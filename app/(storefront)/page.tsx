import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  Lightbulb,
  Grid,
  Package,
  Hexagon,
  Star,
  Sun,
  Box,
  LayoutGrid,
} from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
export default async function Home() {
  const supabase = await createClient();
  const { data: newArrivals } = await supabase
    .from("products")
    .select("id, name, slug, price, discounted_price, images, stock, category:categories(name)")
    .order("created_at", { ascending: false })
    .limit(4);
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .order("name", { ascending: true })
    .limit(7);
  
  // Fetch active campaign
  const { data: activeCampaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userFavorites: string[] = [];
  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("user_id", user.id);
    if (favs) {
      userFavorites = favs.map((f) => f.product_id);
    }
  }
  return (
    <div className="flex flex-col flex-1 w-full font-sans bg-background">
      {/* 1. Hero Section */}
      <section className="w-full pt-6 pb-12">
        <div className="container mx-auto px-4">
          <div className="relative w-full h-[600px] md:h-[700px] rounded-[32px] overflow-hidden bg-muted flex items-center">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=2000&auto=format&fit=crop"
                alt="Evinizin Işıltısı"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-80"
              />
            </div>
            <div className="relative z-10 p-10 md:p-24 flex flex-col items-start w-full h-full">
              <h1 className="text-5xl md:text-[80px] font-black tracking-tight text-primary leading-[1.1] drop-shadow-lg max-w-2xl">
                Evinizin <br />
                Işıltısı
              </h1>
              <p className="mt-auto uppercase tracking-widest text-xs font-bold text-foreground drop-shadow-md flex flex-col gap-1">
                <span>Premium Seri</span> <span>Avize Modelleri</span>
              </p>
              <div className="absolute bottom-10 right-10 flex flex-col items-end gap-10">
                <div className="hidden md:block uppercase text-xs font-bold tracking-[0.2em] text-foreground rotate-90 origin-right drop-shadow-md">
                  Özel Tasarım
                </div>
                <Link
                  href="/products"
                  className="text-foreground hover:text-primary font-semibold text-sm transition-colors flex items-center gap-1 drop-shadow-md"
                >
                  Tümünü Gör <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {/* Dot Indicators */}
              <div className="absolute bottom-10 left-10 flex gap-2">
                <div className="w-8 h-1.5 rounded-full bg-primary"></div>
                <div className="w-2 h-1.5 rounded-full bg-background/50"></div>
                <div className="w-2 h-1.5 rounded-full bg-background/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 2. Shop by Category */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col min-w-[200px]">
            <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-2">
              Kategoriler
            </h2>
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {categories?.map((cat) => (
              <Link
                href={`/products?category=${cat.slug}`}
                key={cat.id}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-sm border border-border/50"
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <Hexagon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground block truncate">
                    {cat.name}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <ArrowRight className="w-3 h-3 text-foreground" />
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/products"
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group bg-primary flex items-center justify-center shadow-sm"
            >
              <div className="text-center p-4">
                <LayoutGrid className="w-6 h-6 text-foreground mb-2 mx-auto opacity-80 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-foreground block">
                  Tüm Ürünler
                </span>
                <span className="text-xs text-foreground/70 block mt-1">
                  Koleksiyonu Gör
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      {/* 3. New Arrivals */}
      <section className="w-full py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[26px] font-bold text-foreground tracking-tight">
              Yeni Gelenler
            </h2>
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={userFavorites.includes(product.id)}
                activeCampaign={activeCampaign}
              />
            ))}
          </div>
        </div>
      </section>
      {/* 4. Banner Section 1 */}{" "}
      <section className="w-full py-16">
        {" "}
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {" "}
          <div className="relative rounded-3xl overflow-hidden bg-primary aspect-[4/3] lg:aspect-auto lg:h-[500px] flex items-center">
            {" "}
            <div className="relative z-10 p-10 max-w-sm">
              {" "}
              <div className="w-10 h-10 mb-6 text-foreground">
                {" "}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zm0 4.2l7.1 13.8H4.9L12 6.2z" />
                </svg>{" "}
              </div>{" "}
              <h2 className="text-4xl font-black text-foreground leading-[1.1] mb-6">
                Tarzınızı
                <br />
                Yansıtın,
                <br />
                İnternete Özel.
              </h2>{" "}
              <Link
                href="/products"
                className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors"
              >
                {" "}
                Yücel Avize ile tanışın.{" "}
              </Link>{" "}
            </div>{" "}
            <div className="absolute right-0 bottom-0 w-3/4 h-3/4">
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop"
                alt="Kampanya"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded-tl-full opacity-90 mix-blend-luminosity"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex flex-col gap-6 h-full">
            {" "}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-muted border border-border flex items-center p-8 min-h-[240px]">
              {" "}
              <div className="relative z-10 max-w-[200px]">
                {" "}
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Modern Koleksiyon
                </p>{" "}
                <h3 className="text-2xl font-bold text-foreground leading-tight mb-6">
                  Aksesuar koleksiyonumuzu keşfedin
                </h3>{" "}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  {" "}
                  İncele{" "}
                </Link>{" "}
              </div>{" "}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40">
                {" "}
                <Image
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=400&auto=format&fit=crop"
                  alt="Aksesuar"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover rounded-full"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-muted border border-border flex items-center p-8 min-h-[240px]">
              {" "}
              <div className="relative z-10 max-w-[200px]">
                {" "}
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Lüks Aydınlatma
                </p>{" "}
                <h3 className="text-2xl font-bold text-foreground leading-tight mb-6">
                  Özel tasarım serimizi inceleyin
                </h3>{" "}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  {" "}
                  Alışverişe Başla{" "}
                </Link>{" "}
              </div>{" "}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-40">
                {" "}
                <Image
                  src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=400&auto=format&fit=crop"
                  alt="Ayakkabı"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover rounded-2xl"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 5. Featured Deals */}{" "}
      <section className="w-full py-16">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-8">
            Öne Çıkan Fırsatlar
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {" "}
            <div className="relative rounded-3xl overflow-hidden bg-primary flex flex-col md:flex-row items-center justify-between p-10 min-h-[300px]">
              {" "}
              <div className="relative z-10 text-foreground max-w-[240px]">
                {" "}
                <div className="w-8 h-8 mb-4">
                  {" "}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 4.2l7.1 13.8H4.9L12 6.2z" />
                  </svg>{" "}
                </div>{" "}
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  Özel indirimleri kaçırmayın
                </h3>{" "}
                <p className="text-sm text-foreground/70 mb-6">
                  Şimdi alışveriş yapın ve sepette ek indirimlerden faydalanın.
                </p>{" "}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary transition-colors"
                >
                  {" "}
                  İncele{" "}
                </Link>{" "}
              </div>{" "}
              <div className="absolute md:relative right-0 bottom-0 w-[200px] h-[250px] opacity-20 md:opacity-100">
                {" "}
                <Image
                  src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=400&auto=format&fit=crop"
                  alt="Deal 1"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-tl-[60px]"
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="relative rounded-3xl overflow-hidden bg-primary flex flex-col md:flex-row items-center justify-between p-10 min-h-[300px]">
              {" "}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[180px] h-[180px] hidden md:block">
                {" "}
                <Image
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=400&auto=format&fit=crop"
                  alt="Deal 2"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-2xl shadow-xl"
                />{" "}
              </div>{" "}
              <div className="relative z-10 text-foreground max-w-[220px] ml-auto">
                {" "}
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  Size özel hoş geldin fırsatı
                </h3>{" "}
                <p className="text-sm text-foreground/80 mb-6">
                  İlk siparişinize özel sürpriz hediye kazanın.
                </p>{" "}
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary transition-colors"
                >
                  {" "}
                  Hesap Oluştur{" "}
                </Link>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 6. Shop by Brands */}{" "}
      <section className="w-full py-16 border-y border-border bg-muted">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <div className="flex justify-between items-end mb-10">
            {" "}
            <h2 className="text-[26px] font-bold text-foreground tracking-tight">
              Ortak Markalar
            </h2>{" "}
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:text-primary/80 transition-colors"
            >
              {" "}
              Tümünü Gör{" "}
            </Link>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border border-border rounded-2xl overflow-hidden bg-background">
            {" "}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/1] border-[0.5px] border-border flex items-center justify-center p-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
              >
                {" "}
                <span className="font-black text-xl tracking-widest text-foreground uppercase">
                  Brand {i + 1}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 7. Recent Post */}{" "}
      <section className="w-full py-24">
        {" "}
        <div className="container mx-auto px-4">
          {" "}
          <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-8">
            Son Yazılar
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {" "}
            <Link
              href="#"
              className="md:col-span-2 relative h-[400px] rounded-3xl overflow-hidden group"
            >
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=1200&auto=format&fit=crop"
                alt="Blog 1"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />{" "}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>{" "}
              <div className="absolute bottom-0 left-0 p-10 max-w-lg">
                {" "}
                <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest border border-border/30 px-3 py-1 rounded-full mb-4 inline-block backdrop-blur-md">
                  Aydınlatma
                </span>{" "}
                <h3 className="text-4xl font-black text-foreground leading-tight mt-4">
                  Aktif yaşam alanları için modern çözümler
                </h3>{" "}
              </div>{" "}
            </Link>{" "}
            <Link
              href="#"
              className="relative h-[400px] rounded-3xl overflow-hidden group bg-primary"
            >
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop"
                alt="Blog 2"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
              />{" "}
              <div className="absolute bottom-0 left-0 p-10">
                {" "}
                <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest border border-border/30 px-3 py-1 rounded-full mb-4 inline-block backdrop-blur-md">
                  Dekorasyon
                </span>{" "}
                <h3 className="text-3xl font-black text-foreground leading-tight mt-4">
                  Çağdaş evler için tasarım ipuçları
                </h3>{" "}
              </div>{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
