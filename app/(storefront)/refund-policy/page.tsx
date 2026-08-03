import { PageHero } from "@/components/storefront/page-hero";

export const metadata = {
  title: "İade ve Değişim Politikası | Yücel Avize",
  description: "Yücel Avize para iade, değişim ve iade koşulları politikası.",
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Para İade Politikası"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İade Politikası" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">
        <div className="prose prose-slate prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>

          <p>
            14 günlük iade politikamız olduğundan ürününüzü teslim aldıktan sonra iade talebinde bulunmak için 14 gününüz vardır.
          </p>
          <p>
            İade edebilmeniz için, ürününüzün size ulaştığı zamanki durumunda, yani tekrar kullanılabilir veya kullanılmamış olması, etiketli ve orijinal ambalajında olması gerekir. Ayrıca, makbuza veya satın alma belgesine sahip olmanız gerekir.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">İade Sürecini Başlatma</h2>
          <p>
            Bir iade başlatmak için <strong>info@yucelavize.com</strong> adresinden bizimle iletişime geçebilirsiniz. Lütfen iadelerin şu adrese gönderilmesi gerektiğini unutmayın:
          </p>

          <div className="bg-secondary p-6 rounded-xl my-6 border border-border">
            <p className="m-0 text-foreground font-medium"><strong>Alıcı:</strong> YÜCEL AVİZE</p>
            <p className="m-0 mt-2 text-foreground font-medium"><strong>Adres:</strong> Kartaltepe, Belediye Cd. No:3, 34295 Küçükçekmece / İstanbul</p>
            <p className="m-0 mt-2 text-foreground font-medium"><strong>Telefon:</strong> +90 543 154 34 57</p>
            <p className="m-0 mt-2 text-foreground font-medium"><strong>MNG Kargo İade Kodu:</strong> (Lütfen müşteri temsilcimizden talep ediniz)</p>
          </div>

          <p>
            İadeniz kabul edilirse size bir iade kargo etiketi ve paketinizi nasıl ve nereye göndereceğinize dair talimatlar göndeririz. İade talebinde bulunulmadan tarafımıza gönderilen ürünler kabul edilmeyecektir.
          </p>
          <p>
            İadelerle ilgili tüm sorularınız için <strong>info@yucelavize.com</strong> adresinden bizimle her zaman iletişime geçebilirsiniz.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Hasarlar ve Sorunlar</h2>
          <p>
            Lütfen siparişinizi teslim aldığınızda inceleyin ve ürün kusurluysa, hasarlıysa veya elinize yanlış bir ürün ulaştıysa hemen bizimle iletişime geçin. Böylece sorunu değerlendirip düzeltebiliriz.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">İstisnalar / İade Edilemeyen Ürünler</h2>
          <p>
            Bozulabilir ürünler (ör. yiyecek, çiçek veya bitki), özel ürünler (ör. özel siparişler veya kişiselleştirilmiş ürünler) ve kişisel bakım ürünleri (ör. güzellik ürünleri) gibi bazı ürün türleri iade edilemez. Ayrıca tehlikeli maddeler, yanıcı sıvılar veya gazlar için iade kabul etmiyoruz. Belirli bir ürünle ilgili sorularınız veya endişeleriniz olması halinde lütfen bizimle iletişime geçin.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Değişimler</h2>
          <p>
            İstediğiniz ürüne ulaşmanın en hızlı yolu, sahip olduğunuz ürünü iade etmek ve iade kabul edildikten sonra yeni ürün için ayrı bir satın alma işlemi yapmaktır.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Avrupa Birliği'ndeki 14 Günlük Cayma Süresi</h2>
          <p>
            Yukarıda belirtilenlere karşın, ürünün Avrupa Birliği'ne gönderilmesi durumunda siparişinizi herhangi bir nedenle ve herhangi bir gerekçe göstermeksizin 14 gün içinde iptal veya iade etme hakkınız vardır. Yukarıda da belirtildiği gibi, ürününüzün size ulaştığı zamanki durumunda, yani giyilmemiş veya kullanılmamış olması, etiketli ve orijinal ambalajında olması gerekir. Ayrıca, makbuza veya satın alma belgesine sahip olmanız gerekir.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Para İadeleri</h2>
          <p>
            İadenizi aldıktan ve inceledikten sonra sizi bilgilendiririz ve para iadesi talebinizin onaylanıp onaylanmadığını size bildiririz. Talebinizin kabul edilmesi halinde 10 iş günü içerisinde, orijinal ödeme yönteminize otomatik olarak para iadesi yapılır. Bankanızın veya kredi kartı şirketinizin para iadesini işlemesinin ve göndermesinin de biraz zaman alabileceğini lütfen unutmayın.
          </p>
          <p>
            İadenizi onaylamamızın üzerinden 15 iş gününden fazla zaman geçtiyse lütfen <strong>info@yucelavize.com</strong> adresinden bizimle iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}
