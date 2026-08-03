import { PageHero } from "@/components/storefront/page-hero";

export const metadata = {
  title: "Kargo ve Teslimat Politikası | Yücel Avize",
  description: "Yücel Avize kargo, teslimat ve nakliye koşulları politikası.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Kargo Politikası"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Kargo Politikası" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">
        <div className="prose prose-slate prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>

          <p>
            Bu sayfa, <strong>Yücel Avize</strong> markası üzerinden gerçekleştirilen satışlarda teslimat ve iade süreçlerine ilişkin şartları düzenler. Tüm işlemler, YÜCEL AVİZE tarafından yürütülmektedir.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. Teslimat Koşulları</h2>
          <p>Siparişler, ödeme onayının ardından stok durumuna bağlı olarak 1–5 iş günü içerisinde kargoya teslim edilir.</p>
          <p>Teslimatlar, anlaşmalı kargo firmaları aracılığıyla Türkiye sınırları içerisinde yapılmaktadır.</p>
          <p>Kargo firması kaynaklı gecikmelerden firmamız sorumlu tutulamaz; ancak sürecin takibi tarafımızca sağlanır.</p>
          <p>Teslimat sırasında paketin hasarlı olması durumunda, kargo görevlisine hasar tespit tutanağı tutturulması ve ürünün teslim alınmaması gerekmektedir.</p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. Cayma Hakkı ve İade Koşulları</h2>
          <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca;</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Tüketici, ürünü teslim aldığı tarihten itibaren 14 gün içerisinde, herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir.</li>
            <li>Cayma hakkı kapsamında yapılan iadeler ücretsizdir.</li>
            <li>İade edilecek ürünlerin; kullanılmamış, montajı yapılmamış, orijinal ambalajı bozulmamış ve tekrar satılabilir durumda olması gerekmektedir.</li>
            <li>Ürünle birlikte gönderilen tüm aksesuarlar, montaj parçaları ve faturanın iade edilmesi zorunludur.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. İade Süreci</h2>
          <p>İade işlemi aşağıdaki adımlar izlenerek gerçekleştirilir:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>İade talebinizi, web sitemizde yer alan iletişim kanalları üzerinden tarafımıza bildiriniz.</li>
            <li>Ürünü, anlaşmalı kargo firmamız ile tarafımızdan alacağınız iade kodunu kullanarak ücretsiz şekilde gönderebilirsiniz.</li>
            <li>Kargo firması tarafından tarafımıza ulaştırılan ürün, iade koşullarına uygunluk açısından kontrol edilir.</li>
            <li>İade onayının ardından, ürün bedeli en geç 14 gün içerisinde ödeme yapılan yöntemle iade edilir.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. Cayma Hakkı Kapsamı Dışında Kalan Ürünler</h2>
          <p>Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Tüketicinin isteği doğrultusunda özel olarak üretilen veya kişiye özel hale getirilen ürünler</li>
            <li>Montajı yapılmış, kullanılmış veya tekrar satılabilirliğini kaybetmiş ürünler</li>
            <li>Elektrik bağlantısı yapılmış ve kullanılmış aydınlatma ürünleri</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">5. İade ve Değişim Hakkında Genel Hükümler</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>İade işlemlerinde, fatura ibrazı zorunludur.</li>
            <li>Ürün bedeli dışında oluşabilecek ek masraflar (kurulum, montaj vb.) iade kapsamına dahil değildir.</li>
            <li>Firmamız, mevzuata uygun şekilde cayma ve iade süreçlerini şeffaf ve hızlı biçimde yürütmeyi taahhüt eder.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">6. İletişim</h2>
          <p>
            Teslimat ve iade süreçleriyle ilgili her türlü soru ve talebiniz için bizimle iletişime geçebilirsiniz.
          </p>

          <div className="bg-secondary p-6 rounded-xl mt-6 border border-border">
            <h4 className="font-bold text-foreground mb-4">YÜCEL AVİZE</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="m-0"><strong>E-Posta:</strong> <a href="mailto:info@yucelavize.com" className="hover:text-primary transition">info@yucelavize.com</a></p>
              <p className="m-0"><strong>Telefon / WhatsApp:</strong> <a href="tel:+905431543457" className="hover:text-primary transition">+90 543 154 34 57</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
