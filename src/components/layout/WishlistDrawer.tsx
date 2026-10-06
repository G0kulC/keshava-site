import { AnimatePresence, motion } from 'motion/react'
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { defaultVariant, products } from '@/data'
import { formatINR } from '@/lib/format'
import { useQuote } from '@/store/quote'
import { useWishlist } from '@/store/wishlist'
import { paths } from '@/config/routes'
import type { Product } from '@/types'

export function WishlistDrawer() {
  const { ids, open, setOpen, remove, clear } = useWishlist()
  const { add } = useQuote()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  // Skip ids for products that no longer exist in the catalogue.
  const saved = ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => !!p)

  const toCart = (p: Product) => {
    const variant = defaultVariant(p)
    add({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images[0]?.thumb,
      variantLabel: variant?.label,
      unitPrice: variant?.price ?? p.price,
      qty: 1,
    })
  }

  const moveToCart = (p: Product) => {
    remove(p.id)
    setOpen(false)
    toCart(p)
  }

  const moveAllToCart = () => {
    saved.forEach(toCart)
    clear()
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Wishlist">
          <motion.div
            className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold">Your wishlist</h2>
                <p className="text-xs text-muted-foreground">Bags you've saved for later. Move them to the cart when you're ready.</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-muted" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            {saved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-brand-50 text-kumkum">
                  <Heart className="size-7" />
                </div>
                <p className="font-medium">Your wishlist is empty</p>
                <p className="text-sm text-muted-foreground">Tap the heart on any bag to save it here and compare later.</p>
                <Link to={paths.shop} onClick={() => setOpen(false)} className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
                  Browse bags
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {saved.map((p) => {
                      const variant = defaultVariant(p)
                      const price = variant?.price ?? p.price
                      return (
                        <motion.li key={p.id} layout exit={{ opacity: 0, x: 40 }} className="flex gap-3 py-4">
                          {p.images[0] && <img src={p.images[0].thumb} alt="" className="size-16 shrink-0 rounded-lg bg-muted object-cover" />}
                          <div className="min-w-0 flex-1">
                            <Link to={paths.product(p.slug)} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-medium hover:text-brand-700">
                              {p.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {price != null ? formatINR(price) : 'Price on request'}
                              {variant && ` · ${variant.label}`}
                            </p>
                            <button
                              onClick={() => moveToCart(p)}
                              className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-brand-50 px-3 text-xs font-semibold text-brand-900 transition hover:bg-brand-700 hover:text-white"
                            >
                              <ShoppingCart className="size-3.5" /> Move to cart
                            </button>
                          </div>
                          <button onClick={() => remove(p.id)} className="self-start p-1 text-muted-foreground hover:text-destructive" aria-label={`Remove ${p.name} from wishlist`}>
                            <Trash2 className="size-4" />
                          </button>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>

                <div className="space-y-3 border-t border-border bg-muted/40 p-5">
                  <button
                    onClick={moveAllToCart}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-700 font-semibold text-white transition hover:bg-brand-900"
                  >
                    <ShoppingCart className="size-5" /> Move all to cart
                  </button>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {saved.length} saved {saved.length === 1 ? 'bag' : 'bags'}
                    </span>
                    <button onClick={clear} className="hover:text-destructive">
                      Clear wishlist
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
