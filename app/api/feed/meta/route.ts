import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://yucelavize.com";
  
  // Facebook Meta Business Catalog XML format is very similar to Google Merchant Center
  const products = [
    {
      id: "PRD-1",
      title: "Kristal Modern Avize",
      description: "Lüks kristal taşlı modern LED avize. Salonlar için uygundur.",
      link: `${baseUrl}/products/kristal-modern-avize`,
      image_link: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?q=80&w=1500&auto=format&fit=crop",
      availability: "in stock",
      price: "3500.00 TRY",
      brand: "Yücel Avize",
      condition: "new",
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
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Yücel Avize Facebook Katalog</title>
    <link>${baseUrl}</link>
    <description>Facebook ve Instagram Mağazası Ürün Beslemesi</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
