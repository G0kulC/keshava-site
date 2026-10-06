import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { useOutsidePress, usePopover } from '@/hooks/usePopover'
import { cn } from '@/lib/utils'

// Narrow screens (< 640px) show the calendar as a bottom sheet.
const NARROW = '(max-width: 639px)'
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(NARROW)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const useIsNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW).matches, () => false)

// ── date helpers (local time, ISO yyyy-mm-dd strings) ─────────────────
const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthLabel = (d: Date) => d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
const longLabel = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

/** 6×7 grid of dates covering the month (leading/trailing days from neighbours). */
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

interface Props {
  value: string // '' or yyyy-mm-dd
  onChange: (iso: string) => void
  label?: string
  placeholder?: string
  /** Earliest selectable date (defaults to today). Pass null to allow past dates. */
  min?: Date | null
  className?: string
}

export function DatePicker({ value, onChange, label = 'Date', placeholder = 'Pick a date', min, className }: Props) {
  const today = startOfDay(new Date())
  const minDate = min === null ? null : startOfDay(min ?? today)
  const selected = value ? fromISO(value) : null

  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => addMonths(selected ?? today, 0))
  const [focus, setFocus] = useState<Date>(selected ?? today)
  const [dir, setDir] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const id = useId()

  // Phones get a bottom sheet; larger screens a compact fixed-width popover.
  const isSheet = useIsNarrow()
  const { style } = usePopover(triggerRef, open && !isSheet, { fixedWidth: 320, estHeight: 420 })
  const close = useCallback(() => setOpen(false), [])
  useOutsidePress([rootRef, panelRef], open, close)

  const isDisabled = (d: Date) => !!minDate && d < minDate

  const openPanel = () => {
    const base = selected ?? (minDate && today < minDate ? minDate : today)
    setMonth(addMonths(base, 0))
    setFocus(base)
    setOpen(true)
  }

  const go = (n: number) => {
    setDir(n)
    setMonth((m) => addMonths(m, n))
  }

  const pick = (d: Date) => {
    if (isDisabled(d)) return
    onChange(toISO(d))
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Move keyboard focus to the focused day button whenever it changes.
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISO(focus)}"]`)?.focus({ preventScroll: true })
  }, [focus, open, month])

  const moveFocus = (d: Date) => {
    setFocus(d)
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      setDir(d > month ? 1 : -1)
      setMonth(addMonths(d, 0))
    }
  }

  const onGridKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (e.key in map) {
      e.preventDefault()
      moveFocus(addDays(focus, map[e.key]))
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault()
      const n = e.key === 'PageUp' ? -1 : 1
      moveFocus(new Date(focus.getFullYear(), focus.getMonth() + n, Math.min(focus.getDate(), 28)))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(focus)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  const quick = [
    { label: 'In 1 week', d: addDays(today, 7) },
    { label: 'In 2 weeks', d: addDays(today, 14) },
    { label: 'In 1 month', d: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()) },
  ]
  // Don't page back past the month containing the earliest allowed date.
  const canPrev = !minDate || month > addMonths(minDate, 0)

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          aria-label={selected ? `${label}: ${longLabel(selected)}` : label}
          onClick={() => (open ? setOpen(false) : openPanel())}
          onKeyDown={(e) => {
            if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              openPanel()
            }
          }}
          className={cn(
            'flex h-11 w-full items-center gap-2.5 rounded-xl border bg-background px-3.5 text-left text-sm transition outline-none',
            open ? 'border-brand-600 ring-3 ring-brand-600/15' : 'border-input hover:border-brand-600/50 focus-visible:border-brand-600 focus-visible:ring-3 focus-visible:ring-brand-600/15',
          )}
        >
          <CalendarDays className={cn('size-4 shrink-0', selected ? 'text-brand-600' : 'text-muted-foreground')} />
          <span className={cn('flex-1 truncate font-medium', !selected && 'font-normal text-muted-foreground')}>{selected ? longLabel(selected) : placeholder}</span>
        </button>
        {selected && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Clear ${label}`}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {open && isSheet && (
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[69] bg-brand-900/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
          )}
          {open && (
            <motion.div
              key="panel"
              ref={panelRef}
              id={`${id}-panel`}
              role="dialog"
              aria-modal={isSheet || undefined}
              aria-label={`Choose ${label}`}
              style={isSheet ? undefined : { ...style, maxHeight: undefined }}
              initial={isSheet ? { y: '100%' } : { opacity: 0, y: -6, scale: 0.98 }}
              animate={isSheet ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isSheet ? { y: '100%' } : { opacity: 0, y: -6, scale: 0.98 }}
              transition={isSheet ? { type: 'spring', damping: 30, stiffness: 320 } : { duration: 0.16 }}
              className={cn(
                'bg-popover shadow-xl shadow-brand-900/15',
                isSheet
                  ? 'fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]'
                  : 'rounded-2xl border border-border p-3',
              )}
            >
              {isSheet && (
                <div className="mx-auto mb-3 max-w-sm">
                  <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-border" />
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{label}</p>
                    <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-muted" aria-label="Close">
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              )}
              <div className={cn(isSheet && 'mx-auto max-w-sm')}>
              {/* header */}
              <div className="flex items-center justify-between px-1 pb-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={!canPrev}
                  className="grid size-8 place-items-center rounded-full hover:bg-muted disabled:opacity-30"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={month.toISOString()}
                    initial={{ opacity: 0, y: dir >= 0 ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: dir >= 0 ? -8 : 8 }}
                    className="font-heading text-base font-semibold text-brand-900"
                    aria-live="polite"
                  >
                    {monthLabel(month)}
                  </motion.p>
                </AnimatePresence>
                <button type="button" onClick={() => go(1)} className="grid size-8 place-items-center rounded-full hover:bg-muted" aria-label="Next month">
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* weekdays */}
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-muted-foreground">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-1.5">
                    {w}
                  </span>
                ))}
              </div>

              {/* days */}
              <div className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={month.toISOString()}
                    role="grid"
                    aria-label={monthLabel(month)}
                    onKeyDown={onGridKey}
                    initial={{ opacity: 0, x: dir >= 0 ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir >= 0 ? -40 : 40 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-7 gap-0.5"
                  >
                    {monthGrid(month).map((d) => {
                      const outside = d.getMonth() !== month.getMonth()
                      const disabled = isDisabled(d)
                      const isSel = selected && sameDay(d, selected)
                      const isToday = sameDay(d, today)
                      const isFocus = sameDay(d, focus)
                      return (
                        <button
                          key={toISO(d)}
                          type="button"
                          data-date={toISO(d)}
                          tabIndex={isFocus ? 0 : -1}
                          disabled={disabled}
                          onClick={() => pick(d)}
                          aria-selected={!!isSel}
                          aria-current={isToday ? 'date' : undefined}
                          aria-label={longLabel(d)}
                          className={cn(
                            'relative grid h-10 place-items-center rounded-xl text-sm tabular-nums transition outline-none',
                            outside && 'text-muted-foreground/50',
                            disabled ? 'cursor-not-allowed text-muted-foreground/30 line-through decoration-1' : 'hover:bg-brand-50',
                            isSel && 'bg-brand-700 font-semibold text-white hover:bg-brand-700',
                            !isSel && isToday && 'font-bold text-brand-700',
                            'focus-visible:ring-2 focus-visible:ring-brand-600',
                          )}
                        >
                          {d.getDate()}
                          {isToday && !isSel && <span className="absolute bottom-1 size-1 rounded-full bg-marigold" />}
                        </button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* quick picks */}
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {quick.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => pick(q.d)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                      selected && sameDay(selected, q.d) ? 'border-brand-700 bg-brand-700 text-white' : 'border-border hover:border-brand-600 hover:text-brand-700',
                    )}
                  >
                    {q.label}
                  </button>
                ))}
                {selected && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange('')
                      setOpen(false)
                    }}
                    className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
                  >
                    Clear
                  </button>
                )}
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

/** Human label for an ISO date, e.g. "Wed, 14 Oct 2026". */
export const formatISODate = (iso: string) => (iso ? longLabel(fromISO(iso)) : '')
