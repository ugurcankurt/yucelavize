"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string, images: string[] = []) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Yorum yapmak için giriş yapmalısınız." };
  }

  // Check if the user actually bought the product and it was delivered
  const { data: hasBought, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      order_items!inner (
        product_id
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "delivered")
    .eq("order_items.product_id", productId)
    .limit(1);

  if (orderError) {
    console.error("Error checking order history:", orderError);
    return { error: "Sipariş geçmişi kontrol edilemedi." };
  }

  if (!hasBought || hasBought.length === 0) {
    return { error: "Sadece ürünü satın alan ve siparişi teslim edilen müşteriler yorum yapabilir." };
  }

  // Get user_metadata full_name
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Müşteri";

  // Insert the review
  const { error: insertError } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user.id,
      user_name: userName,
      rating,
      comment,
      status: "approved",
      images: images || []
    });

  if (insertError) {
    if (insertError.code === '23505') { // Unique constraint violation
      return { error: "Bu ürüne zaten yorum yaptınız." };
    }
    console.error("Error adding review:", insertError);
    return { error: "Yorum eklenirken bir hata oluştu." };
  }

  revalidatePath(`/products`);
  
  return { success: true };
}
