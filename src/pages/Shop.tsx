import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpDown, IndianRupee, Search, X } from 'lucide-react'
import { useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Select } from '@/components/common/Select'
import { ProductCard } from '@/components/shop/ProductCard'
import { BlurFade } from '@/components/ui/blur-fade'
import { categories, fromPrice, products } from '@/data'
import { cn } from '@/lib/utils'

const sorts = {
  popular: 'Recommended',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  name: 'Name A–Z',
} as const
type SortKey = keyof typeof sorts

const priceBands = [
  { id: 'all', label: 'Any price' },
  { id: 'u250', label: 'Under ₹250', test: (n: number) => n < 250 },
  { id: '250-500', label: '₹250 – ₹500', test: (n: number) => n >= 250 && n <= 500 },
  { id: 'o500', label: 'Above ₹500', test: (n: number) => n > 500 },
] as const

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const sort = (params.get('sort') as SortKey) ?? 'popular'
  const band = params.get('price') ?? 'all'
  const deferredQ = useDeferredValue(q)

  const update = (key: string, value: string, fallback = 'all') => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const needle = deferredQ.trim().toLowerCase()
    const test = priceBands.find((b) => b.id === band)
    let list = products.filter(
      (p) =>
        (category === 'all' || p.categories.includes(category)) &&
        (!needle || `${p.name} ${p.summary} ${p.tags.join(' ')}`.toLowerCase().includes(needle)) &&
        (!test || !('test' in test) || test.test(fromPrice(p) ?? 0)),
    )
    if (sort === 'price-asc') list = list.toSorted((a, b) => (fromPrice(a) ?? 0) - (fromPrice(b) ?? 0))
    if (sort === 'price-desc') list = list.toSorted((a, b) => (fromPrice(b) ?? 0) - (fromPrice(a) ?? 0))
    if (sort === 'name') list = list.toSorted((a, b) => a.name.localeCompare(b.name))
    return list
  }, [deferredQ, category, sort, band])

  const activeCat = categories.find((c) => c.slug === category)
  const hasFilters = q || category !== 'all' || band !== 'all'

  return (
    <div className="container-page py-10 md:py-14">
      <BlurFade>
        <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">Shop</p>
        <h1 className="mt-2 text-4xl font-semibold text-brand-900 md:text-5xl">{activeCat ? activeCat.name : 'All bags'}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Prices shown are per pack or per piece as listed. Add what you need to your cart and send it on WhatsApp — we confirm final price for your quantity.
        </p>
      </BlurFade>

      {/* Search + sort */}
      <div className="relative z-30 -mx-4 mt-8 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:px-3 md:sticky md:top-16 lg:top-[76px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => update('q', e.target.value, '')}
              placeholder="Search Ganesha, kattapai, camouflage…"
              className="h-11 w-full rounded-xl border border-input bg-card pr-10 pl-10 text-sm outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15"
            />
            {q && (
              <button onClick={() => update('q', '', '')} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" aria-label="Clear search">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="grid grid-cols-2 gap-2 md:flex">
            <Select
              label="Price"
              className="md:w-44"
              value={band}
              onChange={(v) => update('price', v)}
              leading={<IndianRupee className="size-4 text-muted-foreground" />}
              options={priceBands.map((b) => ({ value: b.id, label: b.label }))}
            />
            <Select
              label="Sort by"
              className="md:w-52"
              value={sort}
              onChange={(v) => update('sort', v, 'popular')}
              leading={<ArrowUpDown className="size-4 text-muted-foreground" />}
              options={(Object.entries(sorts) as [SortKey, string][]).map(([k, v]) => ({ value: k, label: v }))}
            />
          </div>
        </div>

        {/* Category chips — horizontally scrollable on phones */}
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Categories">
          {[{ slug: 'all', name: 'All', count: products.length }, ...categories].map((c) => {
            const active = category === c.slug
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={active}
                onClick={() => update('category', c.slug)}
                className={cn(
                  'relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active ? 'text-white' : 'bg-muted text-foreground/75 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                {active && <motion.span layoutId="cat-chip" className="absolute inset-0 -z-0 rounded-full bg-brand-700" transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }} />}
                <span className="relative">
                  {c.name} <span className={cn('ml-1 text-xs', active ? 'text-white/70' : 'text-muted-foreground')}>{c.count}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground" aria-live="polite">
        <span>
          Showing <strong className="text-foreground">{results.length}</strong> {results.length === 1 ? 'product' : 'products'}
        </span>
        {hasFilters && (
          <button onClick={() => setParams({}, { replace: true })} className="font-semibold text-brand-700 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length ? (
        <motion.div layout className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">No bags match that search</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different word, or tell us what you need — we make custom bags too.</p>
          <button onClick={() => setParams({}, { replace: true })} className="mt-5 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
            Show all products
          </button>
        </div>
      )}
    </div>
  )
}
