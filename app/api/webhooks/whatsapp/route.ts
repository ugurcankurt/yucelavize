import { NextResponse } from "next/server";

// This is the token that we tell Meta to use to verify our webhook
const VERIFY_TOKEN = "yucelavize_whatsapp_gizli_token";

// Handle GET requests for Webhook verification (Meta calls this once when you click "Verify and save")
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WhatsApp Webhook Verified Successfully!");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  } catch (error) {
    console.error("Error during webhook verification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Handle POST requests for incoming messages or status updates
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the incoming message/event from WhatsApp
    console.log("Incoming WhatsApp Webhook Event:", JSON.stringify(body, null, 2));

    // Acknowledge receipt to WhatsApp (Required by Meta, otherwise they retry and disable webhook)
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Error handling WhatsApp webhook payload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
