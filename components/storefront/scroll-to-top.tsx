"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Next.js App Router'da aynı layout altındaki geçişlerde scroll pozisyonu korunabiliyor.
    // Sayfa değiştiğinde her zaman en tepeye scroll olmasını garanti altına alıyoruz.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
