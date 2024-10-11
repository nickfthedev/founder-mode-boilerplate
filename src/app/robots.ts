import type { MetadataRoute } from "next";
import { env } from "../env";

export default function robots(): MetadataRoute.Robots {
  const { APP_URL } = env;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/api/',
          '/admin/',
        ],
      },
      {
        userAgent: '*',
        allow: '/blog/',
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}