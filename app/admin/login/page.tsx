"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-muted/50 dark:bg-foreground p-4">
      <div className="w-full max-w-md bg-white dark:bg-black border rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 bg-foreground dark:bg-muted rounded-full flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-foreground dark:text-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Yönetici Girişi
            </h1>
            <p className="text-sm text-muted-foreground">
              Yücel Avize kontrol paneline erişmek için giriş yapın.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 dark:bg-destructive/10 border border-destructive/30 dark:border-destructive/20 rounded-md">
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
        </div>
      </div>
    </div>
  );
}
