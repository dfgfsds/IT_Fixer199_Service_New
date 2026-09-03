import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.itfixer199.com';
  const lastModDate = new Date('2026-07-21T07:18:06+01:00');

  return [
    {
      url: `${baseUrl}/`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: lastModDate,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/connect`,
      lastModified: new Date('2026-08-04T00:00:00.000Z'),
      priority: 0.9,
    },
  ];
}