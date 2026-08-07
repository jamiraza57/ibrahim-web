import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

/** Top-level, live categories only — admin manages the actual list under Categories. */
export async function CategoryIconRow() {
  const categories = await prisma.category.findMany({
    where: { parentId: null, status: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    take: 8,
  });

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Browse</span>
        <h2 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">Shop by Category</h2>
      </RevealOnScroll>

      <div className="flex justify-start gap-6 overflow-x-auto pb-2 sm:justify-center sm:flex-wrap sm:overflow-visible">
        {categories.map((category, i) => (
          <RevealOnScroll key={category.id} delay={i * 0.05}>
            <Link
              href={`/products?category=${category.slug}`}
              data-cursor="hover"
              className="group flex w-24 shrink-0 flex-col items-center gap-3 text-center sm:w-28"
            >
              <span className="relative block h-20 w-20 overflow-hidden rounded-full border border-gold/20 bg-surface transition-colors duration-300 group-hover:border-gold sm:h-24 sm:w-24">
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-secondary-text group-hover:text-gold sm:text-sm">
                {category.name}
              </span>
            </Link>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
