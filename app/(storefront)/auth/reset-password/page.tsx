"use client";
import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor. Lütfen kontrol edip tekrar deneyin.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifreniz en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }

    const result = await updatePassword(password);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    }
    
    setLoading(false);
  }

  return (
    <AuthLayout
      title="Yeni Şifre Belirleme"
      subtitle="Hesabınız için yeni ve güvenli bir şifre oluşturun."
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
            Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
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
                htmlFor="password"
                className="text-muted-foreground font-semibold text-sm"
              >
                Yeni Şifre
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-muted-foreground font-semibold text-sm"
              >
                Yeni Şifre (Tekrar)
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="h-12 bg-muted border-border focus-visible:ring-primary focus-visible:border-primary rounded-xl"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-14 rounded-full font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] mt-2"
              disabled={loading}
            >
              {loading ? "Güncelleniyor..." : "Şifremi Güncelle"}
            </Button>
          </form>
        )}
        
        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          <Link
            href="/auth/login"
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            İptal et ve Giriş Yap'a dön
          </Link>
        </div>
    </AuthLayout>
  );
}
