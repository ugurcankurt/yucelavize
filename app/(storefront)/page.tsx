import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  Lightbulb,
  Grid,
  Package,
  Hexagon,
  Star,
  Sun,
  Box,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";
import { getUserFavorites } from "@/lib/services/user-service";
import { ProductCard } from "@/components/storefront/product-card";
import { HeroSlider } from "@/components/storefront/hero-slider";
import { getReviewsWithPhotos } from "@/app/actions/reviews";
import { PhotoReviewsSlider } from "@/components/storefront/photo-reviews-slider";
import { 
  getCachedNewArrivals, 
  getCachedCategories, 
  getCachedHeroSlides, 
  getCachedActiveCampaign, 
  getCachedHomeBanners 
} from "@/lib/services/public-data";

export default async function Home() {
  const supabase = await createClient();
  const photoReviews = await getReviewsWithPhotos();
  
  // Use cached data fetching for public entities
  const newArrivals = await getCachedNewArrivals(4);
  const categories = await getCachedCategories(7);
  const slides = await getCachedHeroSlides();
  const activeCampaign = await getCachedActiveCampaign();
  const banners = await getCachedHomeBanners();

  const largeBanner = banners?.find(b => b.is_large);
  const smallBanners = banners?.filter(b => !b.is_large).slice(0, 2);

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const { data: latestBlogs } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image_url, category:category_id(name)")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(2);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userFavorites = await getUserFavorites(supabase, user?.id);
  return (
    <div className="flex flex-col flex-1 w-full font-sans bg-background">
      {/* 1. Hero Section */}
      <HeroSlider slides={slides || []} />

      {/* 2. Shop by Category */}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col min-w-[200px] shrink-0">
            <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-2">
              Koleksiyonlar
            </h2>
            <Link
              href="/categories"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              Tüm Koleksiyonlar
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pb-6 md:pb-0 md:flex-1">
            {categories?.map((cat, index) => (
              <Link
                href={`/products?category=${cat.slug}`}
                key={cat.id}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-sm border border-border/50"
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <Hexagon className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between">
                  <span className="text-sm md:text-sm font-bold text-white block truncate">
                    {cat.name}
                  </span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/products"
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary flex items-center justify-center shadow-sm"
            >
              <div className="text-center p-3 md:p-4">
                <LayoutGrid className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground mb-2 md:mb-3 mx-auto opacity-90 group-hover:scale-110 transition-transform" />
                <span className="text-sm md:text-base font-bold text-primary-foreground block">
                  Tüm Ürünler
                </span>
                <span className="text-xs md:text-sm text-primary-foreground/80 block mt-0.5 md:mt-1">
                  Koleksiyonu Gör
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* 3. New Arrivals */}
      <section className="w-full py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[26px] font-bold text-foreground tracking-tight">
              Yeni Gelenler
            </h2>
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10">
            {newArrivals?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={userFavorites.includes(product.id)}
                activeCampaign={activeCampaign}
              />
            ))}
          </div>
        </div>
      </section>
      {/* 4. Banner Section 1 */}{" "}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {largeBanner && (
            <div className="relative rounded-3xl overflow-hidden bg-primary aspect-[4/3] lg:aspect-auto lg:h-[500px] flex items-center">
              <div className="relative z-10 p-10 max-w-sm">
                <div className="w-10 h-10 mb-6 text-foreground">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 4.2l7.1 13.8H4.9L12 6.2z" />
                  </svg>
                </div>
                {largeBanner.title && (
                  <h2
                    className="text-4xl font-black text-foreground leading-[1.1] mb-6"
                    dangerouslySetInnerHTML={{ __html: largeBanner.title }}
                  />
                )}
                <Link
                  href={largeBanner.link_url || "/products"}
                  className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors"
                >
                  {largeBanner.subtitle || "Alışverişe Başla"}
                </Link>
              </div>
              {largeBanner.image_url && (
                <div className="absolute right-0 bottom-0 w-3/4 h-3/4">
                  <Image
                    src={largeBanner.image_url}
                    alt={largeBanner.title?.replace(/<[^>]*>?/gm, '') || "Banner"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-tl-full opacity-90 mix-blend-luminosity"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-6 h-full">
            {smallBanners && smallBanners[0] && (
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-muted border border-border flex items-center p-8 min-h-[240px]">
                <div className="relative z-10 max-w-[200px]">
                  {smallBanners[0].pre_title && (
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {smallBanners[0].pre_title}
                    </p>
                  )}
                  {smallBanners[0].title && (
                    <h3
                      className="text-2xl font-bold text-foreground leading-tight mb-6"
                      dangerouslySetInnerHTML={{ __html: smallBanners[0].title }}
                    />
                  )}
                  {smallBanners[0].button_text && (
                    <Link
                      href={smallBanners[0].link_url || "/products"}
                      className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                    >
                      {smallBanners[0].button_text}
                    </Link>
                  )}
                </div>
                {smallBanners[0].image_url && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40">
                    <Image
                      src={smallBanners[0].image_url}
                      alt={smallBanners[0].title?.replace(/<[^>]*>?/gm, '') || "Banner"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-full"
                    />
                  </div>
                )}
              </div>
            )}

            {smallBanners && smallBanners[1] && (
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-muted border border-border flex items-center p-8 min-h-[240px]">
                <div className="relative z-10 max-w-[200px]">
                  {smallBanners[1].pre_title && (
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {smallBanners[1].pre_title}
                    </p>
                  )}
                  {smallBanners[1].title && (
                    <h3
                      className="text-2xl font-bold text-foreground leading-tight mb-6"
                      dangerouslySetInnerHTML={{ __html: smallBanners[1].title }}
                    />
                  )}
                  {smallBanners[1].button_text && (
                    <Link
                      href={smallBanners[1].link_url || "/products"}
                      className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                    >
                      {smallBanners[1].button_text}
                    </Link>
                  )}
                </div>
                {smallBanners[1].image_url && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-40">
                    <Image
                      src={smallBanners[1].image_url}
                      alt={smallBanners[1].title?.replace(/<[^>]*>?/gm, '') || "Banner"}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover rounded-2xl"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>{" "}
      {/* 5. Photo Reviews Slider */}
      {photoReviews && photoReviews.length > 0 && (
        <PhotoReviewsSlider reviews={photoReviews} />
      )}{" "}
      {/* 6. Shop by Brands */}{" "}
      <section className="w-full py-12 md:py-20 border-y border-border bg-muted">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="flex justify-between items-end mb-10">
            {" "}
            <h2 className="text-[26px] font-bold text-foreground tracking-tight">
              Ortak Markalar
            </h2>{" "}
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              {" "}
              Tümünü Gör{" "}
            </Link>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-border rounded-2xl overflow-hidden bg-background">
            {" "}
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                brand.url ? (
                  <Link
                    key={brand.id}
                    href={brand.url}
                    className="aspect-[2/1] border-[0.5px] border-border flex items-center justify-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer relative"
                  >
                    <Image src={brand.image_url} alt={brand.name} fill className="object-contain p-4" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw" />
                  </Link>
                ) : (
                  <div
                    key={brand.id}
                    className="aspect-[2/1] border-[0.5px] border-border flex items-center justify-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all relative"
                  >
                    <Image src={brand.image_url} alt={brand.name} fill className="object-contain p-4" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw" />
                  </div>
                )
              ))
            ) : (
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/1] border-[0.5px] border-border flex items-center justify-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                >
                  <span className="font-black text-xl tracking-widest text-foreground uppercase">
                    Brand {i + 1}
                  </span>
                </div>
              ))
            )}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {latestBlogs && latestBlogs.length > 0 && (
        <section className="w-full py-12 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-8">
              Son Yazılar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs[0] && (
                <Link
                  href={`/blog/${latestBlogs[0].slug}`}
                  className="md:col-span-2 relative h-[400px] rounded-3xl overflow-hidden group"
                >
                  <Image
                    src={latestBlogs[0].cover_image_url || "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=1200&auto=format&fit=crop"}
                    alt={latestBlogs[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 max-w-lg">
                    {(latestBlogs[0].category as any)?.name && (
                      <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest border border-border/30 px-3 py-1 rounded-full mb-4 inline-block backdrop-blur-md">
                        {(latestBlogs[0].category as any).name}
                      </span>
                    )}
                    <h3 className="text-4xl font-black text-foreground leading-tight mt-4">
                      {latestBlogs[0].title}
                    </h3>
                  </div>
                </Link>
              )}
              {latestBlogs[1] && (
                <Link
                  href={`/blog/${latestBlogs[1].slug}`}
                  className="relative h-[400px] rounded-3xl overflow-hidden group bg-primary"
                >
                  <Image
                    src={latestBlogs[1].cover_image_url || "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop"}
                    alt={latestBlogs[1].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 p-10">
                    {(latestBlogs[1].category as any)?.name && (
                      <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest border border-border/30 px-3 py-1 rounded-full mb-4 inline-block backdrop-blur-md">
                        {(latestBlogs[1].category as any).name}
                      </span>
                    )}
                    <h3 className="text-3xl font-black text-foreground leading-tight mt-4">
                      {latestBlogs[1].title}
                    </h3>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
