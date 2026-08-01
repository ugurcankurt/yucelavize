import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Power, Trash2 } from "lucide-react";

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
      <AdminPageHeader 
        title="Kuponlar" 
        action={{ href: "/admin/coupons/new", label: "Yeni Kupon" }} 
      />
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
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
                  <Badge variant={coupon.is_active ? "success" : "secondary"}>
                    {coupon.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={coupon.id} />
                        <input type="hidden" name="is_active" value={coupon.is_active.toString()} />
                        <button type="submit" className="w-full">
                          <DropdownMenuItem className="cursor-pointer flex items-center">
                            <Power className="w-4 h-4 mr-2" /> Durumu Değiştir
                          </DropdownMenuItem>
                        </button>
                      </form>
                      <DropdownMenuSeparator />
                      <form action={deleteCoupon}>
                        <input type="hidden" name="id" value={coupon.id} />
                        <button type="submit" className="w-full">
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" /> Sil
                          </DropdownMenuItem>
                        </button>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}
