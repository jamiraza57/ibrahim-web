import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  slug: string;
  name: string;
  price: string | number;
  salePrice?: string | number | null;
  thumbnailUrl?: string;
}

export function ProductCard({ slug, name, price, salePrice, thumbnailUrl }: ProductCardProps) {
  const isOnSale = salePrice && Number(salePrice) < Number(price);

  return (
    <Link href={`/products/${slug}`} data-cursor="hover" className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-gold/10 bg-card">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="mt-3">
        <h3 className="text-sm text-white group-hover:text-gold">{name}</h3>
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
