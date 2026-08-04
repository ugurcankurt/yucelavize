import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // Cache for 1 hour

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const baseUrl = "https://yucelavize.com";

  // Fetch all products
  const { data: products, error } = await supabase
    .from("products")
    .select("*, category:categories(name)");

  if (error) {
    console.error("Error fetching products for Facebook XML feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }

  if (!products) {
    return new NextResponse("No products found", { status: 404 });
  }

  // Fetch all approved reviews to calculate average ratings
  const { data: reviews } = await supabase
    .from("reviews")
    .select("product_id, rating")
    .eq("status", "approved");

  const reviewStats: Record<string, { count: number, total: number }> = {};
  if (reviews) {
    reviews.forEach(r => {
      if (!reviewStats[r.product_id]) {
        reviewStats[r.product_id] = { count: 0, total: 0 };
      }
      reviewStats[r.product_id].count += 1;
      reviewStats[r.product_id].total += r.rating;
    });
  }

  // Fetch active campaigns for dynamic pricing if applicable
  const { data: activeCampaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const xmlItems = products.map((product) => {
    const hasProductDiscount = product.discounted_price && product.discounted_price < product.price;
    let finalPrice = product.price;
    let hasDiscount = false;

    if (hasProductDiscount) {
      finalPrice = product.discounted_price;
      hasDiscount = true;
    } else if (activeCampaign) {
      hasDiscount = true;
      if (activeCampaign.discount_type === "percentage") {
        finalPrice = product.price - (product.price * activeCampaign.discount_amount) / 100;
      } else {
        finalPrice = Math.max(0, product.price - activeCampaign.discount_amount);
      }
    }

    // Prepare description (strip HTML tags if any, limit length)
    let description = (product.description || "").replace(/<[^>]*>?/gm, '');
    if (description.length > 5000) {
      description = description.substring(0, 4997) + '...';
    }
    if (!description.trim()) {
      description = product.name; // Facebook requires a description
    }

    // Determine category
    const productType = product.category
      ? Array.isArray(product.category)
        ? product.category[0]?.name
        : (product.category as any).name
      : "Ev ve Yaşam > Aydınlatma > Avizeler"; // Default fallback

    const primaryImage = product.images && product.images[0] 
      ? product.images[0] 
      : "https://yucelavize.com/og-default.jpg";

    const additionalImages = product.images && product.images.length > 1
      ? product.images.slice(1).map((img: string) => `<g:additional_image_link><![CDATA[${img}]]></g:additional_image_link>`).join('\n      ')
      : "";

    const mpn = product.sku ? `<g:mpn><![CDATA[${product.sku}]]></g:mpn>` : "";

    let color = "";
    let material = "";

    if (product.features && typeof product.features === 'object') {
      const featureKeys = Object.keys(product.features);
      const colorKey = featureKeys.find(k => k.toLowerCase() === 'renk' || k.toLowerCase() === 'color');
      if (colorKey) {
        color = `<g:color><![CDATA[${product.features[colorKey]}]]></g:color>`;
      }
      const materialKey = featureKeys.find(k => k.toLowerCase() === 'malzeme' || k.toLowerCase() === 'materyal' || k.toLowerCase() === 'material');
      if (materialKey) {
        material = `<g:material><![CDATA[${product.features[materialKey]}]]></g:material>`;
      }
    }

    let size = "";
    if (product.features?.dimensions) {
      const { width, height, depth } = product.features.dimensions;
      if (width || height || depth) {
        size = `<g:size><![CDATA[${[width, height, depth].filter(Boolean).join('x')} cm]]></g:size>`;
      }
    }

    const productReviews = reviewStats[product.id];
    let averageRating = "";
    let reviewCount = "";
    if (productReviews && productReviews.count > 0) {
      const avg = (productReviews.total / productReviews.count).toFixed(1);
      averageRating = `<g:custom_label_0><![CDATA[Puan: ${avg}]]></g:custom_label_0>`;
      reviewCount = `<g:custom_label_1><![CDATA[Değerlendirme: ${productReviews.count}]]></g:custom_label_1>`;
    }

    const availability = product.stock > 0 ? "in_stock" : "out_of_stock";

    return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:rich_text_description><![CDATA[${product.description || ""}]]></g:rich_text_description>
      <g:link>${baseUrl}/products/${product.slug}</g:link>
      <g:image_link><![CDATA[${primaryImage}]]></g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price.toFixed(2)} TRY</g:price>
      ${hasDiscount ? `<g:sale_price>${finalPrice.toFixed(2)} TRY</g:sale_price>` : ""}
      <g:brand><![CDATA[Yücel Avize]]></g:brand>
      ${mpn}
      ${color}
      ${material}
      ${size}
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      <g:google_product_category><![CDATA[Ev ve Yaşam > Aydınlatma > Avizeler]]></g:google_product_category>
      <g:inventory>${product.stock}</g:inventory>
      <g:return_policy_label><![CDATA[14 Gün İade]]></g:return_policy_label>
      <g:shipping>
        <g:country>TR</g:country>
        <g:price>0.00 TRY</g:price>
      </g:shipping>
      ${averageRating}
      ${reviewCount}
      ${additionalImages}
    </item>
  `}).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Yücel Avize Facebook Kataloğu</title>
    <link>${baseUrl}</link>
    <description>Yücel Avize Facebook ve Instagram Mağaza Ürün Akışı</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
