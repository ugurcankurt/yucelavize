import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches the favorite product IDs for a given user.
 * 
 * @param supabase The authenticated Supabase client
 * @param userId The ID of the user
 * @returns Array of product IDs that the user has favorited
 */
export async function getUserFavorites(supabase: SupabaseClient, userId: string | undefined): Promise<string[]> {
  if (!userId) return [];
  
  try {
    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", userId);
      
    if (favs) {
      return favs.map((f: any) => f.product_id);
    }
  } catch (error) {
    console.error("Error fetching user favorites:", error);
  }
  
  return [];
}
