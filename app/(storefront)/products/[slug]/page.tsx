import { publicSupabase } from "@/lib/services/public-data";
import { notFound, permanentRedirect } from "next/navigation";

export async function generateStaticParams() {
  const { data: products } = await publicSupabase
    .from("products")
    .select("slug");
  
  if (!products) return [];
  return products.map((product) => ({ slug: product.slug }));
}

export default async function RedirectOldProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const supabase = publicSupabase;

  const { data: product } = await supabase
    .from("products")
    .select("slug, category:categories(slug)")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!product) {
    notFound();
  }

  const categorySlug = product.category
    ? Array.isArray(product.category)
      ? (product.category as any)[0]?.slug
      : (product.category as any).slug
    : "kategorisiz";

  // SEO 301 Permanent Redirect to programmatic SEO URL
  permanentRedirect(`/kategori/${categorySlug}/${product.slug}`);
}
