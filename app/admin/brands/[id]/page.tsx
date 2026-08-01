import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BrandForm } from "@/components/admin/brand-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditBrandPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: brand, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !brand) {
    notFound();
  }

  return (
    <AdminFormLayout title="Marka Düzenle" backHref="/admin/brands">
      <BrandForm initialData={brand} />
    </AdminFormLayout>
  );
}
