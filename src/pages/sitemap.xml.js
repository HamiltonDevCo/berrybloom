import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const site = 'https://berrybloom.agency';

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: '/book-appointment/', priority: '0.9', changefreq: 'monthly' },
  ];

  const postPages = posts
    .filter(p => !p.data.noindex)
    .map(post => ({
      url: `/${post.data.category}/${post.id}/`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: (post.data.updatedDate || post.data.pubDate).toISOString().split('T')[0],
    }));

  const allPages = [...staticPages, ...postPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${site}${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
