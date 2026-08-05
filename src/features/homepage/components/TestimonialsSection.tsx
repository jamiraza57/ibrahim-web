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
      <RevealOnScroll>
        <h2 className="mb-8 text-center font-serif text-2xl text-white sm:text-3xl">What Our Clients Say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-gold/10 bg-card p-6">
              <div className="mb-2 text-gold">{"★".repeat(t.rating)}</div>
              <p className="text-sm text-secondary-text">{t.content}</p>
              <p className="mt-3 text-sm text-white">{t.name}</p>
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
