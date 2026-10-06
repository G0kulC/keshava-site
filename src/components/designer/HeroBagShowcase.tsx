import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Layers, Palette, Printer, Ruler, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BorderBeam } from '@/components/ui/border-beam'
import { productsInCategory } from '@/data'
import { BagDefs, bagShapes, VIEW, type BagKind } from './bagShapes'

// Each slide = one bag style in a colour, with the "customer logo" printed on.
const slides: { kind: BagKind; color: string; ink: string; brand: string; colorName: string }[] = [
  { kind: 'loop', color: '#2f8a4c', ink: '#ffffff', brand: 'GREEN MART', colorName: 'Green' },
  { kind: 'kattapai', color: '#efe3c4', ink: '#7a1f2b', brand: 'SRI TEXTILES', colorName: 'Cream' },
  { kind: 'd-cut', color: '#c8282d', ink: '#ffffff', brand: 'CITY BAZAAR', colorName: 'Red' },
  { kind: 'box', color: '#1f2f5c', ink: '#f2c230', brand: 'GOLD JEWELS', colorName: 'Navy' },
  { kind: 'w-cut', color: '#f2c230', ink: '#1f5c3a', brand: 'FRESH DAILY', colorName: 'Yellow' },
]

const chips = [
  { icon: Layers, text: '6 bag styles', pos: 'left-0 top-[14%]', delay: 0 },
  { icon: Printer, text: '1 or 2 side print', pos: 'right-0 top-[30%]', delay: 0.6 },
  { icon: Ruler, text: '20–150 GSM', pos: 'left-2 bottom-[26%]', delay: 1.2 },
  { icon: Palette, text: 'Any colour', pos: 'right-4 bottom-[12%]', delay: 1.8 },
]

export function HeroBagShowcase({ onTry }: { onTry?: () => void }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const slide = slides[i]
  const shape = bagShapes[slide.kind]
  const P = shape.print
  const photos = productsInCategory('custom-printed-bags').slice(0, 2)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 3200)
    return () => clearInterval(t)
  }, [reduce])

  // Logo emblem sized to the print area.
  const r = Math.min(P.w, P.h) * 0.3
  const cx = P.x + P.w / 2
  const cy = P.y + P.h * 0.45
  const star = `M${cx} ${cy - r * 0.55} l${r * 0.14} ${r * 0.32} ${r * 0.34} 0 -${r * 0.27} ${r * 0.2} ${r * 0.1} ${r * 0.34} -${r * 0.31} -${r * 0.2} -${r * 0.31} ${r * 0.2} ${r * 0.1} -${r * 0.34} -${r * 0.27} -${r * 0.2} ${r * 0.34} 0z`

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* stage */}
      <div className="absolute inset-[8%] overflow-hidden rounded-[2.5rem] border border-white bg-[radial-gradient(circle_at_50%_35%,#fff,var(--brand-50)_60%,var(--marigold-soft))] shadow-2xl shadow-brand-900/10">
        <BorderBeam size={160} duration={9} colorFrom="var(--marigold)" colorTo="var(--brand-600)" borderWidth={2} />
        <div className="absolute inset-x-0 top-3 z-10 flex justify-center sm:top-5">
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-brand-900 shadow-sm backdrop-blur"
            >
              {shape.label} · {slide.colorName}
            </motion.span>
          </AnimatePresence>
        </div>

        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="absolute inset-x-[10%] top-[14%] bottom-[10%] m-auto h-[74%] w-[80%] sm:top-[11%] sm:bottom-[12%] sm:h-[78%]" aria-hidden>
          <BagDefs />
          <ellipse cx="200" cy="462" rx="140" ry="9" fill="rgba(0,0,0,.12)" />
          <AnimatePresence mode="wait">
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              style={{ transformOrigin: '200px 280px' }}
            >
              {shape.Back({ color: slide.color, handle: slide.color })}

              {/* "printing": outline draws on, then fill + text fade in, while the print-head sweeps */}
              <g fill="none" stroke={slide.ink} strokeLinecap="round" strokeLinejoin="round">
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  strokeWidth="5"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.9, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={r - 10}
                  strokeWidth="1.5"
                  strokeDasharray="3 4"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                />
                <motion.path
                  d={star}
                  strokeWidth="3"
                  initial={{ pathLength: reduce ? 1 : 0, fill: 'rgba(0,0,0,0)' }}
                  animate={{ pathLength: 1, fill: slide.ink }}
                  transition={{ pathLength: { delay: 0.5, duration: 0.8 }, fill: { delay: 1.2, duration: 0.4 } }}
                />
              </g>
              <motion.g
                fill={slide.ink}
                initial={{ opacity: reduce ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15, duration: 0.45 }}
              >
                <text x={cx} y={cy + r * 0.38} textAnchor="middle" fontSize={r * 0.24} fontWeight="800" fontFamily="'Arial Black', Arial, sans-serif">
                  {slide.brand}
                </text>
                <text x={cx} y={cy + r + 34} textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="'Trebuchet MS', sans-serif" letterSpacing="2" opacity=".85">
                  ★ THANK YOU ★
                </text>
              </motion.g>

              {/* print-head light sweeping down (y attr fixed; motion only translates) */}
              {!reduce && (
                <motion.rect
                  x={P.x - 6}
                  y={P.y}
                  width={P.w + 12}
                  height="6"
                  rx="3"
                  fill="var(--marigold)"
                  initial={{ translateY: 0, opacity: 0 }}
                  animate={{ translateY: P.h, opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 0.3, duration: 1.2, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px var(--marigold))' }}
                />
              )}

              {shape.Front({ color: slide.color, handle: slide.color })}
            </motion.g>
          </AnimatePresence>
        </svg>

        {/* progress dots */}
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-1.5">
          {slides.map((s, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Show ${bagShapes[s.kind].label}`}
              className="grid size-7 place-items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all ${n === i ? 'w-6 bg-brand-700' : 'w-1.5 bg-brand-900/20'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* floating feature chips */}
      {chips.map(({ icon: Icon, text, pos, delay }) => (
        <motion.div
          key={text}
          className={`absolute ${pos} hidden items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur sm:flex`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 0.3 + delay * 0.3 }, scale: { delay: 0.3 + delay * 0.3 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } }}
        >
          <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Icon className="size-4" />
          </span>
          {text}
        </motion.div>
      ))}

      {/* real custom-print samples */}
      {photos.map((p, n) => (
        <motion.img
          key={p.id}
          src={p.images[0]?.thumb}
          alt={p.name}
          className={`absolute hidden w-[22%] rounded-2xl border-4 border-white bg-white shadow-xl lg:block ${n ? '-right-2 top-[2%] rotate-6' : '-left-2 bottom-0 -rotate-6'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + n * 0.2 }}
        />
      ))}

      {onTry && (
        <motion.button
          onClick={onTry}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-xl transition hover:bg-brand-700"
        >
          <Sparkles className="size-4 text-marigold" /> Try it with your logo
        </motion.button>
      )}
    </div>
  )
}
