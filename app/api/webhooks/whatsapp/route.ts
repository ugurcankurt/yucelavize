import { NextResponse } from "next/server";
import { sendWhatsAppFlowMessage, sendWhatsAppTextMessage } from "@/lib/whatsapp";

// This is the token you will set in Meta Developer Dashboard when configuring the webhook
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "yucelavize_whatsapp_gizli_token_2026";

// 1. Webhook Doğrulama (Verification) - Meta bunu webhook'u kurarken test amaçlı gönderir
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp Webhook başarıyla doğrulandı!");
    // Respond with 200 OK and challenge token from the request
    return new NextResponse(challenge, { status: 200 });
  } else {
    // Responds with '403 Forbidden' if verify tokens do not match
    return new NextResponse("Forbidden", { status: 403 });
  }
}

// 2. Gelen Mesajları Dinleme (Incoming Messages & Flows)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp status update or message
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            const message = change.value.messages[0];
            const from = message.from; // Sender's phone number
            
            // Eğer düz metin mesajı ise (Müşteri sitedeki butona tıklayıp gönderdiyse)
            if (message.type === "text") {
              const text = message.text.body;
              console.log(`[WhatsApp] Yeni mesaj geldi (${from}): ${text}`);
              
              // Müşteri tetikleyici mesajı yolladıysa (Sipariş başlat) -> Ona Flow gönder!
              if (text.includes("(Sipariş başlat)")) {
                // Sitedeki butondan gelen trigger
                console.log(`[WhatsApp] Sipariş akışı başlatılıyor -> ${from}`);
                // Ürün adını ayıkla (Örn: "Merhaba, "Led Avize" ürünü...")
                const match = text.match(/"([^"]+)"/);
                const productName = match ? match[1] : "Sipariş";
                
                await sendWhatsAppFlowMessage(from, `siparis_${Date.now()}`);
              }
            } 
            
            // Eğer interaktif mesaj yanıtı ise (Flow'dan veri geldiyse)
            else if (message.type === "interactive") {
              if (message.interactive.type === "nfm_reply") { // NFM = Native Flow Message
                const flowResponse = JSON.parse(message.interactive.nfm_reply.response_json);
                console.log(`[WhatsApp Flow] Sipariş Verisi Geldi:`, flowResponse);
                
                // TODO: Gelen flowResponse (Ad, soyad, adres) verisini Supabase veritabanına kaydet
                const customerName = flowResponse.first_name || "Müşterimiz";
                
                // Kullanıcıya siparişin alındığına dair onay mesajı gönder
                const confirmationMsg = `Sayın ${customerName}, sipariş detaylarınız tarafımıza ulaştı. Müşteri temsilcimiz onay ve kargo süreçleri için en kısa sürede sizinle iletişime geçecektir. Teşekkür ederiz! 💡 (Yücel Avize)`;
                await sendWhatsAppTextMessage(from, confirmationMsg);
              }
            }
          }
        }
      }
      return NextResponse.json({ status: "success" }, { status: 200 });
    }
    
    return new NextResponse("Not Found", { status: 404 });
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
