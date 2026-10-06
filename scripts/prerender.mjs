// Prerender every route to static HTML for SEO, then write sitemap.xml and robots.txt.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SITE_URL = 'https://keshavafabrics.in'

const { render, allPaths } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr/entry-server.js')).href)
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')
if (!template.includes('<!--seo-head-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--seo-head--> placeholder or empty #root')
}

const fill = (head, html) => template.replace('<!--seo-head-->', head).replace('<div id="root"></div>', `<div id="root">${html}</div>`)

const urls = allPaths()
let ok = 0
for (const url of urls) {
  const { html, head } = await render(url)
  if (!html.includes('<h1')) console.warn(`  ! no <h1> on ${url}`)
  const file = path.join(DIST, url, 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, fill(head, html))
  ok++
}

// 404 page (served with a real 404 status by the host)
{
  const { html, head } = await render('/__not-found__/')
  await fs.writeFile(path.join(DIST, '404.html'), fill(head, html))
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10)
const priority = (u) =>
  u === '/' ? '1.0'
  : /^\/(product-category|non-woven-bags)/.test(u) || ['/shop/', '/customized-bags/', '/bulk-order/'].includes(u) ? '0.9'
  : u.startsWith('/product/') ? '0.8'
  : /policy|terms/.test(u) ? '0.3'
  : '0.6'
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`).join('\n')}
</urlset>
`
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap)

await fs.writeFile(
  path.join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

await fs.rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered ${ok} pages + 404.html, sitemap.xml (${urls.length} URLs), robots.txt`)
