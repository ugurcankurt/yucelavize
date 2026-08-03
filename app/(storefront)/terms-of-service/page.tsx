import { PageHero } from "@/components/storefront/page-hero";

export const metadata = {
  title: "Hizmet Şartları | Yücel Avize",
  description: "Yücel Avize web sitesi hizmet şartları ve kullanım koşulları.",
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Hizmet Şartları"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Hizmet Şartları" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">
        <div className="prose prose-slate prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none">
          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">GENEL BAKIŞ</h2>
          <p>
            yucelavize.com mağazasına hoş geldiniz! "Biz", "bize" ve "bizim" terimleri, yucelavize.com mağazasını ifade eder. yucelavize.com, siz müşterilere kişisel bir alışveriş deneyimi ("Hizmetler") sunmak amacıyla tüm ilgili bilgiler, içerikler, özellikler, araçlar, ürünler ve hizmetler de dahil olmak üzere bu mağazayı ve web sitesini işletmektedir.
          </p>
          <p>
            Aşağıdaki hüküm ve koşullar ile burada atıfta bulunulan tüm politikalar (topluca "Hizmet Şartları" veya "Şartlar"), Hizmetler'i kullandığınızda sahip olduğunuz hakları ve yükümlülükleri açıklar.
          </p>
          <p>
            İşbu Hizmet Şartları, yasal haklarınıza dair önemli bilgiler içerip garanti feragatleri ve sorumluluk retleri gibi konuları kapsadığı için dikkatlice okunmalıdır.
          </p>
          <p>
            Hizmetler'imizi ziyaret ederek, kullanarak veya Hizmetlerimiz ile etkileşime geçerek, işbu Hizmet Şartları'na ve <a href="/privacy-policy">Gizlilik Politikamıza</a> bağlı kalmayı kabul etmiş olursunuz. Bu Hizmet Şartları'nı veya Gizlilik Politikası'nı kabul etmiyorsanız, Hizmetler'imizi kullanmamalı ya da Hizmetler'imize erişmemelisiniz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 1 - ERİŞİM VE HESAP</h2>
          <p>
            İşbu Hizmet Şartları'nı kabul ederek, ikamet ettiğiniz il veya eyalette reşit sayılan yaşta olduğunuzu ve size ait olan, satın aldığınız ya da yönettiğiniz cihazlar üzerinden reşit olmayan bakmakla yükümlü olduğunuz kişilerin Hizmetler'i kullanmalarına izin vermemiz için bize onay verdiğinizi beyan etmiş olursunuz.
          </p>
          <p>
            Online mağazalarımıza erişmeniz veya göz atmanız ya da sunduğumuz ürün veya hizmetlerden herhangi birini satın almanız da dahil olmak üzere, Hizmetler'i kullanmak için e-posta adresiniz, fatura, ödeme ve kargo bilgileri gibi belirli bilgileri sağlamanız istenebilir. Mağazalarımızda sağladığınız tüm bilgilerin doğru, güncel ve eksiksiz olduğunu ve bu bilgileri sağlamak için gerekli tüm haklara sahip olduğunuzu beyan ve garanti edersiniz.
          </p>
          <p>
            Hesap kimlik bilgilerinizin güvenliğini sağlamaktan ve hesabınızdaki tüm faaliyetlerden tek başınıza sorumlu olduğunuzu kabul edersiniz. Hesabınızı başka bir kişiye devredemez, satamaz, tahsis edemez veya lisanslayamazsınız.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 2 - ÜRÜNLERİMİZ</h2>
          <p>
            Online mağazalarımızda ürünlerimizi ve hizmetlerimizi doğru şekilde temsil etmek için her türlü çabayı gösteririz. Ancak, mağazaya erişmek için kullandığınız cihaz türü ile cihazınızın ayarları ve yapılandırması nedeniyle renkler veya ürün görünümü, ekranınızda görünenden farklı olabilir.
          </p>
          <p>
            Satın aldığınız herhangi bir ürün veya hizmetin görünümünün ya da kalitesinin beklentilerinizi karşılayacağını ya da online mağazalarımızda gösterildiği veya sunulduğu gibi olacağını garanti etmeyiz.
          </p>
          <p>
            Ürün açıklamalarının tamamı, tarafımızca önceden bildirimde bulunulmaksızın ve tamamen kendi takdirimize bağlı olarak herhangi bir zamanda değişikliğe tabidir. Herhangi bir ürünü herhangi bir zamanda satıştan kaldırma hakkımızı saklı tutarız ve sunduğumuz ürünlerin miktarlarını, kişi, coğrafi bölge veya yargı bölgesine göre durum bazında sınırlayabiliriz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 3 - SİPARİŞLER</h2>
          <p>
            Sipariş verdiğinizde, bir satın alım teklifi yapmış olursunuz. yucelavize.com, takdirine bağlı olarak herhangi bir nedenle siparişinizi kabul etme veya reddetme hakkını saklı tutar. Siparişiniz, yucelavize.com tarafından kabul onayı verilinceye kadar kabul edilmiş sayılmaz. Siparişinizin kabul edilebilmesi için ödemenizi almamız ve işlememiz gerekmektedir. Lütfen siparişinizi göndermeden önce dikkatlice inceleyiniz. Sipariş kabul edildikten sonra yucelavize.com iptal taleplerini karşılayamayabilir. Siparişi kabul etmememiz, değiştirmemiz veya iptal etmemiz durumunda, sipariş verilirken sağlanan e-posta, fatura adresi ve/veya telefon numarası aracılığıyla sizi bilgilendirmeye çalışırız.
          </p>
          <p>
            Satın alımlarınız yalnızca <a href="/refund-policy">İade Politikamız</a> kapsamında iade veya değişime tabidir.
          </p>
          <p>
            Satın alımlarınızın kişisel veya hane kullanımınız için olduğunu, ticari amaçlı yeniden satış ya da ihracat için olmadığını beyan ve garanti edersiniz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 4 - FİYATLAR VE FATURALANDIRMA</h2>
          <p>
            Fiyatlar, indirimler ve promosyonlar önceden bildirimde bulunmaksızın değiştirilebilir. Bir ürün veya hizmet için tahsil edilen ücret, siparişin verildiği andaki geçerli fiyattan olacaktır ve siparişinizin onay e-postanızda belirtilecektir. Aksi açıkça belirtilmediği sürece, belirtilen fiyatlara vergi, kargo, işlem, gümrük veya ithalat ücretleri dahil değildir.
          </p>
          <p>
            Online mağazalarımızda belirtilen fiyatlar, fiziksel mağazalarda veya üçüncü taraflarca işletilen online ya da diğer mağazalarda sunulan fiyatlardan farklı olabilir. Hizmetler üzerinde zaman zaman fiyatları etkileyebilecek ve işbu Şartlar'dan ayrı hüküm ve koşullar kapsamında yer alan promosyonlar sunabiliriz.
          </p>
          <p>
            Mağazalarımızdan yaptığınız tüm satın alımlar için güncel, eksiksiz ve doğru satın alım, ödeme ve hesap bilgilerini sağlamayı kabul edersiniz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 5 - KARGO VE TESLİMAT</h2>
          <p>
            Kargo ve teslimat gecikmelerinden sorumlu tutulamayız. Tüm teslimat süreleri yalnızca tahmini olup garanti edilmez. Kargo şirketlerinden, gümrük işlemlerinden veya kontrolümüz dışındaki durumlardan kaynaklanan gecikmelerden sorumlu tutulamayız. Ürünleri kargo şirketine aktardığımızda, mülkiyet ve kayıp riski size geçer.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 6 - FİKRİ MÜLKİYET</h2>
          <p>
            Tüm ticari markalar, markalar, metinler, görüntüler, görseller, grafikler, ürün değerlendirmeleri, video ve sesler dahil ancak bunlarla sınırlı olmamak üzere Hizmetler'imiz ve bu Hizmetler'imizin tasarımı, seçimi ve düzenlemesi, yucelavize.com mağazasına, bağlı kuruluşlarına veya lisans verenlerine aittir.
          </p>
          <p>
            İşbu Şartlar, Hizmetler'i yalnızca kişisel ve ticari olmayan amaçlarınız için kullanmanıza izin verir. Hizmetler'de yer alan hiçbir materyali, önceden yazılı iznimiz olmadan çoğaltamaz, dağıtamaz, değiştiremez veya kullanamazsınız.
          </p>
          <p>
            yucelavize.com mülkiyetindeki adlar, logolar, ürün ve hizmet adları, tasarımlar ve sloganlar; yucelavize.com veya onun bağlı kuruluşlarının ya da lisans verenlerinin ticari markalarıdır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 7 - İSTEĞE BAĞLI ARAÇLAR</h2>
          <p>
            Hizmetler'in bir parçası olarak üçüncü taraflarca sunulan müşteri araçlarına erişiminiz sağlanabilir ve bu araçlar tarafımızca izlenmemekte, kontrol edilmemekte veya girdisi bulunmamaktadır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 8 - ÜÇÜNCÜ TARAF BAĞLANTILAR</h2>
          <p>
            Hizmetler, üçüncü taraflarca sağlanan veya işletilen web sitelerine yönelik materyaller ve köprüler içerebilir. Erişmeyi seçtiğiniz herhangi bir üçüncü taraf materyalin veya web sitesinin içeriğini ya da doğruluğunu incelemekten veya değerlendirmekten sorumlu tutulamayız.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 9 - HİZMET SAĞLAYICILARIMIZ İLE İLİŞKİ</h2>
          <p>
            yucelavize.com, size Hizmetler'i sunmamızı sağlayan altyapı hizmet sağlayıcıları tarafından desteklenmektedir. Ancak, mağazamızda yaptığınız tüm satış ve satın alımlar doğrudan yucelavize.com ile gerçekleştirilir.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 10 - GİZLİLİK POLİTİKASI</h2>
          <p>
            Hizmetler aracılığıyla topladığımız tüm kişisel bilgiler, <a href="/privacy-policy">Gizlilik Politikamıza</a> tabidir. Hizmetler'i kullanarak, bu gizlilik politikasını okuduğunuzu kabul etmiş olursunuz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 11 - GERİ BİLDİRİM</h2>
          <p>
            Herhangi bir fikir, öneri, geri bildirim, inceleme veya diğer içeriği ("Geri Bildirim") gönderirseniz, bize bu Geri Bildirimi ticari kullanım da dahil olmak üzere herhangi bir amaçla kullanma hakkını vermiş olursunuz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 12 - HATALAR, TUTARSIZLIKLAR VE EKSİKLİKLER</h2>
          <p>
            Zaman zaman Hizmetler'de, ürün açıklamaları, fiyatlandırma, promosyonlar, teklifler, ürün kargo ücretleri, nakil süreleri ve stok durumu ile ilgili olabilecek yazım hataları, tutarsızlıklar veya eksiklikler içeren bilgiler bulunabilir. Herhangi bir hatayı düzeltme hakkını saklı tutarız.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 13 - YASAKLI KULLANIMLAR</h2>
          <p>
            Hizmetler'e yalnızca yasal amaçlarla erişebilir ve kullanabilirsiniz. Herhangi bir yasa dışı, kötü niyetli veya ihlal edici kullanım yasaktır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 14 - FESİH</h2>
          <p>
            İşbu anlaşmayı veya Hizmetler'e erişiminizi, tamamen kendi takdirimize bağlı olarak, bildirimde bulunmaksızın herhangi bir zamanda feshedebiliriz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 15 - GARANTİLERİN REDDİ</h2>
          <p>
            Hizmetler üzerinde veya aracılığıyla sunulan bilgiler yalnızca genel bilgilendirme amacıyla sunulmaktadır. Hizmetleri "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU ŞEKİLDE" sunmaktayız.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 16 - SORUMLULUĞUN SINIRLANDIRILMASI</h2>
          <p>
            Kanunen izin verilen en geniş kapsamda, yucelavize.com herhangi bir doğrudan, dolaylı, arızi veya netice kabilinden doğan zarardan sorumlu tutulamaz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 17 - TAZMİNAT</h2>
          <p>
            İşbu Hizmet Şartları'nı ihlal etmenizden kaynaklanan her türlü kayıp veya zararı tazmin etmeyi kabul edersiniz.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 18 - UYGULANACAK HUKUK</h2>
          <p>
            İşbu Hizmet Şartları, yucelavize.com genel merkezinin bulunduğu Türkiye Cumhuriyeti kanunlarına tabidir ve bunlara uygun olarak yorumlanır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 19 - HİZMET ŞARTLARINDA DEĞİŞİKLİKLER</h2>
          <p>
            Hizmet Şartları'nın en güncel sürümünü bu sayfada dilediğiniz zaman inceleyebilirsiniz. Bu şartları dilediğimiz zaman değiştirme hakkımız saklıdır.
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-foreground">BÖLÜM 20 - İLETİŞİM BİLGİLERİ</h2>
          <p>
            Hizmet Şartları ile ilgili sorularınızı bize <strong>info@yucelavize.com</strong> adresinden iletebilirsiniz.
          </p>

          <div className="bg-secondary p-6 rounded-xl mt-6 border border-border">
            <h4 className="font-bold text-foreground mb-4">YÜCEL AVİZE</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="m-0"><strong>Marka:</strong> Yücel Avize</p>
              <p className="m-0"><strong>Telefon / WhatsApp:</strong> <a href="tel:+905431543457" className="hover:text-primary transition">+90 543 154 34 57</a></p>
              <p className="m-0"><strong>E-posta:</strong> <a href="mailto:info@yucelavize.com" className="hover:text-primary transition">info@yucelavize.com</a></p>
              <p className="m-0 mt-4">
                <strong>Adres:</strong><br />
                Kartaltepe, Belediye Cd. No:3, 34295<br />
                Küçükçekmece / İstanbul, Türkiye
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
