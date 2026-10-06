// Per-URL SEO: title, description, canonical, Open Graph and JSON-LD structured data.
// Used both at build time (prerender writes it into each page's <head>) and in the browser
// (SeoHead keeps <head> in sync during client-side navigation).
import { absolute, paths, policyPaths, SITE_URL, type PolicySlug } from '@/config/routes'
import { site } from '@/config/site'
import { categories, fromPrice, getCategory, getPost, getProduct, posts, products } from '@/data'
import { policyPages } from '@/data/policies'
import { areaPages, categorySeo, type Faq } from '@/data/seo'

export interface PageMeta {
  title: string
  description: string
  canonical: string
  image: string
  type: 'website' | 'product' | 'article'
  jsonLd: Record<string, unknown>[]
  noindex?: boolean
}

const DEFAULT_IMAGE = '/brand/keshava-fabrics.png'
const BRAND = 'Keshava Fabrics'

const clip = (s: string, n = 158) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…`)
const TITLE_MAX = 65
// Add the brand only when the full title still fits in Google's ~65-char display.
const withBrand = (t: string) => (t.includes(BRAND) || t.length + BRAND.length + 3 > TITLE_MAX ? t : `${t} | ${BRAND}`)

// Some store products share a name; tell them apart (size from the slug, else category).
const nameCount = products.reduce<Record<string, number>>((m, p) => ((m[p.name] = (m[p.name] ?? 0) + 1), m), {})
const distinctName = (p: (typeof products)[number]) => {
  if ((nameCount[p.name] ?? 0) < 2) return p.name
  const dims = p.slug.match(/(d+)x(d+)(?:x(d+))?/)
  if (dims) return `${p.name} (${dims.slice(1).filter(Boolean).join('×')} in)`
  const cat = getCategory(p.categories[1] ?? p.categories[0])
  return cat ? `${p.name} – ${cat.name}` : `${p.name} #${p.id}`
}

// ───────────────────────── structured data ─────────────────────────

export const businessId = `${SITE_URL}/#business`

export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    '@id': businessId,
    name: site.legalName,
    alternateName: [site.name, 'Keshava Fabrics Bhavani'],
    description:
      'Manufacturer and bulk supplier of non-woven bags, thamboolam / return gift bags, kattapai and custom printed bags in Bhavani, Erode district, Tamil Nadu.',
    url: SITE_URL,
    logo: absolute(DEFAULT_IMAGE),
    image: [absolute('/images/about/about-2.webp'), absolute('/images/about/about-12.webp'), absolute(DEFAULT_IMAGE)],
    telephone: site.phone.replace(/\s/g, ''),
    email: site.email,
    priceRange: '₹',
    founder: { '@type': 'Person', name: site.founder.replace(/^Mr\.\s*/, '') },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '289, Anna Nagar 2nd Street, Near Madha Kovil',
      addressLocality: 'Bhavani',
      addressRegion: 'Tamil Nadu',
      postalCode: '638301',
      addressCountry: 'IN',
    },
    ...(site.geo ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
    hasMap: site.mapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: (site.openDays as readonly number[]).map((d) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]),
        opens: `${String(site.openHour).padStart(2, '0')}:00`,
        closes: `${String(site.closeHour).padStart(2, '0')}:00`,
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Bhavani' },
      { '@type': 'City', name: 'Erode' },
      { '@type': 'AdministrativeArea', name: 'Erode district' },
      { '@type': 'State', name: 'Tamil Nadu' },
      { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: ['Non-woven bags', 'Thamboolam bags', 'Return gift bags', 'Kattapai bags', 'Custom printed bags', 'D-cut bags', 'W-cut bags', 'Loop handle bags'],
    contactPoint: [
      { '@type': 'ContactPoint', telephone: site.phone.replace(/\s/g, ''), contactType: 'sales', areaServed: 'IN', availableLanguage: ['English', 'Tamil'] },
      { '@type': 'ContactPoint', telephone: site.phone2.replace(/\s/g, ''), contactType: 'customer service', areaServed: 'IN', availableLanguage: ['English', 'Tamil'] },
    ],
    // TODO: add Google Business Profile, IndiaMART, Facebook, Instagram URLs once created.
    sameAs: [] as string[],
  }
}

const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BRAND,
  inLanguage: 'en-IN',
  publisher: { '@id': businessId },
})

const breadcrumbLd = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...items].map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: absolute(path),
  })),
})

const faqLd = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

// ───────────────────────── page resolvers ─────────────────────────

const page = (m: Partial<PageMeta> & Pick<PageMeta, 'title' | 'description' | 'canonical'>): PageMeta => ({
  image: DEFAULT_IMAGE,
  type: 'website',
  jsonLd: [],
  ...m,
  title: withBrand(m.title),
  description: clip(m.description),
})

/** Normalise "/about-us" and "/about-us/" to the canonical trailing-slash form. */
export const normalisePath = (pathname: string) => {
  const p = pathname.split(/[?#]/)[0] || '/'
  return p === '/' || p.endsWith('/') ? p : `${p}/`
}

export function getPageMeta(pathname: string): PageMeta {
  const path = normalisePath(pathname)
  const seg = path.split('/').filter(Boolean)

  if (path === paths.home)
    return {
      ...page({
        title: 'Non-Woven Bags Manufacturer in Bhavani, Erode | Keshava Fabrics',
        description: `${site.legalName}, Bhavani (Erode) – manufacturer of non-woven bags, thamboolam & return gift bags, kattapai and custom printed bags. Bulk orders across Tamil Nadu. WhatsApp ${site.phone}.`,
        canonical: path,
        jsonLd: [localBusinessLd(), websiteLd()],
      }),
      title: 'Non-Woven Bags Manufacturer in Bhavani, Erode | Keshava Fabrics',
    }

  if (path === paths.shop)
    return page({
      title: 'Shop Bags – Thamboolam, Kattapai, Non-Woven & Printed',
      description: `Browse ${products.length}+ ready designs: thamboolam & return gift bags, kattapai, non-woven, jute-style and shopping bags. Pack prices, per-bag cost and bulk quotes on WhatsApp.`,
      canonical: path,
      jsonLd: [
        breadcrumbLd([['Shop', path]]),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(paths.product(p.slug)), name: p.name })),
        },
      ],
    })

  if (seg[0] === 'product-category' && seg[1]) {
    const cat = getCategory(seg[1])
    const seo = categorySeo[seg[1]]
    if (cat) {
      const items = products.filter((p) => p.categories.includes(cat.slug))
      return page({
        title: seo?.title ?? `${cat.name} in Bulk – Bhavani, Erode`,
        description: seo?.description ?? `${cat.name} from Keshava Fabrics, Bhavani. Bulk orders across Tamil Nadu.`,
        canonical: paths.category(cat.slug),
        image: cat.image ?? DEFAULT_IMAGE,
        jsonLd: [
          breadcrumbLd([
            ['Shop', paths.shop],
            [cat.name, paths.category(cat.slug)],
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: seo?.h1 ?? cat.name,
            url: absolute(paths.category(cat.slug)),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(paths.product(p.slug)), name: p.name })),
            },
          },
          ...(seo?.faqs.length ? [faqLd(seo.faqs)] : []),
        ],
      })
    }
  }

  if (seg[0] === 'product' && seg[1]) {
    const p = getProduct(seg[1])
    if (p) {
      const cat = getCategory(p.categories[0])
      const priced = p.variants.length ? p.variants.map((v) => v.price).filter((x): x is number => x != null) : p.price != null ? [p.price] : []
      const low = priced.length ? Math.min(...priced) : fromPrice(p)
      const high = priced.length ? Math.max(...priced) : low
      const name = distinctName(p)
      const priceBit = low ? ` – from ₹${low}` : ''
      return page({
        title: name.length + priceBit.length <= TITLE_MAX ? `${name}${priceBit}` : name,
        description:
          name !== p.name
            ? `${name}: ${p.summary || 'bulk packs and custom printing available.'}`
            : p.summary || `${p.name} from Keshava Fabrics, Bhavani, Erode. Bulk packs and custom printing available.`,
        canonical: paths.product(p.slug),
        image: p.images[0]?.full ?? DEFAULT_IMAGE,
        type: 'product',
        jsonLd: [
          breadcrumbLd([
            ['Shop', paths.shop],
            ...(cat ? [[cat.name, paths.category(cat.slug)] as [string, string]] : []),
            [p.name, paths.product(p.slug)],
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${absolute(paths.product(p.slug))}#product`,
            name: p.name,
            description: p.summary || p.name,
            sku: String(p.id),
            image: p.images.map((i) => absolute(i.full)),
            brand: { '@type': 'Brand', name: BRAND },
            category: cat?.name,
            ...(low != null
              ? {
                  offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'INR',
                    lowPrice: low,
                    highPrice: high ?? low,
                    offerCount: Math.max(1, priced.length),
                    availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    url: absolute(paths.product(p.slug)),
                    seller: { '@id': businessId },
                  },
                }
              : {}),
          },
        ],
      })
    }
  }

  if (path === paths.customBags)
    return page({
      title: 'Custom Printed Bags with Your Logo – Design Online',
      description:
        'Design your custom printed non-woven bag online: pick D-cut, loop, box, kattapai or W-cut, choose colour, upload your logo and preview it live. Bulk printing from Bhavani, Erode.',
      canonical: path,
      jsonLd: [
        breadcrumbLd([['Customized Bags', path]]),
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Custom printed non-woven bags',
          serviceType: 'Bag printing and manufacturing',
          provider: { '@id': businessId },
          areaServed: { '@type': 'State', name: 'Tamil Nadu' },
          url: absolute(path),
        },
      ],
    })

  if (path === paths.bulkOrder)
    return page({
      title: 'Bulk Bag Orders – Get a Quote in Minutes',
      description:
        'Order non-woven, thamboolam and printed bags in bulk. Mix colours, sizes and quantities, estimate your budget and send one enquiry on WhatsApp. Dispatch across Tamil Nadu.',
      canonical: path,
      jsonLd: [breadcrumbLd([['Bulk Order', path]])],
    })

  if (path === paths.about)
    return page({
      title: `About Us – ${site.legalName}, Bhavani`,
      description: `${site.legalName}, founded by ${site.founder}, is a non-woven bag manufacturer in Bhavani, Erode. Consistent GSM, quality checks and on-time dispatch for repeat bulk buyers.`,
      canonical: path,
      image: '/images/about/about-2.webp',
      jsonLd: [breadcrumbLd([['About Us', path]]), { '@context': 'https://schema.org', '@type': 'AboutPage', url: absolute(path), about: { '@id': businessId } }, localBusinessLd()],
    })

  if (path === paths.contact)
    return page({
      title: 'Contact Us – Bhavani, Erode | WhatsApp for Bulk Quotes',
      description: `Contact ${site.legalName}: ${site.phone} / ${site.phone2}, ${site.email}. ${site.address}. WhatsApp for the fastest quotation.`,
      canonical: path,
      jsonLd: [breadcrumbLd([['Contact Us', path]]), { '@context': 'https://schema.org', '@type': 'ContactPage', url: absolute(path), about: { '@id': businessId } }, localBusinessLd()],
    })

  if (path === paths.industries)
    return page({
      title: 'Bags for Shops, Temples & Weddings – Use Cases',
      description:
        'Which bag suits your business? Non-woven and printed bags for supermarkets, textile showrooms, jewellers, medical shops, temples, weddings and events across Tamil Nadu.',
      canonical: path,
      jsonLd: [breadcrumbLd([['Industries & Use Cases', path]])],
    })

  if (path === paths.gallery)
    return page({
      title: 'Gallery – Our Bags, Prints & Production Unit',
      description: 'Photos of our thamboolam bags, kattapai, printed and non-woven bags, and our production unit in Bhavani, Erode.',
      canonical: path,
      image: '/images/about/about-2.webp',
      jsonLd: [breadcrumbLd([['Gallery', path]])],
    })

  if (path === paths.blog)
    return page({
      title: 'Blog – Guides on Non-Woven Bags, GSM & Printing',
      description: 'Practical guides on choosing GSM, bag types (D-cut, W-cut, loop, box), custom printing, store branding and packaging for events and temple functions.',
      canonical: path,
      jsonLd: [breadcrumbLd([['Blog', path]])],
    })

  const policyEntry = (Object.entries(policyPaths) as [PolicySlug, string][]).find(([, p]) => p === path)
  if (policyEntry) {
    const pol = policyPages.find((p) => p.slug === policyEntry[0])!
    return page({ title: pol.title, description: pol.summary, canonical: path, jsonLd: [breadcrumbLd([[pol.title, path]])] })
  }

  const area = areaPages.find((a) => paths.area(a.slug) === path)
  if (area)
    return page({
      title: area.title,
      description: area.description,
      canonical: path,
      image: '/images/about/about-2.webp',
      jsonLd: [breadcrumbLd([[area.h1, path]]), localBusinessLd(), faqLd(area.faqs)],
    })

  const post = seg.length === 1 ? getPost(seg[0]) : undefined
  if (post)
    return page({
      title: post.title,
      description: post.excerpt.replace(post.title, '').trim(),
      canonical: paths.post(post.slug),
      image: post.cover ?? DEFAULT_IMAGE,
      type: 'article',
      jsonLd: [
        breadcrumbLd([
          ['Blog', paths.blog],
          [post.title, paths.post(post.slug)],
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.cover ? absolute(post.cover) : undefined,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Organization', name: site.legalName, url: SITE_URL },
          publisher: { '@id': businessId },
          mainEntityOfPage: absolute(paths.post(post.slug)),
        },
      ],
    })

  return page({ title: 'Page not found', description: 'This page could not be found.', canonical: path, noindex: true })
}

/** Every indexable URL — drives prerendering and sitemap.xml. */
export function allPaths(): string[] {
  return [
    paths.home,
    paths.shop,
    ...categories.map((c) => paths.category(c.slug)),
    ...products.map((p) => paths.product(p.slug)),
    paths.customBags,
    paths.bulkOrder,
    paths.about,
    paths.contact,
    paths.industries,
    paths.gallery,
    ...areaPages.map((a) => paths.area(a.slug)),
    paths.blog,
    ...posts.map((p) => paths.post(p.slug)),
    ...Object.values(policyPaths),
  ]
}
