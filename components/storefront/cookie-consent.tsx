"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("yucelavize-cookie-consent");
    if (!consent) {
      setShow(true);
    } else if (consent === "granted" && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
  }, []);

  const accept = () => {
    localStorage.setItem("yucelavize-cookie-consent", "granted");
    setShow(false);
    
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const decline = () => {
    localStorage.setItem("yucelavize-cookie-consent", "denied");
    setShow(false);
    
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
    
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
      <div className="mx-auto max-w-5xl bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full hidden md:block">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">
              Çerez Tercihlerinizi Önemsiyoruz
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Size daha iyi bir alışveriş deneyimi sunabilmek, site trafiğimizi analiz etmek ve 
              size özel reklamlar gösterebilmek amacıyla çerezler (cookies) kullanıyoruz. 
              Detaylı bilgi için KVKK aydınlatma metnini inceleyebilirsiniz.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Button variant="outline" className="w-full sm:w-auto" onClick={decline}>
            Reddet
          </Button>
          <Button className="w-full sm:w-auto" onClick={accept}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
