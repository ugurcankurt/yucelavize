import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Yücel Avize",
  description: "Avize modelleri, aydınlatma trendleri, dekorasyon fikirleri ve evinizi güzelleştirecek ipuçları Yücel Avize blogunda.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function BlogIndexPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching published blogs:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & İlham</h1>
        <p className="text-lg text-muted-foreground">
          Aydınlatma trendleri, dekorasyon fikirleri ve Yücel Avize'den en güncel haberler.
        </p>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="text-center py-24 text-muted-foreground">
          Henüz blog yazısı bulunmamaktadır. Yakında yeni içeriklerle karşınızda olacağız.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                    Görsel Yok
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow text-sm">
                  {post.excerpt}
                </p>
                <div className="text-primary font-medium text-sm flex items-center">
                  Devamını Oku
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
