import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export async function FeatureImageSection() {
  const product = await prisma.product.findFirst({
    where: { status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "asc" },
  });

  const image = product?.images[0]?.url;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <RevealOnScroll>
          <span className="eyebrow">Craftsmanship</span>
          <h2 className="mb-5 mt-2 font-display text-3xl leading-snug sm:text-4xl md:text-5xl">Crafted to Last</h2>
          <p className="max-w-md text-secondary-text sm:text-lg">
            Every piece is finished by hand and inspected before it ships. Store it separately in
            a soft pouch, keep it away from perfume and moisture, and it&apos;ll stay as brilliant as
            the day it arrived.
          </p>
        </RevealOnScroll>
        {image && (
          <RevealOnScroll delay={0.1} className="lux-card relative aspect-[4/5] overflow-hidden rounded-lg">
            <Image src={image} alt="" fill className="object-cover" />
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
