import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { Faq } from '@/data/seo'
import { cn } from '@/lib/utils'

/** Accessible FAQ accordion. Answers stay in the HTML (hidden visually) so they are indexable. */
export function Faqs({ faqs, className }: { faqs: Faq[]; className?: string }) {
  const [open, setOpen] = useState(0)
  return (
    <ul className={cn('divide-y divide-border rounded-3xl border border-border bg-card', className)}>
      {faqs.map((f, i) => (
        <li key={f.q}>
          <h3>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-sans text-base font-semibold"
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              {f.q}
              <ChevronDown className={cn('size-4 shrink-0 transition-transform', open === i && 'rotate-180')} />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i ? (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </motion.div>
            ) : (
              <p className="sr-only">{f.a}</p>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  )
}
