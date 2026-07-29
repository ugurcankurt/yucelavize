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

export default async function AdminCampaigns() {
  const supabase = await createClient();
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  async function deleteCampaign(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("campaigns").delete().eq("id", id);
    revalidatePath("/admin/campaigns");
    revalidatePath("/");
  }

  async function toggleActive(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const isActive = formData.get("is_active") === "true";
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("campaigns").update({ is_active: !isActive }).eq("id", id);
    revalidatePath("/admin/campaigns");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Kampanyalar (Sezon İndirimleri)</h2>
        <Button
          nativeButton={false}
          render={<Link href="/admin/campaigns/new" />}
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Kampanya
        </Button>
      </div>
      <div className="rounded-md border bg-white dark:bg-black overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kampanya Adı</TableHead>
              <TableHead>İndirim Miktarı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-destructive py-6"
                >
                  Tablo oluşturulmamış veya veriler yüklenirken hata oluştu. SQL migration'ı çalıştırdığınızdan emin olun.
                </TableCell>
              </TableRow>
            )}
            {!error && (!campaigns || campaigns.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz kampanya eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {campaigns?.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {campaign.discount_type === "percentage" ? `%${campaign.discount_amount}` : `₺${campaign.discount_amount}`}
                </TableCell>
                <TableCell>
                  <form action={toggleActive}>
                    <input type="hidden" name="id" value={campaign.id} />
                    <input type="hidden" name="is_active" value={campaign.is_active.toString()} />
                    <Button variant={campaign.is_active ? "default" : "outline"} size="sm" type="submit">
                      {campaign.is_active ? "Aktif" : "Pasif"}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right">
                  <form action={deleteCampaign}>
                    <input type="hidden" name="id" value={campaign.id} />
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
