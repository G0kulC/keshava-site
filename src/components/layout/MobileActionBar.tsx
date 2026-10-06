import { Phone, ShoppingCart } from 'lucide-react'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { site } from '@/config/site'
import { telLink, waLink } from '@/lib/whatsapp'
import { useQuote } from '@/store/quote'

/** Thumb-friendly sticky actions on phones — most buyers enquire from mobile. */
export function MobileActionBar() {
  const { count, setOpen } = useQuote()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-3 gap-2 p-2">
        <a href={telLink} className="flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold text-foreground/80 active:bg-muted">
          <Phone className="size-5" /> Call
        </a>
        <a
          href={waLink(`Hello ${site.name}! I'd like a quotation.`)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-0.5 rounded-xl bg-whatsapp py-2 text-xs font-semibold text-white"
        >
          <WhatsAppIcon className="size-5" /> WhatsApp
        </a>
        <button onClick={() => setOpen(true)} className="relative flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold text-foreground/80 active:bg-muted">
          <ShoppingCart className="size-5" /> Cart
          {count > 0 && (
            <span className="absolute top-1 right-[30%] grid min-w-4 place-items-center rounded-full bg-marigold px-1 text-[10px] font-bold text-brand-900">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
