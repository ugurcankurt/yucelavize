import { createClient } from "@/lib/supabase/server";
import { Package, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderReviewDialog } from "@/components/storefront/order-review-dialog";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // Caught by layout

  // Get user orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get user reviews to hide already reviewed products
  const { data: userReviews } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("user_id", user.id);
  const reviewedProductIds = userReviews?.map((r) => r.product_id) || [];

  return (
    <div className="bg-background border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
          Sipariş Geçmişim
          <Badge variant="secondary" className="px-3 py-1 text-sm font-bold shadow-sm rounded-full">
            {orders?.length || 0} Sipariş
          </Badge>
        </h2>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="border-2 border-dashed border-border shadow-none bg-muted/10 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
              <Package className="w-12 h-12" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3">
              Henüz siparişiniz yok
            </h3>
            <p className="text-base font-medium text-muted-foreground mb-8 max-w-md mx-auto">
              Sipariş geçmişiniz şu anda boş görünüyor. Yeni ürünler keşfetmeye hemen başlayın!
            </p>
            <Button
              nativeButton={false}
              className="rounded-xl px-10 h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
              render={<Link href="/products" />}
            >
              <Search className="w-5 h-5 mr-2" /> Ürünleri Keşfet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => {
            const getStatusVariant = (status: string) => {
              switch (status) {
                case "pending": return "warning";
                case "confirmed": return "info";
                case "shipped": return "default";
                case "delivered": return "success";
                case "cancelled": return "destructive";
                default: return "secondary";
              }
            };
            
            const getStatusLabel = (status: string) => {
              switch (status) {
                case "pending": return "Ödeme Bekleniyor";
                case "confirmed": return "Onaylandı";
                case "shipped": return "Kargoda";
                case "delivered": return "Teslim Edildi";
                case "cancelled": return "İptal";
                default: return "İşleniyor";
              }
            };

            return (
              <Card 
                key={order.id}
                className="group border-border/60 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 bg-card/50"
              >
                <div className="flex flex-col md:flex-row justify-between p-6 sm:p-8 gap-6 border-b border-border/40 bg-muted/20">
                  <div className="flex flex-wrap sm:flex-nowrap gap-6 sm:gap-12 flex-1">
                    <div className="min-w-[120px]">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" /> Sipariş No
                      </p>
                      <p className="font-black text-foreground text-base">
                        #{order.id.split("-")[0].toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="min-w-[120px]">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Tarih
                      </p>
                      <p className="font-bold text-foreground text-base">
                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    
                    <div className="min-w-[120px]">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Tutar
                      </p>
                      <div className="flex flex-col">
                        <p className="font-black text-primary text-lg leading-none">
                          ₺{order.total_amount.toLocaleString("tr-TR")}
                        </p>
                        {order.coupon_code && order.discount_total > 0 && (
                          <p className="text-xs font-bold text-success mt-1.5">
                            İndirim ({order.coupon_code}): -₺{order.discount_total.toLocaleString("tr-TR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-start justify-start md:justify-end">
                    <Badge variant={getStatusVariant(order.status) as any} className="px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-card">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Teslimat Adresi
                    </p>
                    <p className="font-medium text-foreground text-sm leading-relaxed max-w-2xl line-clamp-1">
                      {order.shipping_address}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                    <Button
                      variant="outline"
                      nativeButton={false}
                      className="rounded-xl border-border/80 h-11 px-6 font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shrink-0 w-full sm:w-auto"
                      render={<Link href={`/account/orders/${order.id}`} />}
                    >
                      Detayları Görüntüle
                    </Button>
                    
                    {order.status === "delivered" && order.order_items.filter((item: any) => !reviewedProductIds.includes(item.product_id)).length > 0 && (
                      <OrderReviewDialog orderItems={order.order_items.filter((item: any) => !reviewedProductIds.includes(item.product_id))} />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
