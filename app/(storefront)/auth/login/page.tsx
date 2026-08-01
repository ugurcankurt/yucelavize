"use client";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
export default function CustomerLoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await login(formData, "/account");
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }
  return (
    <AuthLayout
      title="Giriş Yap"
      subtitle="Siparişlerinizi takip etmek için hesabınıza erişin."
    >
        {registered && (
          <div className="mb-6 p-4 text-sm font-medium text-success bg-success/10 border border-success/30 rounded-xl flex items-center gap-3">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>{" "}
            Kayıt işleminiz başarıyla tamamlandı. Şimdi giriş
            yapabilirsiniz.{" "}
          </div>
        )}{" "}
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
            <div className="flex justify-between items-center">
              {" "}
              <Label
                htmlFor="password"
                className="text-muted-foreground font-semibold text-sm"
              >
                Şifre
              </Label>{" "}
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Şifremi Unuttum
              </Link>{" "}
            </div>{" "}
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
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}{" "}
          </Button>{" "}
        </form>{" "}
        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          {" "}
          Hesabınız yok mu?{""}{" "}
          <Link
            href="/auth/register"
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            {" "}
             Kayıt Ol
          </Link>
        </div>
    </AuthLayout>
  );
}
