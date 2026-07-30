import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductsFilter } from "@/components/storefront/products-filter";
export const metadata = {
  title: "Tüm Ürünler | Yücel Avize",
  description:
    "Yücel Avize'nin lüks ve modern aydınlatma koleksiyonunu keşfedin.",
};
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  let categoryData = null;
  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, discounted_price, images, stock, category:categories!inner(name, slug)",
    );
  if (
    resolvedSearchParams.search &&
    typeof resolvedSearchParams.search === "string"
  ) {
    query = query.or(
      `name.ilike.%${resolvedSearchParams.search}%,description.ilike.%${resolvedSearchParams.search}%`,
    );
  }
  if (
    resolvedSearchParams.category &&
    typeof resolvedSearchParams.category === "string"
  ) {
    query = query.eq("category.slug", resolvedSearchParams.category);
    const { data: cat } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", resolvedSearchParams.category)
      .single();
    if (cat) {
      categoryData = cat;
    }
  }
  // Filters
  if (resolvedSearchParams.min_price) {
    query = query.gte("price", Number(resolvedSearchParams.min_price));
  }
  if (resolvedSearchParams.max_price) {
    query = query.lte("price", Number(resolvedSearchParams.max_price));
  }
  if (resolvedSearchParams.in_stock === "true") {
    query = query.gt("stock", 0);
  }
  // Sorting
  const sort = resolvedSearchParams.sort as string;
  if (sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  
  const [productsData, activeCampaignData] = await Promise.all([
    query,
    supabase.from("campaigns").select("*").eq("is_active", true).limit(1).maybeSingle()
  ]);
  
  const products = productsData.data;
  const activeCampaign = activeCampaignData.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userFavorites: string[] = [];
  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);
    if (favs) {
      userFavorites = favs.map((f) => f.product_id);
    }
  }
  const pageTitle = categoryData
    ? categoryData.name
    : resolvedSearchParams.search
      ? `Arama Sonuçları:"${resolvedSearchParams.search}"`
      : "Tüm Ürünler";
  const pageDescription = categoryData
    ? `${categoryData.name} kategorisindeki özel koleksiyonumuzu keşfedin.`
    : "Evinizin ışıltısını ortaya çıkaracak premium aydınlatma koleksiyonumuzu keşfedin.";
  return (
    <div className="w-full bg-background font-sans min-h-screen">
      <div
        className={`relative w-full -mt-[70px] pt-[130px] pb-16 md:-mt-[80px] md:pt-[160px] md:pb-24 flex items-center justify-center overflow-hidden ${categoryData?.image_url ? "" : "bg-gradient-to-br from-muted via-muted/50 to-background"}`}
      >
        {categoryData?.image_url && (
          <>
            <Image
              src={categoryData.image_url}
              alt={categoryData.name}
              fill
              priority
              sizes="100vw"
              className="object-cover absolute inset-0 z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-transparent z-10"></div>
          </>
        )}
        <div
          className="container relative z-20 mx-auto px-6 flex flex-col items-center text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 md:mb-4 text-primary drop-shadow-md">
            {pageTitle}
          </h1>
          <p className="font-semibold text-sm md:text-base max-w-lg text-foreground/90 drop-shadow-md leading-relaxed">
            {pageDescription}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ProductsFilter count={products?.length || 0} />
        {!products || products.length === 0 ? (
          <div className="text-center py-32 bg-muted rounded-[32px] border border-border">
            <p className="text-lg font-medium text-muted-foreground">
              Şu an mağazada ürün bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={userFavorites.includes(product.id)}
                priority={index < 8}
                activeCampaign={activeCampaign}
              />
            ))}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
