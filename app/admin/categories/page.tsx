import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminCategories() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, created_at")
    .order("created_at", { ascending: false });

  async function deleteCategory(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("categories").delete().eq("id", id);
    revalidatePath("/admin/categories");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Kategoriler</h2>
        <Button
          nativeButton={false}
          render={<Link href="/admin/categories/new" />}
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Kategori Ekle
        </Button>
      </div>
      <div className="rounded-md border bg-white dark:bg-black overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori Adı</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Görsel</TableHead>
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
                  Veriler yüklenirken hata oluştu.
                </TableCell>
              </TableRow>
            )}
            {!error && (!categories || categories.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz kategori eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell>
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Görsel yok
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <Link href={`/admin/categories/${category.id}`} />
                      }
                    >
                      <Edit className="w-4 h-4 mr-1" /> Düzenle
                    </Button>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash2 className="w-4 h-4 mr-1" /> Sil
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
