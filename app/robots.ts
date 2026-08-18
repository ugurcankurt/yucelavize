import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.yucelavize.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/", 
        "/account/", 
        "/auth/", 
        "/api/",
        "/*?sort=*",
        "/*?min_price=*",
        "/*?max_price=*",
        "/*?search=*",
        "/*?in_stock=*"
      ],
    },
    sitemap: `${baseUrl}/sitemap-index.xml`,
  };
}
