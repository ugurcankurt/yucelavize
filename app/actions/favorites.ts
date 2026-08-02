"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Lütfen giriş yapın." };
  }

  // Check if it already exists
  const { data: existingFav, error: checkError } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingFav) {
    // Delete
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existingFav.id);
    
    if (error) return { error: "Favorilerden çıkarılamadı." };
    
    revalidatePath("/account/favorites");
    return { isFavorite: false };
  } else {
    // Insert
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, product_id: productId });
      
    if (error) return { error: "Favorilere eklenemedi." };
    
    revalidatePath("/account/favorites");
    return { isFavorite: true };
  }
}

export async function getMyFavorites() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: favs } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", user.id);
  return favs?.map((f: any) => f.product_id) || [];
}
