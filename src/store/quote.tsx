import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { QuoteItem } from '@/types'

const STORAGE_KEY = 'kf.quote.v1'

interface QuoteCtx {
  items: QuoteItem[]
  count: number
  total: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (item: Omit<QuoteItem, 'key'>) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const Ctx = createContext<QuoteCtx | null>(null)

const load = (): QuoteItem[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [open, setOpen] = useState(false)
  const loaded = useRef(false)

  // Read the saved cart after mount so prerendered HTML and first client render match.
  useEffect(() => {
    setItems(load())
    loaded.current = true
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage unavailable (private mode) — list still works for this visit */
    }
  }, [items])

  const add = useCallback((item: Omit<QuoteItem, 'key'>) => {
    const key = `${item.productId}:${item.variantLabel ?? ''}`
    setItems((prev) => {
      const hit = prev.find((i) => i.key === key)
      return hit
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + item.qty } : i))
        : [...prev, { ...item, key }]
    })
    setOpen(true)
  }, [])

  const setQty = useCallback(
    (key: string, qty: number) => setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i))),
    [],
  )
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + (i.unitPrice ?? 0) * i.qty, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, open, add, setQty, remove, clear],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuote() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>')
  return ctx
}
