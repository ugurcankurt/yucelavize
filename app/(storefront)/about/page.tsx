import { PageHero } from "@/components/storefront/page-hero";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Truck, Gem, MapPin } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | Yücel Avize",
  description: "Yücel Avize'nin kuruluş hikayesi, vizyonu ve showroom lokasyonları hakkında bilgi alın.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Hakkımızda"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hakkımızda" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">

        {/* Story Section */}
        <section className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-20 md:mb-32">
          <div className="w-full lg:w-1/2 relative aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/yucel_avize_sefakoy.webp"
              alt="Yücel Avize Hikayemiz"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-4">
              HİKAYEMİZ
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              İstanbul'un Kalbinden <br className="hidden lg:block" /> Tüm Türkiye'ye Işık Saçıyoruz
            </h3>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p>
                İstanbul Küçükçekmece ve İSTOÇ Toptancılar Çarşısı'ndaki mağazalarımızla yıllardır aydınlatma sektöründe hizmet veren Yücel Avize olarak, yaşam alanlarınızı sadece aydınlatmakla kalmıyor, onlara ruh ve karakter katan tasarımlar sunuyoruz.
              </p>
              <p>
                Toptan ve perakende satış ağımızla, modern LED avizelerden klasik kristal detaylara kadar binlerce modeli müşterilerimizle buluşturuyoruz. İstanbul'daki mağazalarımızdan edindiğimiz yerel tecrübeyi, kaliteden ödün vermeyen yaklaşımımız ve e-ticaret altyapımızla artık tüm Türkiye'deki ev ve ofislere taşıyoruz.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10 border-t border-border pt-10">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-foreground mb-2">2</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Büyük Showroom</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-foreground mb-2">1000+</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avize Modeli</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="py-16 md:py-24 bg-secondary/50 rounded-3xl px-6 md:px-12 mb-20 md:mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-4">
              NEDEN BİZ?
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Yücel Avize Farkı
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm border border-border">
                <Gem className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Premium Kalite</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kullandığımız kristallerden, metal aksamlara kadar tüm materyaller birinci sınıf kalite standartlarında seçilir.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm border border-border">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">%100 Güvenilirlik</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Satın aldığınız her ürün, uzun yıllar sorunsuz kullanabilmeniz için garanti kapsamımız altındadır.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm border border-border">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Ücretsiz & Güvenli Kargo</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hassas ürünlerinizi özel korumalı ambalajlarla Türkiye'nin her yerine ücretsiz ve güvenle ulaştırıyoruz.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-6 shadow-sm border border-border">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">Müşteri Memnuniyeti</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Satış öncesi ve sonrası profesyonel destek ekibimizle her zaman yanınızdayız.
              </p>
            </div>
          </div>
        </section>

        {/* Showrooms */}
        <section className="mb-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold text-primary mb-4">
              LOKASYONLARIMIZ
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Showroom'larımızı Ziyaret Edin
            </h3>
            <p className="text-muted-foreground">
              Tasarım harikası modellerimizi yakından incelemek ve kahvemizi içmek için sizi mağazalarımıza bekliyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Showroom 1 */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">Sefaköy Showroom</h4>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Kartaltepe, Belediye Cd. No:3, 34295<br />
                  Küçükçekmece / İstanbul
                </p>
                <div className="pt-4 border-t border-border">
                  <a
                    href="https://maps.google.com/?q=Kartaltepe,+Belediye+Cd.+No:3,+34295+Küçükçekmece/İstanbul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-foreground underline underline-offset-4 decoration-border hover:decoration-primary transition-colors"
                  >
                    Google Haritalar'da Aç
                  </a>
                </div>
              </div>
            </div>

            {/* Showroom 2 */}
            <div className="bg-background border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-sm group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-foreground">İstoç Showroom</h4>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Mahmutbey Mah. İstoç Toptancılar Çarşısı 2421. Sok,<br />
                  5. Yol Sk. 4.Ada No:131, 34100 Bağcılar / İstanbul
                </p>
                <div className="pt-4 border-t border-border">
                  <a
                    href="https://maps.google.com/?q=Mahmutbey+Mah.+İstoç+Toptancılar+Çarşısı+2421.+Sok,+5.+Yol+Sk.+4.Ada+No:131,+34100+Bağcılar/İstanbul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-foreground underline underline-offset-4 decoration-border hover:decoration-primary transition-colors"
                  >
                    Google Haritalar'da Aç
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
