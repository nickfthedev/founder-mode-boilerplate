// TODO: Re write it look next-intl examples:w
import type { MetadataRoute } from 'next'
import { env } from '../env'
import { api } from '../trpc/server'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const APP_URL = env.APP_URL
  const blog = await api.blog.getPublishedBlogPosts();
  const pages = await api.page.getPublishedPages();
  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // {
    //   url: `${APP_URL}/checkout/stripe`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    {
      url: `${APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/legal/impressum`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/legal/agb`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...pages.map((page) => ({
      url: `${APP_URL}/pages/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...blog.map((post) => ({
      url: `${APP_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}