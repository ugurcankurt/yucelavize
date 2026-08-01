"use client";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <AdminFormLayout title="Yeni Ürün Ekle" backHref="/admin/products" maxWidth="max-w-4xl">
      <ProductForm />
    </AdminFormLayout>
  );
}
