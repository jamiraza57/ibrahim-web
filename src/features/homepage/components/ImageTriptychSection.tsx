import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

interface ImageTriptychSectionProps {
  images?: string[];
}

export async function ImageTriptychSection({ images }: ImageTriptychSectionProps) {
  let sources = images ?? [];

  if (sources.length < 3) {
    // Falls back to real product photography rather than empty grey boxes
    // until the admin sets these three images explicitly.
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    sources = products.map((p) => p.images[0]?.url).filter((url): url is string => Boolean(url));
  }

  if (sources.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <RevealOnScroll>
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {sources.slice(0, 3).map((src, i) => (
            <div key={src + i} className="lux-card relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
