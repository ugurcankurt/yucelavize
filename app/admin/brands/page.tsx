import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteBrand } from "@/app/actions/brands";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: brands, error } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching brands:", error);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Markalar" action={{ href: "/admin/brands/new", label: "Yeni Marka Ekle" }}>
        <p className="text-sm text-muted-foreground mr-4">Ortak markalarınızı buradan yönetebilirsiniz.</p>
      </AdminPageHeader>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4 font-medium">Görsel</th>
                <th className="px-6 py-4 font-medium">Marka Adı</th>
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium">Sıra</th>
                <th className="px-6 py-4 font-medium">Durum</th>
                <th className="px-6 py-4 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Henüz marka eklenmemiş.
                  </td>
                </tr>
              )}
              {brands?.map((brand) => (
                <tr key={brand.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-8 bg-muted rounded overflow-hidden">
                      {brand.image_url ? (
                        <Image
                          src={brand.image_url}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Görsel Yok
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{brand.name}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate">
                    {brand.url ? (
                      <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {brand.url}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">{brand.sort_order}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        brand.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {brand.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/brands/${brand.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteBrand(brand.id);
                      }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          type="submit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
