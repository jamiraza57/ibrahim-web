import Image from "next/image";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { instagramConfigSchema } from "../schemas/homepage-section.schema";

export function InstagramSection({ config }: { config: z.infer<typeof instagramConfigSchema> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Follow Along</span>
        <h2 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">{config.heading}</h2>
      </RevealOnScroll>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {config.imageUrls.map((url, i) => (
          <div key={`${url}-${i}`} className="group relative aspect-square overflow-hidden">
            <Image
              src={url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
