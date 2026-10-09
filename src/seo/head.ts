import { absolute } from '@/config/routes'
import { site } from '@/config/site'
import type { PageMeta } from './meta'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// JSON-LD must not contain a raw "</script>".
const json = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c')

const metaTags = (m: PageMeta) => {
  const url = absolute(m.canonical)
  const image = m.image.startsWith('http') ? m.image : absolute(m.image)
  return {
    names: {
      description: m.description,
      robots: m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
      'twitter:card': 'summary_large_image',
      'twitter:title': m.title,
      'twitter:description': m.description,
      'twitter:image': image,
    } as Record<string, string>,
    props: {
      'og:type': m.type === 'article' ? 'article' : m.type === 'product' ? 'product' : 'website',
      'og:site_name': site.name,
      'og:locale': 'en_IN',
      'og:title': m.title,
      'og:description': m.description,
      'og:url': url,
      'og:image': image,
    } as Record<string, string>,
    url,
  }
}

/** <head> HTML for a page — injected by the prerender step. */
export function renderHead(m: PageMeta): string {
  const { names, props, url } = metaTags(m)
  return [
    `<title>${esc(m.title)}</title>`,
    ...Object.entries(names).map(([k, v]) => `<meta name="${k}" content="${esc(v)}" data-seo />`),
    ...Object.entries(props).map(([k, v]) => `<meta property="${k}" content="${esc(v)}" data-seo />`),
    ...(m.noindex ? [] : [`<link rel="canonical" href="${esc(url)}" data-seo />`]),
    ...m.jsonLd.map((o) => `<script type="application/ld+json" data-seo>${json(o)}</script>`),
  ].join('\n    ')
}

/** Keep <head> in sync during client-side navigation. */
export function applyHead(m: PageMeta) {
  const { names, props, url } = metaTags(m)
  document.title = m.title
  document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove())
  const add = (el: HTMLElement) => {
    el.setAttribute('data-seo', '')
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(names)) {
    const el = document.createElement('meta')
    el.name = k
    el.content = v
    add(el)
  }
  for (const [k, v] of Object.entries(props)) {
    const el = document.createElement('meta')
    el.setAttribute('property', k)
    el.content = v
    add(el)
  }
  if (!m.noindex) {
    const link = document.createElement('link')
    link.rel = 'canonical'
    link.href = url
    add(link)
  }
  for (const o of m.jsonLd) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify(o)
    add(s)
  }
}
