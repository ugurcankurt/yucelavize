import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Fetch order to verify and get details
    const { data: order, error } = await supabase
      .from("orders")
      .select(`*`)
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Order fetch error for WhatsApp:", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check WhatsApp Environment Variables
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_ID) {
      console.error("WhatsApp API credentials missing");
      return NextResponse.json({ error: "WhatsApp API credentials missing" }, { status: 500 });
    }

    // Format phone number (e.g. remove leading zeros, add country code if missing)
    let phone = order.customer_phone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '90' + phone.substring(1);
    } else if (!phone.startsWith('90') && phone.length === 10) {
      phone = '90' + phone;
    }

    // Construct WhatsApp Cloud API payload
    const payload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: "order_confirmation",
        language: {
          code: "tr"
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: order.customer_name.split(' ')[0] || "Müşteri"
              },
              {
                type: "text",
                text: order.id.split('-')[0].toUpperCase() // Short order ID
              },
              {
                type: "text",
                text: order.total_amount.toLocaleString("tr-TR")
              }
            ]
          }
        ]
      }
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return NextResponse.json({ error: "Failed to send WhatsApp message", details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });

  } catch (error) {
    console.error("WhatsApp order confirmation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
