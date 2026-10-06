import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck, ChevronRight, Leaf, Minus, Plus, ShoppingCart, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { ProductCard } from '@/components/shop/ProductCard'
import { WishlistButton } from '@/components/shop/WishlistButton'
import { BlurFade } from '@/components/ui/blur-fade'
import { ShineBorder } from '@/components/ui/shine-border'
import { defaultVariant, getCategory, getProduct, relatedProducts } from '@/data'
import { discountPct, formatINR, packQty } from '@/lib/format'
import { cn } from '@/lib/utils'
import { productEnquiry, waLink } from '@/lib/whatsapp'
import NotFound from '@/pages/NotFound'
import { useQuote } from '@/store/quote'
import { paths } from '@/config/routes'

export default function Product() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  // Remount state when navigating between products.
  return product ? <ProductView key={product.id} slug={slug} /> : <NotFound />
}

function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug)!
  const { add } = useQuote()
  const [imgIdx, setImgIdx] = useState(0)
  const [variantId, setVariantId] = useState(defaultVariant(product)?.id)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'details' | 'specs'>('details')

  const variant = product.variants.find((v) => v.id === variantId)
  const price = variant?.price ?? product.price
  const regular = variant?.regularPrice ?? product.regularPrice
  const off = discountPct(price, regular)
  const units = packQty(variant?.label)
  const perBag = units && price ? price / units : null
  const category = getCategory(product.categories[0])
  const related = relatedProducts(product)
  const image = product.images[imgIdx]

  const addToQuote = () =>
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.thumb,
      variantLabel: variant?.label,
      unitPrice: price,
      qty,
    })

  return (
    <>
      <div className="container-page py-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link to={paths.shop} className="hover:text-foreground">Shop</Link>
          {category && (
            <>
              <ChevronRight className="size-3.5" />
              <Link to={paths.category(category.slug)} className="hover:text-foreground">{category.name}</Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={image?.full}
                  src={image?.full}
                  alt={image?.alt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="size-full object-cover"
                />
              </AnimatePresence>
              {off > 0 && <span className="absolute top-4 left-4 rounded-full bg-kumkum px-3 py-1 text-xs font-bold text-white">Save {off}%</span>}
              <WishlistButton product={product} className="absolute top-4 right-4 size-11 text-lg shadow-sm backdrop-blur" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.thumb}
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      'aspect-square overflow-hidden rounded-xl border-2 bg-muted transition',
                      i === imgIdx ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={img.thumb} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <BlurFade>
            {category && <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">{category.name}</p>}
            <h1 className="mt-2 text-3xl font-semibold text-balance text-brand-900 md:text-4xl">{product.name}</h1>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <span className="font-heading text-4xl font-semibold text-brand-900">{price != null ? formatINR(price) : "Price on request"}</span>
              {off > 0 && <span className="pb-1 text-lg text-muted-foreground line-through">{formatINR(regular)}</span>}
              {perBag && (
                <span className="mb-1 rounded-full bg-marigold-soft px-3 py-1 text-sm font-semibold text-brand-900">≈ {formatINR(Math.round(perBag * 100) / 100)} per bag</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{variant ? `Price for ${variant.label}` : 'Price per piece'} · Bulk discounts on larger quantities</p>

            {product.summary && <p className="mt-6 leading-relaxed text-foreground/80">{product.summary}</p>}

            {product.variants.length > 0 && (
              <fieldset className="mt-7">
                <legend className="mb-3 text-sm font-semibold">{product.attributes[0]?.name ?? 'Option'}</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {product.variants.map((v) => {
                    const active = v.id === variantId
                    const u = packQty(v.label)
                    return (
                      <button
                        key={v.id}
                        onClick={() => setVariantId(v.id)}
                        aria-pressed={active}
                        className={cn(
                          'relative rounded-2xl border-2 p-3 text-left transition',
                          active ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-brand-600/40',
                        )}
                      >
                        <span className="block text-sm font-semibold">{v.label}</span>
                        <span className="block text-sm text-brand-700">{v.price != null ? formatINR(v.price) : "On request"}</span>
                        {u && v.price && <span className="block text-[11px] text-muted-foreground">{formatINR(Math.round((v.price / u) * 100) / 100)}/bag</span>}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-13 items-center justify-between rounded-full border border-border bg-card px-1.5 sm:w-40">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Decrease quantity">
                  <Minus className="size-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 bg-transparent text-center font-semibold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button onClick={() => setQty((q) => q + 1)} className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Increase quantity">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={addToQuote}
                className="relative flex h-13 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-700 font-semibold text-white transition hover:bg-brand-900 active:scale-[0.98]"
              >
                <ShoppingCart className="size-5" /> Add to cart
              </button>
            </div>
            <a
              href={waLink(productEnquiry(product.name, variant ? `${variant.label} × ${qty}` : `qty ${qty}`))}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex h-13 items-center justify-center gap-2 rounded-full border-2 border-whatsapp font-semibold text-[#128c4b] transition hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon /> Ask on WhatsApp
            </a>

            <div className="relative mt-7 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl bg-card p-4 text-center text-xs">
              <ShineBorder shineColor={['var(--brand-600)', 'var(--marigold)']} />
              {[
                { icon: Leaf, text: 'Eco-friendly & reusable' },
                { icon: BadgeCheck, text: 'Quality-checked batches' },
                { icon: Truck, text: 'Planned dispatch' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5">
                  <Icon className="size-5 text-brand-600" />
                  <span className="text-foreground/75">{text}</span>
                </div>
              ))}
            </div>

            {/* Details tabs */}
            <div className="mt-10">
              <div className="flex gap-6 border-b border-border" role="tablist">
                {(['details', 'specs'] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn('relative pb-3 text-sm font-semibold capitalize', tab === t ? 'text-brand-700' : 'text-muted-foreground')}
                  >
                    {t === 'details' ? 'Description' : 'Highlights & specs'}
                    {tab === t && <motion.span layoutId="pdp-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-700" />}
                  </button>
                ))}
              </div>
              <div
                className="prose-kf pt-5"
                // Content is our own sanitised product copy from the scraper (tags whitelisted).
                dangerouslySetInnerHTML={{ __html: (tab === 'details' ? product.description : product.shortDescription) || '<p>Contact us for full specifications.</p>' }}
              />
            </div>
          </BlurFade>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow="You may also like" title="Similar bags" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
