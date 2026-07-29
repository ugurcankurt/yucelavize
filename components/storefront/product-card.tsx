import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/storefront/favorite-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

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
      className="group block"
    >
      <Card className="overflow-hidden border-transparent bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-[20px] p-3 sm:p-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-[16px] bg-muted/50 mb-3 sm:mb-4 flex items-center justify-center">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover p-2 sm:p-0 sm:object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Favorite Button (Floating Top Right inside image area, or just top right of card) */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton
              productId={product.id}
              initialIsFavorite={isFavorite}
              className="w-8 h-8 sm:w-9 sm:h-9 shadow-sm bg-white hover:bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400"
              iconClassName="w-4 h-4"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="shadow-sm text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1">
                Son {product.stock}
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="shadow-sm bg-rose-500 hover:bg-rose-600 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 text-white">
                {discountBadge}
              </Badge>
            )}
          </div>

          {/* Out of stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm uppercase tracking-wider font-bold shadow-md bg-white border border-gray-200">
                Tükendi
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-0 flex flex-col">
          <h3 className="font-bold text-[14px] sm:text-base text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-[12px] font-medium text-muted-foreground">
              {catName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] sm:text-[12px] font-bold text-foreground">4.9</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              {hasDiscount ? (
                 <div className="flex items-center gap-1.5 sm:gap-2">
                   <p className="font-black text-[15px] sm:text-lg text-foreground">
                     ₺{finalPrice.toLocaleString("tr-TR")}
                   </p>
                   <p className="text-[10px] sm:text-[11px] text-muted-foreground line-through decoration-muted-foreground/50">
                     ₺{product.price.toLocaleString("tr-TR")}
                   </p>
                 </div>
              ) : (
                <p className="font-black text-[15px] sm:text-lg text-foreground">
                  ₺{product.price.toLocaleString("tr-TR")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
