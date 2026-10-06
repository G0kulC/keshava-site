import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckCheck, MousePointerClick, Package, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { products } from '@/data'
import { discountPct, formatINR, packQty } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * Animated "how ordering works" demo using real products:
 * 1. pick a bag → 2. choose a pack size → 3. get the quote on WhatsApp.
 */

const steps = [
  { icon: MousePointerClick, label: 'Pick a bag' },
  { icon: Package, label: 'Choose pack' },
  { icon: WhatsAppIcon, label: 'Get quote' },
]

// Phase timings (ms) within one product cycle.
const PHASE_AT = [0, 1500, 3300]
const CYCLE = 6800

const shortPack = (label: string) => {
  const n = packQty(label)
  return n ? `${n} pcs` : label
}

export function HomeHeroShowcase() {
  const reduce = useReducedMotion()

  // Variable products with real pack pricing, one per name, mixed categories.
  const demo = useMemo(() => {
    const seen = new Set<string>()
    return products
      .filter((p) => p.variants.slice(0, 3).every((v) => v.price != null) && p.images.length && !seen.has(p.name) && seen.add(p.name))
      .slice(0, 5)
  }, [])

  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState(reduce ? 2 : 0)
  const p = demo[idx]
  // Demo picks the 3rd pack (or last) — usually the best per-bag value.
  const target = Math.min(2, p.variants.length - 1)
  const [chip, setChip] = useState(0)

  useEffect(() => {
    if (reduce) return
    const timers = [
      setTimeout(() => setPhase(1), PHASE_AT[1]),
      // walk the highlight across the chips like a finger tapping
      ...Array.from({ length: target + 1 }, (_, n) => setTimeout(() => setChip(n), PHASE_AT[1] + 350 + n * 380)),
      setTimeout(() => setPhase(2), PHASE_AT[2]),
      setTimeout(() => {
        setPhase(0)
        setChip(0)
        setIdx((i) => (i + 1) % demo.length)
      }, CYCLE),
    ]
    return () => timers.forEach(clearTimeout)
  }, [idx, reduce, target, demo.length])

  if (!p) return null
  const v = p.variants[reduce ? target : chip]
  const units = packQty(v?.label)
  const perBag = units && v?.price ? Math.round((v.price / units) * 100) / 100 : null
  const off = discountPct(v?.price ?? null, v?.regularPrice ?? null)

  return (
    <div className="relative mx-auto w-full max-w-[540px] pt-14 pb-24 sm:pb-16">
      {/* glow */}
      <div className="pointer-events-none absolute inset-10 rounded-full bg-[radial-gradient(circle,var(--marigold-soft),transparent_65%)] blur-2xl" />

      {/* Stepper */}
      <ol className="absolute inset-x-0 top-0 z-20 mx-auto flex w-fit items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur" aria-label="How ordering works">
        {steps.map(({ icon: Icon, label }, n) => {
          const on = phase >= n
          const now = phase === n
          return (
            <li key={label} className="relative">
              {now && <motion.span layoutId="hero-step" className="absolute inset-0 rounded-full bg-brand-700" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />}
              <span
                className={cn(
                  'relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  now ? 'text-white' : on ? 'text-brand-700' : 'text-muted-foreground',
                )}
              >
                <span className={cn('grid size-5 place-items-center rounded-full text-[10px]', now ? 'bg-white/20' : on ? 'bg-brand-50' : 'bg-muted')}>
                  {on && !now ? <CheckCheck className="size-3" /> : <Icon className="size-3" />}
                </span>
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{n + 1}</span>
              </span>
            </li>
          )
        })}
      </ol>

      {/* Product photo */}
      <div className="relative mx-auto w-[72%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30, rotate: -4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5, scale: phase === 0 ? 1.02 : 1 }}
            exit={{ opacity: 0, y: -20, rotate: 3, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-card shadow-2xl shadow-brand-900/15"
          >
            <Link to={`/product/${p.slug}`} aria-label={p.name}>
              <img src={p.images[0].thumb} alt={p.images[0].alt} className="aspect-square w-full object-cover" />
            </Link>
            {/* tap ripple on "pick" */}
            {phase === 0 && !reduce && (
              <motion.span
                className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-600"
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pack-size card */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            key={`pack-${p.id}`}
            initial={{ opacity: 0, x: -30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
            className="absolute bottom-0 left-0 z-10 w-[min(290px,78%)] rounded-2xl border border-border bg-card p-4 shadow-xl shadow-brand-900/10"
          >
            <p className="line-clamp-1 text-xs font-semibold text-muted-foreground">{p.name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.variants.slice(0, 4).map((x, n) => (
                <span
                  key={x.id}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-300',
                    n === chip ? 'scale-105 border-brand-700 bg-brand-700 text-white' : 'border-border text-foreground/70',
                  )}
                >
                  {shortPack(x.label)}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={v?.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-heading text-2xl font-semibold text-brand-900">
                  {formatINR(v?.price)}
                </motion.span>
              </AnimatePresence>
              {off > 0 && <span className="rounded-md bg-kumkum/10 px-1.5 py-0.5 text-[10px] font-bold text-kumkum">Save {off}%</span>}
            </div>
            {perBag != null && <p className="text-[11px] font-semibold text-brand-700">≈ {formatINR(perBag)} per bag</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp conversation */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key={`wa-${p.id}`}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="absolute top-16 right-0 z-10 w-[min(250px,70%)] space-y-2 sm:top-20 sm:-right-4"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#128c4b]">
              <span className="grid size-6 place-items-center rounded-full bg-whatsapp text-white">
                <WhatsAppIcon className="size-3.5" />
              </span>
              WhatsApp
            </div>
            <div className="rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-xs leading-snug text-[#1f2c1f] shadow-md">
              Hi! I need <strong>{v?.label}</strong> of “{p.name.split(' ').slice(0, 4).join(' ')}…”. Please share a quote.
              <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#5b7c5b]">
                now <CheckCheck className="size-3 text-[#34b7f1]" />
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 1 }}
              className="rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs leading-snug shadow-md"
            >
              Thank you! Sending price & dispatch date for your quantity 🙏
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* reassurance */}
      <div className="absolute right-0 bottom-0 z-0 hidden items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur sm:flex">
        <ShoppingBag className="size-4 text-brand-600" />
        <span>
          <strong>No payment</strong> to enquire
        </span>
      </div>
    </div>
  )
}
