import {
  getHeroSection,
  getPromoBannerSection,
  getTriptychSection,
} from "@/features/homepage/services/homepage-section.service";
import { heroConfigSchema, bannerConfigSchema } from "@/features/homepage/schemas/homepage-section.schema";
import { HeroSection } from "@/features/homepage/components/HeroSection";
import { CategoryIconRow } from "@/features/homepage/components/CategoryIconRow";
import { WhyChooseUsSection } from "@/features/homepage/components/WhyChooseUsSection";
import { ImageTriptychSection } from "@/features/homepage/components/ImageTriptychSection";
import { FeatureImageSection } from "@/features/homepage/components/FeatureImageSection";
import { FeaturedProductsSection } from "@/features/homepage/components/FeaturedProductsSection";
import { HowItWorksSection } from "@/features/homepage/components/HowItWorksSection";
import { BannerSection } from "@/features/homepage/components/BannerSection";
import { TestimonialsSection } from "@/features/homepage/components/TestimonialsSection";
import { NewsletterSection } from "@/features/homepage/components/NewsletterSection";

const DEFAULT_HERO = heroConfigSchema.parse({
  heading: "Timeless Elegance",
  subheading: "Fine jewelry crafted to last, delivered across Pakistan.",
  ctaLabel: "Shop Now",
  ctaHref: "/products",
});

// The homepage is a fixed sequence of sections (not the arbitrary,
// admin-composed homepage-builder list) — only the hero image/text, one promo
// banner, and the triptych images are admin-editable, via /admin/header-images.
export default async function HomePage() {
  const [heroRow, promoRow, triptychRow] = await Promise.all([
    getHeroSection(),
    getPromoBannerSection(),
    getTriptychSection(),
  ]);

  const hero = heroRow ? heroConfigSchema.parse(heroRow.config) : DEFAULT_HERO;
  const promo = promoRow ? bannerConfigSchema.parse(promoRow.config) : null;
  const triptychImages = triptychRow ? (bannerConfigSchema.parse(triptychRow.config).images ?? []) : [];

  return (
    <div>
      <HeroSection config={hero} />
      <CategoryIconRow />
      <WhyChooseUsSection />
      <ImageTriptychSection images={triptychImages} />
      <FeatureImageSection />
      <FeaturedProductsSection config={{ heading: "New Arrivals", tag: "isNewArrival", limit: 8 }} />
      <HowItWorksSection />
      <FeaturedProductsSection config={{ heading: "Best Sellers", tag: "isBestSeller", limit: 8 }} />
      {promo && <BannerSection config={promo} />}
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
