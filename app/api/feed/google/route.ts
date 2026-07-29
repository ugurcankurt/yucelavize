import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://yucelavize.com";
  
  // In a real application, you fetch these products from Supabase
  const products = [
    {
      id: "PRD-1",
      title: "Kristal Modern Avize",
      description: "Lüks kristal taşlı modern LED avize. Salonlar için uygundur.",
      link: `${baseUrl}/products/kristal-modern-avize`,
      image_link: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=1500&auto=format&fit=crop", // Minimum 1500x1500 for 2026 specs
      availability: "in_stock",
      price: "3500.00 TRY",
      brand: "Yücel Avize",
      condition: "new",
      google_product_category: "Home & Garden > Lighting > Chandeliers",
      handling_cutoff_time: "15:00+03:00", // 2026 Spec: Daily deadline for order processing
      minimum_order_value: "0.00 TRY", // 2026 Spec
    },
  ];

  const xmlItems = products.map((product) => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.title}]]></g:title>
      <g:description><![CDATA[${product.description}]]></g:description>
      <g:link>${product.link}</g:link>
      <g:image_link>${product.image_link}</g:image_link>
      <g:condition>${product.condition}</g:condition>
      <g:availability>${product.availability}</g:availability>
      <g:price>${product.price}</g:price>
      <g:brand><![CDATA[${product.brand}]]></g:brand>
      <g:google_product_category><![CDATA[${product.google_product_category}]]></g:google_product_category>
      <g:handling_cutoff_time>${product.handling_cutoff_time}</g:handling_cutoff_time>
      <g:minimum_order_value>${product.minimum_order_value}</g:minimum_order_value>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Yücel Avize Ürün Kataloğu</title>
    <link>${baseUrl}</link>
    <description>Türkiye'nin Premium Avize Mağazası</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
