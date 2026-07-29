"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "bank_info")
        .single();
      if (data && data.value) {
        setIban(data.value.iban || "");
        setBankName(data.value.bankName || "");
      }
    }
    loadSettings();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const value = { iban, bankName };

    // Check if exists
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", "bank_info")
      .single();

    let error;
    if (existing) {
      const res = await supabase
        .from("settings")
        .update({ value })
        .eq("key", "bank_info");
      error = res.error;
    } else {
      const res = await supabase
        .from("settings")
        .insert([{ key: "bank_info", value }]);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      alert("Ayarlar kaydedilirken hata oluştu.");
    } else {
      alert("Ayarlar başarıyla kaydedildi!");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Sistem Ayarları</h2>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-8 bg-white dark:bg-black p-6 rounded-lg border"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Banka ve Ödeme Bilgileri</h3>
          <p className="text-sm text-muted-foreground">
            Müşterilerinizin ödeme yapacağı havale bilgilerini buradan
            güncelleyebilirsiniz.
          </p>

          <div className="space-y-2">
            <Label htmlFor="bankName">Banka Adı & Alıcı Adı</Label>
            <Input
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Örn: Garanti BBVA - Yücel Avize Ltd. Şti."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN Numarası</Label>
            <Input
              id="iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </form>
    </div>
  );
}
