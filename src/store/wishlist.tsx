import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'kf.wishlist.v1'

interface WishlistCtx {
  /** Saved product ids, newest first. */
  ids: number[]
  count: number
  open: boolean
  setOpen: (v: boolean) => void
  has: (productId: number) => boolean
  toggle: (productId: number) => void
  remove: (productId: number) => void
  clear: () => void
}

const Ctx = createContext<WishlistCtx | null>(null)

const load = (): number[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? saved.filter((id): id is number => typeof id === 'number') : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([])
  const [open, setOpen] = useState(false)
  const loaded = useRef(false)

  // Read the saved list after mount so prerendered HTML and first client render match.
  useEffect(() => {
    setIds(load())
    loaded.current = true
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      /* storage unavailable (private mode) — list still works for this visit */
    }
  }, [ids])

  const toggle = useCallback(
    (productId: number) => setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev])),
    [],
  )
  const remove = useCallback((productId: number) => setIds((prev) => prev.filter((id) => id !== productId)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      open,
      setOpen,
      has: (productId: number) => ids.includes(productId),
      toggle,
      remove,
      clear,
    }),
    [ids, open, toggle, remove, clear],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
