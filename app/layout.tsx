import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Figtree, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { TrackingProvider } from "@/components/storefront/tracking-provider";
import { CookieConsent } from "@/components/storefront/cookie-consent";
const ralewayHeading = Raleway({ subsets: ['latin'], variable: '--font-heading' });

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.yucelavize.com'),
  title: "Yücel Avize | Premium Aydınlatma ve Avize Modelleri",
  description:
    "Türkiye'nin premium avize mağazası. En şık, modern ve klasik avize modelleriyle evinizi aydınlatın.",
  keywords:
    "avize, premium avize, lüks aydınlatma, modern avize, klasik avize, yücel avize",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans", figtree.variable, ralewayHeading.variable)}
    >
      <head>
        <link rel="preconnect" href="https://jzqhcopfzejewhqjaisp.supabase.co" />
        <link rel="dns-prefetch" href="https://jzqhcopfzejewhqjaisp.supabase.co" />
      </head>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Yücel Avize",
              "url": "https://www.yucelavize.com",
              "logo": "https://www.yucelavize.com/yucel_avize_logo.webp",
              "image": "https://www.yucelavize.com/yucel_avize_sefakoy.webp",
              "description": "Türkiye'nin premium aydınlatma mağazası. En şık, modern ve klasik avize modelleri.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kartaltepe, Belediye Cd. No:3",
                "addressLocality": "Küçükçekmece",
                "addressRegion": "İstanbul",
                "postalCode": "34295",
                "addressCountry": "TR"
              },
              "email": "info@yucelavize.com",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-543-154-3457",
                "contactType": "customer service",
                "areaServed": "TR",
                "availableLanguage": "Turkish"
              },
              "sameAs": [
                "https://instagram.com/yucelavize",
                "https://facebook.com/yucelavize"
              ]
            }).replace(/</g, '\\u003c')
          }}
        />
        {/* Google Consent Mode V2 Default State */}
        <Script id="consent-mode-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
          `}
        </Script>
        
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BWR4LR7D1T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BWR4LR7D1T', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <TrackingProvider />
        <CookieConsent />
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
