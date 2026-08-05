import Image from "next/image";
import type { z } from "zod";
import type { instagramConfigSchema } from "../schemas/homepage-section.schema";

export function InstagramSection({ config }: { config: z.infer<typeof instagramConfigSchema> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <h2 className="mb-8 text-center font-serif text-2xl text-white sm:text-3xl">{config.heading}</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {config.imageUrls.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-square overflow-hidden">
            <Image src={url} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
