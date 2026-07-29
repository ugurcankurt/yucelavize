import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminCoupons() {
  const supabase = await createClient();
  const { data: coupons, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  async function deleteCoupon(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("coupons").delete().eq("id", id);
    revalidatePath("/admin/coupons");
    revalidatePath("/");
  }

  async function toggleActive(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const isActive = formData.get("is_active") === "true";
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("coupons").update({ is_active: !isActive }).eq("id", id);
    revalidatePath("/admin/coupons");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Kuponlar</h2>
        <Button
          nativeButton={false}
          render={<Link href="/admin/coupons/new" />}
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Kupon
        </Button>
      </div>
      <div className="rounded-md border bg-white dark:bg-black overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kupon Kodu</TableHead>
              <TableHead>İndirim Miktarı</TableHead>
              <TableHead>Kullanım</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-destructive py-6"
                >
                  Tablo oluşturulmamış veya veriler yüklenirken hata oluştu. SQL migration'ı çalıştırdığınızdan emin olun.
                </TableCell>
              </TableRow>
            )}
            {!error && (!coupons || coupons.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz kupon eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {coupons?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-bold">{coupon.code}</TableCell>
                <TableCell className="text-muted-foreground">
                  {coupon.discount_type === "percentage" ? `%${coupon.discount_amount}` : `₺${coupon.discount_amount}`}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {coupon.usage_count} / {coupon.max_usages || 'Sınırsız'}
                </TableCell>
                <TableCell>
                  <form action={toggleActive}>
                    <input type="hidden" name="id" value={coupon.id} />
                    <input type="hidden" name="is_active" value={coupon.is_active.toString()} />
                    <Button variant={coupon.is_active ? "default" : "outline"} size="sm" type="submit">
                      {coupon.is_active ? "Aktif" : "Pasif"}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right">
                  <form action={deleteCoupon}>
                    <input type="hidden" name="id" value={coupon.id} />
                    <Button variant="destructive" size="sm" type="submit">
                      <Trash2 className="w-4 h-4 mr-1" /> Sil
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
