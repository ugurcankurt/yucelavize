import { publicSupabase } from "@/lib/services/public-data";
import Image from "next/image";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductsFilter } from "@/components/storefront/products-filter";
import { PageHero } from "@/components/storefront/page-hero";

import { Metadata, ResolvingMetadata } from "next";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(
  { searchParams }: { searchParams: SearchParams },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category as string | undefined;

  let title = "Tüm Ürünler | Yücel Avize";
  let description = "Yücel Avize'nin lüks ve modern aydınlatma koleksiyonunu keşfedin.";

  if (categorySlug) {
    const supabase = publicSupabase;
    const { data: cat } = await supabase
      .from("categories")
      .select("name, description")
      .eq("slug", categorySlug)
      .single();

    if (cat) {
      title = `${cat.name} | Yücel Avize`;
      description = cat.description || `${cat.name} kategorisindeki özel koleksiyonumuzu keşfedin.`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = publicSupabase;
  let categoryData = null;
  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, discounted_price, images, stock, category:categories!inner(name, slug), reviews(rating, status)",
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
  const pageTitle = categoryData
    ? categoryData.name
    : resolvedSearchParams.search
      ? `Arama Sonuçları:"${resolvedSearchParams.search}"`
      : "Tüm Ürünler";
  const pageDescription = categoryData
    ? `${categoryData.name} kategorisindeki özel koleksiyonumuzu keşfedin.`
    : "Evinizin ışıltısını ortaya çıkaracak premium aydınlatma koleksiyonumuzu keşfedin.";
  const breadcrumbs = categoryData
    ? [
        { label: "Koleksiyonlar", href: "/categories" },
        { label: categoryData.name },
      ]
    : resolvedSearchParams.search
      ? [{ label: "Arama Sonuçları" }]
      : [{ label: "Tüm Ürünler" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (products || []).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://yucelavize.com/products/${product.slug}`
    }))
  };

  return (
    <div className="w-full bg-background font-sans min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title={pageTitle}
        description={pageDescription}
        imageUrl={categoryData?.image_url}
        breadcrumbs={breadcrumbs}
      />
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
