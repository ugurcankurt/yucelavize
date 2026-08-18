"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, ShoppingBag, Heart, LayoutGrid, User, ChevronUp } from "lucide-react";
import { useProductStore } from "@/hooks/use-product-store";
import { AddToCartButton } from "./add-to-cart-button";
import { ColorSelector } from "./color-selector";

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { product, variations } = useProductStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: ShoppingBag },
    { name: "Favorites", href: "/account/favorites", icon: Heart },
    { name: "Kategoriler", href: "/kategori", icon: LayoutGrid }, 
    { name: "Profile", href: "/account", icon: User },
  ];

  // Close expansion if path changes
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Track scroll position to hide when at the bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight;
      
      // Hide if within 50px of the bottom (usually the footer area)
      setIsAtBottom(scrollPosition >= bottomPosition - 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isProductPage = pathname.match(/^\/products\/[^/]+$/);

  const hasVariations = variations && variations.length > 0;
  const selectedVariation = searchParams.get("variation") || searchParams.get("color") || null;
  
  const handleSelectVariation = (variation: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variation", variation);
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
      
      // Scroll to top to see the variation change in the gallery
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
  };

  return (
      <>
        {/* Backdrop */}
        {isExpanded && isProductPage && (
          <div 
            className="fixed inset-0 bg-black/40 z-[35] lg:hidden animate-in fade-in duration-300" 
            onClick={() => setIsExpanded(false)}
          />
        )}
        
        <div 
          className={`lg:hidden fixed left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-[24px] shadow-2xl z-40 overflow-hidden cursor-pointer transition-all duration-300 bg-primary text-primary-foreground ${
            isProductPage && isExpanded ? "bottom-6 p-4 flex-col flex" : "bottom-6 h-16"
          } ${isAtBottom ? "translate-y-32 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
          onClick={() => {
            if (isProductPage && !isExpanded && product) setIsExpanded(true);
          }}
        >
          
          {/* LAYER 1: Generic Nav */}
          <div 
            className={`absolute inset-0 flex w-full h-full items-center justify-around px-2 transition-all duration-500 ease-out ${
              !isProductPage ? "opacity-100 z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-95"
            }`}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "#");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isActive ? "bg-primary-foreground text-primary shadow-md scale-105" : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  <item.icon className={`w-[22px] h-[22px] ${isActive ? "fill-primary" : ""}`} strokeWidth={isActive ? 2 : 1.5} />
                </Link>
              );
            })}
          </div>

          {/* LAYER 2: Product Nav Compact */}
          <div 
            className={`absolute inset-0 flex w-full h-full items-center justify-between p-2 transition-all duration-500 ease-out ${
              isProductPage && !isExpanded ? "opacity-100 z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-95"
            }`}
          >
            {product ? (
              <>
                {/* Left: Price */}
                <div className="flex flex-col px-3 justify-center min-w-max">
                  <span className="text-base font-extrabold text-primary-foreground tracking-tight leading-none">₺{product.price.toLocaleString("tr-TR")}</span>
                </div>
                
                {/* Middle: Variations */}
                <div className="flex-1 flex flex-col items-center justify-center px-1 overflow-hidden">
                  {hasVariations && !selectedVariation ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-medium text-primary-foreground/80 mb-1">Seçenek Belirleyin</span>
                      <div className="flex items-center -space-x-1">
                        {variations.slice(0, 3).map((v, i) => (
                          <div 
                            key={i} 
                            className={`px-1.5 py-0.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-[8px] text-primary-foreground shadow-sm truncate max-w-[40px]`} 
                          >
                            {v}
                          </div>
                        ))}
                        {variations.length > 3 && (
                          <span className="text-[9px] font-medium text-primary-foreground/80 pl-1.5">+{variations.length - 3}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-primary-foreground/90 leading-tight text-center px-1 truncate max-w-full">
                      {selectedVariation ? `Seçim: ${selectedVariation}` : ""}
                    </span>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pr-1">
                  {hasVariations && !selectedVariation && (
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center shadow-inner">
                      <ChevronUp className="w-4 h-4 text-primary-foreground/80" />
                    </div>
                  )}
                  <div onClick={(e) => {
                    if (hasVariations && !selectedVariation) {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }
                  }}>
                    <AddToCartButton 
                      product={product}
                      selectedColor={selectedVariation || undefined}
                      disabled={Boolean(hasVariations && !selectedVariation)}
                      iconOnly={true}
                      className="w-12 h-12 shadow-md bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      onAdded={() => setIsExpanded(false)}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Loading Skeleton */
              <div className="flex w-full h-full items-center justify-between px-3 opacity-50 animate-pulse">
                <div className="w-16 h-8 bg-primary-foreground/20 rounded-lg"></div>
                <div className="flex-1"></div>
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full"></div>
              </div>
            )}
          </div>

          {/* LAYER 3: Product Nav Expanded */}
          {isProductPage && isExpanded && product && (
            <div className="relative flex flex-col w-full h-full gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground/90 line-clamp-1">{product.name}</span>
                  <span className="text-xl font-extrabold text-primary-foreground tracking-tight">₺{product.price.toLocaleString("tr-TR")}</span>
                </div>
              </div>
              
              {hasVariations && (
                <div className="px-1 -mt-1 scale-[0.95] origin-left">
                  <ColorSelector
                    colors={variations}
                    selectedColor={selectedVariation}
                    onSelectColor={handleSelectVariation}
                    variant="navbar"
                  />
                </div>
              )}
              
              <div className="w-full mt-1">
                <AddToCartButton 
                  product={product}
                  selectedColor={selectedVariation || undefined}
                  disabled={Boolean(hasVariations && !selectedVariation)}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full font-bold shadow-lg"
                  onAdded={() => setIsExpanded(false)}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
}
