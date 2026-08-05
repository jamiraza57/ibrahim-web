import Link from "next/link";
import { listVisibleSections } from "@/features/homepage/services/homepage-section.service";
import { SectionRenderer } from "@/features/homepage/components/SectionRenderer";

export default async function HomePage() {
  const sections = await listVisibleSections();

  if (sections.length === 0) {
    // First-run state before the owner has configured anything in the Homepage Builder.
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-[0.1] blur-3xl" />
        <div className="relative">
          <span className="eyebrow">Ibrahim Fine Jewelry</span>
          <h1 className="mt-3 font-display text-4xl text-gradient-gold sm:text-5xl">Timeless Elegance</h1>
          <p className="mx-auto mt-4 max-w-sm text-secondary-text">
            This homepage hasn&apos;t been configured yet. Head to Admin → Homepage Builder to add your first
            sections.
          </p>
          <Link
            href="/admin/homepage-builder"
            className="mt-8 inline-block rounded-full border border-gold/40 px-8 py-3 text-sm tracking-wide text-gold transition-colors hover:bg-gold hover:text-gold-foreground"
          >
            Open Homepage Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
