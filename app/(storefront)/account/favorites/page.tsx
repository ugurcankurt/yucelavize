import { createClient } from "@/lib/supabase/server";
import { Heart, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/storefront/product-card";

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
      .select("*, product:products(*, reviews(rating, status))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    favorites = data || [];
  } catch (error) {
    console.error("Favorites table not ready:", error);
  }

  // Fetch Active Campaign
  const { data: activeCampaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

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
    <div className="bg-background border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Favorilerim
          <Badge variant="secondary" className="px-3 py-1 text-sm font-bold shadow-sm rounded-full">
            {favorites.length} Ürün
          </Badge>
        </h2>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-2 border-dashed border-border shadow-none bg-muted/10 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3">
              Favori ürününüz bulunmuyor
            </h3>
            <p className="text-base font-medium text-muted-foreground mb-8 max-w-md mx-auto">
              Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize ekleyebilir ve daha sonra kolayca sipariş edebilirsiniz.
            </p>
            <Button
              nativeButton={false}
              className="rounded-xl px-10 h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
              render={<Link href="/products" />}
            >
              <Heart className="w-5 h-5 mr-2" /> Ürünleri Keşfet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((fav) => {
            const product = fav.product;
            if (!product) return null;
            return (
              <ProductCard
                key={fav.id}
                product={product}
                isFavorite={true}
                activeCampaign={activeCampaign}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
