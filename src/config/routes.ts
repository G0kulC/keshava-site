// Canonical URLs. These deliberately match the old WordPress site (same paths, trailing
// slash) so existing Google rankings and shared links carry over after the migration.

export const SITE_URL = 'https://keshavafabrics.in'

export const paths = {
  home: '/',
  shop: '/shop/',
  category: (slug: string) => `/product-category/${slug}/`,
  product: (slug: string) => `/product/${slug}/`,
  customBags: '/customized-bags/',
  bulkOrder: '/bulk-order/',
  about: '/about-us/',
  contact: '/contact-us/',
  industries: '/industries-use-cases/',
  gallery: '/gallery/',
  blog: '/blog/',
  // WordPress served posts from the site root.
  post: (slug: string) => `/${slug}/`,
  policy: (slug: PolicySlug) => policyPaths[slug],
  area: (slug: string) => `/${slug}/`,
} as const

export type PolicySlug = 'shipping' | 'returns' | 'bulk-orders' | 'privacy' | 'terms'

export const policyPaths: Record<PolicySlug, string> = {
  shipping: '/shipping-policy/',
  returns: '/return-and-refund-policy/',
  'bulk-orders': '/bulk-order-policy/',
  privacy: '/privacy-policy/',
  terms: '/terms-conditions/',
}

export const absolute = (path: string) => `${SITE_URL}${path}`
