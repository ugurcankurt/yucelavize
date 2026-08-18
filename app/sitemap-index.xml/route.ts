import { publicSupabase } from "@/lib/services/public-data";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = publicSupabase;
  const URL_LIMIT = 50000;
  const BASE_URL = "https://www.yucelavize.com";

  // Calculate how many sitemap chunks we need based on total products
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true });

  const totalProducts = productCount || 0;
  const productChunks = Math.ceil(totalProducts / URL_LIMIT) || 1;

  let sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (let i = 0; i < productChunks; i++) {
    sitemapIndexXML += `  <sitemap>\n    <loc>${BASE_URL}/sitemap/${i}.xml</loc>\n  </sitemap>\n`;
  }

  sitemapIndexXML += `</sitemapindex>`;

  return new NextResponse(sitemapIndexXML, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
