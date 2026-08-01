import { createClient } from "@/lib/supabase/server";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BlogForm } from "@/components/admin/blog-form";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <AdminFormLayout title="Blog Yazısını Düzenle" backHref="/admin/blog" maxWidth="max-w-7xl" noWrapper>
      <BlogForm initialData={post} />
    </AdminFormLayout>
  );
}
