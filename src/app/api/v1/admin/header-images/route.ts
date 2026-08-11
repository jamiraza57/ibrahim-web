import { NextResponse } from "next/server";
import {
  getHeroSection,
  getPromoBannerSection,
  getTriptychSection,
  normalizeHeroConfig,
} from "@/features/homepage/services/homepage-section.service";

export async function GET() {
  const [hero, promo, triptych] = await Promise.all([
    getHeroSection(),
    getPromoBannerSection(),
    getTriptychSection(),
  ]);

  return NextResponse.json({
    data: {
      hero: hero ? normalizeHeroConfig(hero.config) : null,
      promo: promo?.config ?? null,
      triptych: triptych?.config ?? null,
    },
  });
}
