import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-xl px-4 py-14 text-center sm:px-6">
      <RevealOnScroll>
        <NewsletterForm />
      </RevealOnScroll>
    </section>
  );
}
