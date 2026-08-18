import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { PageHero } from "@/components/storefront/page-hero";
import { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { CollectionJsonLd } from "@/components/seo/collection-jsonld";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name") // add description if schema updates
    .eq("slug", slug)
    .single();

  if (!category) {
    return { title: "Kategori Bulunamadı" };
  }

  const title = `${category.name} | Yücel Avize`;
  const description = `${category.name} kategorisindeki en şık ürünleri keşfedin.`;

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
    alternates: {
      canonical: `https://www.yucelavize.com/kategori/${slug}`,
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch category details
  const { data: category, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (catError || !category) {
    notFound();
  }

  // 2. Fetch products in this category
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      discounted_price,
      images,
      is_featured,
      category:categories(name, slug)
    `)
    .eq("category_id", category.id);

  const safeProducts = products || [];

  return (
    <div className="w-full">
      <BreadcrumbJsonLd 
        items={[
          { name: "Ana Sayfa", url: "https://www.yucelavize.com" },
          { name: "Kategoriler", url: "https://www.yucelavize.com/kategori" },
          { name: category.name, url: `https://www.yucelavize.com/kategori/${slug}` }
        ]} 
      />
      <CollectionJsonLd
        name={category.name}
        description={`${category.name} kategorisindeki ürünler`}
        url={`https://www.yucelavize.com/kategori/${slug}`}
        imageUrl={category.image_url}
        products={safeProducts.map(p => ({
          name: p.name,
          url: `https://www.yucelavize.com/products/${p.slug}`
        }))}
      />

      <PageHero
        title={category.name}
        description={`${category.name} kategorimize ait ürünler`}
        imageUrl={category.image_url}
        breadcrumbs={[
          { label: "Kategoriler", href: "/kategori" },
          { label: category.name }
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Kategorideki Ürünler <span className="text-muted-foreground text-sm font-normal">({safeProducts.length})</span>
              </h2>
            </div>
            
            {safeProducts.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border/50">
                <p className="text-muted-foreground text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {safeProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
