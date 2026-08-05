import { prisma } from "@/lib/prisma";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <RevealOnScroll className="text-center">
        <span className="eyebrow">Testimonials</span>
        <h2 className="mb-8 mt-2 font-display text-2xl sm:text-3xl">What Our Clients Say</h2>
      </RevealOnScroll>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <RevealOnScroll key={t.id} delay={i * 0.08} className="lux-card rounded-lg p-6">
            <div className="mb-2 text-gold">{"★".repeat(t.rating)}</div>
            <p className="text-sm text-secondary-text">{t.content}</p>
            <p className="mt-3 font-display text-sm">{t.name}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
