import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full bg-background flex flex-col font-sans border-t border-border">
      {/* Top Help Section */}
      <div className="w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">

            {/* WhatsApp */}
            <div className="flex gap-4 items-start md:px-6 first:pl-0 pt-6 md:pt-0">
              <MessageCircle className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <h4 className="text-m font-semibold text-foreground">WhatsApp Destek</h4>
                <p className="text-sm text-muted-foreground mt-1">+90 543 154 34 57</p>
                <a href="https://wa.me/905431543457" className="text-sm font-bold text-foreground mt-3 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors">Mesaj At</a>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex gap-4 items-start md:px-6 pt-6 md:pt-0">
              <Phone className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <h4 className="text-m font-semibold text-foreground">Telefon</h4>
                <p className="text-sm text-muted-foreground mt-1">+90 543 154 34 57</p>
                <a href="tel:+905431543457" className="text-sm font-bold text-foreground mt-3 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors">Hemen Ara</a>
              </div>
            </div>

            {/* E-Posta */}
            <div className="flex gap-4 items-start md:px-6 pt-6 md:pt-0">
              <Mail className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <h4 className="text-m font-semibold text-foreground">E-Posta</h4>
                <p className="text-sm text-muted-foreground mt-1">info@yucelavize.com</p>
                <a href="mailto:info@yucelavize.com" className="text-sm font-bold text-foreground mt-3 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors">Mail Gönder</a>
              </div>
            </div>

            {/* Adres */}
            <div className="flex gap-4 items-start md:px-6 pt-6 md:pt-0">
              <MapPin className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col">
                <h4 className="text-m font-semibold text-foreground">Adres</h4>
                <p className="text-[13px] leading-relaxed text-muted-foreground mt-1 mb-2">
                  <span className="font-semibold text-foreground">Sefaköy:</span> Kartaltepe, Belediye Cd. No:3, 34295 Küçükçekmece/İstanbul
                </p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">İstoç:</span> Mahmutbey Mah. İstoç Toptancılar Çarşısı 2421. Sok, 5. Yol Sk. 4.Ada No:131, 34100 Bağcılar/İstanbul
                </p>
                <a href="https://maps.google.com/?q=Yücel+Avize" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground mt-3 underline underline-offset-4 decoration-border hover:decoration-primary transition-colors">Yol Tarifi</a>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Main Footer Body */}
      <div className="bg-secondary/20">
        <div className="container mx-auto px-4 pt-16 pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Info (Span 3) */}
          <div className="flex flex-col lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/yucel_avize_logo.webp" alt="Yücel Avize Logo" width={62} height={62} className="object-contain" style={{ width: "auto", height: "auto" }} priority />
              <span className="text-xl md:text-[22px] tracking-[0.2em] text-primary uppercase">
                YÜCEL AVİZE
              </span>
            </Link>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Aydınlatma ve dekorasyonu modern, zamansız tasarımlarla bir araya getiren Yücel Avize; yaşam alanlarına estetik, denge ve karakter katan çözümler sunar.
            </p>
            <Separator className="my-4 bg-primary" />
            <Link href="tel:+905431543457">
              <p className="text-sm font-bold text-foreground">
                +90 543 154 34 57
              </p>
            </Link>
          </div>

          {/* Kurumsal (Span 2) */}
          <div className="flex flex-col lg:col-span-2 lg:pl-4">
            <h4 className="text-[16px] font-semibold text-foreground mb-6">
              Kurumsal
            </h4>
            <ul className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition">Hakkımızda</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition">İletişim</Link></li>
              <li><Link href="/refund-policy" className="hover:text-foreground transition">Koşulsuz İade ve Değişim</Link></li>
              <li><Link href="#" className="hover:text-foreground transition">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          {/* Politikalar (Span 2) */}
          <div className="flex flex-col lg:col-span-2">
            <h4 className="text-[16px] font-semibold text-foreground mb-6">
              Politikalar
            </h4>
            <ul className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-foreground transition">Gizlilik Politikası</Link></li>
              <li><Link href="/refund-policy" className="hover:text-foreground transition">İade & Değişim</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-foreground transition">Kargo Politikası</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-foreground transition">Koşullar ve Şartlar</Link></li>
              <li><Link href="/legal-notice" className="hover:text-foreground transition">Yasal Bilgilendirme (KVKK)</Link></li>
            </ul>
          </div>

          {/* Newsletter (Span 5) */}
          <div className="flex flex-col lg:col-span-5 lg:pl-10">
            <h4 className="text-xl md:text-[22px] font-normal mb-4">
              Bültene Abone Olun
            </h4>
            <p className="text-[13px] text-muted-foreground mb-6">
              Yeniliklerden ve indirimlerden haberdar olmak için:
            </p>
            <form className="flex w-full items-center gap-2 mb-4">
              <Input
                type="email"
                placeholder="eposta@adresiniz.com"
                className="flex-1 rounded-full bg-background/50 px-5 shadow-none focus-visible:ring-1 border-border/60"
                required
              />
              <Button
                type="submit"
                className="rounded-full px-8 text-[13px]"
              >
                Abone Ol
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
              Abone olarak <Link href="/terms-of-service" className="hover:text-foreground transition underline underline-offset-2">Hizmet Şartları</Link> ve <Link href="/privacy-policy" className="hover:text-foreground transition underline underline-offset-2">Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
            </p>
          </div>

        </div>

        <Separator className="my-6 bg-border/40" />

        {/* Bottom Social & Copyright spacing */}
        <div className="container mx-auto px-4 pb-6 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Yücel Avize - Tüm Hakları Saklıdır
          </p>
          <a href="https://facebook.com/yucelavize" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-all duration-300 bg-background">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
