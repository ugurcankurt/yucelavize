import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
  return (
    <AdminFormLayout title="Yeni Koleksiyon Ekle" backHref="/admin/collections">
      <CollectionForm />
    </AdminFormLayout>
  );
}
