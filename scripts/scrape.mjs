// Scrapes keshavafabrics.in (WooCommerce Store API + WP REST API) into static JSON
// and downloads product/blog images locally.
// Usage: node scripts/scrape.mjs   (add --no-images to skip downloads)
import fs from 'node:fs/promises'
import path from 'node:path'

const BASE = 'https://keshavafabrics.in'
const ROOT = path.resolve(import.meta.dirname, '..')
const DATA_DIR = path.join(ROOT, 'src/data')
const IMG_DIR = path.join(ROOT, 'public/images')
const SKIP_IMAGES = process.argv.includes('--no-images')
const UA = { 'User-Agent': 'Mozilla/5.0 (KeshavaFabrics data export)' }

const getJSON = async (url) => {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

const decode = (s = '') =>
  s
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&#8243;/g, '″')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))

// Keep only simple semantic markup; drop WP/Gemini data-* attributes and classes.
const cleanHtml = (html = '') =>
  decode(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(\/?)(\w+)[^>]*>/g, (m, close, tag) => {
      const t = tag.toLowerCase()
      return ['p', 'ul', 'ol', 'li', 'b', 'strong', 'i', 'em', 'h2', 'h3', 'h4', 'br'].includes(t)
        ? `<${close}${t === 'b' ? 'strong' : t}>`
        : ''
    })
    .replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, '<li>$1</li>')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()

const plain = (html = '') => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const rupees = (minor) => (minor == null ? null : Number(minor) / 100)

// Pick the srcset candidate closest to `target` width.
const pickSize = (img, target) => {
  const cands = (img.srcset || '')
    .split(',')
    .map((s) => s.trim().split(/\s+/))
    .filter(([u, w]) => u && w)
    .map(([url, w]) => ({ url, w: parseInt(w) }))
  if (!cands.length) return img.src
  return cands.reduce((a, b) => (Math.abs(b.w - target) < Math.abs(a.w - target) ? b : a)).url
}

const downloaded = new Map()
async function download(url, subdir) {
  if (SKIP_IMAGES) return url
  if (downloaded.has(url)) return downloaded.get(url)
  const name = decodeURIComponent(new URL(url).pathname.split('/').pop())
  const rel = `/images/${subdir}/${name}`
  const dest = path.join(IMG_DIR, subdir, name)
  try {
    await fs.access(dest)
  } catch {
    const res = await fetch(url, { headers: UA })
    if (!res.ok) {
      console.warn('  ! image failed', res.status, url)
      return url
    }
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()))
  }
  downloaded.set(url, rel)
  return rel
}

// Small concurrency helper so we don't hammer the origin.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await fn(items[idx], idx)
      }
    }),
  )
  return out
}

async function scrapeCategories() {
  const cats = await getJSON(`${BASE}/wp-json/wc/store/v1/products/categories?per_page=100`)
  return mapLimit(cats, 4, async (c) => ({
    id: c.id,
    slug: c.slug,
    name: decode(c.name),
    description: plain(c.description),
    count: c.count,
    image: c.image ? await download(pickSize(c.image, 600), 'categories') : null,
  }))
}

async function scrapeProducts() {
  const all = []
  for (let page = 1; ; page++) {
    const batch = await getJSON(`${BASE}/wp-json/wc/store/v1/products?per_page=100&page=${page}`)
    all.push(...batch)
    if (batch.length < 100) break
  }
  console.log(`  ${all.length} products`)

  return mapLimit(all, 4, async (p) => {
    const variants = await mapLimit(p.variations || [], 4, async (v) => {
      const d = await getJSON(`${BASE}/wp-json/wc/store/v1/products/${v.id}`)
      return {
        id: v.id,
        attributes: Object.fromEntries(v.attributes.map((a) => [a.name, a.value])),
        label: v.attributes
          .map((a) => {
            const attr = p.attributes.find((x) => x.name === a.name)
            return attr?.terms.find((t) => t.slug === a.value)?.name ?? a.value
          })
          .join(' / '),
        price: rupees(d.prices.price),
        regularPrice: rupees(d.prices.regular_price),
        inStock: d.is_in_stock,
      }
    })
    variants.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))

    const images = await mapLimit(p.images, 3, async (img) => ({
      alt: decode(img.alt || p.name),
      thumb: await download(pickSize(img, 600), 'products'),
      full: await download(pickSize(img, 1200), 'products'),
    }))

    const price = rupees(p.prices.price)
    const regular = rupees(p.prices.regular_price)
    return {
      id: p.id,
      slug: p.slug,
      name: decode(p.name),
      type: p.type,
      categories: p.categories.map((c) => c.slug),
      tags: p.tags.map((t) => decode(t.name)),
      shortDescription: cleanHtml(p.short_description),
      description: cleanHtml(p.description),
      summary: plain(p.short_description).slice(0, 220),
      price,
      regularPrice: regular,
      priceRange: p.prices.price_range
        ? { min: rupees(p.prices.price_range.min_amount), max: rupees(p.prices.price_range.max_amount) }
        : null,
      onSale: p.on_sale,
      currency: p.prices.currency_code,
      inStock: p.is_in_stock,
      rating: Number(p.average_rating),
      reviewCount: p.review_count,
      attributes: p.attributes.map((a) => ({ name: a.name, values: a.terms.map((t) => t.name) })),
      variants,
      images,
      sourceUrl: p.permalink,
    }
  })
}

async function scrapePosts() {
  const posts = await getJSON(
    `${BASE}/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,date,title,excerpt,content`,
  )
  return mapLimit(posts, 3, async (p) => {
    const firstImg = p.content.rendered.match(/<img[^>]+src="([^"]+)"/)?.[1]
    return {
      id: p.id,
      slug: p.slug,
      date: p.date,
      title: decode(p.title.rendered),
      excerpt: plain(p.excerpt.rendered).replace(/\s*\[…\]$/, '…'),
      content: cleanHtml(p.content.rendered),
      cover: firstImg ? await download(firstImg, 'blog') : null,
    }
  })
}

console.log('Scraping categories…')
const categories = await scrapeCategories()
console.log('Scraping products…')
const products = await scrapeProducts()
console.log('Scraping blog posts…')
const posts = await scrapePosts()

// Drop empty categories so the UI never shows a dead filter.
const used = new Set(products.flatMap((p) => p.categories))
const liveCats = categories.filter((c) => used.has(c.slug))

await fs.mkdir(DATA_DIR, { recursive: true })
await fs.writeFile(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2))
await fs.writeFile(path.join(DATA_DIR, 'categories.json'), JSON.stringify(liveCats, null, 2))
await fs.writeFile(path.join(DATA_DIR, 'posts.json'), JSON.stringify(posts, null, 2))
console.log(
  `Done: ${products.length} products, ${liveCats.length} categories, ${posts.length} posts, ${downloaded.size} images`,
)
