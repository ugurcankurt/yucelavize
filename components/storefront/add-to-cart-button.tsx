"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart, ProductType } from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackGAEvent } from "@/lib/google-analytics";
interface AddToCartButtonProps {
  product: ProductType;
  selectedColor?: string;
  disabled?: boolean;
  className?: string;
  iconOnly?: boolean;
  onAdded?: () => void;
}
export function AddToCartButton({
  product,
  selectedColor,
  disabled,
  className,
  iconOnly,
  onAdded,
}: AddToCartButtonProps) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const currentItem = cart.items.find(item => item.product.id === product.id && item.color === selectedColor);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    
    if (currentQuantity >= product.stock) {
      toast.add({
        title: "Stok Yetersiz",
        description: `Bu üründen en fazla ${product.stock} adet ekleyebilirsiniz.`,
        type: "error",
      } as any);
      return;
    }

    cart.addItem(product, 1, selectedColor);
    trackMetaEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "TRY"
    });
    trackGAEvent("add_to_cart", {
      currency: "TRY",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: 1,
        }
      ]
    });
    setIsAdded(true);
    
    if (onAdded) {
      onAdded();
    }
    
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
      size={iconOnly ? "icon" : "lg"}
      onClick={handleAddToCart}
      disabled={disabled}
      className={cn(
        iconOnly ? "w-12 h-12 rounded-full" : "h-14 text-lg w-full",
        "transition-all",
        isAdded 
          ? "bg-success text-success-foreground hover:bg-success/90" 
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {product.stock <= 0 ? (
        <>
          {" "}
          <ShoppingCart className={iconOnly ? "w-5 h-5 opacity-50" : "mr-2 w-5 h-5 opacity-50"} /> {!iconOnly && "Tükendi"}{" "}
        </>
      ) : isAdded ? (
        <>
          {" "}
          <Check className={iconOnly ? "w-5 h-5" : "mr-2 w-5 h-5"} /> {!iconOnly && "Sepete Eklendi"}{" "}
        </>
      ) : (
        <>
          {" "}
          <ShoppingCart className={iconOnly ? "w-5 h-5" : "mr-2 w-5 h-5"} /> {!iconOnly && "Sepete Ekle"}{" "}
        </>
      )}{" "}
    </Button>
  );
}
