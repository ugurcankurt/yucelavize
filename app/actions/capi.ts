"use server";

import { headers, cookies } from "next/headers";
import { ParamBuilder } from "capi-param-builder-nodejs";
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

    const host = reqHeaders.get("host") || "";
    const xForwardedFor = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || reqHeaders.get("x-real-ip") || null;
    const referer = reqHeaders.get("referer") || null;
    const clientUserAgent = reqHeaders.get("user-agent") || "";

    const cookieObj: { [key: string]: string } = {};
    reqCookies.getAll().forEach(cookie => {
      cookieObj[cookie.name] = cookie.value;
    });

    const parsedUrl = new URL(eventSourceUrl, `https://${host}`);
    const queryParams: { [key: string]: string } = {};
    parsedUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const paramBuilder = new ParamBuilder();
    const cookiesToSet = paramBuilder.processRequest(
      host,
      queryParams,
      cookieObj,
      referer,
      xForwardedFor,
      null
    );

    // Attempt to set cookies back to the browser
    try {
      for (const cookie of cookiesToSet) {
        reqCookies.set(cookie.name, cookie.value, { 
          maxAge: cookie.maxAge, 
          domain: cookie.domain,
          path: '/'
        });
      }
    } catch (e) {
      // Ignore cookie set errors (e.g. if called outside of a mutation context)
    }

    const fbp = paramBuilder.getFbp() || undefined;
    const fbc = paramBuilder.getFbc() || undefined;
    const clientIpAddress = paramBuilder.getClientIpAddress() || "";

    // Advanced Matching: Fetch logged-in user and hash email/phone
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let em = undefined;
    let ph = undefined;

    if (user?.email) {
      em = paramBuilder.getNormalizedAndHashedPII(user.email, "email") || undefined;
    }

    if (user?.phone) {
      ph = paramBuilder.getNormalizedAndHashedPII(user.phone, "phone") || undefined;
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
