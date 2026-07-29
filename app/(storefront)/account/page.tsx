import { createClient } from "@/lib/supabase/server";
import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // Caught by layout // Get user orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return (
    <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm shadow-gray-100/50 min-h-[500px]">
      {" "}
      <h2 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
        {" "}
        Sipariş Geçmişim{" "}
        <span className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
          {orders?.length || 0} Sipariş
        </span>{" "}
      </h2>{" "}
      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-border rounded-[24px]">
          {" "}
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
            {" "}
            <Package className="w-10 h-10" />{" "}
          </div>{" "}
          <h3 className="text-lg font-bold text-foreground mb-2">
            Henüz siparişiniz yok
          </h3>{" "}
          <p className="text-sm font-medium text-muted-foreground mb-6">
            Alışverişe başlayarak ilk siparişinizi oluşturun.
          </p>{" "}
          <Button
            nativeButton={false}
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
            render={<Link href="/products" />}
          >
            {" "}
            Ürünleri Keşfet{" "}
          </Button>{" "}
        </div>
      ) : (
        <div className="space-y-6">
          {" "}
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-border rounded-2xl p-6 bg-muted hover:bg-muted hover:border-border transition-colors"
            >
              {" "}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-border/60">
                {" "}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 flex-1">
                  {" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Sipariş No
                    </p>{" "}
                    <p className="font-black text-foreground text-sm">
                      #{order.id.split("-")[0]}
                    </p>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Tarih
                    </p>{" "}
                    <p className="font-semibold text-foreground text-sm">
                      {new Date(order.created_at).toLocaleDateString("tr-TR")}
                    </p>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Tutar
                    </p>{" "}
                    <p className="font-black text-foreground text-base text-primary">
                      ₺{order.total_amount.toLocaleString("tr-TR")}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <span
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center shadow-sm ${order.status === "pending" ? "bg-warning/10 text-warning border border-warning/30" : order.status === "confirmed" ? "bg-info/10 text-primary border border-info/30" : order.status === "shipped" ? "bg-primary/10 text-primary border border-primary/30" : order.status === "delivered" ? "bg-success/10 text-success border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"}`}
                  >
                    {" "}
                    {order.status === "pending"
                      ? "Ödeme Bekleniyor"
                      : order.status === "confirmed"
                        ? "Onaylandı"
                        : order.status === "shipped"
                          ? "Kargoda"
                          : order.status === "delivered"
                            ? "Teslim Edildi"
                            : "İptal"}{" "}
                  </span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {" "}
                <div className="text-sm">
                  {" "}
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Teslimat Adresi
                  </p>{" "}
                  <p className="font-medium text-muted-foreground line-clamp-1 max-w-md">
                    {order.shipping_address}
                  </p>{" "}
                </div>{" "}
                <Button
                  variant="outline"
                  className="rounded-full border-border text-muted-foreground font-semibold hover:bg-background shrink-0"
                >
                  {" "}
                  Sipariş Detayı{" "}
                </Button>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
