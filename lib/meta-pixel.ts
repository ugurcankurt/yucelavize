import { trackCapiEvent } from "@/app/actions/capi";

export const trackMetaEvent = (eventName: string, data: any = {}) => {
  if (typeof window === "undefined") return;

  const eventId = crypto.randomUUID();

  if ((window as any).fbq) {
    (window as any).fbq('track', eventName, data, { eventID: eventId });
  }

  // Fire CAPI event in the background
  trackCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: window.location.href,
    customData: data,
  }).catch((err) => console.error("CAPI dispatch failed", err));
};
