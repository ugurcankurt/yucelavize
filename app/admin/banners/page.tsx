import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreHorizontal, Power } from "lucide-react";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners, error } = await supabase
    .from("home_banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  async function toggleStatus(id: string, currentStatus: boolean) {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer
      .from("home_banners")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    revalidatePath("/admin/banners");
    revalidatePath("/");
  }

  async function deleteBanner(id: string) {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.from("home_banners").delete().eq("id", id);
    revalidatePath("/admin/banners");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Banner Yönetimi" 
        action={{ href: "/admin/banners/new", label: "Yeni Banner Ekle" }} 
      />

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Tipi</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-destructive py-6"
                >
                  Veriler yüklenirken hata oluştu.
                </TableCell>
              </TableRow>
            )}
            {!error && (!banners || banners.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz banner eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {banners?.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-muted">
                    <Image 
                      src={banner.image_url} 
                      alt={banner.title} 
                      fill 
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium" dangerouslySetInnerHTML={{ __html: banner.title }} />
                  {banner.pre_title && <div className="text-xs text-muted-foreground line-clamp-1">{banner.pre_title}</div>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{banner.is_large ? "Büyük (Sol)" : "Küçük (Sağ)"}</Badge>
                </TableCell>
                <TableCell>{banner.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={banner.is_active ? "default" : "secondary"}>
                    {banner.is_active ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/banners/${banner.id}`} className="cursor-pointer flex items-center" />}>
                        <Edit className="w-4 h-4 mr-2" /> Düzenle
                      </DropdownMenuItem>
                      <form action={toggleStatus.bind(null, banner.id, banner.is_active)}>
                        <button type="submit" className="w-full">
                          <DropdownMenuItem className="cursor-pointer flex items-center">
                            <Power className="w-4 h-4 mr-2" /> Durumu Değiştir
                          </DropdownMenuItem>
                        </button>
                      </form>
                      <DropdownMenuSeparator />
                      <form action={deleteBanner.bind(null, banner.id)}>
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
