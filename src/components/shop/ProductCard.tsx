import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronRight, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, defaultVariant } from '@/data'
import { discountPct, formatINR, packQty } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useQuote } from '@/store/quote'
import type { Product } from '@/types'

const MAX_CHIPS = 4

/** "Pack of 100" → "100 pcs" so chips stay short and scannable. */
const shortPack = (label: string) => {
  const n = packQty(label)
  return n ? `${n.toLocaleString('en-IN')} pcs` : label
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { add } = useQuote()
  const [variantId, setVariantId] = useState(defaultVariant(product)?.id)
  const [added, setAdded] = useState(false)

  const [img, hover] = product.images
  const variant = product.variants.find((v) => v.id === variantId)
  const price = variant?.price ?? product.price
  const regular = variant?.regularPrice ?? product.regularPrice
  const off = discountPct(price, regular)
  const units = packQty(variant?.label)
  const perBag = units && price ? round2(price / units) : null
  const cat = categories.find((c) => c.slug === product.categories[0])
  const href = `/product/${product.slug}`
  const extra = product.variants.length - MAX_CHIPS

  const addToQuote = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: img?.thumb,
      variantLabel: variant?.label,
      unitPrice: price,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-[box-shadow,border-color] hover:border-brand-600/30 hover:shadow-xl hover:shadow-brand-900/5"
    >
      {/* Photo — kept clean so the printed brand mark is never covered */}
      <Link to={href} className="relative block aspect-square overflow-hidden bg-muted" aria-label={product.name}>
        {img && <img src={img.thumb} alt={img.alt} width={600} height={600} loading={priority ? 'eager' : 'lazy'} decoding="async" className="size-full object-cover" />}
        {hover && (
          <img
            src={hover.thumb}
            alt=""
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <span className="absolute right-3 bottom-3 inline-flex translate-y-2 items-center gap-1 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold text-brand-900 opacity-0 shadow-sm backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
          View details <ChevronRight className="size-3.5" />
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-5">
        {cat && <p className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase">{cat.name}</p>}
        <h3 className="mt-1 line-clamp-2 min-h-[2.6em] font-sans text-[15px] leading-snug font-semibold">
          <Link to={href} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>

        {/* Pack-size chips: pick one and the price below updates */}
        {product.variants.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">Pack size</p>
            {/* one swipeable row on phones, wraps on larger cards */}
            <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden" role="radiogroup" aria-label="Pack size">
              {product.variants.slice(0, MAX_CHIPS).map((v) => {
                const on = v.id === variantId
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      'inline-flex min-h-8 shrink-0 items-center rounded-full border px-2.5 text-[11px] font-semibold whitespace-nowrap transition sm:px-3 sm:text-xs',
                      on ? 'border-brand-700 bg-brand-700 text-white' : 'border-border bg-background text-foreground/75 hover:border-brand-600 hover:text-brand-700',
                    )}
                  >
                    {shortPack(v.label)}
                  </button>
                )
              })}
              {extra > 0 && (
                <Link to={href} className="inline-flex min-h-8 shrink-0 items-center rounded-full border border-dashed border-border px-2.5 text-[11px] font-semibold whitespace-nowrap text-muted-foreground hover:text-brand-700 sm:px-3 sm:text-xs">
                  +{extra} more
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Price block */}
        <div className="mt-auto pt-3 sm:pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={price}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={cn('font-heading font-semibold text-brand-900', price != null ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg')}
              >
                {price != null ? formatINR(price) : 'Price on request'}
              </motion.span>
            </AnimatePresence>
            {off > 0 && <span className="text-xs text-muted-foreground line-through sm:text-sm">{formatINR(regular)}</span>}
            {off > 0 && <span className="rounded-md bg-kumkum/10 px-1.5 py-0.5 text-[11px] font-bold text-kumkum">Save {off}%</span>}
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
            {variant && price == null ? (
              <>We'll share the price for this pack</>
            ) : variant ? (
              <>
                <span className="block sm:inline">for {variant.label.toLowerCase()}</span>
                {perBag != null && (
                  <>
                    <span className="hidden sm:inline"> · </span>
                    <span className="block font-semibold text-brand-700 sm:inline">≈ {formatINR(perBag)} per bag</span>
                  </>
                )}
              </>
            ) : (
              'per piece'
            )}
          </p>

          <button
            type="button"
            onClick={addToQuote}
            className={cn(
              'mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition active:scale-[0.98] sm:mt-4 sm:h-11 sm:gap-2 sm:text-sm',
              added ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-900 hover:bg-brand-700 hover:text-white',
            )}
            aria-label={`Add ${product.name}${variant ? `, ${variant.label},` : ''} to cart`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(added)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
                {added ? 'Added' : 'Add to cart'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  )
}
