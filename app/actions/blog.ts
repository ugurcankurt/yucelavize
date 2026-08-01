"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Error deleting blog post:", error);
    throw new Error("Blog yazısı silinemedi.");
  }
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const is_published = formData.get("is_published") === "true";
  const cover_image_url = formData.get("cover_image_url") as string;
  
  const { data: userData } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt,
      content,
      seo_title,
      seo_description,
      is_published,
      cover_image_url,
      author_id: userData.user?.id,
      published_at: is_published ? new Date().toISOString() : null,
    });
    
  if (error) {
    console.error("Error creating blog post:", error);
    throw new Error("Blog yazısı oluşturulamadı.");
  }
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const is_published = formData.get("is_published") === "true";
  const cover_image_url = formData.get("cover_image_url") as string;
  
  const { data: currentPost } = await supabase.from("blog_posts").select("is_published").eq("id", id).single();
  
  const published_at = (is_published && !currentPost?.is_published) 
    ? new Date().toISOString() 
    : (is_published ? undefined : null); // Keep existing if already published, null if unpublished

  const updateData: any = {
    title,
    slug,
    excerpt,
    content,
    seo_title,
    seo_description,
    is_published,
    updated_at: new Date().toISOString()
  };
  
  if (cover_image_url) {
    updateData.cover_image_url = cover_image_url;
  }
  
  if (published_at !== undefined) {
    updateData.published_at = published_at;
  }
  
  const { error } = await supabase
    .from("blog_posts")
    .update(updateData)
    .eq("id", id);
    
  if (error) {
    console.error("Error updating blog post:", error);
    throw new Error("Blog yazısı güncellenemedi.");
  }
  
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}
