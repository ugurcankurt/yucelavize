"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2 } from "lucide-react";

export default function AdminSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([{ bankName: "", accountName: "", iban: "" }]);

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "bank_info")
        .single();
      if (data && data.value) {
        if (Array.isArray(data.value)) {
          setBanks(data.value);
        } else {
          setBanks([data.value]);
        }
      }
    }
    loadSettings();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const value = banks;

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

  const handleBankChange = (index: number, field: string, val: string) => {
    const newBanks = [...banks];
    newBanks[index] = { ...newBanks[index], [field]: val };
    setBanks(newBanks);
  };

  const addBank = () => {
    if (banks.length < 4) {
      setBanks([...banks, { bankName: "", accountName: "", iban: "" }]);
    }
  };

  const removeBank = (index: number) => {
    const newBanks = banks.filter((_, i) => i !== index);
    setBanks(newBanks);
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Banka ve Ödeme Bilgileri</h3>
              <p className="text-sm text-muted-foreground">
                Müşterilerinizin ödeme yapacağı havale bilgilerini buradan güncelleyebilirsiniz. (Maksimum 4 banka)
              </p>
            </div>
            {banks.length < 4 && (
              <Button type="button" variant="outline" size="sm" onClick={addBank}>
                <Plus className="w-4 h-4 mr-2" /> Banka Ekle
              </Button>
            )}
          </div>

          <div className="space-y-6 pt-4">
            {banks.map((bank, index) => (
              <div key={index} className="p-4 border rounded-xl relative space-y-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Banka {index + 1}</h4>
                  {banks.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBank(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Banka Adı</Label>
                  <Input
                    value={bank.bankName || ""}
                    onChange={(e) => handleBankChange(index, "bankName", e.target.value)}
                    placeholder="Örn: Garanti BBVA"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alıcı Adı / Şirket Ünvanı</Label>
                  <Input
                    value={bank.accountName || ""}
                    onChange={(e) => handleBankChange(index, "accountName", e.target.value)}
                    placeholder="Örn: Yücel Avize Ltd. Şti."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>IBAN Numarası</Label>
                  <Input
                    value={bank.iban || ""}
                    onChange={(e) => handleBankChange(index, "iban", e.target.value)}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </form>
    </div>
  );
}
