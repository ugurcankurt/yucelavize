"use client";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BannerForm } from "@/components/admin/banner-form";

export default function NewBannerPage() {
  return (
    <AdminFormLayout title="Yeni Banner Ekle" backHref="/admin/banners">
      <BannerForm />
    </AdminFormLayout>
  );
}
