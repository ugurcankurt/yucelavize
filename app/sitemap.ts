import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.yucelavize.com";
  const supabase = await createClient();

  // Fetch all published products
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, images");

  // Fetch all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at, image_url");

  // Fetch all published blogs
  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, image_url")
    .eq("is_published", true);

  const productUrls = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at || Date.now()),
    changeFrequency: "daily" as const, // High frequency for products due to price/stock changes
    priority: 0.8,
    ...(product.images && product.images[0] ? { images: [product.images[0]] } : {})
  }));

  const categoryUrls = (categories || []).map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: new Date(category.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    ...(category.image_url ? { images: [category.image_url] } : {})
  }));

  const blogUrls = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    ...(blog.image_url ? { images: [blog.image_url] } : {})
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categoryUrls,
    ...productUrls,
    ...blogUrls,
  ];
}
