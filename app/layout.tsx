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
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
