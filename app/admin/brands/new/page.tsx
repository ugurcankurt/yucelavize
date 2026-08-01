"use client";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BrandForm } from "@/components/admin/brand-form";

export default function NewBrandPage() {
  return (
    <AdminFormLayout title="Yeni Marka Ekle" backHref="/admin/brands">
      <BrandForm />
    </AdminFormLayout>
  );
}
