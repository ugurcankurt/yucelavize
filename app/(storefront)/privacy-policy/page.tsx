import { PageHero } from "@/components/storefront/page-hero";

export const metadata = {
  title: "Gizlilik Politikası | Yücel Avize",
  description: "Yücel Avize Gizlilik Politikası ve Kişisel Verilerin Korunması hakkında bilgilendirme metni.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-background font-sans min-h-screen pb-16">
      <PageHero
        title="Gizlilik Politikası"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gizlilik Politikası" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 md:mt-12">
        <div className="prose prose-slate prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>

          <p>
            Yücel Avize, siz müşterilere kişisel bir alışveriş deneyimi ("Hizmetler") sunmak amacıyla tüm ilgili bilgiler, içerikler, özellikler, araçlar, ürünler ve hizmetler de dahil olmak üzere bu mağazayı ve web sitesini işletmektedir. İşbu Gizlilik Politikası, Hizmetler'i ziyaret ettiğinizde, kullandığınızda veya Hizmetler aracılığıyla bir satın alma ya da başka bir işlem gerçekleştirdiğinizde veya bizimle başka bir şekilde iletişim kurduğunuzda, kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve paylaştığımızı açıklamaktadır. Hizmet Şartları'mız ile işbu Gizlilik Politikası arasında bir çelişki olması halinde, kişisel bilgilerinizin toplanması, işlenmesi ve paylaşılması ile ilgili olarak işbu Gizlilik Politikası esas alınır.
          </p>
          <p>
            Lütfen işbu Gizlilik Politikası'nı dikkatlice okuyunuz. Hizmetler'den herhangi birini kullanarak ve bunlara erişerek, işbu Gizlilik Politikası'nı okuduğunuzu ve bilgilerinizin bu Gizlilik Politikası'nda açıklandığı şekilde toplanmasını, kullanılmasını ve paylaşılmasını anladığınızı kabul etmiş olursunuz.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Topladığımız veya İşlediğimiz Kişisel Bilgiler</h2>
          <p>
            "Kişisel bilgiler" terimini kullandığımızda, sizin veya başka bir kişinin kimliğini açığa çıkaran ya da sizinle veya başka biriyle makul şekilde bağlantısı kurulabilen bilgileri kastederiz. Kişisel bilgiler, kimliğinizi açığa çıkarmayacak veya sizinle makul şekilde bağlantısı kurulamayacak şekilde anonim olarak toplanan ya da kimliği açığa çıkaran kısımları gizlenmiş bilgileri kapsamaz. Hizmetler ile nasıl etkileşimde bulunduğunuza, ikamet ettiğiniz yere ve yürürlükteki yasaların izin verdiği veya gerektirdiği ölçüde, kişisel bilgilerinizden çıkarımlar da dahil olmak üzere, aşağıdaki kişisel bilgi kategorilerini toplayabilir ya da işleyebiliriz:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>İletişim bilgileri:</strong> örneğin, adınız, adresiniz, fatura adresiniz, kargo adresiniz, telefon numaranız ve e-posta adresiniz gibi bilgiler.</li>
            <li><strong>Finansal bilgiler:</strong> örneğin, kredi kartı, banka kartı ve finansal hesap numaraları, ödeme kartı bilgileri, finansal hesap bilgileri, işlem ayrıntıları, ödeme yöntemi, ödeme onayı ve diğer ödeme ayrıntıları gibi bilgiler.</li>
            <li><strong>Hesap bilgileri:</strong> örneğin, kullanıcı adınız, parolanız, güvenlik sorularınız, tercihleriniz ve ayarlarınız gibi bilgiler.</li>
            <li><strong>İşlem bilgileri:</strong> örneğin, sepete eklediğiniz, istek listenize eklediğiniz, satın aldığınız, iade ettiğiniz, değişim yaptığınız veya iptal ettiğiniz ürünler ve geçmiş işlemleriniz gibi bilgiler.</li>
            <li><strong>Bizimle iletişimleriniz:</strong> örneğin, müşteri destek talebi gönderirken bizimle iletişimlerinizde paylaştığınız bilgiler.</li>
            <li><strong>Cihaz bilgileri:</strong> örneğin, cihazınız, tarayıcınız veya ağ bağlantınız, IP adresiniz ve diğer benzersiz tanımlayıcılar hakkında bilgiler.</li>
            <li><strong>Kullanım bilgileri:</strong> örneğin, Hizmetler ile ne zaman ve nasıl etkileşimde bulunduğunuz veya gezindiğiniz gibi, Hizmetler ile etkileşiminizle ilgili bilgiler.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Kişisel Bilgi Kaynakları</h2>
          <p>Kişisel bilgileri aşağıdaki kaynaklardan toplayabiliriz:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Doğrudan sizden:</strong> örneğin, hesap oluşturduğunuzda, Hizmetler'i ziyaret ettiğinizde veya kullandığınızda, bizimle iletişime geçtiğinizde ya da kişisel bilgilerinizi başka şekilde bize sağladığınızda;</li>
            <li><strong>Hizmetler üzerinden otomatik olarak:</strong> örneğin, ürünlerimizi veya hizmetlerimizi kullandığınızda ya da web sitelerimizi ziyaret ettiğinizde cihazınızdan ve çerezler ve benzeri teknolojilerin kullanımı yoluyla;</li>
            <li><strong>Hizmet sağlayıcılarımızdan:</strong> örneğin, belirli teknolojileri sağlamak için hizmet sağlayıcılarından yardım aldığımızda veya kişisel bilgilerinizi bizim adımıza topladıklarında veya işlediklerinde;</li>
            <li><strong>İş ortaklarımızdan</strong> veya diğer üçüncü taraflardan.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Kişisel Bilgilerinizi Nasıl Kullanırız?</h2>
          <p>Bizimle nasıl etkileşimde bulunduğunuza veya Hizmetler'in hangisini kullandığınıza bağlı olarak, kişisel bilgilerinizi aşağıdaki amaçlar için kullanabiliriz:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Hizmetleri Sağlama, Kişiselleştirme ve İyileştirme:</strong> Sizinle yaptığımız sözleşmeyi yerine getirmek, ödemelerinizi işlemek, siparişlerinizi göndermek, tercihlerinizi ve ilgilendiğiniz ürünleri hatırlamak, hesabınızla ilgili bildirimler göndermek, satın alımlarınızı, iadelerinizi, değişimlerinizi veya diğer işlemlerinizi işlemek, hesabınızı oluşturmak, sürdürmek ve yönetmek, kargo düzenlemek, iade ve değişimleri kolaylaştırmak, yorum paylaşmanızı sağlamak ve satın aldıklarınıza bağlı ürün önerileri gibi kişiye özel bir alışveriş deneyimi oluşturmak için kişisel bilgilerinizi kullanırız.</li>
            <li><strong>Pazarlama ve Reklam:</strong> Pazarlama ve promosyon amaçları için (örneğin, size e-posta, kısa mesaj veya posta yoluyla pazarlama, reklam ve promosyon iletişimleri göndermek için) ve Hizmetler'de ya da diğer web sitelerinde, önceki satın alımlarınıza veya sepetinize eklediklerinize ve Hizmetler'deki diğer faaliyetlerinize dayalı olarak ürün veya hizmetlerin online reklamlarını size göstermek için kişisel bilgilerinizi kullanırız.</li>
            <li><strong>Güvenlik ve Sahtekarlık Önleme:</strong> Hesabınızı doğrulamak, güvenli bir ödeme ve alışveriş deneyimi sunmak, olası sahtekarlık, yasa dışı, tehlikeli veya kötü niyetli faaliyetleri tespit etmek, incelemek veya önlem almak, kamu güvenliğini korumak ve Hizmetler'imizin güvenliğini sağlamak için kişisel bilgilerinizi kullanırız. Hizmetler'i kullanıp hesap kaydı oluşturmayı seçtiğinizde, hesabınızın kimlik bilgilerinin güvenliğinden siz sorumlu olursunuz.</li>
            <li><strong>Sizinle İletişim Kurma:</strong> Size müşteri desteği sağlamak, hızlı yanıt vermek, etkili hizmetler sunmak ve sizinle iş ilişkimizi sürdürmek için kişisel bilgilerinizi kullanırız.</li>
            <li><strong>Hukuki Nedenler:</strong> Yürürlükteki yasalara uymak veya kolluk kuvvetleri ya da devlet kurumlarından gelen talepler de dahil olmak üzere geçerli hukuki süreçlere yanıt vermek, hukuki delil tespiti süreçlerinde inceleme yapmak veya katılım göstermek, olası ya da mevcut dava veya diğer hukuki ihtilaf süreçlerini yürütmek ve şartlarımızın ya da politikalarımızın olası ihlallerini araştırmak veya uygulamak amacıyla kişisel bilgilerinizi kullanırız.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Kişisel Bilgilerinizi Nasıl Paylaşırız?</h2>
          <p>Belirli durumlarda, bu Gizlilik Politikası'na tabi olarak meşru amaçlarla kişisel bilgilerinizi üçüncü taraflarla paylaşabiliriz. Bu durumlara örnek olarak şunlar verilebilir:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Bizim adımıza hizmet (örneğin, bilgi teknolojileri yönetimi, ödeme işleme, veri analizleri, müşteri desteği, bulut depolama, gönderim ve kargo hizmeti) veren diğer üçüncü taraflar ve satıcılar ile bilgi paylaşımı.</li>
            <li>Size pazarlama hizmetleri ve reklam sunmak için iş ve pazarlama ortaklarımızla bilgi paylaşımı.</li>
            <li>Siz yönlendirdiğinizde, talep ettiğinizde veya açık rızanızla belirli bilgilerin üçüncü taraflarla paylaşılması durumunda; örneğin, size ürün gönderimi için veya sosyal medya widget'ları ya da oturum açma entegrasyonları kullanmanız halinde bilgi paylaşımı.</li>
            <li>Satış ortaklarımızla veya kurumsal grubumuz içindeki diğer birimler arasında bilgi paylaşımı.</li>
            <li>Birleşme veya iflas gibi ticari işlemlerle bağlantılı olarak, geçerli yasal yükümlülüklere uymak, geçerli hizmet şartlarını uygulamak ve Hizmetler'i, haklarımızı, kullanıcılarımızın haklarını korumak veya savunmak amacıyla bilgi paylaşımı.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Üçüncü Taraf Web Siteleri ve Bağlantılar</h2>
          <p>
            Hizmetler, üçüncü taraflarca işletilen web sitelerine veya diğer online platformlara yönlendiren bağlantılar içerebilir. Tarafımızla ilişkili veya kontrolümüz altında olmayan sitelere yönlendiren bağlantıları takip ederseniz, ilgili sitelerin gizlilik ve güvenlik politikaları ile diğer hüküm ve koşullarını incelemeniz gerekir. Bu tür sitelerin gizliliği veya güvenliği konusunda, bu sitelerde yer alan bilgilerin doğruluğu, eksiksizliği veya güvenilirliği dahil herhangi bir garanti vermeyiz ve bu hususlarda herhangi bir sorumluluk kabul etmeyiz.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Çocuklara Ait Veriler</h2>
          <p>
            Hizmetler, çocuklar tarafından kullanılmak üzere tasarlanmamıştır ve yaşadığınız yargı bölgesinde yasal reşit olma yaşının altındaki çocuklara ait herhangi bir kişisel bilgiyi kasıtlı olarak toplamayız. Çocuğunuzun bize kişisel bilgilerini sağladığını düşünüyorsanız, söz konusu bilgilerin silinmesini talep etmek üzere aşağıda belirtilen iletişim bilgilerini kullanarak bizimle iletişime geçebilirsiniz.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Bilgilerinizin Güvenliği ve Saklanması</h2>
          <p>
            Lütfen unutmayın ki hiçbir güvenlik önlemi kusursuz veya aşılamaz değildir ve "mükemmel güvenlik" garantisi vermemiz mümkün değildir. Ayrıca bize ilettiğiniz bilgiler, aktarım sürecinde de güvende olmayabilir. Bu nedenle, hassas veya gizli bilgileri bize iletmek için güvenli olmayan iletişim kanallarını kullanmamanızı öneririz.
          </p>
          <p>
            Kişisel bilgilerinizin ne kadar süreyle saklanacağı; hesabınızı sürdürmek, size Hizmetler'i sunmak, yasal yükümlülüklere uymak, uyuşmazlıkları çözmek veya geçerli diğer sözleşme ve politikaları uygulamak için söz konusu bilgilere ihtiyaç duyup duymadığımız gibi çeşitli etkenlere bağlıdır.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Haklarınız ve Seçenekleriniz</h2>
          <p>İkamet ettiğiniz yere bağlı olarak, kişisel bilgilerinizle ilgili aşağıda belirtilen hakların tümüne veya bazılarına sahip olabilirsiniz:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Erişim/Bilgi Edinme Hakkı:</strong> Hakkınızda tuttuğumuz kişisel bilgilere erişim talep etme hakkına sahip olabilirsiniz.</li>
            <li><strong>Silme Hakkı:</strong> Hakkınızda tuttuğumuz kişisel bilgilerin silinmesini talep etme hakkına sahip olabilirsiniz.</li>
            <li><strong>Düzeltme Hakkı:</strong> Doğru olmayan kişisel bilgilerinizin düzeltilmesini talep etme hakkına sahip olabilirsiniz.</li>
            <li><strong>Veri Taşınabilirliği Hakkı:</strong> Hakkınızda tuttuğumuz kişisel bilgilerin bir kopyasını alma ve üçüncü bir tarafa aktarılmasını talep etme hakkına sahip olabilirsiniz.</li>
            <li><strong>İletişim Tercihlerinin Yönetimi:</strong> Size gönderdiğimiz promosyon içerikli e-postalardaki abonelikten çıkma seçeneğini kullanarak istediğiniz zaman bu e-postaları devre dışı bırakabilirsiniz.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">İşbu Gizlilik Politikası'ndaki Değişiklikler</h2>
          <p>
            İşbu Gizlilik Politikası'nı zaman zaman uygulamalarımızdaki değişiklikleri yansıtacak şekilde veya diğer operasyonel, hukuki ya da düzenleyici nedenlerle güncelleyebiliriz. Revize edilen Gizlilik Politikası'nı bu web sitesinde yayınlar, "Son güncelleme" tarihini günceller ve yürürlükteki yasalar uyarınca gerekli bildirimleri sağlarız.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">İletişim</h2>
          <p>
            Gizlilik uygulamalarımız veya bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa ya da sahip olduğunuz bir hakkı kullanmak isterseniz lütfen aşağıdaki bilgiler üzerinden bizimle iletişime geçin:
          </p>

          <div className="bg-secondary p-6 rounded-xl mt-6 border border-border">
            <h4 className="font-bold text-foreground mb-4">Yücel Avize</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="m-0"><strong>Telefon:</strong> <a href="tel:+905431543457" className="hover:text-primary transition">+90 543 154 34 57</a></p>
              <p className="m-0"><strong>E-Posta:</strong> <a href="mailto:info@yucelavize.com" className="hover:text-primary transition">info@yucelavize.com</a></p>
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
