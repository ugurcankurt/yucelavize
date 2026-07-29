"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ColorSelector } from "./color-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductType } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";
import { useProductStore } from "@/hooks/use-product-store";

interface ProductActionSectionProps {
  product: ProductType;
  colors?: string[];
}

export function ProductActionSection({
  product,
  colors,
}: ProductActionSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setProductContext, clearProductContext } = useProductStore();

  // Read color from URL if exists, else null
  const urlColor = searchParams.get("color");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    urlColor || null,
  );
  const hasColors = colors && colors.length > 0;

  useEffect(() => {
    setProductContext(product, colors);
    return () => clearProductContext();
  }, [product, colors, setProductContext, clearProductContext]);

  // Sync state when user clicks a color
  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    // Update URL without server roundtrip (Next.js supports this natively)
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", color);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    
    // Scroll up to the top to see the color change
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (hasColors && !selectedColor) {
      e.preventDefault();
      // Stop add to cart
      toast.add({
        title: "Renk Seçimi Zorunlu",
        description: "Lütfen sepete eklemeden önce bir renk seçiniz.",
        type: "error",
      } as any);
      return false;
    }
    return true; // Allow add to cart
  };

  return (
    <div className="hidden lg:flex flex-col gap-4 mb-8 bg-muted p-6 rounded-2xl border border-border">
      {hasColors && (
        <ColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={handleSelectColor}
        />
      )}
      <div onClickCapture={handleAddToCart}>
        <AddToCartButton
          product={product}
          selectedColor={selectedColor || undefined}
          disabled={hasColors && !selectedColor}
        />
      </div>
    </div>
  );
}
