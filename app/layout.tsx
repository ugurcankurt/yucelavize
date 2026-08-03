import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Figtree, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

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
  metadataBase: new URL('https://yucelavize.com'),
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
              "url": "https://yucelavize.com",
              "logo": "https://yucelavize.com/yucel_avize_logo.webp",
              "image": "https://yucelavize.com/yucel_avize_sefakoy.webp",
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
        {/* Meta Pixel Code */}
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
            fbq('init', '2110321059606201');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2110321059606201&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
