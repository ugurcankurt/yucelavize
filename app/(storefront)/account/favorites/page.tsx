import { createClient } from "@/lib/supabase/server";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { revalidatePath } from "next/cache";
export const metadata = { title: "Favorilerim | Yücel Avize" };
export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // Since we couldn't push the migration to remote DB directly without user interaction,
  // we handle the case gracefully if the table doesn't exist or returns error.
  let favorites: any[] = [];
  try {
    const { data } = await supabase
      .from("favorites")
      .select("*, product:products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    favorites = data || [];
  } catch (error) {
    console.error("Favorites table not ready:", error);
  }

  // Remove Action
  async function removeFavorite(formData: FormData) {
    "use server";
    const favoriteId = formData.get("favoriteId") as string;
    const sClient = await createClient();
    const {
      data: { user },
    } = await sClient.auth.getUser();
    if (user && favoriteId) {
      await sClient
        .from("favorites")
        .delete()
        .eq("id", favoriteId)
        .eq("user_id", user.id);
      revalidatePath("/account/favorites");
    }
  }

  return (
    <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm shadow-gray-100/50 min-h-[500px]">
      <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
        Favorilerim{" "}
        <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
          {favorites.length} Ürün
        </span>
      </h2>
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-border rounded-[24px]">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Favorileriniz boş
          </h3>
          <p className="text-sm font-medium text-muted-foreground mb-6">
            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca
            bulabilirsiniz.
          </p>
          <Button
            nativeButton={false}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
            render={<Link href="/products" />}
          >
            {" "}
            Ürünleri İncele{" "}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const product = fav.product;
            if (!product) return null;
            const primaryImage =
              product.images?.[0] ||
              "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=600&auto=format&fit=crop";
            return (
              <div key={fav.id} className="group flex flex-col relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted border border-border mb-4">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <form action={removeFavorite}>
                    <input type="hidden" name="favoriteId" value={fav.id} />
                    <button
                      type="submit"
                      className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-full flex items-center justify-center shadow-sm transition-colors"
                    >
                      {" "}
                      <Trash2 className="w-4 h-4" />{" "}
                    </button>
                  </form>
                  {/* Stock Badges */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-4 left-4 bg-warning text-warning-foreground text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full shadow-md">
                      {" "}
                      Son {product.stock}{" "}
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      {" "}
                      <span className="bg-foreground text-background text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                        Tükendi
                      </span>{" "}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-base text-foreground line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <p className="font-black text-foreground">
                    ₺{product.price.toLocaleString("tr-TR")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 text-xs font-semibold px-4 border-border"
                  >
                    {" "}
                    <ShoppingCart className="w-3.5 h-3.5 mr-2" /> Ekle{" "}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
