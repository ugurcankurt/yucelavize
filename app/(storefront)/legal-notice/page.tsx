import { PageHero } from "@/components/storefront/page-hero";

export const metadata = {
  title: "Yasal Bildirim ve KVKK Aydınlatma Metni | Yücel Avize",
  description: "Yücel Avize 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
};

export default function LegalNoticePage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Yasal Bildirim (KVKK)"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Yasal Bildirim" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">
        <div className="prose prose-slate prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Bu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verilerinizin işlenmesine ilişkin olarak sizleri bilgilendirmek amacıyla hazırlanmıştır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">1. Veri Sorumlusu</h2>
          <p>
            KVKK kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri yer alan şirket tarafından işlenmektedir:
          </p>
          <div className="bg-secondary p-6 rounded-xl my-6 border border-border">
            <h4 className="font-bold text-foreground mb-4">Veri Sorumlusu: YÜCEL AVİZE</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="m-0"><strong>Marka:</strong> Yücel Avize</p>
              <p className="m-0"><strong>Adres:</strong> Kartaltepe, Belediye Cd. No:3, 34295 Küçükçekmece / İstanbul</p>
              <p className="m-0"><strong>E-posta:</strong> <a href="mailto:info@yucelavize.com" className="hover:text-primary transition">info@yucelavize.com</a></p>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">2. İşlenen Kişisel Veriler</h2>
          <p>Aşağıdaki kişisel verileriniz, KVKK’ya uygun olarak işlenebilmektedir:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Kimlik bilgileri (ad, soyad)</li>
            <li>İletişim bilgileri (telefon numarası, e-posta adresi, adres)</li>
            <li>Müşteri işlem bilgileri (sipariş, fatura, ödeme, iade bilgileri)</li>
            <li>Hukuki işlem ve işlem güvenliği bilgileri</li>
            <li>Talep ve şikâyet kayıtları</li>
            <li>İnternet sitesi kullanım bilgileri (çerezler aracılığıyla)</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Ürün ve hizmet satış süreçlerinin yürütülmesi</li>
            <li>Sipariş, teslimat, iade ve satış sonrası destek işlemlerinin gerçekleştirilmesi</li>
            <li>Faturalandırma ve muhasebe süreçlerinin yürütülmesi</li>
            <li>Müşteri ilişkileri yönetimi ve taleplerin yanıtlanması</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi</li>
            <li>Bilgi güvenliği ve işlem güvenliğinin sağlanması</li>
            <li>Yetkili kurum ve kuruluşlara mevzuat kapsamında bilgi verilmesi</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">4. Kişisel Verilerin Aktarılması</h2>
          <p>Kişisel verileriniz, KVKK’nın 8. ve 9. maddelerine uygun olarak;</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Kargo firmalarına (teslimat süreçleri için),</li>
            <li>Bankalara ve ödeme kuruluşlarına (ödeme işlemleri için),</li>
            <li>Mali müşavirlik ve muhasebe hizmeti alınan kişi/kuruluşlara,</li>
            <li>Yetkili kamu kurum ve kuruluşlarına</li>
          </ul>
          <p>yalnızca gerekli olduğu ölçüde aktarılabilir.</p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
          <p>Kişisel verileriniz;</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>İnternet sitemiz,</li>
            <li>Sipariş ve iletişim formları,</li>
            <li>E-posta, telefon ve mağaza içi işlemler</li>
          </ul>
          <p>aracılığıyla elektronik veya fiziki ortamda toplanmaktadır.</p>
          <p>Verileriniz;</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması,</li>
            <li>Hukuki yükümlülüklerin yerine getirilmesi,</li>
            <li>Meşru menfaatlerimiz,</li>
            <li>Açık rızanızın bulunması</li>
          </ul>
          <p>hukuki sebeplerine dayanılarak işlenmektedir.</p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">6. KVKK Kapsamındaki Haklarınız</h2>
          <p>KVKK’nın 11. maddesi uyarınca veri sahibi olarak;</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,</li>
            <li>KVKK’ya uygun olarak silinmesini veya yok edilmesini isteme,</li>
            <li>Bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p>haklarına sahipsiniz.</p>
          <p>
            Bu haklarınıza ilişkin taleplerinizi <strong>info@yucelavize.com</strong> adresi üzerinden yazılı olarak iletebilirsiniz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">7. Yürürlük</h2>
          <p>
            İşbu KVKK Aydınlatma Metni, internet sitemizde yayımlandığı tarih itibarıyla yürürlüğe girer.
          </p>
        </div>
      </div>
    </div>
  );
}
