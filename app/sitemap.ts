import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://flipside.example'
  return ['/', '/support', '/privacy', '/terms'].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }))
}
