"use client";
import { useState } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { createClient } from "@/lib/supabase/client";
export default function CustomerRegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
  }

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
            disabled={loading || googleLoading}
          >
            {" "}
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}{" "}
          </Button>{" "}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">
                veya
              </span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 border-border hover:bg-muted/50 transition-all hover:scale-[1.01]"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Yönlendiriliyor..." : "Google ile devam et"}
          </Button>
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
