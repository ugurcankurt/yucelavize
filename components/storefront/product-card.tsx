import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/storefront/favorite-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCardProps {
  product: any;
  isFavorite?: boolean;
  priority?: boolean;
  activeCampaign?: any;
}
export function ProductCard({
  product,
  isFavorite = false,
  priority = false,
  activeCampaign,
}: ProductCardProps) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=600&auto=format&fit=crop"];
  const catName = product.category
    ? Array.isArray(product.category)
      ? (product.category as any)[0]?.name
      : (product.category as any).name
    : "Aydınlatma";

  const catSlug = product.category
    ? Array.isArray(product.category)
      ? (product.category as any)[0]?.slug
      : (product.category as any).slug
    : "kategorisiz";

  const productUrl = `/kategori/${catSlug}/${product.slug}`;

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

  // Calculate rating
  const approvedReviews = (product.reviews || []).filter((r: any) => r.status === 'approved');
  const reviewCount = approvedReviews.length;
  let avgRating = "0.0";
  if (reviewCount > 0) {
    avgRating = (approvedReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount).toFixed(1);
  }

  return (
    <Card className="group h-full overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-[20px] p-0 gap-0 flex flex-col relative">
      <div className="relative w-full aspect-square overflow-hidden bg-muted/20 flex items-center justify-center">
        <Carousel className="w-full h-full [&>div]:h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full ml-0">
            {images.map((img: string, index: number) => (
              <CarouselItem key={index} className="pl-0 relative w-full h-full">
                <Link
                  href={productUrl}
                  className="block w-full h-full relative cursor-pointer"
                  tabIndex={-1}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Görsel ${index + 1}`}
                    fill
                    priority={priority && index === 0}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                  />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="hidden md:flex left-2 bg-white/80 hover:bg-white border-none shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 h-8 w-8" />
              <CarouselNext className="hidden md:flex right-2 bg-white/80 hover:bg-white border-none shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 h-8 w-8" />
            </>
          )}
        </Carousel>
        
        {/* Favorite Button (Floating Top Right) */}
        <div className="absolute top-3 right-3 z-30">
          <FavoriteButton
            productId={product.id}
            initialIsFavorite={isFavorite}
            className="w-8 h-8 shadow-sm bg-white hover:bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400"
            iconClassName="w-4 h-4"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30 pointer-events-none">
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="destructive" className="shadow-sm rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1">
              Son {product.stock}
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="shadow-sm rounded-full bg-rose-500 hover:bg-rose-600 text-[9px] sm:text-[10px] font-bold tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1 text-white border-none">
              {discountBadge}
            </Badge>
          )}
        </div>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none">
            <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm uppercase tracking-wider font-bold shadow-md bg-white border border-gray-200">
              Tükendi
            </Badge>
          </div>
        )}
      </div>

      <Link href={productUrl} className="flex-1 flex flex-col cursor-pointer">
        <CardContent className="px-3 pb-3 pt-3 sm:px-3 sm:pb-3.5 sm:pt-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-[14px] sm:text-[15px] text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            {reviewCount > 0 && (
              <div className="flex items-center gap-1 shrink-0 mt-[2px]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[12px] sm:text-[13px] font-bold text-foreground">{avgRating}</span>
              </div>
            )}
          </div>
          
          <span className="text-[12px] sm:text-[13px] font-medium text-muted-foreground mb-3">
            {catName}
          </span>

          <div className="flex items-center gap-2 sm:gap-2.5 mt-auto pt-1">
            <p className="font-bold text-[15px] sm:text-[16px] text-foreground">
              ₺{finalPrice.toLocaleString("tr-TR")}
            </p>
            {hasDiscount && (
              <p className="text-[12px] sm:text-[13px] font-medium text-muted-foreground line-through decoration-muted-foreground/60">
                ₺{product.price.toLocaleString("tr-TR")}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
