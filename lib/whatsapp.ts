// WhatsApp Business Cloud API Helper Functions

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const API_VERSION = "v19.0"; // Meta Graph API Version

/**
 * Göndericiye standart bir metin mesajı gönderir.
 */
export async function sendWhatsAppTextMessage(to: string, message: string) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("WhatsApp API kimlik bilgileri eksik!");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("WhatsApp Mesaj Gönderme Hatası:", error);
    return null;
  }
}

/**
 * Kullanıcıya etkileşimli bir Flow (Akış) mesajı gönderir.
 */
export async function sendWhatsAppFlowMessage(to: string, flowToken: string) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("WhatsApp API kimlik bilgileri eksik!");
    return false;
  }

  // Not: FLOW_ID'yi Meta Developer sayfasından aldıktan sonra buraya veya .env'ye eklemelisiniz.
  const FLOW_ID = process.env.WHATSAPP_FLOW_ID || "BURAYA_FLOW_ID_GELECEK"; 

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "interactive",
          interactive: {
            type: "flow",
            header: {
              type: "text",
              text: "Yücel Avize Sipariş Merkezi"
            },
            body: {
              text: "Siparişinizi tamamlamak için lütfen aşağıdaki butona tıklayarak adres bilgilerinizi giriniz."
            },
            footer: {
              text: "Güvenli Sipariş"
            },
            action: {
              name: "flow",
              parameters: {
                flow_message_version: "3",
                flow_token: flowToken, // Benzersiz bir takip kodu olabilir (örn: ürün id veya session id)
                flow_id: FLOW_ID,
                flow_cta: "Sipariş Formunu Doldur",
                flow_action: "navigate",
                flow_action_payload: {
                  screen: "ORDER_FORM"
                }
              }
            }
          }
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("WhatsApp Flow Gönderme Hatası:", error);
    return null;
  }
}
