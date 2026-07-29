"use client";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { validateCoupon } from "@/app/actions/coupon";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  
  // Prevent hydration errors with Zustand persist
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="w-full bg-background font-sans min-h-screen">
      {/* Page Header */}
      <div className="bg-muted w-full py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Alışveriş Sepeti
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            Sepetinizdeki ürünleri inceleyip güvenle siparişinizi
            tamamlayabilirsiniz.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {cart.items.length === 0 ? (
          <div className="text-center py-32 bg-muted rounded-[32px] border border-border flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sepetiniz boş
            </h2>
            <p className="text-muted-foreground font-medium mb-8">
              Henüz sepetinize hiç ürün eklemediniz.
            </p>
            <Button
              nativeButton={false}
              size="lg"
              className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              render={<Link href="/products" />}
            >
              Alışverişe Başla
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.color || idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.color && (
                      <p className="text-sm font-medium text-muted-foreground mt-0.5">
                        Renk: 
                        <span className="text-muted-foreground">{item.color}</span>
                      </p>
                    )}
                    <p className="text-xl font-black text-foreground mt-2">
                      ₺{item.product.price.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start mt-4 sm:mt-0">
                    <div className="flex items-center border border-border rounded-full overflow-hidden bg-muted h-10">
                      <button
                        onClick={() =>
                          cart.updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.color,
                          )
                        }
                        className="px-3 h-full hover:bg-secondary text-muted-foreground transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          cart.updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.color,
                          )
                        }
                        className="px-3 h-full hover:bg-secondary text-muted-foreground transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        cart.removeItem(item.product.id, item.color)
                      }
                      className="w-10 h-10 flex items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                      title="Sepetten Çıkar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="border border-border rounded-3xl p-8 bg-muted shadow-sm sticky top-28">
                <h3 className="text-xl font-black text-foreground mb-6">
                  Sipariş Özeti
                </h3>
                
                {/* Coupon Section */}
                <div className="mb-6 pb-6 border-b border-border">
                  {!cart.appliedCoupon ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Kupon Kodu" 
                          className="pl-9 h-11 bg-background uppercase" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        />
                      </div>
                      <Button 
                        variant="secondary" 
                        className="h-11 px-6 font-bold"
                        disabled={!couponCode || isApplying}
                        onClick={async () => {
                          setIsApplying(true);
                          const result = await validateCoupon(couponCode, cart.getTotal());
                          setIsApplying(false);
                          
                          if (result.error) {
                            alert(result.error);
                          } else if (result.coupon) {
                            cart.applyCoupon(result.coupon);
                            setCouponCode("");
                            alert("Kupon başarıyla uygulandı!");
                          }
                        }}
                      >
                        {isApplying ? "..." : "Uygula"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-xl">
                      <div className="flex items-center gap-2 text-success font-semibold">
                        <Tag className="w-4 h-4" />
                        <span>{cart.appliedCoupon.code} Uygulandı</span>
                      </div>
                      <button 
                        onClick={() => cart.removeCoupon()}
                        className="p-1 hover:bg-success/20 rounded-md text-success transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-medium">Ara Toplam</span>
                    <span className="font-semibold text-foreground">
                      ₺{cart.getTotal().toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span className="font-medium">Kargo Tutarı</span>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-xs uppercase tracking-wide">
                      Ücretsiz
                    </span>
                  </div>
                  
                  {cart.appliedCoupon && (
                    <div className="flex justify-between items-center text-success">
                      <span className="font-medium">İndirim ({cart.appliedCoupon.code})</span>
                      <span className="font-semibold">
                        -₺{cart.getDiscountAmount().toLocaleString("tr-TR")}
                      </span>
                    </div>
                  )}

                  <div className="pt-6 mt-4 border-t border-border flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">
                      Toplam
                    </span>
                    <span className="text-3xl font-black text-foreground">
                      ₺{cart.getFinalTotal().toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>

                <Button
                  nativeButton={false}
                  size="lg"
                  className="w-full text-base h-14 rounded-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
                  render={<Link href="/checkout" />}
                >
                  Alışverişi Tamamla
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="mt-6 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  256-bit SSL ile güvenli ödeme
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
