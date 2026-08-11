import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export function NewsletterSection() {
  return (
    <section className="border-t border-gold/10 bg-surface-2/40">
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 md:py-24">
        <RevealOnScroll>
          <NewsletterForm
            variant="hero"
            eyebrow="Newsletter"
            heading="Be the First to Know"
            description="Discover new collections, exclusive pieces, and private offers before anyone else."
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
