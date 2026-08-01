"use client";
import { useState } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
export default function CustomerRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }
  return (
    <AuthLayout
      title="Kayıt Ol"
      subtitle="Hemen bir hesap oluşturarak siparişlerinizi yönetmeye başlayın."
      icon={UserPlus}
    >
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3">
            {" "}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>{" "}
            {error}{" "}
          </div>
        )}{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <div className="space-y-2">
            {" "}
            <Label
              htmlFor="fullName"
              className="text-muted-foreground font-semibold text-sm"
            >
              Ad Soyad
            </Label>{" "}
            <Input
              id="fullName"
              name="fullName"
              required
              placeholder="Adınız Soyadınız"
              className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label
              htmlFor="email"
              className="text-muted-foreground font-semibold text-sm"
            >
              E-posta Adresi
            </Label>{" "}
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="ornek@email.com"
              className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
            />{" "}
          </div>{" "}
          <div className="space-y-2">
            {" "}
            <Label
              htmlFor="password"
              className="text-muted-foreground font-semibold text-sm"
            >
              Şifre
            </Label>{" "}
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
            />{" "}
          </div>{" "}
          <Button
            type="submit"
            className="w-full h-14 rounded-full font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] mt-2"
            disabled={loading}
          >
            {" "}
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}{" "}
          </Button>{" "}
        </form>{" "}
        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          {" "}
          Zaten bir hesabınız var mı?{""}{" "}
          <Link
            href="/auth/login"
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            {" "}
            Giriş Yap{" "}
          </Link>{" "}
        </div>
    </AuthLayout>
  );
}
