"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ColorSelector } from "./color-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductType } from "@/hooks/use-cart";
import { toast } from "@/components/ui/toast";
import { useProductStore } from "@/hooks/use-product-store";
import { WhatsAppOrderButton } from "./whatsapp-order-button";

interface ProductActionSectionProps {
  product: ProductType;
  variations?: string[];
}

export function ProductActionSection({
  product,
  variations,
}: ProductActionSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setProductContext, clearProductContext } = useProductStore();

  // Read variation from URL if exists, else null
  const urlVariation = searchParams.get("variation") || searchParams.get("color");
  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    urlVariation || null,
  );
  const hasVariations = variations && variations.length > 0;

  useEffect(() => {
    setProductContext(product, variations);
    return () => clearProductContext();
  }, [product, variations, setProductContext, clearProductContext]);

  // Sync state when user clicks a variation
  const handleSelectVariation = (variation: string) => {
    setSelectedVariation(variation);
    // Update URL without server roundtrip (Next.js supports this natively)
    const params = new URLSearchParams(searchParams.toString());
    params.set("variation", variation);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    
    // Scroll up to the top to see the variation change
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (hasVariations && !selectedVariation) {
      e.preventDefault();
      // Stop add to cart
      toast.add({
        title: "Varyasyon Seçimi Zorunlu",
        description: "Lütfen sepete eklemeden önce bir seçenek seçiniz.",
        type: "error",
      } as any);
      return false;
    }
    return true; // Allow add to cart
  };

  return (
    <div className="hidden lg:flex flex-col gap-4 mb-8 bg-muted p-6 rounded-2xl border border-border">
      {hasVariations && (
        <ColorSelector
          colors={variations}
          selectedColor={selectedVariation}
          onSelectColor={handleSelectVariation}
        />
      )}
      <div onClickCapture={handleAddToCart}>
        <AddToCartButton
          product={product}
          selectedColor={selectedVariation || undefined}
          disabled={(hasVariations && !selectedVariation) || product.stock <= 0}
        />
      </div>
      
      {/* WhatsApp Hızlı Sipariş Butonu */}
      <WhatsAppOrderButton 
        productName={product.name} 
        disabled={(hasVariations && !selectedVariation) || product.stock <= 0}
      />
    </div>
  );
}
