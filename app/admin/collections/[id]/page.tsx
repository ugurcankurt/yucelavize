import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { CollectionForm } from "@/components/admin/collection-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (!collection) {
    notFound();
  }

  return (
    <AdminFormLayout title="Koleksiyon Düzenle" backHref="/admin/collections">
      <CollectionForm initialData={collection} />
    </AdminFormLayout>
  );
}
