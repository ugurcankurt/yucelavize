"use client";
import { MessageCircle } from "lucide-react";
export function WhatsappButton() {
  const phoneNumber = "905000000000"; // Müşteri numaranızı buraya ekleyebilirsiniz
  const message =
    "Merhaba, Yücel Avize ürünleri hakkında bilgi almak istiyorum.";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="WhatsApp Canlı Destek"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
