"use server";

import { headers, cookies } from "next/headers";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

interface CapiEventData {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  customData?: any;
  userData?: any;
}

export async function trackCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  customData = {},
  userData = {}
}: CapiEventData) {
  try {
    const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const TOKEN = process.env.META_CAPI_TOKEN;

    if (!PIXEL_ID || !TOKEN) {
      console.warn("CAPI is not configured. Missing PIXEL_ID or META_CAPI_TOKEN.");
      return { success: false, error: "Missing configuration" };
    }

    const reqHeaders = await headers();
    const reqCookies = await cookies();

    const clientIpAddress = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || reqHeaders.get("x-real-ip") || "";
    const clientUserAgent = reqHeaders.get("user-agent") || "";
    const fbp = reqCookies.get("_fbp")?.value || "";
    const fbc = reqCookies.get("_fbc")?.value || "";

    // Advanced Matching: Fetch logged-in user and hash email/phone
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let em = undefined;
    let ph = undefined;

    if (user?.email) {
      const normalizedEmail = user.email.trim().toLowerCase();
      em = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
    }

    if (user?.phone) {
      const normalizedPhone = user.phone.replace(/\\D/g, "");
      ph = crypto.createHash('sha256').update(normalizedPhone).digest('hex');
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: timestamp,
          event_id: eventId,
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data: {
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            fbp: fbp || undefined,
            fbc: fbc || undefined,
            em,
            ph,
            ...userData,
          },
          custom_data: customData,
        },
      ],
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("CAPI Error:", result);
      return { success: false, error: result };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send CAPI event:", error);
    return { success: false, error: "Internal server error" };
  }
}
