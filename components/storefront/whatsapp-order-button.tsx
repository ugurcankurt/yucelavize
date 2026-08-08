"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppOrderButtonProps {
  productName: string;
  productUrl?: string;
  disabled?: boolean;
}

export function WhatsAppOrderButton({ productName, productUrl, disabled }: WhatsAppOrderButtonProps) {
  const handleWhatsAppClick = () => {
    // Phone number should ideally come from env variable, fallback to a placeholder
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905000000000"; 
    const currentUrl = productUrl || (typeof window !== "undefined" ? window.location.href : "");
    
    // We send a specific trigger phrase so the WhatsApp bot (Webhook) can catch it and send the Flow
    const message = `Merhaba, "${productName}" ürünü için hızlı sipariş oluşturmak istiyorum. (Sipariş başlat)`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button 
      onClick={handleWhatsAppClick}
      disabled={disabled}
      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg h-14 flex items-center justify-center gap-2 rounded-xl transition-all shadow-md hover:shadow-lg mt-2"
    >
      <MessageCircle className="w-6 h-6" />
      WhatsApp'tan Sipariş Ver
    </Button>
  );
}
