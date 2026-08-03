import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Metadata } from "next";
import { PageHero } from "@/components/storefront/page-hero";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tüm Koleksiyonlar | Yücel Avize",
  description: "Yücel Avize'deki tüm aydınlatma ve aksesuar koleksiyonlarını keşfedin.",
};

export const revalidate = 3600;

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (collections || []).map((collection, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://yucelavize.com/collections/${collection.slug}`
    }))
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title="Tüm Koleksiyonlar"
        description="Evinizin her köşesi için özenle tasarlanmış aydınlatma ve aksesuar koleksiyonlarımızı keşfedin."
        breadcrumbs={[{ label: "Tüm Koleksiyonlar" }]}
      />

      {/* Collections Grid */}
      <div className="container mx-auto px-4 py-12">
        {!collections || collections.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border/50">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Koleksiyon Bulunamadı</h2>
            <p className="text-muted-foreground">Henüz eklenmiş bir koleksiyon bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collections.map((collection, index) => (
              <Link 
                key={collection.id} 
                href={`/collections/${collection.slug}`}
                className="group relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                  {collection.image_url ? (
                    <Image
                      src={collection.image_url}
                      alt={collection.name}
                      fill
                      priority={index < 4}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform duration-300">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
