export interface ProductImage {
  alt: string
  thumb: string
  full: string
}

export interface ProductVariant {
  id: number
  attributes: Record<string, string>
  label: string
  price: number | null
  regularPrice: number | null
  inStock: boolean
}

export interface Product {
  id: number
  slug: string
  name: string
  type: 'simple' | 'variable' | string
  categories: string[]
  tags: string[]
  shortDescription: string
  description: string
  summary: string
  price: number | null
  regularPrice: number | null
  priceRange: { min: number | null; max: number | null } | null
  onSale: boolean
  currency: string
  inStock: boolean
  rating: number
  reviewCount: number
  attributes: { name: string; values: string[] }[]
  variants: ProductVariant[]
  images: ProductImage[]
  sourceUrl: string
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string
  count: number
  image: string | null
}

export interface Post {
  id: number
  slug: string
  date: string
  title: string
  excerpt: string
  content: string
  cover: string | null
}

export interface QuoteItem {
  key: string
  productId: number
  slug: string
  name: string
  image?: string
  variantLabel?: string
  unitPrice: number | null
  qty: number
}
