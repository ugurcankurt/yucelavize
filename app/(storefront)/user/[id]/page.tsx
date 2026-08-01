import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/storefront/product-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageSquare, ShoppingBag, Heart, ShieldCheck, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function UserProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const userId = params.id;

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    notFound();
  }

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(name, slug, images)")
    .eq("user_id", userId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Fetch Favorites (via secure RPC)
  const { data: favoritesData } = await supabase
    .rpc("get_public_favorites", { uid: userId });

  const favoriteProducts = favoritesData || [];

  // Fetch Purchased Products (via secure RPC)
  const { data: purchasedData } = await supabase
    .rpc("get_public_purchased_products", { uid: userId });

  const purchasedProducts = purchasedData || [];

  // Fetch Active Campaign
  const { data: activeCampaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  // Fetch Reviews for all displayed products
  const allProductIds = Array.from(new Set([
    ...favoriteProducts.map((p: any) => p.id),
    ...purchasedProducts.map((p: any) => p.id)
  ]));

  if (allProductIds.length > 0) {
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("product_id, rating, status")
      .eq("status", "approved")
      .in("product_id", allProductIds);

    const reviews = allReviews || [];
    
    favoriteProducts.forEach((p: any) => {
      p.reviews = reviews.filter((r) => r.product_id === p.id);
    });
    purchasedProducts.forEach((p: any) => {
      p.reviews = reviews.filter((r) => r.product_id === p.id);
    });
  }

  const safeReviews = reviews || [];

  const getPublicName = (fullName: string | null) => {
    if (!fullName) return "Müşteri";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return fullName;
    return parts.slice(0, -1).join(" ");
  };

  const publicName = getPublicName(profile.full_name);

  const renderTabsContent = (
    <>
      <TabsContent value="reviews" className="focus-visible:outline-none mt-8">
        {safeReviews.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-dashed border-border">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Bu kullanıcı henüz yorum yapmamış.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeReviews.map((review) => (
              <Card key={review.id} className="border-border shadow-sm overflow-hidden rounded-[2rem] bg-card">
                <CardHeader className="pb-3 border-b border-border bg-muted/30 px-6 pt-6">
                  <Link href={`/products/${review.products?.slug}`} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-border bg-background shrink-0">
                      <Image
                        src={review.products?.images?.[0] || "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22"}
                        alt={review.products?.name || "Ürün"}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors">
                        {review.products?.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3.5 h-3.5",
                                star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                </CardHeader>

                <CardContent className="pt-4 pb-6 px-6">
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="purchases" className="focus-visible:outline-none mt-8">
        {purchasedProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-dashed border-border">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Satın alma geçmişi bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {purchasedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} isFavorite={false} activeCampaign={activeCampaign} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="favorites" className="focus-visible:outline-none mt-8">
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-[2rem] border border-dashed border-border">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">Favori ürünü bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} isFavorite={false} activeCampaign={activeCampaign} />
            ))}
          </div>
        )}
      </TabsContent>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container mx-auto px-4 pt-8 md:pt-12 max-w-6xl">

        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden">
          <Tabs defaultValue="reviews" className="w-full">
            <div className="flex flex-col gap-6 mb-4">

              <Card className="border-none shadow-sm rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 bg-card relative overflow-hidden">
                <Avatar className="w-24 h-24 border-[3px] border-background shadow-md relative z-10">
                  {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={publicName} className="object-cover" />}
                  <AvatarFallback className="bg-muted text-muted-foreground font-bold text-3xl">
                    {publicName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center relative z-10">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{publicName}</h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-primary text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Doğrulanmış
                  </div>
                </div>
              </Card>

              <TabsList className="grid grid-cols-3 gap-2 w-full !h-auto p-0 bg-transparent border-none">
                <TabsTrigger value="reviews" className="w-full bg-card border-none rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all !h-auto !whitespace-normal group/tab">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-bold leading-none mb-1">{safeReviews.length}</span>
                    <span className="text-[10px] font-medium text-center leading-tight opacity-80">Yorumlar</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="w-full bg-card border-none rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all !h-auto !whitespace-normal group/tab">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-bold leading-none mb-1">{purchasedProducts.length}</span>
                    <span className="text-[10px] font-medium text-center leading-tight opacity-80">Siparişler</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="w-full bg-card border-none rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all !h-auto !whitespace-normal group/tab">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-bold leading-none mb-1">{favoriteProducts.length}</span>
                    <span className="text-[10px] font-medium text-center leading-tight opacity-80">Favoriler</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            {renderTabsContent}
          </Tabs>
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block">
          <Tabs defaultValue="reviews" className="w-full">
            <div className="grid grid-cols-12 gap-6 mb-8">

              {/* Desktop Profile Card */}
              <Card className="col-span-4 border-none shadow-sm rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 bg-card relative overflow-hidden group">
                <Avatar className="w-36 h-36 border-4 border-background shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-105">
                  {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={publicName} className="object-cover" />}
                  <AvatarFallback className="bg-muted text-muted-foreground font-bold text-5xl">
                    {publicName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center relative z-10">
                  <h1 className="text-3xl font-bold text-foreground mb-3">{publicName}</h1>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-primary text-sm font-semibold shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Doğrulanmış
                  </div>
                </div>
              </Card>

              {/* Desktop Stats */}
              <div className="col-span-8 flex flex-col">
                <TabsList className="grid grid-cols-3 gap-6 w-full !h-auto p-0 bg-transparent border-none">
                  <TabsTrigger value="reviews" className="w-full bg-card border-none rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 !h-auto !whitespace-normal group/tab hover:shadow-md cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors duration-300">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-4xl font-black leading-none mb-2">{safeReviews.length}</span>
                      <span className="text-sm font-semibold text-center uppercase tracking-wider opacity-80">Değerlendirme</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="purchases" className="w-full bg-card border-none rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 !h-auto !whitespace-normal group/tab hover:shadow-md cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors duration-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-4xl font-black leading-none mb-2">{purchasedProducts.length}</span>
                      <span className="text-sm font-semibold text-center uppercase tracking-wider opacity-80">Satın Alınan</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="w-full bg-card border-none rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 shadow-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] transition-all duration-300 !h-auto !whitespace-normal group/tab hover:shadow-md cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-data-[state=active]/tab:bg-white/20 group-data-[state=active]/tab:text-primary-foreground transition-colors duration-300">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-4xl font-black leading-none mb-2">{favoriteProducts.length}</span>
                      <span className="text-sm font-semibold text-center uppercase tracking-wider opacity-80">Favoriler</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {renderTabsContent}
          </Tabs>
        </div>

      </div>
    </div>
  );
}
