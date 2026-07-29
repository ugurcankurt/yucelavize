import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export default async function AdminSlidesPage() {
  const supabase = await createClient();
  const { data: slides, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  async function toggleStatus(id: string, currentStatus: boolean) {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer
      .from("hero_slides")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    revalidatePath("/admin/slides");
    revalidatePath("/");
  }

  async function deleteSlide(id: string) {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.from("hero_slides").delete().eq("id", id);
    revalidatePath("/admin/slides");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Slider Yönetimi</h2>
        <Link href="/admin/slides/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Slayt Ekle
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white dark:bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Sıra</TableHead>
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
            {!error && (!slides || slides.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Henüz slayt eklenmemiş.
                </TableCell>
              </TableRow>
            )}
            {slides?.map((slide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-muted">
                    <Image 
                      src={slide.image_url} 
                      alt={slide.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{slide.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{slide.subtitle}</div>
                </TableCell>
                <TableCell>{slide.sort_order}</TableCell>
                <TableCell>
                  <form action={toggleStatus.bind(null, slide.id, slide.is_active)}>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className={`h-8 px-2 text-xs font-medium ${
                        slide.is_active
                          ? "bg-success/10 text-success border-success/20 hover:bg-success/20 hover:text-success"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                      }`}
                    >
                      {slide.is_active ? "Aktif" : "Pasif"}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/slides/${slide.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <form action={deleteSlide.bind(null, slide.id)}>
                      <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
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
