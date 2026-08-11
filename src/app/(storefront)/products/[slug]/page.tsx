import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getStorefrontProductBySlug } from "@/features/products/services/storefront-product.service";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/cart/components/WishlistButton";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { StickyBuyBar } from "@/features/products/components/StickyBuyBar";
import { RelatedProducts } from "@/features/products/components/RelatedProducts";
import { RecentlyViewed } from "@/features/products/components/RecentlyViewed";
import { getSiteUrl } from "@/lib/env";
import { siteConfig } from "@/config/site";
import { LOW_STOCK_THRESHOLD } from "@/config/inventory";
import { formatPrice } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) return {};

  const image = product.images[0]?.url;
  const canonical = `${getSiteUrl()}/products/${slug}`;

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      siteName: siteConfig.name,
      images: image ? [image] : undefined,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) notFound();

  const canonicalUrl = `${getSiteUrl()}/products/${product.slug}`;
  const primaryCategory = product.categories[0]?.category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    url: canonicalUrl,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: (product.salePrice ?? product.price).toString(),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonicalUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
      ...(primaryCategory
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: primaryCategory.name,
              item: `${getSiteUrl()}/categories/${primaryCategory.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: primaryCategory ? 3 : 2,
        name: product.name,
        item: canonicalUrl,
      },
    ],
  };

  const isOnSale = Boolean(product.salePrice && Number(product.salePrice) < Number(product.price));
  const percentOff = isOnSale ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100) : 0;
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-secondary-text">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        <span>/</span>
        {primaryCategory ? (
          <>
            <Link href={`/categories/${primaryCategory.slug}`} className="hover:text-gold">
              {primaryCategory.name}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery
          images={product.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt }))}
          productName={product.name}
        />

        <div>
          {product.material && <span className="eyebrow">{product.material}</span>}
          <h1 className="mt-2 font-display text-3xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-2xl text-gold">{formatPrice(Number(product.salePrice))}</span>
                <span className="text-lg text-secondary-text line-through">{formatPrice(Number(product.price))}</span>
                <span className="rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-widest text-gold-foreground">
                  −{percentOff}%
                </span>
              </>
            ) : (
              <span className="text-2xl text-gold">{formatPrice(Number(product.price))}</span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full border border-gold/30 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                New Arrival
              </span>
            )}
          </div>

          <p className="mt-2 text-xs uppercase tracking-wide text-secondary-text">
            {product.stock <= 0
              ? "Out of stock"
              : isLowStock
                ? `Only ${product.stock} left in stock`
                : `In stock — ${product.stock} available`}
          </p>

          {product.shortDescription && <p className="mt-4 text-secondary-text">{product.shortDescription}</p>}

          <div className="mt-6 flex gap-3">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={Number(product.salePrice ?? product.price)}
              image={product.images[0]?.url}
              inStock={product.stock > 0}
            />
            <WishlistButton productId={product.id} />
          </div>

          <div className="mt-8 divide-y divide-gold/10 border-t border-gold/10">
            <details className="group py-4" open>
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg [&::-webkit-details-marker]:hidden">
                Specifications
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {product.material && (
                  <div>
                    <dt className="text-secondary-text">Material</dt>
                    <dd className="text-foreground">{product.material}</dd>
                  </div>
                )}
                {product.purity && (
                  <div>
                    <dt className="text-secondary-text">Purity</dt>
                    <dd className="text-foreground">{product.purity}</dd>
                  </div>
                )}
                {product.stone && (
                  <div>
                    <dt className="text-secondary-text">Stone</dt>
                    <dd className="text-foreground">{product.stone}</dd>
                  </div>
                )}
                {product.color && (
                  <div>
                    <dt className="text-secondary-text">Color</dt>
                    <dd className="text-foreground">{product.color}</dd>
                  </div>
                )}
              </dl>
              {product.description && (
                <p className="mt-4 whitespace-pre-line text-sm text-secondary-text">{product.description}</p>
              )}
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg [&::-webkit-details-marker]:hidden">
                Shipping
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm text-secondary-text">
                Complimentary insured shipping on every order. Most pieces ship within 2–3 business days and arrive
                in signature Ibrahim packaging.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg [&::-webkit-details-marker]:hidden">
                Care
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm text-secondary-text">
                Store separately in a soft pouch, avoid contact with perfume and moisture, and have your piece
                inspected by our atelier once a year to keep every setting secure.
              </p>
            </details>
          </div>
        </div>
      </div>

      <RelatedProducts productId={product.id} categoryIds={product.categories.map((c) => c.categoryId)} />
      <RecentlyViewed currentProductId={product.id} />

      <StickyBuyBar
        productId={product.id}
        slug={product.slug}
        name={product.name}
        price={Number(product.salePrice ?? product.price)}
        image={product.images[0]?.url}
        inStock={product.stock > 0}
      />
    </div>
  );
}
