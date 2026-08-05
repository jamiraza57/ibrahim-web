import Link from "next/link";
import Image from "next/image";
import type { z } from "zod";
import type { bannerConfigSchema } from "../schemas/homepage-section.schema";

export function BannerSection({ config }: { config: z.infer<typeof bannerConfigSchema> }) {
  const content = (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg sm:aspect-[3/1]">
      <Image src={config.imageUrl} alt={config.heading ?? ""} fill className="object-cover" />
      {(config.heading || config.ctaLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-4 text-center">
          {config.heading && <h2 className="font-serif text-2xl text-white sm:text-3xl">{config.heading}</h2>}
          {config.ctaLabel && <span className="mt-3 rounded-full border border-gold px-6 py-2 text-sm text-gold">{config.ctaLabel}</span>}
        </div>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {config.ctaHref ? <Link href={config.ctaHref}>{content}</Link> : content}
    </section>
  );
}
