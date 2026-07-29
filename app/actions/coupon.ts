"use server";

import { createClient } from "@/lib/supabase/server";

export async function validateCoupon(code: string, cartTotal: number) {
  const supabase = await createClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    return { error: "Geçersiz veya süresi dolmuş kupon kodu." };
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { error: "Bu kuponun süresi dolmuş." };
  }

  // Check usage limits
  if (coupon.max_usages && coupon.usage_count >= coupon.max_usages) {
    return { error: "Bu kuponun kullanım limiti dolmuş." };
  }

  // Check min order amount
  if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
    return { error: `Bu kuponu kullanmak için minimum sepet tutarı ₺${coupon.min_order_amount} olmalıdır.` };
  }

  return { coupon };
}
