import { listVisibleSections } from "@/features/homepage/services/homepage-section.service";
import { SectionRenderer } from "@/features/homepage/components/SectionRenderer";

export default async function HomePage() {
  const sections = await listVisibleSections();

  if (sections.length === 0) {
    // First-run state before the owner has configured anything in the Homepage Builder.
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-serif text-3xl text-gold sm:text-4xl">Ibrahim — Fine Jewelry</h1>
          <p className="mt-3 text-secondary-text">
            Configure this homepage from Admin → Homepage Builder.
          </p>
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
