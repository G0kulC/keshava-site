import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/types'

/** Heart toggle that saves a product to the wishlist. */
export function WishlistButton({ product, className }: { product: Product; className?: string }) {
  const { has, toggle } = useWishlist()
  const saved = has(product.id)

  return (
    <button
      type="button"
      onClick={() => toggle(product.id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cn(
        'grid place-items-center rounded-full border transition active:scale-90',
        saved ? 'border-kumkum/30 bg-background text-kumkum' : 'border-border bg-background/95 text-foreground/70 hover:border-kumkum/40 hover:text-kumkum',
        className,
      )}
    >
      <motion.span key={String(saved)} initial={{ scale: saved ? 0.5 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6, duration: 0.4 }}>
        <Heart className={cn('size-[1.1em]', saved && 'fill-current')} />
      </motion.span>
    </button>
  )
}
