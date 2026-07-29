import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Search, PackageOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const supabase = await createClient();

  let productsQuery = supabase
    .from("products")
    .select("id, name, sku, price, stock, images, features")
    .order("created_at", { ascending: false });

  if (query) {
    productsQuery = productsQuery.ilike("name", `%${query}%`);
  }

  const { data: products, error } = await productsQuery;

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    const supabase = await createClient();
    await supabase.from("products").delete().eq("id", id);
    revalidatePath("/admin/products");
    revalidatePath("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-zinc-100">
          Ürün Yönetimi
        </h2>

        <div className="flex w-full sm:w-auto items-center gap-3">
          <form className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="Ürün adı ara..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-foreground border border-border dark:border-border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </form>

          <Button
            nativeButton={false}
            render={<Link href="/admin/products/new" />}
            className="whitespace-nowrap shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border dark:border-border bg-white dark:bg-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 dark:bg-foreground/50">
            <TableRow>
              <TableHead className="w-[80px]">Görsel</TableHead>
              <TableHead>Ürün Adı & Renkler</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-destructive font-medium"
                >
                  Veriler yüklenirken hata oluştu.
                </TableCell>
              </TableRow>
            )}

            {!error && (!products || products.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center">
                    <PackageOpen className="w-12 h-12 text-muted-foreground/70 dark:text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground dark:text-zinc-100">
                      Kayıtlı ürün bulunamadı
                    </p>
                    <p className="text-sm mt-1">
                      {query
                        ? "Arama kriterlerinize uyan ürün yok."
                        : "Sisteme henüz hiç ürün eklenmemiş."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {products?.map((product) => {
              const colors = product.features?.colors || [];
              const mainImage = product.images?.[0] || "/placeholder.jpg"; // Varsayılan görsel eklenebilir

              return (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/50 dark:hover:bg-foreground/50 transition-colors"
                >
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-border dark:border-border">
                      {product.images?.[0] ? (
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted dark:bg-foreground/90 flex items-center justify-center">
                          <PackageOpen className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground dark:text-zinc-100">
                      {product.name}
                    </div>
                    {colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {colors.map((c: string) => (
                          <span
                            key={c}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-foreground/90 text-muted-foreground dark:text-muted-foreground border border-border dark:border-border"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₺{product.price.toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 10 ? "bg-success/20 text-success dark:bg-success/20 dark:text-success" : product.stock > 0 ? "bg-warning/20 text-warning dark:bg-warning/20 dark:text-warning" : "bg-destructive/20 text-destructive dark:bg-destructive/20 dark:text-destructive"}`}
                    >
                      {product.stock} adet
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/products/${product.id}`} />}
                        className="h-8 shadow-sm"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Düzenle
                      </Button>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <Button
                          variant="destructive"
                          size="sm"
                          type="submit"
                          className="h-8 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Sil
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
