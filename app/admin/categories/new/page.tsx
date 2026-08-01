import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <AdminFormLayout title="Yeni Kategori Ekle" backHref="/admin/categories">
      <CategoryForm />
    </AdminFormLayout>
  );
}
