"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData, redirectTo: string = "/") {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signup(formData: FormData, redirectToUrl: string = "/account") {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: "customer"
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmations are disabled, data.session will be present
  if (data.session) {
    redirect(redirectToUrl);
  } else {
    // Otherwise, they need to confirm their email
    redirect(`/auth/login?registered=true&next=${redirectToUrl}`);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function updateAvatarUrl(avatarUrl: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "User not found" };
  }

  // 1. Eski avatarı Storage'dan sil (eğer varsa)
  const oldAvatarUrl = user.user_metadata?.avatar_url;
  if (oldAvatarUrl && oldAvatarUrl.includes('/avatars/')) {
    const oldFilePath = oldAvatarUrl.split('/avatars/')[1];
    if (oldFilePath) {
      await supabase.storage.from("avatars").remove([oldFilePath]);
    }
  }

  // 2. Yeni avatarı auth.users tablosuna kaydet
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl }
  });
  
  if (error) {
    return { error: error.message };
  }

  // 3. profiles tablosunu güncelle (senkronizasyon için)
  await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);

  revalidatePath("/", "layout");
  return { success: true };
}

export async function removeAvatarUrl() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "User not found" };
  }

  // 1. Storage üzerinden sil
  const avatarUrl = user.user_metadata?.avatar_url;
  if (avatarUrl && avatarUrl.includes('/avatars/')) {
    const filePath = avatarUrl.split('/avatars/')[1];
    if (filePath) {
      await supabase.storage.from("avatars").remove([filePath]);
    }
  }

  // 2. auth.users tablosunu güncelle
  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: null }
  });
  
  if (error) {
    return { error: error.message };
  }

  // 3. profiles tablosunu güncelle (senkronizasyon için)
  await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Oturumunuzun süresi dolmuş olabilir. Lütfen tekrar giriş yapın." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function sendPasswordResetEmail(formData: FormData, origin: string) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
