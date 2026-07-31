import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle2, Clock, XCircle, CreditCard, Box, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // 1. Fetch Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  // If order not found or doesn't belong to the user
  if (orderError || !order || order.user_id !== user.id) {
    notFound();
  }

  // 2. Fetch Order Items & Products
  const { data: orderItems } = await supabase
    .from("order_items")
    .select(`
      *,
      products (
        id,
        name,
        images,
        price,
        slug,
        sku
      )
    `)
    .eq("order_id", order.id);

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'pending':
        return { label: 'Ödeme Bekleniyor', variant: 'warning' as const, icon: Clock };
      case 'confirmed':
        return { label: 'Onaylandı', variant: 'info' as const, icon: CheckCircle2 };
      case 'shipped':
        return { label: 'Kargoda', variant: 'default' as const, icon: Truck };
      case 'delivered':
        return { label: 'Teslim Edildi', variant: 'success' as const, icon: Package };
      case 'cancelled':
        return { label: 'İptal Edildi', variant: 'destructive' as const, icon: XCircle };
      default:
        return { label: 'İşleniyor', variant: 'secondary' as const, icon: Clock };
    }
  };

  const statusInfo = getStatusDisplay(order.status);
  const StatusIcon = statusInfo.icon;
  const shortOrderId = order.id.split("-")[0].toUpperCase();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <Link href="/account" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Siparişlerime Dön
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Sipariş <span className="text-muted-foreground font-medium text-2xl">#{shortOrderId}</span>
            </h1>
            <Badge variant={statusInfo.variant as any} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
              <StatusIcon className="w-3.5 h-3.5" />
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Sipariş Tarihi: <span className="font-bold text-foreground">{new Date(order.created_at).toLocaleDateString("tr-TR")}</span>
          </p>
        </div>
        
        <div className="flex w-full sm:w-auto gap-3">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold h-11">
            <FileText className="w-4 h-4 mr-2" /> Fatura İndir
          </Button>
          <Button className="flex-1 sm:flex-none rounded-xl font-bold h-11 shadow-lg shadow-primary/20">
            Desteğe Bağlan
          </Button>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* 2. Main Layout (Addresses + Items / Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Column: Items and Addresses */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Adres Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card/50">
              <CardHeader className="pb-3 border-b border-border/40 bg-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Teslimat Adresi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {order.shipping_address}
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden bg-card/50">
              <CardHeader className="pb-3 border-b border-border/40 bg-muted/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" /> Fatura Adresi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {order.billing_address || order.shipping_address}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sipariş Edilen Ürünler */}
          <Card className="rounded-3xl border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Sipariş Edilen Ürünler
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((item: any) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 items-start sm:items-center hover:bg-muted/10 transition-colors">
                      {/* Ürün Görseli */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0">
                        <Image
                          src={item.products?.images?.[0] || "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=200&auto=format&fit=crop"}
                          alt={item.products?.name || "Ürün Görseli"}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Ürün Bilgileri */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <Link href={item.products?.slug ? `/products/${item.products.slug}` : "#"} className="group">
                          <h4 className="font-bold text-base sm:text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {item.products?.name || "Bilinmeyen Ürün"}
                          </h4>
                        </Link>
                        {item.products?.sku && (
                          <p className="text-xs text-muted-foreground font-medium">SKU: {item.products.sku}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <div className="bg-muted px-2.5 py-1 rounded-md text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            Adet: <span className="text-foreground">{item.quantity}</span>
                          </div>
                          <div className="bg-muted px-2.5 py-1 rounded-md text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            Fiyat: <span className="text-foreground">₺{item.unit_price.toLocaleString("tr-TR")}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Ürün Toplam Tutar */}
                      <div className="sm:text-right shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/40 w-full sm:w-auto flex sm:block justify-between items-center">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Toplam</p>
                        <p className="text-lg font-black text-foreground">₺{(item.quantity * item.unit_price).toLocaleString("tr-TR")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-muted-foreground font-medium bg-muted/10">
                    Bu siparişte ürün bulunamadı.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <Card className="rounded-3xl border-border/60 shadow-lg shadow-black/5 overflow-hidden">
              <CardHeader className="pb-4 border-b border-dashed border-border/80 bg-muted/10">
                <CardTitle className="text-xl font-black">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Sipariş Tarihi</span>
                    <span className="text-foreground">{new Date(order.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Ara Toplam</span>
                    <span className="text-foreground">₺{order.total_amount.toLocaleString("tr-TR")}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Kargo Ücreti</span>
                    <span className="text-primary font-bold">Ücretsiz</span>
                  </div>
                  
                  {order.coupon_code && (
                    <div className="flex justify-between items-center text-success">
                      <span>İndirim ({order.coupon_code})</span>
                      <span className="font-bold">-₺{order.discount_total || 0}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-muted-foreground">Genel Toplam</span>
                      <span className="text-3xl font-black text-primary">₺{order.total_amount.toLocaleString("tr-TR")}</span>
                    </div>
                    <p className="text-[11px] text-right text-muted-foreground font-semibold">Tüm vergiler dahildir.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Card */}
            {(order.tracking_number || order.shipping_company) && (
              <Card className="rounded-2xl border-primary/20 bg-primary/5 overflow-hidden shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm uppercase tracking-wider">Kargo Takip</h4>
                      {order.shipping_company && (
                        <p className="text-xs font-semibold text-primary/70">{order.shipping_company}</p>
                      )}
                    </div>
                  </div>
                  {order.tracking_number && (
                    <div className="bg-background rounded-xl p-3 border border-primary/20 flex items-center justify-between mb-4 shadow-sm">
                      <span className="font-black text-foreground tracking-wider">{order.tracking_number}</span>
                    </div>
                  )}
                  {order.tracking_url && (
                    <Button 
                      nativeButton={false}
                      render={<a href={order.tracking_url} target="_blank" rel="noopener noreferrer" />} 
                      className="w-full font-bold h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                    >
                      Kargom Nerede?
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
        
      </div>
      
    </div>
  );
}
