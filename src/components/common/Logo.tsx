import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'

// Leaf mark is cropped from the official logo (public/brand/keshava-fabrics.png);
// the wordmark is set in type so it stays crisp and readable at header size.
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn('group flex items-center gap-2', className)} aria-label={`${site.name} home`}>
      <img
        src="/brand/leaf.png"
        alt=""
        width={44}
        height={44}
        className="size-11 shrink-0 object-contain transition-transform duration-300 group-hover:-rotate-6"
      />
      <span className="flex flex-col items-center leading-none">
        <span className={cn('font-sans text-[1.35rem] font-extrabold tracking-[0.02em]', light ? 'text-white' : 'text-[#2f3a3f]')}>KESHAVA</span>
        <span className="mt-0.5 flex w-full items-center gap-1.5">
          <span className={cn('h-px flex-1', light ? 'bg-white/40' : 'bg-brand-700/60')} />
          <span className={cn('font-sans text-[0.8rem] font-bold', light ? 'text-[#7cc46a]' : 'text-brand-700')}>Fabrics</span>
          <span className={cn('h-px flex-1', light ? 'bg-white/40' : 'bg-brand-700/60')} />
        </span>
      </span>
    </Link>
  )
}
