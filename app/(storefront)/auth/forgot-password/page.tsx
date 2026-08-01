"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const origin = window.location.origin;
    
    const result = await sendPasswordResetEmail(formData, origin);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Şifremi Unuttum"
      subtitle="Kayıtlı e-posta adresinizi girin, şifrenizi sıfırlamanız için bir bağlantı gönderelim."
    >
        {success && (
          <div className="mb-6 p-4 text-sm font-medium text-success bg-success/10 border border-success/30 rounded-xl flex items-center gap-3">
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
            </svg>
            Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve gerekiyorsa spam klasörünü) kontrol edin.
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3">
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
            </svg>
            {error}
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-muted-foreground font-semibold text-sm"
              >
                E-posta Adresi
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ornek@email.com"
                className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 rounded-full font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] mt-2"
              disabled={loading}
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>
          </form>
        )}
        
        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Şifrenizi hatırladınız mı?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
    </AuthLayout>
  );
}
