import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { Calculator, Info, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Select } from '@/components/common/Select'
import { BorderBeam } from '@/components/ui/border-beam'
import { products } from '@/data'
import { formatINR, packQty } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const PRESETS = [500, 1000, 2500, 5000]
const MIN = 100
const MAX = 10000

/** Lowest per-bag price across a product's priced packs (or its piece price). */
function bestRate(p: Product) {
  const fromPacks = p.variants
    .map((v) => ({ v, n: packQty(v.label) }))
    .filter((x) => x.v.price != null && x.n)
    .map((x) => ({ perBag: x.v.price! / x.n!, basis: x.v.label }))
  if (fromPacks.length) return fromPacks.reduce((a, b) => (b.perBag < a.perBag ? b : a))
  return p.price != null && !p.variants.length ? { perBag: p.price, basis: 'per piece' } : null
}

const candidates = (() => {
  const seen = new Set<string>()
  return products
    .map((p) => ({ p, rate: bestRate(p) }))
    .filter((x): x is { p: Product; rate: NonNullable<ReturnType<typeof bestRate>> } => !!x.rate && !seen.has(x.p.name) && !!seen.add(x.p.name))
})()

export interface EstimateLine {
  category: string
  product: string
  qty: number
}

/** Quick budget estimate from listed prices, with one tap to add it to the enquiry. */
export function BulkEstimator({ onAdd }: { onAdd: (line: EstimateLine) => void }) {
  const [slug, setSlug] = useState(candidates[0]?.p.slug ?? '')
  const [qty, setQty] = useState(1000)
  const [added, setAdded] = useState(false)

  const pick = useMemo(() => candidates.find((c) => c.p.slug === slug) ?? candidates[0], [slug])
  const total = pick ? pick.rate.perBag * qty : 0

  // Smoothly count the total up/down when inputs change.
  const mv = useMotionValue(total)
  const shown = useTransform(mv, (v) => formatINR(Math.round(v)))
  useEffect(() => {
    const c = animate(mv, total, { duration: 0.5, ease: 'easeOut' })
    return () => c.stop()
  }, [total, mv])

  if (!pick) return null

  const add = () => {
    onAdd({ category: pick.p.categories[0] ?? '', product: pick.p.slug, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-xl shadow-brand-900/5 sm:p-6">
      <BorderBeam size={140} duration={10} colorFrom="var(--marigold)" colorTo="var(--brand-600)" borderWidth={1.5} />

      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-700 text-marigold">
          <Calculator className="size-5" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-brand-900">Quick bulk estimate</p>
          <p className="text-xs text-muted-foreground">Plan your budget before you enquire</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="grid gap-1.5 text-xs font-medium text-muted-foreground">
          Bag
          <Select
            label="Bag"
            value={slug}
            onChange={setSlug}
            options={candidates.map(({ p, rate }) => ({
              value: p.slug,
              label: p.name,
              description: `≈ ${formatINR(Math.round(rate.perBag * 100) / 100)} per bag`,
              icon: p.images[0] ? <img src={p.images[0].thumb} alt="" className="size-full rounded-md object-cover" /> : undefined,
            }))}
          />
        </div>

        <div className="grid gap-2 text-xs font-medium text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Quantity</span>
            <span className="flex items-center gap-1 rounded-lg border border-input bg-background px-2">
              <input
                type="number"
                inputMode="numeric"
                min={MIN}
                max={MAX * 10}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 0))}
                className="h-8 w-20 bg-transparent text-right text-sm font-semibold text-foreground tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Quantity in pieces"
              />
              <span className="text-xs">pcs</span>
            </span>
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={100}
            value={Math.min(qty, MAX)}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full accent-[var(--brand-700)]"
            aria-label="Quantity slider"
          />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQty(n)}
                className={cn(
                  'inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold transition',
                  qty === n ? 'border-brand-700 bg-brand-700 text-white' : 'border-border text-foreground/75 hover:border-brand-600 hover:text-brand-700',
                )}
              >
                {n.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* result */}
        <div className="rounded-2xl bg-linear-to-br from-brand-50 to-marigold-soft p-4">
          <p className="text-xs font-semibold text-brand-700">Estimated cost</p>
          <motion.p className="font-heading text-4xl font-semibold text-brand-900 tabular-nums">{shown}</motion.p>
          <p className="mt-1 text-xs text-foreground/70">
            {qty.toLocaleString('en-IN')} pcs × ≈ {formatINR(Math.round(pick.rate.perBag * 100) / 100)} per bag
            <span className="text-muted-foreground"> · from listed {pick.rate.basis.toLowerCase()} price</span>
          </p>
        </div>

        <p className="flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
          <Info className="mt-px size-3.5 shrink-0" />
          Guide only. Larger quantities usually get better rates — your final price, GST and freight come in the quotation.
        </p>

        <button
          type="button"
          onClick={add}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.98]',
            added ? 'bg-brand-600 text-white' : 'bg-brand-700 text-white hover:bg-brand-900',
          )}
        >
          <Plus className="size-4" /> {added ? 'Added to your enquiry ↓' : 'Add to my enquiry'}
        </button>
      </div>
    </div>
  )
}
