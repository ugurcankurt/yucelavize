"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData, "/admin");

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Yönetici Girişi"
      subtitle="Yücel Avize kontrol paneline erişmek için giriş yapın."
    >
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 dark:bg-destructive/10 border border-destructive/30 dark:border-destructive/20 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="admin@yucelavize.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button
          type="submit"
          className="w-full h-11 text-base mt-2"
          disabled={loading}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </AuthLayout>
  );
}
