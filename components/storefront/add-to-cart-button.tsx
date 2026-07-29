"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, ProductType } from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
interface AddToCartButtonProps {
  product: ProductType;
  selectedColor?: string;
  disabled?: boolean;
}
export function AddToCartButton({
  product,
  selectedColor,
  disabled,
}: AddToCartButtonProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const handleAddToCart = (e: React.MouseEvent) => {
    if (disabled) return;
    cart.addItem(product, 1, selectedColor);
    setIsAdded(true);
    toast.add({
      title: "Sepete Eklendi",
      description: `${product.name} ${selectedColor ? `(${selectedColor}) ` : ""}sepetinize başarıyla eklendi.`,
      type: "success",
    } as any);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };
  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      disabled={disabled}
      className={`h-14 text-lg w-full transition-all ${isAdded ? "bg-success text-background hover:bg-success/90" : "bg-foreground text-background hover:bg-foreground/90"}`}
    >
      {" "}
      {isAdded ? (
        <>
          {" "}
          <Check className="mr-2 w-5 h-5" /> Sepete Eklendi{" "}
        </>
      ) : (
        <>
          {" "}
          <ShoppingCart className="mr-2 w-5 h-5" /> Sepete Ekle{" "}
        </>
      )}{" "}
    </Button>
  );
}
