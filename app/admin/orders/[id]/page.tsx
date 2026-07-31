import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderCargoUpdate } from "@/components/admin/order-cargo-update";
import { ArrowLeft, Package, User, MapPin, Receipt, CreditCard, Truck } from "lucide-react";
import Image from "next/image";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return notFound();
  }

  // Fetch order items with products
  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      *,
      product:products (
        id,
        name,
        slug,
        images,
        sku
      )
    `)
    .eq("order_id", id);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">
          Sipariş Detayı <span className="text-muted-foreground text-lg ml-2">#{order.id.split("-")[0]}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Items */}
          <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
              <Package className="w-5 h-5 text-primary" /> Ürünler
            </div>
            
            <div className="space-y-4">
              {orderItems?.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg border bg-muted flex-shrink-0 relative overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Görsel Yok</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{item.product?.name || "Bilinmeyen Ürün"}</p>
                    {item.product?.sku && (
                      <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.product.sku}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-0.5">Miktar: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₺{item.unit_price}</p>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5">Toplam: ₺{item.unit_price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Customer & Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
               <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
                <MapPin className="w-5 h-5 text-primary" /> Teslimat Adresi
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {order.shipping_address}
              </p>
            </div>
            
            <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
               <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
                <Receipt className="w-5 h-5 text-primary" /> Fatura Adresi
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {order.billing_address || order.shipping_address}
              </p>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Status & Actions */}
          <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
            <div className="font-bold text-lg mb-4">Sipariş Durumu</div>
            <div className="mb-4">
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Tarih: {new Date(order.created_at).toLocaleString('tr-TR')}
            </p>
          </div>

          {/* Cargo Tracking */}
          <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
              <Truck className="w-5 h-5 text-primary" /> Kargo Bilgileri
            </div>
            <OrderCargoUpdate 
              orderId={order.id} 
              initialCompany={order.shipping_company}
              initialTracking={order.tracking_number}
              initialUrl={order.tracking_url}
            />
          </div>

          {/* Customer Info */}
          <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
             <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
              <User className="w-5 h-5 text-primary" /> Müşteri
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">İsim Soyisim</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">E-Posta</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Telefon</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-black border rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 font-bold text-lg border-b pb-4 mb-4">
              <CreditCard className="w-5 h-5 text-primary" /> Özet
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span className="font-medium">
                  ₺{order.total_amount + (order.discount_total || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Kargo</span>
                <span className="font-medium text-success text-xs bg-success/10 px-2 py-0.5 rounded uppercase">Ücretsiz</span>
              </div>
              {order.coupon_code && (
                 <div className="flex justify-between items-center text-success">
                  <span className="font-medium">İndirim ({order.coupon_code})</span>
                  <span className="font-bold">-₺{order.discount_total || 0}</span>
                </div>
              )}
              <div className="pt-3 mt-3 border-t flex justify-between items-center">
                <span className="font-bold">Genel Toplam</span>
                <span className="font-black text-xl text-primary">₺{order.total_amount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
