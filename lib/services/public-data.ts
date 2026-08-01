import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

// We use the regular supabase-js client here because we don't want to rely on cookies
// for public data. This allows Next.js to cache these requests globally.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const publicSupabase = createClient(supabaseUrl, supabaseKey);

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
