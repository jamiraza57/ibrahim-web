import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  slug: string;
  name: string;
  price: string | number;
  salePrice?: string | number | null;
  thumbnailUrl?: string;
  category?: string;
  badge?: string;
}

export function ProductCard({ slug, name, price, salePrice, thumbnailUrl, category, badge }: ProductCardProps) {
  const isOnSale = salePrice && Number(salePrice) < Number(price);

  return (
    <Link href={`/products/${slug}`} data-cursor="hover" className="group block">
      <div className="lux-card relative aspect-square overflow-hidden rounded-lg">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur-sm">
            {badge}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-gold text-gold-foreground opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-3">
        {category && <p className="eyebrow mb-1">{category}</p>}
        <h3 className="font-display text-sm group-hover:text-gold">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-sm text-gold">${Number(salePrice).toLocaleString()}</span>
              <span className="text-xs text-secondary-text line-through">
                ${Number(price).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm text-secondary-text">${Number(price).toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
