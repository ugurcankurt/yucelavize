"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBrand(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const image_url = formData.get("image_url") as string;
  const url = formData.get("url") as string;
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true";

  const { error } = await supabase.from("brands").insert([
    {
      name,
      image_url,
      url: url || null,
      sort_order,
      is_active,
    },
  ]);

  if (error) {
    console.error("Error creating brand:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const image_url = formData.get("image_url") as string;
  const url = formData.get("url") as string;
  const sort_order = parseInt((formData.get("sort_order") as string) || "0");
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true";

  const { error } = await supabase
    .from("brands")
    .update({
      name,
      image_url,
      url: url || null,
      sort_order,
      is_active,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating brand:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("brands").delete().eq("id", id);

  if (error) {
    console.error("Error deleting brand:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function updateBrandStatus(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("brands")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Error updating brand status:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/brands");
  return { success: true };
}
