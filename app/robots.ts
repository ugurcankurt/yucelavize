import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://yucelavize.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/auth/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
