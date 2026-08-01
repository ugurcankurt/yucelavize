"use client";

import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { SlideForm } from "@/components/admin/slide-form";

export default function NewSlidePage() {
  return (
    <AdminFormLayout title="Yeni Slayt Ekle" backHref="/admin/slides">
      <SlideForm />
    </AdminFormLayout>
  );
}
