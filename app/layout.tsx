import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Figtree, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const ralewayHeading = Raleway({subsets:['latin'],variable:'--font-heading'});

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

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
    "Türkiye'nin lüks ve premium avize mağazası. En şık, modern ve klasik avize modelleriyle evinizi aydınlatın.",
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
              "logo": "https://yucelavize.com/logo.png",
              "image": "https://yucelavize.com/og-default.jpg",
              "description": "Türkiye'nin lüks ve premium avize mağazası. En şık, modern ve klasik avize modelleri.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-555-000-0000",
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
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
