import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { Button } from "@/components/ui/button";

export default function NewCampaignPage() {
  async function createCampaign(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const discount_type = formData.get("discount_type") as string;
    const discount_amount = parseFloat(formData.get("discount_amount") as string);
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;

    const supabase = await createClient();
    
    await supabase.from("campaigns").insert({
      name,
      discount_type,
      discount_amount,
      start_date: start_date ? new Date(start_date).toISOString() : null,
      end_date: end_date ? new Date(end_date).toISOString() : null,
      is_active: true
    });

    redirect("/admin/campaigns");
  }

  return (
    <AdminFormLayout title="Yeni Kampanya" backHref="/admin/campaigns">
      <form action={createCampaign} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Kampanya Adı</Label>
          <Input id="name" name="name" required placeholder="Örn: Yaz İndirimi" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount_type">İndirim Tipi</Label>
            <select
              id="discount_type"
              name="discount_type"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="percentage">Yüzde (%)</option>
              <option value="fixed">Sabit Tutar (₺)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_amount">İndirim Miktarı</Label>
            <Input id="discount_amount" name="discount_amount" type="number" step="0.01" required placeholder="20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Başlangıç Tarihi (Opsiyonel)</Label>
            <Input id="start_date" name="start_date" type="datetime-local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Bitiş Tarihi (Opsiyonel)</Label>
            <Input id="end_date" name="end_date" type="datetime-local" />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Kampanya Oluştur
        </Button>
      </form>
    </AdminFormLayout>
  );
}
