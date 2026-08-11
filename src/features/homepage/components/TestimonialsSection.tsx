import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Testimonials</span>
        <h2 className="mb-10 mt-2 font-display text-2xl sm:text-3xl">What Our Clients Say</h2>
      </RevealOnScroll>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <RevealOnScroll key={t.id} delay={i * 0.08} className="lux-card relative rounded-lg p-7">
            <span className="pointer-events-none absolute -top-3 left-6 font-display text-6xl text-gold/20">&ldquo;</span>
            <div className="mb-3 text-sm tracking-widest text-gold">{"★".repeat(t.rating)}</div>
            <p className="text-sm leading-relaxed text-secondary-text">{t.content}</p>
            <div className="mt-5 flex items-center gap-3 border-t border-gold/10 pt-4">
              <span className="h-px w-6 bg-gold/50" />
              <p className="font-display text-sm">{t.name}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
