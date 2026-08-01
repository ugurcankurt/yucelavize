import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Metadata } from "next";
import { PageHero } from "@/components/storefront/page-hero";

export const metadata: Metadata = {
  title: "Tüm Koleksiyonlar | Yücel Avize",
  description: "Yücel Avize'deki tüm aydınlatma ve aksesuar koleksiyonlarını keşfedin.",
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="w-full">
      <PageHero
        title="Tüm Koleksiyonlar"
        description="Evinizin her köşesi için özenle tasarlanmış aydınlatma ve aksesuar koleksiyonlarımızı keşfedin."
        breadcrumbs={[{ label: "Tüm Koleksiyonlar" }]}
      />

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {!categories || categories.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border/50">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Koleksiyon Bulunamadı</h2>
            <p className="text-muted-foreground">Henüz eklenmiş bir koleksiyon bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Image Section */}
                <div className="relative aspect-square w-full bg-muted overflow-hidden">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform duration-300">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
