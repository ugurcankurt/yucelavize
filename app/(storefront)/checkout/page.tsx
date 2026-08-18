"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Building, Info, MapPin, Plus, Check, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { incrementCouponUsage } from "@/app/actions/coupon";
import { PageHero } from "@/components/storefront/page-hero";
import { getCities, getDistricts } from "@/lib/data/turkey";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackGAEvent } from "@/lib/google-analytics";

export default function CheckoutPage() {
  const cart = useCart();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Billing specific states
  const [useSameAddressForBilling, setUseSameAddressForBilling] = useState(true);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string>("");
  const [isAddingBillingAddress, setIsAddingBillingAddress] = useState(false);

  const [accountCreated, setAccountCreated] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    district: "",
    zip: "",
    email: "",
    phone: "",
    title: "Teslimat Adresim",
  });

  const [billingFormData, setBillingFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    district: "",
    zip: "",
    phone: "",
    title: "Fatura Adresim",
  });

  const [banks, setBanks] = useState<any[]>([]);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const isSecure = window.location.protocol === 'https:';
    document.cookie = `next-redirect=/checkout; path=/; max-age=300; SameSite=${isSecure ? 'None; Secure' : 'Lax'}`;
    // Fallback bulletproof redirect using localStorage
    window.localStorage.setItem("next-redirect", "/checkout");
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  useEffect(() => {
    setMounted(true);

    if (cart.items.length > 0) {
      trackMetaEvent("InitiateCheckout", {
        value: cart.getFinalTotal(),
        currency: "TRY"
      });
      trackGAEvent("begin_checkout", {
        currency: "TRY",
        value: cart.getFinalTotal(),
        items: cart.items.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });
    }

    async function fetchData() {
      const { data: settingsData } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "bank_info")
        .single();

      if (settingsData?.value) {
        if (Array.isArray(settingsData.value)) {
          setBanks(settingsData.value);
        } else {
          setBanks([settingsData.value]);
        }
      }

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({ ...prev, email: currentUser.email || "" }));

        const { data: addrData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (addrData && addrData.length > 0) {
          setAddresses(addrData);
          setSelectedAddressId(addrData[0].id);
          setSelectedBillingAddressId(addrData[0].id);
        } else {
          setIsAddingNewAddress(true);
          setIsAddingBillingAddress(true);
        }
      } else {
        setIsAddingNewAddress(true);
        setIsAddingBillingAddress(true);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const formatAddressString = (addrObj: any) => {
    if (!addrObj) return "";
    return `${addrObj.title} - ${addrObj.full_name} - ${addrObj.address_line}, ${addrObj.city} ${addrObj.zip_code} - Tel: ${addrObj.phone}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 0. Live Stock Validation
    if (cart.items.length > 0) {
      const productIds = cart.items.map(item => item.product.id);
      const { data: currentProducts, error: productsError } = await supabase
        .from("products")
        .select("id, name, stock")
        .in("id", productIds);

      if (productsError) {
        console.error("Stock validation error:", productsError);
        toast.add({
          title: "Sistem Hatası",
          description: "Ürün stokları kontrol edilirken bir hata oluştu.",
          type: "error",
        } as any);
        setIsSubmitting(false);
        return;
      }

      for (const item of cart.items) {
        const dbProduct = currentProducts?.find(p => p.id === item.product.id);
        if (!dbProduct || dbProduct.stock < item.quantity) {
          toast.add({
            title: "Stok Yetersiz",
            description: `"${item.product.name}" ürünü stokta kalmamıştır veya yeterli stok yoktur.`,
            type: "error",
          } as any);
          setIsSubmitting(false);
          return;
        }
      }
    }

    let finalUserId = user?.id;

    // 1. Auto-registration
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8) + "Yc!1";
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: randomPassword,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      if (signUpError && signUpError.status !== 400) {
        console.error("Signup error:", signUpError);
      }

      if (signUpData?.user) {
        finalUserId = signUpData.user.id;

        // Şifre belirleme maili gönder
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/account/settings`,
        });

        if (resetError) {
          console.error("Şifre belirleme maili gönderilemedi:", resetError);
        }

        // Hoş geldiniz mailini asenkron olarak gönder
        fetch("/api/emails/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`.trim()
          }),
        }).catch(err => console.error("Welcome email API call failed:", err));

        setAccountCreated(true);
      }
    }

    // 2. Insert new shipping address if needed
    if (isAddingNewAddress && finalUserId) {
      try {
        const { data: newAddr, error: addrError } = await supabase.from("addresses").insert({
          user_id: finalUserId,
          title: formData.title || "Teslimat Adresi",
          full_name: `${formData.firstName} ${formData.lastName}`,
          address_line: formData.address,
          city: `${formData.city} / ${formData.district}`,
          zip_code: formData.zip,
          phone: formData.phone || "000"
        }).select().single();

        if (!addrError && newAddr) {
          setSelectedAddressId(newAddr.id);
        }
      } catch (e) {
        console.error("Shipping address insert error:", e);
      }
    }

    // 3. Insert new billing address if needed and different
    if (!useSameAddressForBilling && isAddingBillingAddress && finalUserId) {
      try {
        const { data: newBillAddr, error: billAddrError } = await supabase.from("addresses").insert({
          user_id: finalUserId,
          title: billingFormData.title || "Fatura Adresi",
          full_name: `${billingFormData.firstName} ${billingFormData.lastName}`,
          address_line: billingFormData.address,
          city: `${billingFormData.city} / ${billingFormData.district}`,
          zip_code: billingFormData.zip,
          phone: billingFormData.phone || "000"
        }).select().single();

        if (!billAddrError && newBillAddr) {
          setSelectedBillingAddressId(newBillAddr.id);
        }
      } catch (e) {
        console.error("Billing address insert error:", e);
      }
    }

    // 4. Create Order Records
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const shippingString = user && !isAddingNewAddress
      ? formatAddressString(selectedAddress)
      : `${formData.title} - ${formData.firstName} ${formData.lastName} - ${formData.address}, ${formData.city} / ${formData.district} ${formData.zip} - Tel: ${formData.phone}`;

    let billingString = shippingString;
    if (!useSameAddressForBilling) {
      billingString = user && !isAddingBillingAddress
        ? formatAddressString(addresses.find(a => a.id === selectedBillingAddressId))
        : `${billingFormData.title} - ${billingFormData.firstName} ${billingFormData.lastName} - ${billingFormData.address}, ${billingFormData.city} / ${billingFormData.district} ${billingFormData.zip} - Tel: ${billingFormData.phone}`;
    }

    // Determine correct customer details
    let finalCustomerName = `${formData.firstName} ${formData.lastName}`.trim();
    let finalCustomerPhone = formData.phone;

    if (user && !isAddingNewAddress && selectedAddress) {
      finalCustomerName = selectedAddress.full_name;
      finalCustomerPhone = selectedAddress.phone;
    }

    // Fallback if name is still empty
    if (!finalCustomerName) {
      finalCustomerName = user?.user_metadata?.full_name || user?.email || "Müşteri";
    }

    // Generate Order ID locally to avoid .select() which can trigger RLS on anonymous sessions
    const orderId = crypto.randomUUID();

    const couponCode = cart.appliedCoupon?.code || null;
    const discountTotal = cart.getDiscountAmount() || 0;

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      user_id: finalUserId || null,
      customer_name: finalCustomerName,
      customer_email: formData.email || user?.email,
      customer_phone: finalCustomerPhone || "0",
      shipping_address: shippingString,
      billing_address: billingString,
      total_amount: cart.getFinalTotal(),
      coupon_code: couponCode,
      discount_total: discountTotal,
      status: 'pending'
    });

    if (!orderError) {
      const orderItems = cart.items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) {
        console.error("Order items creation failed:", itemsError);
        // ROLLBACK: Delete the order if items failed (e.g. stock constraint violation)
        await supabase.from("orders").delete().eq("id", orderId);
        setIsSubmitting(false);
        toast.add({
          title: "Sipariş Tamamlanamadı",
          description: "Bir veya birden fazla ürünün stoğu tükendiği için siparişiniz iptal edildi.",
          type: "error",
        } as any);
        return;
      }


      // Trigger email sending asynchronously (don't await so it doesn't block UI)
      fetch("/api/emails/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }).catch(err => console.error("Email API call failed:", err));

      // Increment coupon usage
      if (couponCode) {
        incrementCouponUsage(couponCode).catch(console.error);
      }

      // Track purchase for GA4 / Google Ads
      trackMetaEvent("Purchase", {
        value: cart.getFinalTotal(),
        currency: "TRY"
      });
      trackGAEvent("purchase", {
        transaction_id: orderId,
        value: cart.getFinalTotal(),
        currency: "TRY",
        coupon: couponCode || undefined,
        items: cart.items.map(item => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      });

      // 5. Success
      setIsSubmitting(false);
      setIsSuccess(true);
      cart.clearCart();
    } else {
      console.error("Order creation failed:", orderError);
      setIsSubmitting(false);
      toast.add({
        title: "Sistem Hatası",
        description: "Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        type: "error",
      } as any);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-background font-sans min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-background border border-border rounded-[32px] p-10 text-center shadow-xl shadow-gray-100">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-4">
            Sipariş Alındı!
          </h2>
          <p className="text-muted-foreground font-medium mb-6">
            Siparişiniz başarıyla alındı. Ödemenizi lütfen aşağıdaki Havale/EFT bilgileri ile gerçekleştirin. Ödeme onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır.
          </p>

          {accountCreated && (
            <div className="mb-8 p-4 bg-primary/10 rounded-xl border border-primary/20 text-left">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Hesabınız Oluşturuldu!
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Sipariş takibini yapabilmeniz için <span className="font-semibold text-foreground">{formData.email}</span> adresi ile otomatik olarak bir hesap oluşturuldu.
              </p>
              <p className="text-sm text-muted-foreground">
                Kendi şifrenizi belirleyip giriş yapabilmeniz için e-posta adresinize bir şifre belirleme bağlantısı gönderdik. Lütfen e-postanızı kontrol edin (Gerekiyorsa Spam/Gereksiz kutusuna da bakmayı unutmayın).
              </p>
            </div>
          )}

          <Button
            nativeButton={false}
            size="lg"
            className="w-full rounded-full font-bold h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            render={<Link href="/products" />}
          >
            Alışverişe Devam Et
          </Button>
        </div>
      </div>
    );
  }

  // Helper to render address form
  const renderAddressForm = (data: any, setData: any, required: boolean) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">Ad</Label>
          <Input
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
            required={required}
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">Soyad</Label>
          <Input
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
            required={required}
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">Telefon</Label>
          <Input
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            required={required}
            placeholder="05..."
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">Adres Başlığı</Label>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required={required}
            placeholder="Ev, İş vb."
            className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground font-semibold text-sm">Adres</Label>
        <Input
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          required={required}
          placeholder="Mahalle, sokak, bina no..."
          className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">İl</Label>
          <div className="relative">
            <select
              value={data.city}
              onChange={(e) => setData({ ...data, city: e.target.value, district: "" })}
              required={required}
              className="h-12 w-full appearance-none bg-muted border border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl px-3 text-sm"
            >
              <option value="" disabled>İl Seçiniz</option>
              {getCities().map(c => (
                <option key={c.plate} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground font-semibold text-sm">İlçe</Label>
          <div className="relative">
            <select
              value={data.district}
              onChange={(e) => setData({ ...data, district: e.target.value })}
              required={required}
              disabled={!data.city}
              className="h-12 w-full appearance-none bg-muted border border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl px-3 text-sm disabled:opacity-50"
            >
              <option value="" disabled>İlçe Seçiniz</option>
              {data.city && getDistricts(data.city).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-muted-foreground font-semibold text-sm">Posta Kodu</Label>
        <Input
          value={data.zip}
          onChange={(e) => setData({ ...data, zip: e.target.value })}
          required={required}
          className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-background font-sans min-h-screen">
      <PageHero
        title="Güvenli Ödeme"
        description="Siparişinizi tamamlamak için bilgilerinizi girin."
        breadcrumbs={[
          { label: "Ödeme" }
        ]}
      />

      <div className="container mx-auto px-4 max-w-6xl -mt-8 mb-20 relative z-20">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7 bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* İletişim */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  İletişim Bilgileri
                </h2>

                {user ? (
                  <div className="p-4 bg-muted/50 rounded-xl border border-border flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Hesabınızla giriş yapıldı</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-muted-foreground font-semibold text-sm"
                      >
                        E-posta Adresi
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ornek@email.com"
                        required
                        className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Sipariş takibi için hesabınız otomatik oluşturulacaktır.</p>
                    </div>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground font-semibold">
                          veya hızlı sipariş için
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-border hover:bg-muted/50 transition-all"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      {googleLoading ? "Yönlendiriliyor..." : "Google ile devam et"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Teslimat */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h2 className="text-lg font-bold text-foreground">
                  Teslimat Adresi
                </h2>

                {user && !isAddingNewAddress ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`relative cursor-pointer border rounded-2xl p-5 transition-all ${selectedAddressId === address.id
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border bg-background hover:border-primary/50'
                            }`}
                        >
                          {selectedAddressId === address.id && (
                            <div className="absolute top-4 right-4 text-primary">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h3 className="font-bold text-foreground text-sm">{address.title}</h3>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground">{address.full_name}</p>
                            <p className="line-clamp-2">{address.address_line}</p>
                            <p>{address.city} {address.zip_code && `, ${address.zip_code}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl border-dashed h-12"
                      onClick={() => setIsAddingNewAddress(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Yeni Adres Ekle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {renderAddressForm(formData, setFormData, isAddingNewAddress)}
                    {user && addresses.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full h-12 text-muted-foreground"
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        Vazgeç ve Kayıtlı Adreslerimden Seç
                      </Button>
                    )}
                  </div>
                )}

                {/* Billing Address Switch */}
                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer group p-3 bg-muted/30 rounded-xl border border-transparent hover:border-border transition-colors">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={useSameAddressForBilling}
                        onChange={(e) => setUseSameAddressForBilling(e.target.checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-muted-foreground rounded checked:border-primary checked:bg-primary transition-all cursor-pointer"
                      />
                      <Check className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">Fatura adresim, teslimat adresim ile aynı</span>
                  </label>
                </div>
              </div>

              {/* Fatura Adresi */}
              {!useSameAddressForBilling && (
                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                  <h2 className="text-lg font-bold text-foreground">
                    Fatura Adresi
                  </h2>

                  {user && !isAddingBillingAddress ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            onClick={() => setSelectedBillingAddressId(address.id)}
                            className={`relative cursor-pointer border rounded-2xl p-5 transition-all ${selectedBillingAddressId === address.id
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-background hover:border-primary/50'
                              }`}
                          >
                            {selectedBillingAddressId === address.id && (
                              <div className="absolute top-4 right-4 text-primary">
                                <Check className="w-5 h-5" />
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <h3 className="font-bold text-foreground text-sm">{address.title}</h3>
                            </div>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <p className="font-semibold text-foreground">{address.full_name}</p>
                              <p className="line-clamp-2">{address.address_line}</p>
                              <p>{address.city} {address.zip_code && `, ${address.zip_code}`}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-dashed h-12"
                        onClick={() => setIsAddingBillingAddress(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Yeni Fatura Adresi Ekle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {renderAddressForm(billingFormData, setBillingFormData, !useSameAddressForBilling && isAddingBillingAddress)}
                      {user && addresses.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full h-12 text-muted-foreground"
                          onClick={() => setIsAddingBillingAddress(false)}
                        >
                          Vazgeç ve Kayıtlı Adreslerimden Seç
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Ödeme */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h2 className="text-lg font-bold text-foreground">
                  Banka Havalesi / EFT ile Ödeme
                </h2>

                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Siparişinizi tamamladıktan sonra banka hesap bilgilerimiz (IBAN) kayıtlı e-posta adresinize gönderilecektir. Ödemeniz onaylandıktan sonra siparişiniz hazırlanacaktır.
                    </p>
                  </div>
                </div>

                {banks.length > 0 && (
                  <div className="p-5 bg-background border border-border rounded-xl space-y-3 shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-2">Anlaşmalı Olduğumuz Bankalar:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {banks.map((bank, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
                          <Building className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-sm font-medium">{bank.bankName || "Banka"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full h-14 rounded-full font-bold text-base bg-foreground hover:bg-background text-background shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 mt-4"
              >
                {isSubmitting
                  ? "İşleniyor..."
                  : `Havale ile Siparişi Tamamla (₺${cart.getFinalTotal().toLocaleString("tr-TR")})`}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 sticky top-28 shadow-sm">
              <h2 className="text-xl font-black text-foreground mb-6">
                Sipariş Özeti
              </h2>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.color || idx}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                      <Image
                        src={
                          item.product.images?.[0] ||
                          "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=200&auto=format&fit=crop"
                        }
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.color && (
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                          Renk:{" "}
                          <span className="text-muted-foreground">
                            {item.color}
                          </span>
                        </p>
                      )}
                      <p className="text-sm font-semibold text-muted-foreground mt-1">
                        ₺
                        {(item.product.price * item.quantity).toLocaleString(
                          "tr-TR",
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-medium text-sm">Ara Toplam</span>
                  <span className="font-bold text-foreground">
                    ₺{cart.getTotal().toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-medium text-sm">Kargo Tutarı</span>
                  <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-[10px] uppercase tracking-wide">
                    Ücretsiz
                  </span>
                </div>

                {cart.appliedCoupon && (
                  <div className="flex justify-between items-center text-success">
                    <span className="font-medium text-sm">İndirim ({cart.appliedCoupon.code})</span>
                    <span className="font-bold">
                      -₺{cart.getDiscountAmount().toLocaleString("tr-TR")}
                    </span>
                  </div>
                )}

                <div className="pt-4 mt-2 border-t border-border flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">
                    Toplam
                  </span>
                  <span className="text-3xl font-black text-foreground">
                    ₺{cart.getFinalTotal().toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
