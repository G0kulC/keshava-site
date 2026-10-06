// Data access layer. Today it reads static JSON; when the admin panel / API lands,
// only this file needs to change (e.g. swap to fetch + React Query).
import { packQty } from '@/lib/format'
import type { Category, Post, Product } from '@/types'
import categoriesJson from './categories.json'
import postsJson from './posts.json'
import productsJson from './products.json'

// The live store has pack sizes saved with a ₹0 price (not filled in yet). Treat those as
// "price on request", and always list packs smallest → largest.
const priced = (n: number | null) => (n && n > 0 ? n : null)
const normalise = (p: Product): Product => ({
  ...p,
  price: priced(p.price),
  regularPrice: priced(p.regularPrice),
  variants: p.variants
    .map((v) => ({ ...v, price: priced(v.price), regularPrice: priced(v.regularPrice) }))
    .toSorted((a, b) => (packQty(a.label) ?? 0) - (packQty(b.label) ?? 0)),
})

export const products = (productsJson as Product[]).map(normalise)

/** First pack that actually has a price (falls back to the first pack). */
export const defaultVariant = (p: Product) => p.variants.find((v) => v.price != null) ?? p.variants[0]
export const categories = categoriesJson as Category[]
export const posts = (postsJson as Post[]).toSorted((a, b) => b.date.localeCompare(a.date))

export const getProduct = (slug: string) => products.find((p) => p.slug === slug)
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug)
export const getPost = (slug: string) => posts.find((p) => p.slug === slug)

export const productsInCategory = (slug: string) => products.filter((p) => p.categories.includes(slug))

export function relatedProducts(p: Product, limit = 4) {
  const scored = products
    .filter((x) => x.id !== p.id)
    .map((x) => ({ x, score: x.categories.filter((c) => p.categories.includes(c)).length }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.x)
}

/** Lowest price a customer can pay for this product (variant-aware). */
export const fromPrice = (p: Product) => p.priceRange?.min ?? p.price

export const featuredProducts = () => {
  // Show variety: best discounts first, one per name to avoid near-duplicates.
  const seen = new Set<string>()
  return products
    .toSorted((a, b) => (b.regularPrice ?? 0) / (b.price || 1) - (a.regularPrice ?? 0) / (a.price || 1))
    .filter((p) => (seen.has(p.name) ? false : (seen.add(p.name), true)))
    .slice(0, 8)
}
