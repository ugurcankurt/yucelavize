"use client";

import { useState, useTransition } from "react";
import { updateOrderCargo } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface OrderCargoUpdateProps {
  orderId: string;
  initialCompany?: string | null;
  initialTracking?: string | null;
  initialUrl?: string | null;
}

export function OrderCargoUpdate({
  orderId,
  initialCompany,
  initialTracking,
  initialUrl
}: OrderCargoUpdateProps) {
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState(initialCompany || "");
  const [tracking, setTracking] = useState(initialTracking || "");
  const [url, setUrl] = useState(initialUrl || "");

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateOrderCargo(orderId, {
        shipping_company: company,
        tracking_number: tracking,
        tracking_url: url
      });

      if (result.error) {
        toast.add({
          title: "Hata",
          description: "Kargo bilgileri güncellenemedi: " + result.error,
          type: "error"
        });
      } else {
        toast.add({
          title: "Başarılı",
          description: "Kargo bilgileri başarıyla kaydedildi.",
          type: "success"
        });
      }
    });
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <Label htmlFor="company" className="text-xs font-semibold text-muted-foreground uppercase">Kargo Firması</Label>
        <Input
          id="company"
          placeholder="Örn: Yurtiçi Kargo"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tracking" className="text-xs font-semibold text-muted-foreground uppercase">Takip Numarası</Label>
        <Input
          id="tracking"
          placeholder="Örn: 123456789"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url" className="text-xs font-semibold text-muted-foreground uppercase">Kargo Takip Linki (URL)</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isPending}
        />
      </div>
      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full mt-2 font-bold"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Kaydediliyor...</>
        ) : (
          <><Save className="w-4 h-4 mr-2" /> Kargo Bilgilerini Kaydet</>
        )}
      </Button>
    </div>
  );
}
