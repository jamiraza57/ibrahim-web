# Ibrahim — Luxury Jewelry Store

Production e-commerce build. Next.js 15 / React 19 / TypeScript / Prisma / MongoDB (Atlas) / Cash on Delivery / Vercel Blob / Resend.

## What's built and working

- **Data layer**: full Mongo-backed Prisma schema — Product, Category (nested), Collection, Order (+ items, status history), Customer, Address, Coupon, AdminUser, AnnouncementBar, HomepageSection, MediaAsset, Testimonial, NewsletterSubscriber
- **Admin**: JWT auth (bcrypt + HttpOnly cookie, rate-limited login), full CRUD for Products (Vercel Blob images, category/collection assign), Categories (nested), Collections, Orders (search/filter/status timeline), Coupons, Media Library, Homepage Builder (Hero/Banner/Featured Collections/Featured Products/Testimonials/Newsletter/Instagram), Announcement Bar
- **Storefront**: homepage driven entirely by Homepage Builder, category/collection/search pages with real filtering+sorting+pagination, single product page with JSON-LD + OG metadata, cart + wishlist (localStorage), full checkout (complete address form, COD only, coupon support), order success page
- **Design**: luxury dark/gold theme, Fraunces/Inter/IBM Plex Mono, magnetic buttons, luxury cursor, mobile-responsive throughout (hamburger nav, collapsible admin sidebar, all grids/tables collapse on small screens)

## Not yet built

- Analytics dashboard
- SEO plumbing (sitemap.ts / robots.ts, canonical URLs, category/collection JSON-LD)
- Security hardening pass (CSP headers, middleware matcher audit)
- Deploy prep / production smoke test

## Setup

```bash
pnpm install
cp .env.example .env      # fill in your real DATABASE_URL (MongoDB Atlas), JWT_SECRET (32+ chars), Vercel Blob/Resend keys
pnpm prisma generate
pnpm prisma:push          # MongoDB has no migration history — this syncs the schema directly
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=changeme123! pnpm prisma:seed
pnpm dev
```

Admin panel: `/admin/login` — use the seeded credentials above.

### MongoDB Atlas connection string

Must include a database name and params, e.g.:
```
mongodb+srv://ecommerce_db:<password>@cluster0.xxxxx.mongodb.net/ibrahim?retryWrites=true&w=majority
```
Reset the `<password>` from Atlas → Database Access if you don't remember it, and URL-encode any special characters.
