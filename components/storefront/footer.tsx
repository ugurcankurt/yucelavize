import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
export function Footer() {
  return (
    <footer className="w-full bg-background flex flex-col font-sans border-t border-border">
      {" "}
      {/* Top Help Section */}{" "}
      <div className="w-full bg-secondary">
        {" "}
        <div className="container mx-auto px-4 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {" "}
          <div className="flex flex-col text-center md:text-left">
            {" "}
            <h3 className="text-xl font-bold text-foreground mb-1">
              Her zaman size yardıma hazırız
            </h3>{" "}
            <p className="text-sm text-muted-foreground font-medium">
              Bize ulaşmak için destek kanallarımızı kullanabilirsiniz.
            </p>{" "}
          </div>{" "}
          <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-16">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background text-primary">
                {" "}
                <Mail className="w-5 h-5" />{" "}
              </div>{" "}
              <div className="flex flex-col">
                {" "}
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                  Email Destek
                </span>{" "}
                <span className="text-sm font-semibold text-foreground">
                  destek@yucelavize.com
                </span>{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background text-primary">
                {" "}
                <Phone className="w-5 h-5" />{" "}
              </div>{" "}
              <div className="flex flex-col">
                {" "}
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                  Müşteri Hizmetleri
                </span>{" "}
                <span className="text-sm font-semibold text-foreground">
                  +90 850 123 45 67
                </span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Footer Links */}{" "}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {" "}
        {/* Logo & Socials */}{" "}
        <div className="lg:col-span-2 flex flex-col">
          {" "}
          <Link href="/" className="relative flex items-center justify-start flex-shrink-0 w-36 h-12 md:w-44 md:h-14 mb-6">
            <Image src="/yucel_avize_logo.png" alt="Yücel Avize Logo" fill sizes="(max-width: 768px) 150px, 200px" className="object-contain object-left z-0" />
            <div className="absolute inset-0 flex items-center justify-start pl-2 text-[24px] md:text-[28px] font-black tracking-tighter leading-none">
              <div className="relative">
                <span aria-hidden="true" className="absolute inset-0 z-0 text-white [-webkit-text-stroke:6px_#ffffff] pointer-events-none select-none">
                  yücelavize
                </span>
                <span className="relative z-10 text-primary">
                  yücel<span className="text-foreground">avize</span>
                </span>
              </div>
            </div>
          </Link>{" "}
          <div className="flex items-center gap-3 mb-8">
            {" "}
            <button className="h-10 w-[120px] bg-background rounded-lg text-background flex flex-col items-center justify-center hover:bg-foreground transition">
              {" "}
              <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                GET IT ON
              </span>{" "}
              <span className="text-sm font-bold">Google Play</span>{" "}
            </button>{" "}
            <button className="h-10 w-[120px] bg-background rounded-lg text-background flex flex-col items-center justify-center hover:bg-foreground transition">
              {" "}
              <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                Download on the
              </span>{" "}
              <span className="text-sm font-bold">App Store</span>{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex items-center gap-4 text-muted-foreground">
            {" "}
            <Link href="#" className="hover:text-primary transition-colors">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>{" "}
            </Link>{" "}
            <Link href="#" className="hover:text-primary transition-colors">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>{" "}
            </Link>{" "}
            <Link href="#" className="hover:text-primary transition-colors">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
        {/* Menu */}{" "}
        <div className="flex flex-col">
          {" "}
          <h4 className="text-base font-bold text-foreground mb-6">
            Menü
          </h4>{" "}
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            {" "}
            <li>
              <Link href="/" className="hover:text-primary transition">
                Ana Sayfa
              </Link>
            </li>{" "}
            <li>
              <Link href="/products" className="hover:text-primary transition">
                Tüm Ürünler
              </Link>
            </li>{" "}
            <li>
              <Link href="/about" className="hover:text-primary transition">
                Hakkımızda
              </Link>
            </li>{" "}
            <li>
              <Link href="/blog" className="hover:text-primary transition">
                Blog
              </Link>
            </li>{" "}
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                İletişim
              </Link>
            </li>{" "}
          </ul>{" "}
        </div>{" "}
        {/* Policy */}{" "}
        <div className="flex flex-col">
          {" "}
          <h4 className="text-base font-bold text-foreground mb-6">
            Politikalar
          </h4>{" "}
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            {" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Mesafeli Satış Sözleşmesi
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Gizlilik Politikası
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                İade & Değişim
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                KVKK Aydınlatma Metni
              </Link>
            </li>{" "}
          </ul>{" "}
        </div>{" "}
        {/* Links */}{" "}
        <div className="flex flex-col">
          {" "}
          <h4 className="text-base font-bold text-foreground mb-6">
            Faydalı Linkler
          </h4>{" "}
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted-foreground">
            {" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Kargo Takip
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Sıkça Sorulan Sorular
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Bayilik Başvurusu
              </Link>
            </li>{" "}
            <li>
              <Link href="#" className="hover:text-primary transition">
                Bize Katılın
              </Link>
            </li>{" "}
          </ul>{" "}
        </div>{" "}
      </div>{" "}
      {/* Copyright */}{" "}
      <div className="border-t border-border">
        {" "}
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {" "}
          <p className="text-xs font-medium text-muted-foreground">
            © 2026, Yücel Avize. All rights reserved.
          </p>{" "}
          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            {" "}
            <Link href="#" className="hover:text-foreground transition">
              Terms
            </Link>{" "}
            <Link href="#" className="hover:text-foreground transition">
              Cookies
            </Link>{" "}
            <Link href="#" className="hover:text-foreground transition">
              Privacy Policy
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
