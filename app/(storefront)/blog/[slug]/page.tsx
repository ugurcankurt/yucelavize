import { publicSupabase } from "@/lib/services/public-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";

// Revalidate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data: posts } = await publicSupabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  
  if (!posts) return [];
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = publicSupabase;

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover_image_url, seo_title, seo_description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    return {
      title: "Blog Yazısı Bulunamadı | Yücel Avize",
    };
  }

  const title = post.seo_title || `${post.title} | Yücel Avize Blog`;
  const description = post.seo_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = publicSupabase;

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) {
    notFound();
  }

  // TipTap saves content as raw HTML, so we can directly inject it.
  const renderContent = (content: string) => {
    return { __html: content };
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image_url ? [post.cover_image_url] : [],
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": [{
      "@type": "Person",
      "name": "Yücel Avize",
      "url": "https://yucelavize.com/hakkimizda"
    }]
  };

  return (
    <div className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Tüm Yazılara Dön
        </Link>

        <article className="prose prose-stone dark:prose-invert lg:prose-lg max-w-none">
          <header className="mb-10 text-center">
            <time className="text-sm font-medium text-muted-foreground mb-4 block" dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
          </header>

          {post.cover_image_url && (
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-12 shadow-md">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl prose-img:shadow-md mx-auto"
            dangerouslySetInnerHTML={renderContent(post.content)} 
          />
        </article>
      </div>
    </div>
  );
}
