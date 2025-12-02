import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://jmfitnessstudio.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/contact", "/waitlist"],
        disallow: ["/admin", "/user", "/coach", "/employee", "/api"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
