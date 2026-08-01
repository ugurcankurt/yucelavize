import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts from Supabase
  const [{ count: productsCount }, { count: ordersCount }, { count: customersCount }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount")
  ]);

  // Calculate total revenue (assuming orders table has total_amount)
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Özet</h2>
        <p className="text-muted-foreground mt-2">
          Mağazanızın genel durumunu buradan takip edebilirsiniz.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all duration-200 border-border/60 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">₺{totalRevenue.toLocaleString("tr-TR")}</div>
            <p className="text-xs text-muted-foreground mt-1">Tüm zamanlar</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/60 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Siparişler
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">{ordersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Tüm zamanlar</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/60 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-info" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Sistemdeki aktif ürünler</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-200 border-border/60 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Kayıtlı Müşteri
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mt-2">{customersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Kayıtlı profiller</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
