"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function TrackingProvider() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("yucelavize-cookie-consent");
      setConsentGranted(consent === "granted");
    };

    // Check on mount
    checkConsent();

    // Listen for changes
    window.addEventListener("cookie-consent-changed", checkConsent);
    return () => {
      window.removeEventListener("cookie-consent-changed", checkConsent);
    };
  }, []);

  if (!consentGranted) {
    return null; // Do not render tracking scripts if consent is not granted
  }

  const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>      {/* Meta Pixel */}
      {PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
