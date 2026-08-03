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
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default async function AdminCollections() {
  const supabase = await createClient();
  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, name, slug, image_url, is_active, created_at")
    .order("created_at", { ascending: false });

  async function deleteCollection(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("collections").delete().eq("id", id);
    revalidatePath("/admin/collections");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Koleksiyonlar" 
        action={{ href: "/admin/collections/new", label: "Yeni Koleksiyon Ekle" }} 
      />
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Koleksiyon Adı</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Görsel</TableHead>
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
                  Veriler yüklenirken hata oluştu.
                </TableCell>
              </TableRow>
            )}
            {!error && (!collections || collections.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz koleksiyon eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {collections?.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell className="font-medium">{collection.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {collection.slug}
                </TableCell>
                <TableCell>
                  {collection.image_url ? (
                    <img
                      src={collection.image_url}
                      alt={collection.name}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Görsel yok
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {collection.is_active ? (
                    <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">Aktif</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">Pasif</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/collections/${collection.id}`} className="cursor-pointer flex items-center" />}>
                        <Edit className="w-4 h-4 mr-2" /> Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <form action={deleteCollection}>
                        <input type="hidden" name="id" value={collection.id} />
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
