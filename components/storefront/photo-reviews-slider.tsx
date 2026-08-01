"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function PhotoReviewsSlider({ reviews }: { reviews: any[] }) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImage, setLightboxImage] = React.useState("");

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const openLightbox = (url: string) => {
    setLightboxImage(url);
    setLightboxOpen(true);
  };
  const maskName = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return name.length > 2 ? `${name.substring(0, 2)}***` : `${name}***`;
    const firstName = parts.slice(0, -1).join(" ");
    const lastName = parts[parts.length - 1];
    return `${firstName} ${lastName.charAt(0)}***`;
  };

  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4">
            Sizden Gelenler
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl">
            Ürünlerimizi kullanan müşterilerimizin gerçek deneyimleri.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card 
                      className="relative h-[400px] md:h-[480px] w-full overflow-hidden rounded-[32px] border-0 shadow-xl group"
                    >
                      {/* Inner Carousel for Multiple Images */}
                      <div className="absolute inset-0 w-full h-full z-0" onPointerDownCapture={(e) => e.stopPropagation()}>
                        <Carousel className="w-full h-full" opts={{ watchDrag: review.images.length > 1 }}>
                        <CarouselContent className="h-full ml-0">
                          {review.images.map((img: string, idx: number) => (
                            <CarouselItem key={idx} className="relative w-full h-[400px] md:h-[480px] pl-0 basis-full">
                              <div className="relative w-full h-[400px] md:h-[480px] cursor-pointer overflow-hidden" onClick={() => openLightbox(img)}>
                                <Image
                                  src={img}
                                  alt={`${maskName(review.user_name)} görseli ${idx + 1}`}
                                  fill
                                  priority={idx === 0}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        
                        {/* Photos Count Badge */}
                        {review.images.length > 1 && (
                          <div className="absolute top-5 right-5 z-20 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/><path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11"/></svg>
                            {review.images.length} Görsel
                          </div>
                        )}
                        
                        {review.images.length > 1 && (
                          <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <CarouselPrevious className="left-4 bg-black/40 text-white border-0 hover:bg-black/60 hover:text-white w-8 h-8 z-30" />
                            <CarouselNext className="right-4 bg-black/40 text-white border-0 hover:bg-black/60 hover:text-white w-8 h-8 z-30" />
                          </div>
                        )}
                      </Carousel>
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 pointer-events-none z-10" />

                      {/* Content Area */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end z-20 pointer-events-none">
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 md:w-5 md:h-5 drop-shadow-md ${star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-white/30 text-white/30"
                                }`}
                            />
                          ))}
                        </div>
                        
                        <p className="text-white text-lg md:text-xl font-medium leading-snug mb-6 line-clamp-3 drop-shadow-md">
                          &quot;{review.comment}&quot;
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg border border-white/30 shadow-inner overflow-hidden shrink-0 pointer-events-auto">
                            {review.user_avatar ? (
                              <Image src={review.user_avatar} alt={maskName(review.user_name)} fill sizes="48px" className="object-cover" />
                            ) : (
                              review.user_name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-semibold text-sm md:text-base drop-shadow-md">
                              {maskName(review.user_name)}
                            </span>
                            {review.products && (
                              <div className="pointer-events-auto">
                                <Link
                                  href={`/products/${review.products.slug}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-white/70 hover:text-white transition-colors text-xs md:text-sm font-medium line-clamp-1 drop-shadow-md"
                                >
                                  {review.products.name}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 lg:-left-12 bg-background border-border shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all w-12 h-12" />
              <CarouselNext className="-right-4 lg:-right-12 bg-background border-border shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all w-12 h-12" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl bg-transparent border-none shadow-none text-white p-0 overflow-visible ring-0"
        >
          <div className="relative w-full h-[70vh] sm:h-[85vh] flex items-center justify-center">
            <Image
              src={lightboxImage}
              alt="Büyütülmüş Görsel"
              fill
              sizes="100vw"
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white bg-black/40 p-2 rounded-full backdrop-blur transition-colors z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
