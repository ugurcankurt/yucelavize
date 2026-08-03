import { MapPin, Phone, Mail } from "lucide-react";
import { PageHero } from "@/components/storefront/page-hero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "İletişim | Yücel Avize",
  description: "Yücel Avize ile iletişime geçin. Soru, görüş ve önerileriniz için formumuzu doldurabilirsiniz.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-background min-h-screen pb-16 font-sans">
      <PageHero
        title="İletişim"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />
      <div className="container mx-auto px-4 mt-6 md:mt-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Bize Ulaşın</CardTitle>
                <CardDescription>Soru, görüş ve önerileriniz için aşağıdaki formu doldurabilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">İsim Soyisim</Label>
                      <Input type="text" id="name" placeholder="İsim Soyisim" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input type="email" id="email" placeholder="E-posta" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon Numarası *</Label>
                      <Input type="tel" id="phone" placeholder="Telefon Numarası" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderNo">Sipariş Numarası (Varsa)</Label>
                      <Input type="text" id="orderNo" placeholder="Sipariş Numarası (Varsa)" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea id="message" placeholder="Mesajınız" rows={6} className="resize-y" />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Section */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-xl">İletişim Bilgileri</CardTitle>
                <CardDescription>Yardıma mı ihtiyacınız var? Bize aşağıdaki kanallardan ulaşabilirsiniz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 mt-4">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-foreground mb-1">Adres</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Sefaköy: Kartaltepe, Belediye Cd. No:3, 34295<br />Küçükçekmece / İstanbul
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-foreground mb-1">Telefon</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      +90 543 154 34 57
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-foreground mb-1">E-Posta</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      info@yucelavize.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Maps Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-8 text-center">Mağazalarımız</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-border/50 p-0 gap-0">
              <CardHeader className="bg-secondary/20 border-b border-border/50 py-4">
                <CardTitle className="text-lg text-center">Sefaköy Showroom</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[350px] relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://maps.google.com/maps?q=Yücel%20Avize,%20Kartaltepe,%20Belediye%20Cd.%20No:3,%20Küçükçekmece/İstanbul&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="absolute inset-0 block border-0"
                  ></iframe>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/50 p-0 gap-0">
              <CardHeader className="bg-secondary/20 border-b border-border/50 py-4">
                <CardTitle className="text-lg text-center">İstoç Showroom</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[350px] relative">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://maps.google.com/maps?q=Yücel%20Avize,%20İstoç%20Toptancılar%20Çarşısı,%20Bağcılar/İstanbul&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="absolute inset-0 block border-0"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
