import Image from "next/image";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import type { z } from "zod";
import type { instagramConfigSchema } from "../schemas/homepage-section.schema";

export function InstagramSection({ config }: { config: z.infer<typeof instagramConfigSchema> }) {
  const instagram = siteConfig.socials.find((s) => s.label === "Instagram");

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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/40 group-hover:opacity-100">
              <Instagram className="h-5 w-5 text-gold" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>
      {instagram && (
        <RevealOnScroll className="mt-10 flex justify-center">
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 text-sm tracking-wide text-gold transition-colors duration-300 hover:bg-gold hover:text-gold-foreground"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
            View on Instagram
          </a>
        </RevealOnScroll>
      )}
    </section>
  );
}
