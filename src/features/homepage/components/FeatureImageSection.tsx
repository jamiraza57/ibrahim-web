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
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <RevealOnScroll>
          <span className="eyebrow">Craftsmanship</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">Crafted to Last</h2>
          <p className="mt-4 max-w-md text-secondary-text">
            Every piece is finished by hand and inspected before it ships. Store it separately in
            a soft pouch, keep it away from perfume and moisture, and it&apos;ll stay as brilliant as
            the day it arrived.
          </p>
        </RevealOnScroll>
        {image && (
          <RevealOnScroll delay={0.1} className="lux-card relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={image} alt="" fill className="object-cover" />
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
