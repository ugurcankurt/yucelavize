"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackGAEvent } from "@/lib/google-analytics";
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  useEffect(() => {
    trackMetaEvent("Purchase", { currency: "TRY" });
    trackGAEvent("purchase", {
      currency: "TRY",
      transaction_id: orderId || undefined,
    });
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto text-center space-y-6">
      {" "}
      <div className="flex justify-center mb-8">
        {" "}
        <div className="w-24 h-24 bg-success/20 dark:bg-success/20 rounded-full flex items-center justify-center">
          {" "}
          <CheckCircle2 className="w-12 h-12 text-success dark:text-success" />{" "}
        </div>{" "}
      </div>{" "}
      <h1 className="text-4xl font-bold tracking-tight">Siparişiniz Alındı!</h1>{" "}
      <p className="text-lg text-muted-foreground">
        {" "}
        Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz başarıyla
        oluşturuldu ve işleme alındı.{" "}
      </p>{" "}
      {orderId && (
        <div className="bg-muted border rounded-xl p-6 my-8">
          {" "}
          <p className="text-sm text-muted-foreground mb-2">
            Sipariş Takip Numaranız
          </p>{" "}
          <p className="text-2xl font-mono font-bold">{orderId}</p>{" "}
        </div>
      )}{" "}
      <div className="text-sm text-muted-foreground bg-info/10 p-4 rounded-lg border border-info/20">
        {" "}
        <p>
          Havale/EFT ile ödeme seçeneğini seçtiyseniz, ödemenizi yaparken
          açıklama kısmına <strong>sipariş takip numaranızı</strong> yazmayı
          unutmayın. Ödemeniz onaylandığında siparişiniz kargoya verilecektir.
        </p>{" "}
      </div>{" "}
      <div className="pt-8">
        {" "}
        <Button
          nativeButton={false}
          size="lg"
          className="h-14 px-8 text-lg"
          render={<Link href="/" />}
        >
          {" "}
          Alışverişe Devam Et{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
}
export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      {" "}
      <Suspense fallback={<p>Yükleniyor...</p>}>
        {" "}
        <SuccessContent />{" "}
      </Suspense>{" "}
    </div>
  );
}
