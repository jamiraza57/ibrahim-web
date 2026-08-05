import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getStorefrontProductBySlug } from "@/features/products/services/storefront-product.service";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/cart/components/WishlistButton";
import { getEnv } from "@/lib/env";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) return {};

  const image = product.images[0]?.url;
  const canonical = `${getEnv().NEXT_PUBLIC_SITE_URL}/products/${slug}`;

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.salePrice ?? product.price).toString(),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          {product.images.length > 0 ? (
            product.images.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-gold/10">
                <Image src={img.url} alt={img.alt ?? product.name} fill className="object-cover" priority />
              </div>
            ))
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-gold/10 bg-card text-secondary-text">
              No image available
            </div>
          )}
        </div>

        <div>
          <h1 className="font-serif text-3xl text-white">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            {product.salePrice ? (
              <>
                <span className="text-2xl text-gold">${product.salePrice.toString()}</span>
                <span className="text-lg text-secondary-text line-through">${product.price.toString()}</span>
              </>
            ) : (
              <span className="text-2xl text-gold">${product.price.toString()}</span>
            )}
          </div>

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

          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-gold/10 pt-6 text-sm sm:grid-cols-2">
            {product.material && (
              <div>
                <dt className="text-secondary-text">Material</dt>
                <dd className="text-white">{product.material}</dd>
              </div>
            )}
            {product.purity && (
              <div>
                <dt className="text-secondary-text">Purity</dt>
                <dd className="text-white">{product.purity}</dd>
              </div>
            )}
            {product.stone && (
              <div>
                <dt className="text-secondary-text">Stone</dt>
                <dd className="text-white">{product.stone}</dd>
              </div>
            )}
            {product.color && (
              <div>
                <dt className="text-secondary-text">Color</dt>
                <dd className="text-white">{product.color}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 border-t border-gold/10 pt-6">
            <h2 className="mb-2 font-serif text-lg text-white">Description</h2>
            <p className="whitespace-pre-line text-secondary-text">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
