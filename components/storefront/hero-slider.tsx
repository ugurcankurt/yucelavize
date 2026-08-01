"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  link_url: string | null;
  image_url: string;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null); // otherwise the swipe is fired even with usual touch events
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <section className="w-full pt-0 md:pt-6 pb-2 md:pb-6">
        <div className="container mx-auto px-0 lg:px-4">
          <div className="relative w-full aspect-[4/5] sm:h-[600px] md:h-[700px] sm:aspect-auto -mt-8 lg:mt-0 rounded-none lg:rounded-[32px] overflow-hidden bg-muted flex items-center justify-center z-0">
            <p className="text-muted-foreground">Henüz slayt eklenmemiş.</p>
          </div>
        </div>
      </section>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="w-full pt-0 md:pt-6 pb-8 md:pb-12">
      <div className="container mx-auto px-0 lg:px-4">
        <div
          className="relative w-full aspect-[4/5] sm:h-[600px] md:h-[700px] sm:aspect-auto -mt-8 lg:mt-0 rounded-none lg:rounded-[32px] overflow-hidden bg-black group z-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                {/* Background Image with slight cinematic zoom */}
                <div className={`absolute inset-0 transition-transform duration-[10000ms] ease-linear ${isActive ? "scale-105" : "scale-100"}`}>
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover opacity-80"
                  />
                  {/* Subtle Gradient Overlay for Text Readability - Mobile Bottom, Desktop Left */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/50 to-transparent md:to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-20 p-6 pb-20 sm:p-8 sm:pb-16 md:p-24 flex flex-col items-start justify-end md:justify-center w-full h-full max-w-4xl">
                  {slide.subtitle && (
                    <div
                      className={`mb-4 uppercase tracking-widest text-xs font-bold text-white drop-shadow-md transition-all duration-700 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                    >
                      {slide.subtitle}
                    </div>
                  )}
                  <h1
                    className={`text-4xl sm:text-5xl md:text-[80px] font-black tracking-tight text-white leading-[1.1] drop-shadow-lg mb-6 md:mb-8 transition-all duration-700 delay-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                  >
                    {slide.title}
                  </h1>

                  {slide.button_text && (
                    <Link
                      href={slide.link_url || "/products"}
                      className={`inline-flex items-center justify-center h-11 md:h-12 px-6 md:px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all duration-700 delay-500 hover:scale-105 shadow-xl ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                    >
                      {slide.button_text} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Navigation Controls (Only show if > 1 slide) */}
          {slides.length > 1 && (
            <>
              {/* Prev/Next Buttons */}
              <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
