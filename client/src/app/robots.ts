import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXTAUTH_URL || "https://messmatch.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/about", "/services", "/contact"],
      disallow: ["/dashboard/", "/profile/", "/chats/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

