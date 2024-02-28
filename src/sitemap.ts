import Routes from '@/constants/route-paths';

export default function sitemap() {
  return Object.values(Routes).map(r => ({
    url: process.env.NEXT_PUBLIC_BASE_URL + r.slice(1),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}