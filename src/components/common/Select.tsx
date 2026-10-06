import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useOutsidePress, usePopover } from '@/hooks/usePopover'
import { cn } from '@/lib/utils'

export interface SelectOption<T extends string = string> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

interface Props<T extends string> {
  value: T
  onChange: (v: T) => void
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  className?: string
  /** Visual size of the trigger. */
  size?: 'md' | 'lg'
  leading?: ReactNode
}

/** Accessible custom listbox (replaces the native <select>). */
export function Select<T extends string>({ value, onChange, options, placeholder = 'Select…', label, className, size = 'md', leading }: Props<T>) {
  const [open, setOpen] = useState(false)
  const [active, setActiveState] = useState(0)
  // Mirror in a ref so rapid key presses (ArrowDown then Enter) never read a stale value.
  const activeRef = useRef(0)
  const setActive = (v: number | ((a: number) => number)) => {
    activeRef.current = typeof v === 'function' ? v(activeRef.current) : v
    setActiveState(activeRef.current)
  }
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ q: '', t: 0 })
  const id = useId()
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]

  // The list lives in a portal so parents with overflow:hidden can never clip it.
  const { style, placement } = usePopover(triggerRef, open, { minWidth: 240, estHeight: Math.min(288, options.length * 52 + 12) })
  const dropUp = placement === 'top'
  const close = useCallback(() => setOpen(false), [])
  useOutsidePress([rootRef, listRef as React.RefObject<HTMLElement | null>], open, close)

  // Keep the active option in view.
  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const openList = () => {
    setActive(Math.max(0, selectedIndex))
    setOpen(true)
  }
  const choose = (i: number) => {
    const o = options[i]
    if (o) onChange(o.value)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((a) => Math.min(options.length - 1, a + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((a) => Math.max(0, a - 1))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(activeRef.current)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        if (e.key.length === 1) {
          const now = Date.now()
          const ta = typeahead.current
          ta.q = now - ta.t > 600 ? e.key.toLowerCase() : ta.q + e.key.toLowerCase()
          ta.t = now
          const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(ta.q))
          if (hit >= 0) setActive(hit)
        }
    }
  }

  return (
    <div ref={rootRef} className={cn('relative min-w-0 w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-xl border bg-background px-3.5 text-left text-sm transition outline-none',
          size === 'lg' ? 'h-12' : 'h-11',
          open ? 'border-brand-600 ring-3 ring-brand-600/15' : 'border-input hover:border-brand-600/50 focus-visible:border-brand-600 focus-visible:ring-3 focus-visible:ring-brand-600/15',
        )}
      >
        {leading}
        {selected?.icon && <span className="grid size-7 shrink-0 place-items-center">{selected.icon}</span>}
        <span className={cn('min-w-0 flex-1 truncate font-medium', !selected && 'text-muted-foreground')}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180 text-brand-700')} />
      </button>

      {typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {open && (
          <motion.ul
            style={{ ...style, maxHeight: Math.min(288, Number(style.maxHeight) || 288) }}
            onKeyDown={onKeyDown}
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn(
              'overflow-y-auto overscroll-contain rounded-2xl border border-border bg-popover p-1.5 shadow-xl shadow-brand-900/15',
              dropUp ? 'origin-bottom' : 'origin-top',
            )}
          >
            {options.map((o, i) => {
              const isSel = o.value === value
              return (
                <li
                  key={o.value}
                  id={`${id}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSel}
                  onPointerMove={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors',
                    i === active && 'bg-brand-50',
                    isSel && 'text-brand-900',
                  )}
                >
                  {o.icon && <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted/70">{o.icon}</span>}
                  <span className="min-w-0 flex-1">
                    <span className={cn('block truncate', isSel ? 'font-semibold' : 'font-medium')}>{o.label}</span>
                    {o.description && <span className="block truncate text-xs text-muted-foreground">{o.description}</span>}
                  </span>
                  {isSel && <Check className="size-4 shrink-0 text-brand-600" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  )
}
