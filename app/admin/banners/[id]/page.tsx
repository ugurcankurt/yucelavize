import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { BannerForm } from "@/components/admin/banner-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: banner } = await supabase
    .from("home_banners")
    .select("*")
    .eq("id", id)
    .single();

  if (!banner) {
    notFound();
  }

  return (
    <AdminFormLayout title="Banner Düzenle" backHref="/admin/banners">
      <BannerForm initialData={banner} />
    </AdminFormLayout>
  );
}
