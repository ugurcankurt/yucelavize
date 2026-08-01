"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBanner(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const pre_title = formData.get("pre_title") as string;
  const subtitle = formData.get("subtitle") as string;
  const button_text = formData.get("button_text") as string;
  const link_url = formData.get("link_url") as string;
  const image_url = formData.get("image_url") as string;
  const is_large = formData.get("is_large") === "on" || formData.get("is_large") === "true";
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true";

  const { error } = await supabase.from("home_banners").insert([
    {
      title,
      pre_title: pre_title || null,
      subtitle: subtitle || null,
      button_text: button_text || null,
      link_url: link_url || null,
      image_url,
      is_large,
      sort_order,
      is_active,
    },
  ]);

  if (error) {
    console.error("Error creating banner:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { success: true };
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const pre_title = formData.get("pre_title") as string;
  const subtitle = formData.get("subtitle") as string;
  const button_text = formData.get("button_text") as string;
  const link_url = formData.get("link_url") as string;
  const image_url = formData.get("image_url") as string;
  const is_large = formData.get("is_large") === "on" || formData.get("is_large") === "true";
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true";

  const { error } = await supabase
    .from("home_banners")
    .update({
      title,
      pre_title: pre_title || null,
      subtitle: subtitle || null,
      button_text: button_text || null,
      link_url: link_url || null,
      image_url,
      is_large,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating banner:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("home_banners").delete().eq("id", id);

  if (error) {
    console.error("Error deleting banner:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { success: true };
}

export async function updateBannerStatus(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("home_banners")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Error updating banner status:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { success: true };
}
