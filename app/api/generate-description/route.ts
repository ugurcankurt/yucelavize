import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { productName, categoryName, width, height, depth } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API anahtarı bulunamadı." }, { status: 500 });
    }

    if (!productName || !categoryName) {
      return NextResponse.json({ error: "Ürün adı ve kategori zorunludur." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
Sen profesyonel bir e-ticaret metin yazarı ve SEO uzmanısın. Yücel Avize adlı premium bir aydınlatma markası için çalışıyorsun.
Aşağıda bilgileri verilen ürün için, müşterileri satın almaya ikna edecek, SEO uyumlu, dikkat çekici ve modern bir ürün açıklaması yazmanı istiyorum.

Ürün Bilgileri:
- Ürün Adı: ${productName}
- Kategori: ${categoryName}
- Ölçüler: En: ${width || "?"} mm, Boy/Yükseklik: ${height || "?"} mm, Derinlik: ${depth || "?"} mm

Kurallar:
1. Çıktı **sadece HTML formatında** olmalıdır (markdown, \`\`\`html gibi kod blokları KULLANMA, direkt HTML etiketleriyle başla).
2. Açıklama çok uzun olmasın (max 3-4 paragraf) ama çok etkili olsun.
3. Önemli kelimeleri <strong> etiketiyle kalın yap.
4. Okunabilirliği artırmak için <ul> ve <li> etiketleriyle ürünün 3-4 temel avantajını/özelliğini (kalite, tasarım, kullanım alanı) listele.
5. Kullanım alanları hakkında (salon, yatak odası, ofis vb.) tavsiyelerde bulun.
6. Ölçülerden de mutlaka şık bir dille bahset (örneğin "X mm yüksekliğe sahip bu özel tasarım..."). Eğer ölçüler girilmemişse (?) ölçülerden bahsetme.
7. HTML <p> etiketleri arasında boşluk bırakarak (örneğin margin veya sadece ayrı p etiketleri kullanarak) ferah bir görünüm sağla. Yücel Avize kalitesini vurgula.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Markdown bloklarını (eğer AI inatla eklerse) temizle
    text = text.replace(/```html\n?/g, "").replace(/```\n?/g, "").trim();

    return NextResponse.json({ description: text });
  } catch (error) {
    console.error("AI Description Error:", error);
    return NextResponse.json({ error: "Açıklama üretilirken bir hata oluştu." }, { status: 500 });
  }
}
