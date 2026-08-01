import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Power } from "lucide-react";

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
      <AdminPageHeader 
        title="Kampanyalar (Sezon İndirimleri)" 
        action={{ href: "/admin/campaigns/new", label: "Yeni Kampanya" }} 
      />
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
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
                  <Badge variant={campaign.is_active ? "success" : "secondary"}>
                    {campaign.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={campaign.id} />
                        <input type="hidden" name="is_active" value={campaign.is_active.toString()} />
                        <button type="submit" className="w-full">
                          <DropdownMenuItem className="cursor-pointer flex items-center">
                            <Power className="w-4 h-4 mr-2" /> Durumu Değiştir
                          </DropdownMenuItem>
                        </button>
                      </form>
                      <DropdownMenuSeparator />
                      <form action={deleteCampaign}>
                        <input type="hidden" name="id" value={campaign.id} />
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
