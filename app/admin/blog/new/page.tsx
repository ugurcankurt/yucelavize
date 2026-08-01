"use client";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <AdminFormLayout title="Yeni Blog Yazısı" backHref="/admin/blog" maxWidth="max-w-7xl" noWrapper>
      <BlogForm />
    </AdminFormLayout>
  );
}
