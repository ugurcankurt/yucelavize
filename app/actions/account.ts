"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAddress(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Lütfen giriş yapın." };
  }

  const title = formData.get("title") as string;
  const fullName = formData.get("fullName") as string;
  const addressLine = formData.get("addressLine") as string;
  const city = formData.get("city") as string;
  const zipCode = formData.get("zipCode") as string;
  const phone = formData.get("phone") as string;

  if (!title || !fullName || !addressLine || !city || !phone) {
    return { error: "Lütfen tüm zorunlu alanları doldurun." };
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    title,
    full_name: fullName,
    address_line: addressLine,
    city,
    zip_code: zipCode,
    phone,
  });

  if (error) {
    return { error: "Adres eklenirken bir hata oluştu." };
  }

  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", user.id);
  
  if (error) return { error: error.message };
  
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Lütfen giriş yapın." };

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;

  if (!fullName) return { error: "Ad Soyad zorunludur." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id);

  if (error) return { error: "Profil güncellenirken hata oluştu." };
  
  await supabase.auth.updateUser({
    data: { full_name: fullName, phone, gender }
  });

  revalidatePath("/account/settings");
  revalidatePath("/account");
  
  return { success: true };
}

export async function updateAvatarUrl(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Lütfen giriş yapın." };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) return { error: "Avatar güncellenirken hata oluştu." };

  await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl }
  });

  revalidatePath("/account", "layout");
  return { success: true };
}

export async function removeAvatarUrl() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Lütfen giriş yapın." };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (error) return { error: "Avatar kaldırılırken hata oluştu." };

  await supabase.auth.updateUser({
    data: { avatar_url: null }
  });

  revalidatePath("/account", "layout");
  return { success: true };
}
