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
import { Edit, Trash2, Search, PackageOpen, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
      <AdminPageHeader 
        title="Ürün Yönetimi" 
        action={{ href: "/admin/products/new", label: "Yeni Ürün Ekle" }} 
      >
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
        </div>
      </AdminPageHeader>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50 dark:bg-foreground/50">
            <TableRow>
              <TableHead className="w-[80px]">Görsel</TableHead>
              <TableHead>Ürün Adı & Varyasyonlar</TableHead>
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
              const variations = product.features?.variations || product.features?.colors || [];
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
                    {variations.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {variations.map((v: string) => (
                          <span
                            key={v}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-foreground/90 text-muted-foreground dark:text-muted-foreground border border-border dark:border-border"
                          >
                            {v}
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
                    <Badge 
                      variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                      className={product.stock > 10 ? "bg-green-500 hover:bg-green-600" : product.stock > 0 ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                    >
                      {product.stock} adet
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`/admin/products/${product.id}`} className="cursor-pointer flex items-center" />}>
                        <Edit className="w-4 h-4 mr-2" /> Düzenle
                      </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button type="submit" className="w-full">
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" /> Sil
                            </DropdownMenuItem>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        </CardContent>
      </Card>
    </div>
  );
}
