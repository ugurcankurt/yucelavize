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
        "/*?*" // Optimize crawl budget: Block parameter-based URLs (sort, filter, etc.)
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
