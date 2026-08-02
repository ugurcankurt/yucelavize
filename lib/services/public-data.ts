import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

// We use the regular supabase-js client here because we don't want to rely on cookies
// for public data. This allows Next.js to cache these requests globally.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export const publicSupabase = createClient(supabaseUrl, supabaseKey);

export const getCachedCategories = unstable_cache(
  async (limit?: number) => {
    let query = publicSupabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data } = await query;
    return data;
  },
  ["public-categories"],
  { revalidate: 3600, tags: ["categories"] }
);

export const getCachedNewArrivals = unstable_cache(
  async (limit: number = 4) => {
    const { data } = await publicSupabase
      .from("products")
      .select("id, name, slug, price, discounted_price, images, stock, category:categories(name), reviews(rating, status)")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data;
  },
  ["public-new-arrivals"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedHeroSlides = unstable_cache(
  async () => {
    const { data } = await publicSupabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data;
  },
  ["public-hero-slides"],
  { revalidate: 3600, tags: ["hero-slides"] }
);

export const getCachedActiveCampaign = unstable_cache(
  async () => {
    const { data } = await publicSupabase
      .from("campaigns")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    return data;
  },
  ["public-active-campaign"],
  { revalidate: 3600, tags: ["campaigns"] }
);

export const getCachedHomeBanners = unstable_cache(
  async () => {
    const { data } = await publicSupabase
      .from("home_banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    return data;
  },
  ["public-home-banners"],
  { revalidate: 3600, tags: ["banners"] }
);

export const getCachedBrands = unstable_cache(
  async () => {
    const { data } = await publicSupabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data;
  },
  ["public-brands"],
  { revalidate: 3600, tags: ["brands"] }
);

export const getCachedLatestBlogs = unstable_cache(
  async (limit: number = 2) => {
    const { data } = await publicSupabase
      .from("blog_posts")
      .select("id, title, slug, cover_image_url, category:category_id(name)")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data;
  },
  ["public-latest-blogs"],
  { revalidate: 3600, tags: ["blog_posts"] }
);

export const getCachedPhotoReviews = unstable_cache(
  async () => {
    const { data: reviews, error } = await publicSupabase
      .from("reviews")
      .select(`
        id,
        user_id,
        rating,
        comment,
        user_name,
        created_at,
        images,
        products (
          name,
          slug
        )
      `)
      .eq("status", "approved")
      .not("images", "eq", "{}")
      .not("images", "is", null)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !reviews) {
      console.error("Error fetching photo reviews:", error);
      return [];
    }

    const filteredReviews = reviews.filter(r => r.images && r.images.length > 0);
    
    if (filteredReviews.length === 0) return [];

    const userIds = [...new Set(filteredReviews.map(r => r.user_id).filter(Boolean))];
    
    let profileMap: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await publicSupabase
        .from("profiles")
        .select("id, avatar_url")
        .in("id", userIds);
        
      if (profiles) {
        profileMap = profiles.reduce((acc, p) => {
          if (p.avatar_url) acc[p.id] = p.avatar_url;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    return filteredReviews.map(r => ({
      ...r,
      user_avatar: r.user_id ? profileMap[r.user_id] || null : null
    }));
  },
  ["public-photo-reviews"],
  { revalidate: 3600, tags: ["reviews"] }
);
