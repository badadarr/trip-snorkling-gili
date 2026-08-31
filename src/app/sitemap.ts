import { MetadataRoute } from 'next';
import { getPackagesList } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://trip-snorkling-gili.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packagesList = await getPackagesList();

  // Public static routes
  const staticRoutes = [
    '',
    '/paket',
    '/booking',
    '/faq',
    '/gallery',
    '/tentang',
  ];

  const staticEntries: MetadataRoute.Sitemap = [];

  // Generate localized URLs for Indonesian & English
  ['id', 'en'].forEach((locale) => {
    staticRoutes.forEach((route) => {
      const url = `${BASE_URL}/${locale}${route}`;
      staticEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });
  });

  // Package dynamic pages
  const packageEntries: MetadataRoute.Sitemap = [];
  packagesList.forEach((pkg) => {
    ['id', 'en'].forEach((locale) => {
      packageEntries.push({
        url: `${BASE_URL}/${locale}/paket/${pkg.slug}`,
        lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: pkg.isFeatured ? 0.95 : 0.85,
      });
    });
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...staticEntries,
    ...packageEntries,
  ];
}
