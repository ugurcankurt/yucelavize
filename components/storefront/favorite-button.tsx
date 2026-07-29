"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorites";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
interface FavoriteButtonProps {
  productId: string;
  initialIsFavorite: boolean;
  className?: string;
  iconClassName?: string;
}
export function FavoriteButton({
  productId,
  initialIsFavorite,
  className,
  iconClassName,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    /* Optimistic update */ setIsFavorite(!isFavorite);
    setLoading(true);
    const result = await toggleFavorite(productId);
    if (result.error) {
      if (result.error === "Lütfen giriş yapın.") {
        router.push("/auth/login");
      } else {
        toast.add({
          title: "Hata",
          description: result.error,
          type: "error",
        } as any);
        setIsFavorite(isFavorite); /* Revert */
      }
    } else if (result.isFavorite !== undefined) {
      setIsFavorite(result.isFavorite);
      if (result.isFavorite) {
        toast.add({
          title: "Favorilere Eklendi",
          description: "Ürün favori listenize eklendi.",
          type: "success",
        } as any);
      } else {
        toast.add({
          title: "Favorilerden Çıkarıldı",
          description: "Ürün favori listenizden çıkarıldı.",
          type: "info",
        } as any);
      }
    }
    setLoading(false);
  };
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "bg-background/90 backdrop-blur hover:bg-background rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 group",
        className,
      )}
      aria-label={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    >
      {" "}
      <Heart
        className={cn(
          "transition-all duration-300",
          isFavorite
            ? "fill-red-500 text-destructive scale-110"
            : "text-muted-foreground group-hover:text-destructive",
          iconClassName,
        )}
      />{" "}
    </button>
  );
}
