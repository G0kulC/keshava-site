import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { formatINR } from '@/lib/format'
import { quoteMessage, waLink } from '@/lib/whatsapp'
import { useQuote } from '@/store/quote'
import { paths } from '@/config/routes'

export function QuoteDrawer() {
  const { items, open, setOpen, setQty, remove, clear, total } = useQuote()
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')

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

  const message = quoteMessage(items, { 'Delivery city': city, Notes: notes })

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
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
                <h2 className="text-xl font-semibold">Your cart</h2>
                <p className="text-xs text-muted-foreground">No payment now — we reply with final price & dispatch date.</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full hover:bg-muted" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <ShoppingCart className="size-7" />
                </div>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add bags with the pack size you need, then send the whole list on WhatsApp in one tap.</p>
                <Link to={paths.shop} onClick={() => setOpen(false)} className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white">
                  Browse bags
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout exit={{ opacity: 0, x: 40 }} className="flex gap-3 py-4">
                        {i.image && <img src={i.image} alt="" className="size-16 shrink-0 rounded-lg bg-muted object-cover" />}
                        <div className="min-w-0 flex-1">
                          <Link to={paths.product(i.slug)} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-medium hover:text-brand-700">
                            {i.name}
                          </Link>
                          {i.variantLabel && <p className="text-xs text-muted-foreground">{i.variantLabel}</p>}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-border">
                              <button className="grid size-7 place-items-center" onClick={() => setQty(i.key, i.qty - 1)} aria-label="Decrease">
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold tabular-nums">{i.qty}</span>
                              <button className="grid size-7 place-items-center" onClick={() => setQty(i.key, i.qty + 1)} aria-label="Increase">
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-semibold">{i.unitPrice ? formatINR(i.unitPrice * i.qty) : 'On quote'}</span>
                          </div>
                        </div>
                        <button onClick={() => remove(i.key)} className="self-start p-1 text-muted-foreground hover:text-destructive" aria-label="Remove">
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-3 border-t border-border bg-muted/40 p-5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Delivery city"
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand-600"
                    />
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notes (date, printing…)"
                      className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand-600"
                    />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Estimated total</span>
                    <span className="font-heading text-2xl font-semibold">{formatINR(total)}</span>
                  </div>
                  <a
                    href={waLink(message)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white transition hover:brightness-110"
                  >
                    <WhatsAppIcon /> Send order on WhatsApp
                  </a>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      <Link to={paths.policy('shipping')} onClick={() => setOpen(false)} className="underline-offset-2 hover:text-brand-700 hover:underline">
                        Shipping
                      </Link>
                      {' · '}
                      <Link to={paths.policy('returns')} onClick={() => setOpen(false)} className="underline-offset-2 hover:text-brand-700 hover:underline">
                        Returns
                      </Link>
                    </span>
                    <button onClick={clear} className="hover:text-destructive">
                      Clear cart
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
