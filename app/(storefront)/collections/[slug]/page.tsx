import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { PageHero } from "@/components/storefront/page-hero";
import { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!collection) {
    return { title: "Koleksiyon Bulunamadı" };
  }

  return {
    title: `${collection.name} | Yücel Avize`,
    description: collection.description || `${collection.name} koleksiyonundaki en şık ürünleri keşfedin.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch collection details
  const { data: collection, error: colError } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (colError || !collection) {
    notFound();
  }

  // 2. Fetch products in this collection
  // Since we have a many-to-many relationship, we need to join collection_products with products
  const { data: collectionProducts, error: prodError } = await supabase
    .from("collection_products")
    .select(`
      product_id,
      product:products (
        id,
        name,
        slug,
        price,
        discounted_price,
        images,
        is_featured,
        category:categories(name)
      )
    `)
    .eq("collection_id", collection.id);

  const products = collectionProducts 
    ? collectionProducts.map((cp) => cp.product).filter(Boolean) 
    : [];

  return (
    <div className="w-full">
      <PageHero
        title={collection.name}
        description={collection.description || `${collection.name} koleksiyonumuza ait ürünler`}
        imageUrl={collection.image_url}
        breadcrumbs={[
          { label: "Koleksiyonlar", href: "/collections" },
          { label: collection.name }
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Koleksiyondaki Ürünler <span className="text-muted-foreground text-sm font-normal">({products.length})</span>
              </h2>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border/50">
                <p className="text-muted-foreground text-lg">Bu koleksiyonda henüz ürün bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product: any) => (
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
