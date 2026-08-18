import { MetadataRoute } from "next";
import { publicSupabase } from "@/lib/services/public-data";

const URL_LIMIT = 50000;
const BASE_URL = "https://www.yucelavize.com";

export async function generateSitemaps() {
  const supabase = publicSupabase;
  
  // Calculate how many sitemap chunks we need based on total products
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true });

  const totalProducts = productCount || 0;
  const productChunks = Math.ceil(totalProducts / URL_LIMIT) || 1;

  const sitemaps = [];
  for (let i = 0; i < productChunks; i++) {
    sitemaps.push({ id: i.toString() });
  }

  return sitemaps;
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = parseInt(await props.id, 10);
  const supabase = publicSupabase;

  const start = id * URL_LIMIT;
  const end = start + URL_LIMIT - 1;

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, images, category:categories(slug)")
    .range(start, end);

  const productUrls = (products || []).map((product) => {
    const categorySlug = product.category
      ? Array.isArray(product.category)
        ? (product.category as any)[0]?.slug
        : (product.category as any).slug
      : "kategorisiz";

    return {
      url: `${BASE_URL}/kategori/${categorySlug}/${product.slug}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.8,
      ...(product.images && product.images[0] ? { images: [product.images[0]] } : {})
    };
  });

  // Only add static routes and categories/collections to the first sitemap (id = 0)
  if (id === 0) {
    const { data: categories } = await supabase
      .from("categories")
      .select("slug, updated_at, image_url");

    const { data: collections } = await supabase
      .from("collections")
      .select("slug, updated_at, image_url")
      .eq("is_active", true);

    const { data: blogs } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, cover_image_url")
      .eq("is_published", true);

    const categoryUrls = (categories || []).map((category) => ({
      url: `${BASE_URL}/kategori/${category.slug}`,
      lastModified: new Date(category.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      ...(category.image_url ? { images: [category.image_url] } : {})
    }));

    const collectionUrls = (collections || []).map((collection) => ({
      url: `${BASE_URL}/collections/${collection.slug}`,
      lastModified: new Date(collection.updated_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      ...(collection.image_url ? { images: [collection.image_url] } : {})
    }));

    const blogUrls = (blogs || []).map((blog) => ({
      url: `${BASE_URL}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...(blog.cover_image_url ? { images: [blog.cover_image_url] } : {})
    }));

    const staticUrls = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/products`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/kategori`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/collections`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/terms-of-service`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/refund-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/shipping-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/legal-notice`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }
    ];

    return [
      ...staticUrls,
      ...categoryUrls,
      ...collectionUrls,
      ...blogUrls,
      ...productUrls,
    ];
  }

  // If id > 0, just return the products for that chunk
  return productUrls;
}

