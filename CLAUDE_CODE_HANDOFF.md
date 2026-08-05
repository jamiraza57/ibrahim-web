# Continuing the Ibrahim Luxury Jewelry Store Build

You're picking up an in-progress Next.js 15 / TypeScript / Prisma / MongoDB (Atlas) build in this
repo (`ibrahim-web`). Read this whole file before touching anything, then inspect the actual
code — this doc is a map, not a substitute for reading the files.

## Before writing anything

1. Run `find src prisma -type f | sort` and diff it against the inventory below — confirm
   nothing has drifted since this handoff.
2. Run `pnpm install`, then `cp .env.example .env` and check what's already filled in.
3. Do NOT `git push` until I explicitly confirm at the end of whatever you build next.

## Architecture conventions already established — follow these, don't reinvent them

- **Feature-based structure**: `src/features/<name>/{components,schemas,services}`. Each
  feature owns its Zod schema, its Prisma-backed service functions, and its client components.
  API routes in `src/app/api/v1/**` are thin — they parse/validate with the feature's schema,
  call the feature's service, map thrown errors to HTTP status codes. No business logic in routes.
- **Admin auth**: JWT in an HttpOnly cookie (`src/lib/auth/jwt.ts`, `cookies.ts`), enforced by
  `src/middleware.ts` on `/admin/**` and `/api/v1/admin/**` (except `/admin/login`). Don't add
  a second auth mechanism.
- **Server-authoritative money math**: checkout (`src/features/checkout/services/checkout.service.ts`)
  never trusts client-sent prices — it re-fetches products and recomputes subtotal/discount/shipping
  server-side. Keep this pattern for anything touching money.
- **Database is MongoDB (Atlas)**, not Postgres — `relationMode = "prisma"` in the datasource
  means Prisma emulates `onDelete` referential actions at the client level (Mongo has no real
  FKs). Money fields are `Float`, not `Decimal` (Mongo connector doesn't support Decimal) — the
  service layer already treats them as plain numbers via `Number()`, so this needed zero
  application-code changes. No migration history exists — use `pnpm prisma:push`
  (`prisma db push`), never `prisma migrate`.
- **Payment is COD-only** — there is no Stripe/online payment in this project. Don't reintroduce it.
- **Transactions for multi-write operations**: see `checkout.service.ts` and
  `product.service.ts` (`prisma.$transaction`) — anywhere a write touches more than one table
  that must stay consistent, wrap it.
- **Responsive-by-default**: Tailwind classes throughout use mobile-first breakpoints
  (`grid-cols-1 sm:grid-cols-2`, etc.) — every new UI piece must collapse cleanly to a single
  column on narrow screens; admin tables get wrapped in `<div className="overflow-x-auto">`.
- **Theme**: `#050505` background / `#D4AF37` gold / Fraunces+Inter+IBM Plex Mono, defined in
  `tailwind.config.ts`. Use the existing `gold`, `background`, `card`, `secondary-text` tokens —
  don't hardcode hex values in new components.
- **Cart/Wishlist**: client-only, localStorage-backed React Context (`src/features/cart/context/`).
  No backend cart table — intentional, since checkout is guest-only.

## What's fully built and working (don't rebuild these)

**Data layer**: complete `prisma/schema.prisma` — Product, Category (nested), Collection, Order
(+ OrderItem, OrderStatusHistory), Customer, Address (full fields incl. line2/state), Coupon,
AdminUser, AnnouncementBar, HomepageSection, MediaAsset, Testimonial, NewsletterSubscriber.

**Admin** (all behind JWT middleware, sidebar nav in `src/components/shared/AdminSidebar.tsx`):
- Login/logout (`/admin/login`, real bcrypt + JWT, rate-limited)
- Products: full CRUD, image upload via Vercel Blob, category/collection multi-select, all
  catalog fields (material/purity/stone/color/etc.), paginated/searchable list
- Categories: full CRUD, nesting with cycle prevention
- Collections: full CRUD
- Orders: list (search/filter), detail view (customer, address, items, totals, timeline),
  status transitions via a state machine (`order-management.service.ts`) that releases stock on
  cancellation and auto-marks COD orders paid on delivery
- Coupons: full CRUD (percentage/fixed, min purchase, usage limit, expiry)
- Media Library: Vercel Blob signed direct upload, grid view, delete
- Homepage Builder: per-section-type Zod-validated config (Hero, Banner, Featured Collections,
  Featured Products by tag, Testimonials, Newsletter, Instagram), reorder, visibility toggle —
  drives the actual homepage, no placeholder content
- Announcement Bar: single-row config, live on storefront

**Storefront**:
- Homepage renders from Homepage Builder sections
- Category/Collection/Search pages: real filtering (material/stone/color/price/stock),
  sorting, pagination — all through one shared query function
  (`storefront-product.service.ts`) so "published + not future-scheduled" logic lives in one place
- Single product page: gallery, JSON-LD structured data, OpenGraph/Twitter metadata
- Cart page, Checkout page (full address form — line1/line2/city/state/postal/country/notes,
  COD only, coupon input), Order Success page
- Header (sticky glass, mobile hamburger drawer), Footer (newsletter signup wired to a real
  `NewsletterSubscriber` table), luxury cursor, magnetic buttons

**Cross-cutting**: rate limiting on login/checkout, Zod validation on every write endpoint,
`.env.example` fully specified with a runtime validator (`src/lib/env.ts`) that fails loudly on
missing vars.

## What's NOT built yet — pick up here, in this order

1. **Analytics dashboard** (`/admin/analytics` — route doesn't exist yet, sidebar link is a
   dead link right now). KPI cards (revenue, orders, avg order value), revenue-over-time chart,
   top products, customer count. Query `Order`/`OrderItem` directly — no separate analytics
   table exists or is needed at this scale.
2. **SEO plumbing**: `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js file conventions,
   not manual XML), canonical URLs on all storefront pages, verify JSON-LD is present on
   category/collection pages too (currently only on single product).
3. **Security hardening pass**: check CSRF exposure on state-changing routes (cookies are
   `sameSite: lax`, not `strict` — verify that's intentional given cross-site nav needs), audit
   every admin API route actually gets caught by the middleware matcher, add security headers
   (`next.config.ts` — CSP, X-Frame-Options, etc.).
4. **Deploy prep**: Vercel config, confirm `prisma generate` runs in the build step (it's in
   `package.json`'s `build` script already — verify it actually works), run `pnpm prisma:push`
   against a real MongoDB Atlas cluster and smoke-test the full guest checkout flow end to end.

## Known gaps / things I flagged but didn't fix

- Testimonials are admin-manageable only via direct DB access right now — there's no
  `/admin/testimonials` CRUD page. Add one if the owner needs to manage these without a DB client.
- The `emptyConfigSchema` pattern in `homepage-section.schema.ts` for TESTIMONIALS/NEWSLETTER/
  FOOTER section types is a bit of a shrug — fine for now, but if a section type ever needs
  config, follow the same per-type schema pattern as HERO/BANNER.
- I never got to run `prisma migrate` against a real database from my sandbox (no network path
  to `binaries.prisma.sh` there) — treat the schema as reviewed-by-hand, not migration-tested.
  Run it for real as your first step.

Work phase-by-phase, confirm with me before moving to the next area, and don't push until I
say so.
