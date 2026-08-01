import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !category) {
    notFound();
  }

  return (
    <AdminFormLayout title={`Kategori Düzenle: ${category.name}`} backHref="/admin/categories">
      <CategoryForm initialData={category} />
    </AdminFormLayout>
  );
}
