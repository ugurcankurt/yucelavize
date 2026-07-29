"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Share2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { FavoriteButton } from "@/components/storefront/favorite-button";
interface ProductGalleryProps {
  images: string[];
  productName: string;
  productId: string;
  initialIsFavorite: boolean;
  colorMapping?: Record<string, string>;
}
export function ProductGallery({
  images,
  productName,
  productId,
  initialIsFavorite,
  colorMapping,
}: ProductGalleryProps) {
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setActiveIndex(index);
      thumbApi.scrollTo(index);
    };
    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi]);

  // Sync Carousel with URL Color parameter
  const color = searchParams.get("color");
  useEffect(() => {
    if (!mainApi || !colorMapping || !color) return;

    if (colorMapping[color]) {
      const mappedImageUrl = colorMapping[color];
      // Find index of this URL in images array
      const index = images.findIndex((img) => img === mappedImageUrl);
      if (index !== -1) {
        mainApi.scrollTo(index);
      }
    }
  }, [color, mainApi, colorMapping, images]);

  const onThumbHover = (index: number) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-6 animate-in fade-in duration-700">
      {/* Desktop/Tablet Thumbnails (Vertical) */}
      {images.length > 1 && (
        <div className="hidden lg:block w-20 lg:w-24 shrink-0 order-2 lg:order-1 relative">
          <Carousel
            orientation="vertical"
            setApi={setThumbApi}
            opts={{ containScroll: "keepSnaps", dragFree: true }}
            className="w-full"
          >
            {/* Limit height so vertical carousel is scrollable if many images */}
            <CarouselContent className="h-[400px] lg:h-[500px] -mt-3">
              {images.map((img, idx) => (
                <CarouselItem key={idx} className="pt-3 basis-1/4 lg:basis-1/5">
                  <button
                    onMouseEnter={() => onThumbHover(idx)}
                    onClick={() => onThumbHover(idx)}
                    className={cn(
                      "relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-muted transition-all duration-300 border-2",
                      activeIndex === idx
                        ? "border-border shadow-sm"
                        : "border-transparent opacity-50 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
      {/* Main Image View */}
      <div className="flex-1 min-w-0 order-1 lg:order-2">
        <Dialog>
          {/* Main Unified Carousel (Desktop & Mobile) */}
          <div className="relative w-full bg-muted lg:rounded-2xl overflow-hidden group shadow-sm">
            <Carousel
              setApi={setMainApi}
              className="w-full"
              opts={{ loop: true }}
            >
              <CarouselContent>
                {images.map((img, idx) => (
                  <CarouselItem key={idx} className="relative">
                    <DialogTrigger
                      nativeButton={false}
                      render={
                        <div className="relative w-full aspect-[4/5] cursor-zoom-in">
                          <Image
                            src={img}
                            alt={`${productName} Görseli ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Desktop Hover Arrows */}
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="hidden lg:flex left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background backdrop-blur-md" />
                  <CarouselNext className="hidden lg:flex right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background backdrop-blur-md" />
                </>
              )}
            </Carousel>
            {/* Mobile Pagination Dots */}
            {images.length > 1 && (
              <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 backdrop-blur-md",
                      activeIndex === idx
                        ? "w-6 bg-foreground shadow-sm"
                        : "w-1.5 bg-foreground/30",
                    )}
                  />
                ))}
              </div>
            )}
            {/* Top Right Actions */}
            <div className="absolute top-12 lg:top-4 right-4 z-20 flex flex-col gap-3">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: productName,
                        url: window.location.href,
                      });
                    } catch (err) { }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="w-11 h-11 lg:w-12 lg:h-12 shadow-lg backdrop-blur-xl bg-background/90 hover:bg-background dark:hover:bg-background border border-border/50 rounded-full flex items-center justify-center text-foreground transition-colors"
                aria-label="Paylaş"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5 lg:w-6 lg:h-6" />}
              </button>
              <FavoriteButton
                productId={productId}
                initialIsFavorite={initialIsFavorite}
                className="w-11 h-11 lg:w-12 lg:h-12 shadow-lg backdrop-blur-xl bg-background/90 hover:bg-background dark:hover:bg-background border border-border/50"
                iconClassName="w-5 h-5 lg:w-6 lg:h-6"
              />
            </div>
          </div>
          {/* Lightbox / Maximize Modal */}
          <DialogContent className="max-w-[95vw] md:max-w-[85vw] h-[95vh] p-0 border-none bg-background/95 flex flex-col justify-center overflow-hidden rounded-3xl">
            <DialogTitle className="sr-only">
              {productName} Görselleri
            </DialogTitle>
            <DialogDescription className="sr-only">
              {productName} tam ekran görsel galerisi.
            </DialogDescription>
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Carousel
                className="w-full max-w-5xl"
                opts={{ startIndex: activeIndex, loop: true }}
              >
                <CarouselContent>
                  {images.map((img, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex items-center justify-center"
                    >
                      <div className="relative w-full h-[80vh] flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`${productName} Büyük Görsel ${idx + 1}`}
                          fill
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 md:-left-12 h-12 w-12 bg-background/10 hover:bg-background/20 border-border/20 text-foreground hidden md:flex" />
                    <CarouselNext className="right-4 md:-right-12 h-12 w-12 bg-background/10 hover:bg-background/20 border-border/20 text-foreground hidden md:flex" />
                  </>
                )}
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
