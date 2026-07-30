"use client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
export default function CheckoutPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    /* Simulate API call */ setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      cart.clearCart();
    }, 1500);
  };
  if (isSuccess) {
    return (
      <div className="w-full bg-background font-sans min-h-screen flex items-center justify-center p-4">
        {" "}
        <div className="max-w-md w-full bg-background border border-border rounded-[32px] p-10 text-center shadow-xl shadow-gray-100">
          {" "}
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            {" "}
            <CheckCircle2 className="w-10 h-10 text-success" />{" "}
          </div>{" "}
          <h2 className="text-3xl font-black text-foreground mb-4">
            Sipariş Alındı!
          </h2>{" "}
          <p className="text-muted-foreground font-medium mb-8">
            {" "}
            Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu. Sipariş
            detayları e-posta adresinize gönderildi.{" "}
          </p>{" "}
          <Button
            nativeButton={false}
            size="lg"
            className="w-full rounded-full font-bold h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
            render={<Link href="/products" />}
          >
            {" "}
            Alışverişe Devam Et{" "}
          </Button>{" "}
        </div>{" "}
      </div>
    );
  }
  return (
    <div className="w-full bg-muted font-sans min-h-screen py-10 md:py-20">
      {" "}
      <div className="container mx-auto px-4 max-w-6xl">
        {" "}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          {" "}
          <ArrowLeft className="w-4 h-4 mr-2" /> Alışverişe Devam Et{" "}
        </Link>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {" "}
          {/* Checkout Form */}{" "}
          <div className="lg:col-span-7 bg-background border border-border rounded-[32px] p-6 sm:p-10 shadow-sm">
            {" "}
            <div className="flex items-center gap-3 mb-8">
              {" "}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {" "}
                <Lock className="w-5 h-5" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  Güvenli Ödeme
                </h1>{" "}
                <p className="text-sm font-medium text-muted-foreground">
                  Tüm bilgileriniz şifrelenerek korunur.
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <form onSubmit={handleSubmit} className="space-y-8">
              {" "}
              {/* İletişim */}{" "}
              <div className="space-y-4">
                {" "}
                <h2 className="text-lg font-bold text-foreground">
                  İletişim Bilgileri
                </h2>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label
                    htmlFor="email"
                    className="text-muted-foreground font-semibold text-sm"
                  >
                    E-posta
                  </Label>{" "}
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    required
                    className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Teslimat */}{" "}
              <div className="space-y-4 pt-4 border-t border-border">
                {" "}
                <h2 className="text-lg font-bold text-foreground">
                  Teslimat Adresi
                </h2>{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="firstName"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      Ad
                    </Label>{" "}
                    <Input
                      id="firstName"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="lastName"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      Soyad
                    </Label>{" "}
                    <Input
                      id="lastName"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label
                    htmlFor="address"
                    className="text-muted-foreground font-semibold text-sm"
                  >
                    Adres
                  </Label>{" "}
                  <Input
                    id="address"
                    required
                    placeholder="Mahalle, sokak, bina no..."
                    className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="city"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      İl
                    </Label>{" "}
                    <Input
                      id="city"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="zip"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      Posta Kodu
                    </Label>{" "}
                    <Input
                      id="zip"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Ödeme */}{" "}
              <div className="space-y-4 pt-4 border-t border-border">
                {" "}
                <h2 className="text-lg font-bold text-foreground">
                  Ödeme Bilgileri
                </h2>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label
                    htmlFor="cardName"
                    className="text-muted-foreground font-semibold text-sm"
                  >
                    Kart Üzerindeki İsim
                  </Label>{" "}
                  <Input
                    id="cardName"
                    required
                    className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <Label
                    htmlFor="cardNumber"
                    className="text-muted-foreground font-semibold text-sm"
                  >
                    Kart Numarası
                  </Label>{" "}
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    required
                    className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="expiry"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      Son Kullanma (AA/YY)
                    </Label>{" "}
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                  <div className="space-y-2">
                    {" "}
                    <Label
                      htmlFor="cvv"
                      className="text-muted-foreground font-semibold text-sm"
                    >
                      CVV
                    </Label>{" "}
                    <Input
                      id="cvv"
                      placeholder="123"
                      required
                      className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <Button
                type="submit"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full h-14 rounded-full font-bold text-base bg-foreground hover:bg-background text-background shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 mt-4"
              >
                {isSubmitting
                  ? "İşleniyor..."
                  : `₺${cart.getFinalTotal().toLocaleString("tr-TR")} Öde ve Siparişi Tamamla`}
              </Button>
            </form>{" "}
          </div>{" "}
          {/* Order Summary Sidebar */}{" "}
          <div className="lg:col-span-5">
            {" "}
            <div className="bg-background border border-border rounded-[32px] p-6 sm:p-10 sticky top-28 shadow-sm">
              {" "}
              <h2 className="text-xl font-black text-foreground mb-6">
                Sipariş Özeti
              </h2>{" "}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {" "}
                {cart.items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.color || idx}`}
                    className="flex gap-4"
                  >
                    {" "}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                      {" "}
                      <Image
                        src={
                          item.product.images?.[0] ||
                          "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=200&auto=format&fit=crop"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />{" "}
                      <div className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {" "}
                        {item.quantity}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      {" "}
                      <h4 className="font-bold text-sm text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>{" "}
                      {item.color && (
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                          {" "}
                          Renk:{" "}
                          <span className="text-muted-foreground">
                            {item.color}
                          </span>{" "}
                        </p>
                      )}{" "}
                      <p className="text-sm font-semibold text-muted-foreground mt-1">
                        ₺
                        {(item.product.price * item.quantity).toLocaleString(
                          "tr-TR",
                        )}
                      </p>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
              <div className="border-t border-border pt-6 space-y-4">
                {" "}
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
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
