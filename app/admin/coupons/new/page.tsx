import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminFormLayout } from "@/components/admin/admin-form-layout";
import { Button } from "@/components/ui/button";

export default function NewCouponPage() {
  async function createCoupon(formData: FormData) {
    "use server";
    const code = (formData.get("code") as string).toUpperCase();
    const discount_type = formData.get("discount_type") as string;
    const discount_amount = parseFloat(formData.get("discount_amount") as string);
    const min_order_amount = parseFloat(formData.get("min_order_amount") as string) || 0;
    const max_usages_str = formData.get("max_usages") as string;
    const max_usages = max_usages_str ? parseInt(max_usages_str, 10) : null;
    const expires_at = formData.get("expires_at") as string;

    const supabase = await createClient();
    
    await supabase.from("coupons").insert({
      code,
      discount_type,
      discount_amount,
      min_order_amount,
      max_usages,
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      is_active: true
    });

    redirect("/admin/coupons");
  }

  return (
    <AdminFormLayout title="Yeni Kupon" backHref="/admin/coupons">
      <form action={createCoupon} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Kupon Kodu</Label>
          <Input id="code" name="code" required placeholder="Örn: YAZ10" className="uppercase" />
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
            <Input id="discount_amount" name="discount_amount" type="number" step="0.01" required placeholder="10" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_order_amount">Minimum Sipariş Tutarı (₺)</Label>
            <Input id="min_order_amount" name="min_order_amount" type="number" step="0.01" defaultValue="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_usages">Maksimum Kullanım Sınırı (Kişi)</Label>
            <Input id="max_usages" name="max_usages" type="number" placeholder="Sınırsız için boş bırakın" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expires_at">Son Kullanma Tarihi (Opsiyonel)</Label>
          <Input id="expires_at" name="expires_at" type="datetime-local" />
        </div>

        <Button type="submit" className="w-full">
          Kupon Oluştur
        </Button>
      </form>
    </AdminFormLayout>
  );
}
