import type { HomepageSection } from "@prisma/client";
import { HeroCarousel } from "./HeroCarousel";
import { BannerSection } from "./BannerSection";
import { StatsSection } from "./StatsSection";
import { BrandStorySection } from "./BrandStorySection";
import { ShopByCategorySection } from "./ShopByCategorySection";
import { FeaturedCollectionsSection } from "./FeaturedCollectionsSection";
import { FeaturedProductsSection } from "./FeaturedProductsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { NewsletterSection } from "./NewsletterSection";
import { InstagramSection } from "./InstagramSection";
import {
  bannerConfigSchema,
  statsConfigSchema,
  brandStoryConfigSchema,
  shopByCategoryConfigSchema,
  featuredCollectionsConfigSchema,
  featuredProductsConfigSchema,
  instagramConfigSchema,
} from "../schemas/homepage-section.schema";
import { normalizeHeroConfig } from "../services/homepage-section.service";

export function SectionRenderer({ section }: { section: HomepageSection }) {
  switch (section.type) {
    case "HERO":
      return <HeroCarousel slides={normalizeHeroConfig(section.config).slides} />;
    case "BANNER":
      return <BannerSection config={bannerConfigSchema.parse(section.config)} />;
    case "STATS":
      return <StatsSection config={statsConfigSchema.parse(section.config)} />;
    case "BRAND_STORY":
      return <BrandStorySection config={brandStoryConfigSchema.parse(section.config)} />;
    case "SHOP_BY_CATEGORY":
      return <ShopByCategorySection config={shopByCategoryConfigSchema.parse(section.config)} />;
    case "FEATURED_COLLECTIONS":
      return <FeaturedCollectionsSection config={featuredCollectionsConfigSchema.parse(section.config)} />;
    case "FEATURED_PRODUCTS":
      return <FeaturedProductsSection config={featuredProductsConfigSchema.parse(section.config)} />;
    case "TESTIMONIALS":
      return <TestimonialsSection />;
    case "NEWSLETTER":
      return <NewsletterSection />;
    case "INSTAGRAM":
      return <InstagramSection config={instagramConfigSchema.parse(section.config)} />;
    // FOOTER is rendered globally by the storefront layout, not per-section here.
    case "FOOTER":
      return null;
    default:
      return null;
  }
}
