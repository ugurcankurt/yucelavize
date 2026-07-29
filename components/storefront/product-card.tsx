import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/storefront/favorite-button";
interface ProductCardProps {
  product: any;
  isFavorite: boolean;
  priority?: boolean;
  activeCampaign?: any;
}
export function ProductCard({
  product,
  isFavorite,
  priority = false,
  activeCampaign,
}: ProductCardProps) {
  const primaryImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=600&auto=format&fit=crop";
  const catName = product.category
    ? Array.isArray(product.category)
      ? (product.category as any)[0]?.name
      : (product.category as any).name
    : "Aydınlatma";

  const hasProductDiscount = product.discounted_price && product.discounted_price < product.price;
  let finalPrice = product.price;
  let hasDiscount = false;
  let discountBadge = "";

  if (hasProductDiscount) {
    finalPrice = product.discounted_price;
    hasDiscount = true;
    const percentage = Math.round(((product.price - product.discounted_price) / product.price) * 100);
    discountBadge = `%${percentage} İndirim`;
  } else if (activeCampaign) {
    hasDiscount = true;
    if (activeCampaign.discount_type === "percentage") {
      finalPrice = product.price - (product.price * activeCampaign.discount_amount) / 100;
      discountBadge = `%${activeCampaign.discount_amount} İndirim`;
    } else {
      finalPrice = Math.max(0, product.price - activeCampaign.discount_amount);
      discountBadge = `₺${activeCampaign.discount_amount} İndirim`;
    }
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted border border-border mb-5">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            productId={product.id}
            initialIsFavorite={isFavorite}
            className="w-9 h-9"
            iconClassName="w-4 h-4"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.stock <= 5 && product.stock > 0 && (
            <div className="bg-warning text-warning-foreground text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md w-max">
              Son {product.stock}
            </div>
          )}
          {hasDiscount && (
            <div className="bg-destructive text-destructive-foreground text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md w-max">
              {discountBadge}
            </div>
          )}
        </div>
        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-foreground text-background text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
              Tükendi
            </span>
          </div>
        )}
        {/* Hover Add to cart button preview */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-[90%] z-10">
          <div className="w-full h-10 bg-background/90 backdrop-blur-md rounded-full text-foreground font-semibold text-sm flex items-center justify-center shadow-lg border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer">
            İncele
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {catName}
        </span>
      </div>
      <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">
        {product.name}
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          {hasDiscount ? (
             <div className="flex items-center gap-2">
               <p className="font-black text-foreground">
                 ₺{finalPrice.toLocaleString("tr-TR")}
               </p>
               <p className="text-xs text-muted-foreground line-through">
                 ₺{product.price.toLocaleString("tr-TR")}
               </p>
             </div>
          ) : (
            <p className="font-black text-foreground">
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
          )}
        </div>
        {product.stock > 0 && (
          <p className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wide">
            Stokta
          </p>
        )}
      </div>
    </Link>
  );
}
