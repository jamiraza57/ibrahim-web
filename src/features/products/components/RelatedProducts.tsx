import { getRelatedProducts } from "../services/storefront-product.service";
import { ProductCard } from "./ProductCard";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export async function RelatedProducts({ productId, categoryIds }: { productId: string; categoryIds: string[] }) {
  const products = await getRelatedProducts(productId, categoryIds, 8);
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <RevealOnScroll>
        <span className="eyebrow">You May Also Like</span>
        <h2 className="mb-8 mt-2 font-display text-2xl">Complete the Look</h2>
      </RevealOnScroll>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product, i) => (
          <RevealOnScroll key={product.id} delay={i * 0.06}>
            <ProductCard
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price.toString()}
              salePrice={product.salePrice?.toString()}
              thumbnailUrl={product.images.find((img) => img.isThumbnail)?.url ?? product.images[0]?.url}
              isNewArrival={product.isNewArrival}
              stock={product.stock}
            />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
