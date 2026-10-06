import { motion, useInView, useReducedMotion } from 'motion/react'
import { Check, ClipboardList, Factory, Package, PackageCheck, PenTool, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const steps = [
  { icon: ClipboardList, title: 'Requirement', text: 'Share bag type, size, quantity, printing and delivery city.' },
  { icon: PenTool, title: 'Design', text: 'We prepare the layout and finalise print details with you.' },
  { icon: Factory, title: 'Production', text: 'After your approval, the order moves into production.' },
  { icon: ShieldCheck, title: 'Quality check', text: 'Every batch is checked for finishing, print and strength.' },
  { icon: PackageCheck, title: 'Packing', text: 'Bags are packed securely for safe, organised shipment.' },
  { icon: Truck, title: 'Delivery', text: 'Dispatched on the planned date, with updates on the way.' },
]

const LAST = steps.length - 1
const STEP_MS = 650

/**
 * Animated order-flow timeline. When it scrolls into view, steps light up one by one
 * while a progress line fills; once complete, a parcel keeps travelling the route.
 * Horizontal on desktop, vertical on phones. Steps are clickable.
 */
export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()
  const [active, setActive] = useState(reduce ? LAST : -1)
  const [auto, setAuto] = useState(true)
  const done = active >= LAST

  useEffect(() => {
    if (!inView || reduce || !auto || done) return
    const t = setTimeout(() => setActive((a) => a + 1), active < 0 ? 250 : STEP_MS)
    return () => clearTimeout(t)
  }, [inView, reduce, auto, active, done])

  const pick = (i: number) => {
    setAuto(false)
    setActive(i)
  }

  const progress = Math.max(0, active) / LAST

  return (
    <div ref={ref} className="relative">
      {/* ── Desktop: horizontal track ───────────────────────────── */}
      <div className="relative hidden lg:block">
        {/* track spans centre of first node → centre of last node */}
        <div className="absolute top-7 right-[calc(100%/12)] left-[calc(100%/12)] h-1 -translate-y-1/2 rounded-full bg-border">
          <motion.div
            className="h-full origin-left rounded-full bg-linear-to-r from-brand-600 via-brand-700 to-marigold"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          />
          {done && !reduce && <TravellingParcel axis="x" />}
        </div>

        <ol className="relative grid grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center text-center">
              <Node step={s} i={i} active={active} onPick={pick} />
              <StepText step={s} i={i} active={active} className="mt-5 px-1" />
            </li>
          ))}
        </ol>
      </div>

      {/* ── Mobile / tablet: vertical timeline ─────────────────── */}
      <div className="relative lg:hidden">
        <div className="absolute top-7 bottom-7 left-7 w-1 -translate-x-1/2 rounded-full bg-border">
          <motion.div
            className="w-full origin-top rounded-full bg-linear-to-b from-brand-600 via-brand-700 to-marigold"
            style={{ height: '100%' }}
            initial={false}
            animate={{ scaleY: progress }}
            transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          />
          {done && !reduce && <TravellingParcel axis="y" />}
        </div>
        <ol className="relative space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <Node step={s} i={i} active={active} onPick={pick} />
              <StepText step={s} i={i} active={active} className="pt-1.5" />
            </li>
          ))}
        </ol>
      </div>

      {/* status line */}
      <motion.p
        className="mt-10 text-center text-sm font-medium text-muted-foreground"
        animate={{ opacity: active >= 0 ? 1 : 0 }}
        aria-live="polite"
      >
        {done ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-brand-700">
            <Check className="size-4" /> Delivered on your date — with updates at every step
          </span>
        ) : (
          <>
            Step {Math.max(0, active) + 1} of {steps.length}: <span className="text-foreground">{steps[Math.max(0, active)].title}</span>
          </>
        )}
      </motion.p>
    </div>
  )
}

function Node({ step, i, active, onPick }: { step: (typeof steps)[number]; i: number; active: number; onPick: (i: number) => void }) {
  const Icon = step.icon
  const reached = i <= active
  const current = i === active
  return (
    <button
      type="button"
      onClick={() => onPick(i)}
      aria-label={`Step ${i + 1}: ${step.title}`}
      aria-current={current ? 'step' : undefined}
      className="relative z-10 shrink-0 outline-none focus-visible:ring-3 focus-visible:ring-brand-600/30 rounded-full"
    >
      {/* pulse ring on the current step */}
      {current && (
        <motion.span
          className="absolute inset-0 rounded-full bg-brand-600/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.7, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <motion.span
        className={cn(
          'relative grid size-14 place-items-center rounded-full border-2 transition-colors duration-500',
          reached ? 'border-brand-700 bg-brand-700 text-white shadow-lg shadow-brand-700/25' : 'border-border bg-card text-muted-foreground',
        )}
        animate={{ scale: current ? 1.12 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Icon className="size-6" />
      </motion.span>
      <span
        className={cn(
          'absolute -top-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-background text-[11px] font-bold transition-colors duration-500',
          reached ? 'bg-marigold text-brand-900' : 'bg-muted text-muted-foreground',
        )}
      >
        {i < active ? <Check className="size-3" strokeWidth={3} /> : i + 1}
      </span>
    </button>
  )
}

function StepText({ step, i, active, className }: { step: (typeof steps)[number]; i: number; active: number; className?: string }) {
  const reached = i <= active
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: reached ? 1 : 0.45, y: reached ? 0 : 6 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className={cn('font-sans text-base font-semibold transition-colors', reached ? 'text-brand-900' : 'text-foreground/70')}>{step.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
    </motion.div>
  )
}

/** Small parcel that loops along the finished route. */
function TravellingParcel({ axis }: { axis: 'x' | 'y' }) {
  const anim = axis === 'x' ? { left: ['0%', '100%'] } : { top: ['0%', '100%'] }
  return (
    <motion.span
      className={cn(
        'absolute grid size-7 place-items-center rounded-full bg-marigold text-brand-900 shadow-md',
        axis === 'x' ? 'top-1/2 -translate-x-1/2 -translate-y-1/2' : 'left-1/2 -translate-x-1/2 -translate-y-1/2',
      )}
      initial={{ opacity: 0 }}
      animate={{ ...anim, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
      aria-hidden
    >
      <Package className="size-3.5" />
    </motion.span>
  )
}
