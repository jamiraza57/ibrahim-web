import { prisma } from "@/lib/prisma";
import {
  getHeroSection,
  getPromoBannerSection,
  getTriptychSection,
  normalizeHeroConfig,
} from "@/features/homepage/services/homepage-section.service";
import { bannerConfigSchema } from "@/features/homepage/schemas/homepage-section.schema";
import { HeroCarousel } from "@/features/homepage/components/HeroCarousel";
import { CategoryIconRow } from "@/features/homepage/components/CategoryIconRow";
import { WhyChooseUsSection } from "@/features/homepage/components/WhyChooseUsSection";
import { ShopByCategorySection } from "@/features/homepage/components/ShopByCategorySection";
import { ImageTriptychSection } from "@/features/homepage/components/ImageTriptychSection";
import { FeatureImageSection } from "@/features/homepage/components/FeatureImageSection";
import { FeaturedProductsSection } from "@/features/homepage/components/FeaturedProductsSection";
import { HowItWorksSection } from "@/features/homepage/components/HowItWorksSection";
import { BannerSection } from "@/features/homepage/components/BannerSection";
import { TestimonialsSection } from "@/features/homepage/components/TestimonialsSection";
import { InstagramSection } from "@/features/homepage/components/InstagramSection";
import { NewsletterSection } from "@/features/homepage/components/NewsletterSection";

const DEFAULT_HERO = normalizeHeroConfig({
  slides: [
    {
      heading: "Timeless Elegance",
      subheading: "Fine jewelry crafted to last, delivered across Pakistan.",
      ctaLabel: "Shop Now",
      ctaHref: "/products",
      isActive: true,
    },
    {
      heading: "The Signature Collection",
      subheading: "Designed for moments that deserve more.",
      ctaLabel: "Discover Now",
      ctaHref: "/products",
      isActive: true,
    },
    {
      heading: "Made to Shine",
      subheading: "Exceptional craftsmanship. Extraordinary detail.",
      ctaLabel: "Shop Jewelry",
      ctaHref: "/products",
      isActive: true,
    },
  ],
});

// The homepage is a fixed sequence of sections (not the arbitrary,
// admin-composed homepage-builder list) — only the hero slides, one promo
// banner, and the triptych images are admin-editable, via /admin/header-images.
// "Shop by Collection" and the Instagram strip pull real, live Category/Product
// data directly (same pattern CategoryIconRow already uses) rather than needing
// their own admin config row.
export default async function HomePage() {
  const [heroRow, promoRow, triptychRow, featuredCategories, instagramProducts] = await Promise.all([
    getHeroSection(),
    getPromoBannerSection(),
    getTriptychSection(),
    prisma.category.findMany({
      where: { parentId: null, status: true, OR: [{ imageUrl: { not: null } }, { bannerUrl: { not: null } }] },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      take: 5,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const hero = heroRow ? normalizeHeroConfig(heroRow.config) : DEFAULT_HERO;
  const promo = promoRow ? bannerConfigSchema.parse(promoRow.config) : null;
  const triptychImages = triptychRow ? (bannerConfigSchema.parse(triptychRow.config).images ?? []) : [];
  const instagramImages = instagramProducts.map((p) => p.images[0]?.url).filter((url): url is string => Boolean(url));

  return (
    <div>
      <HeroCarousel slides={hero.slides} />
      <CategoryIconRow />
      <WhyChooseUsSection />
      {featuredCategories.length > 0 && (
        <ShopByCategorySection config={{ heading: "Shop by Collection", categoryIds: featuredCategories.map((c) => c.id) }} />
      )}
      <ImageTriptychSection images={triptychImages} />
      <FeatureImageSection />
      <FeaturedProductsSection config={{ heading: "New Arrivals", tag: "isNewArrival", limit: 8 }} />
      <HowItWorksSection />
      <FeaturedProductsSection config={{ heading: "Best Sellers", tag: "isBestSeller", limit: 8 }} variant="rail" />
      {promo && <BannerSection config={promo} />}
      <TestimonialsSection />
      {instagramImages.length > 0 && (
        <InstagramSection config={{ heading: "Follow Along", imageUrls: instagramImages }} />
      )}
      <NewsletterSection />
    </div>
  );
}
