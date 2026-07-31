import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChevronRight, Home } from "lucide-react";
import { ProductGallery } from "./product-gallery";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductDimensions } from "@/components/storefront/product-dimensions";
import { ProductActionSection } from "@/components/storefront/product-action-section";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductReviews } from "@/components/storefront/product-reviews";
// Dynamic Metadata generation for SEO 2026 guidelines
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images, price")
    .eq("slug", resolvedParams.slug)
    .single();
  if (!product) {
    return { title: "Ürün Bulunamadı" };
  }
  const primaryImage =
    product.images?.[0] || "https://yucelavize.com/og-default.jpg";
  return {
    title: `${product.name} | Yücel Avize`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [{ url: primaryImage }],
      type: "website",
    },
  };
}
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(name, slug), features")
    .eq("slug", resolvedParams.slug)
    .single();
  if (error || !product) {
    notFound();
  }
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
  const isFavorite = userFavorites.includes(product.id);

  // Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", product.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const safeReviews = reviews || [];

  const userIds = [...new Set(safeReviews.map(r => r.user_id).filter(Boolean))];
  let profilesMap: Record<string, string | null> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, avatar_url")
      .in("id", userIds);
      
    if (profiles) {
      profilesMap = profiles.reduce((acc, p) => {
        acc[p.id] = p.avatar_url;
        return acc;
      }, {} as Record<string, string | null>);
    }
  }

  const enrichedReviews = safeReviews.map(r => ({
    ...r,
    user_avatar: profilesMap[r.user_id] || null
  }));
  // Determine review eligibility
  let isEligible = false;
  if (user) {
    const { data: orderItem } = await supabase
      .from("order_items")
      .select(`
        id,
        orders!inner(user_id, status)
      `)
      .eq("product_id", product.id)
      .eq("orders.user_id", user.id)
      .eq("orders.status", "delivered")
      .limit(1);
    
    if (orderItem && orderItem.length > 0) {
      // Check if user has already reviewed this product
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", user.id)
        .limit(1);
        
      if (!existingReview || existingReview.length === 0) {
        isEligible = true;
      }
    }
  }

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, category:categories(name, slug), features, reviews(rating, status)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4);

  // Fetch active campaign
  const { data: activeCampaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const hasProductDiscount = product.discounted_price && product.discounted_price < product.price;
  let finalPrice = product.price;
  let hasDiscount = false;
  let discountBadge = "";

  if (hasProductDiscount) {
    finalPrice = product.discounted_price;
    hasDiscount = true;
    const percentage = Math.round(((product.price - product.discounted_price) / product.price) * 100);
    discountBadge = `%${percentage} İndirim`;
  } else if (activeCampaign) {
    hasDiscount = true;
    if (activeCampaign.discount_type === "percentage") {
      finalPrice = product.price - (product.price * activeCampaign.discount_amount) / 100;
      discountBadge = `%${activeCampaign.discount_amount} İndirim`;
    } else {
      finalPrice = Math.max(0, product.price - activeCampaign.discount_amount);
      discountBadge = `₺${activeCampaign.discount_amount} İndirim`;
    }
  }
  // Schema.org Product JSON-LD for Google SEO (2026 Merchant specs supported)
  const reviewCount = safeReviews.length;
  let aggregateRating = null;
  let jsonLdReviews = undefined;

  if (reviewCount > 0) {
    const sum = safeReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / reviewCount).toFixed(1);
    
    aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: reviewCount
    };

    jsonLdReviews = safeReviews.map(r => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5"
      },
      author: {
        "@type": "Person",
        name: r.user_name
      },
      reviewBody: r.comment,
      datePublished: new Date(r.created_at).toISOString().split('T')[0]
    }));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Yücel Avize" },
    offers: {
      "@type": "Offer",
      url: `https://yucelavize.com/products/${product.slug}`,
      priceCurrency: "TRY",
      price: finalPrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(jsonLdReviews ? { review: jsonLdReviews } : {})
  };
  const images: string[] = product.images && product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=2000&auto=format&fit=crop"];
  // Fallback
  const categoryName = product.category
    ? Array.isArray(product.category)
      ? product.category[0]?.name
      : product.category.name
    : "Aydınlatma";
  return (
    <>
      {" "}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />{" "}
      <div className="w-full pb-8 lg:pb-8">
        {/* Breadcrumb Navigation - Desktop Only */}
        <div className="container mx-auto px-4 mt-4 hidden lg:block">
          <nav className="flex items-center text-sm text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap pb-2">
            {" "}
            <Link
              href="/"
              className="flex items-center hover:text-foreground transition-colors"
            >
              {" "}
              <Home className="w-4 h-4 mr-1" /> Ana Sayfa{" "}
            </Link>{" "}
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />{" "}
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              {" "}
              Tüm Ürünler{" "}
            </Link>{" "}
            <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />{" "}
            <span className="font-medium text-foreground truncate">
              {product.name}
            </span>{" "}
          </nav>
        </div>

        <div className="container mx-auto px-0 lg:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-20">
            {/* Interactive Image Gallery */}
            <div id="product-gallery" className="w-full -mt-8 lg:mt-0 lg:sticky lg:top-24 h-max relative z-0">
              <ProductGallery
                images={images}
                productName={product.name}
                productId={product.id}
                initialIsFavorite={isFavorite}
                colorMapping={product.features?.colorMapping}
              />
            </div>
            {/* Product Info */}
            <div className="flex flex-col px-4 lg:px-0 pt-6 lg:pt-2 animate-in fade-in duration-700">
              {" "}
              <div className="mb-6 flex gap-2">
                {" "}
                <Badge variant="secondary" className="font-medium">
                  {" "}
                  {categoryName}{" "}
                </Badge>{" "}
                {product.stock > 0 && product.stock <= 5 && (
                  <Badge
                    variant="destructive"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/10"
                  >
                    {" "}
                    Son {product.stock} Ürün{" "}
                  </Badge>
                )}{" "}
                {product.stock === 0 && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Tükendi
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge variant="destructive" className="uppercase font-bold tracking-wider">
                    {discountBadge}
                  </Badge>
                )}
              </div>
              <div className="mb-8">
                {" "}
                <div className="flex items-start justify-between gap-4">
                  {" "}
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
                    {" "}
                    {product.name}{" "}
                  </h1>{" "}
                </div>{" "}
                <div className="flex items-baseline gap-4 mt-2">
                  <p className="text-4xl font-bold text-foreground">
                    ₺{finalPrice.toLocaleString("tr-TR")}
                  </p>
                  {(hasDiscount || product.price > finalPrice) ? (
                    <p className="text-lg text-muted-foreground line-through decoration-border dark:decoration-border">
                      ₺{product.price.toLocaleString("tr-TR")}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground line-through decoration-border dark:decoration-border">
                      ₺{Math.round(product.price * 1.2).toLocaleString("tr-TR")}
                    </p>
                  )}
                </div>

              </div>{" "}
              <ProductActionSection
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: finalPrice,
                  images: images,
                }}
                colors={product.features?.colors}
              />

              <div className="w-full mt-4 mb-6">
                <h3 className="text-xl font-bold text-foreground mb-3">Ürün Açıklaması</h3>
                <div
                  className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Product Dimensions Visualizer */}{" "}
              <ProductDimensions
                width={product.features?.dimensions?.width}
                height={product.features?.dimensions?.height}
                depth={product.features?.dimensions?.depth}
              />{" "}
            </div>
          </div>
        </div>

        {/* Müşteri Yorumları */}
        <div className="container mx-auto px-4 mt-8">
          <ProductReviews 
            productId={product.id} 
            reviews={enrichedReviews} 
            isEligible={isEligible} 
          />
        </div>

        {/* Benzer Ürünler */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="container mx-auto px-4 mt-16 lg:mt-24 border-t border-border pt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Benzer Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  isFavorite={userFavorites.includes(relatedProduct.id)}
                  activeCampaign={activeCampaign}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
