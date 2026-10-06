import { AnimatePresence, motion } from 'motion/react'
import { Menu, Phone, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Marquee } from '@/components/ui/marquee'
import { nav, site } from '@/config/site'
import { cn } from '@/lib/utils'
import { telLink } from '@/lib/whatsapp'
import { useQuote } from '@/store/quote'

const announcements = ['Bulk orders', 'Custom logo printing', 'On-time dispatch', `Made in ${site.location}`]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setOpen } = useQuote()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  return (
    <>
      <div className="bg-brand-900 text-[13px] text-brand-50">
        {/* Phones: messages scroll so nothing gets cut off */}
        <div className="flex h-9 items-center sm:hidden">
          <Marquee pauseOnHover className="p-0 [--duration:22s] [--gap:2rem]">
            {announcements.map((a) => (
              <span key={a} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-marigold">●</span> {a}
              </span>
            ))}
          </Marquee>
        </div>
        {/* Larger screens: static line + phone numbers */}
        <div className="container-page hidden h-9 items-center justify-between gap-4 sm:flex">
          <p className="truncate">
            <span className="text-marigold">●</span> {announcements.join(' · ')}
          </p>
          <div className="flex shrink-0 items-center gap-4 font-medium">
            <a href={telLink} className="flex items-center gap-1.5 hover:text-marigold">
              <Phone className="size-3.5" /> {site.phone}
            </a>
            <a href={`tel:+${site.phone2Raw}`} className="hidden items-center gap-1.5 hover:text-marigold lg:flex">
              <Phone className="size-3.5" /> {site.phone2}
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled ? 'border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl' : 'bg-background',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-3.5 py-2 font-display text-[15px] font-medium tracking-[-0.01em] text-foreground/70 transition-colors hover:text-foreground',
                    isActive && 'font-semibold text-brand-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-brand-50"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3.5 font-display text-[15px] font-semibold tracking-[-0.01em] transition hover:border-brand-600 hover:text-brand-700"
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="grid min-w-5 place-items-center rounded-full bg-marigold px-1.5 text-[11px] font-bold text-brand-900"
                  >
                    {count > 999 ? '999+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link
              to="/bulk-order"
              className="hidden h-10 items-center rounded-full bg-brand-700 px-5 font-display text-[15px] font-semibold tracking-[-0.01em] text-white transition hover:bg-brand-900 md:flex"
            >
              Get bulk quote
            </Link>
            <button
              className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background lg:hidden"
              aria-label="Mobile"
            >
              <ul className="container-page grid gap-1 py-4">
                {[{ label: 'Home', to: '/' }, ...nav].map((item, i) => (
                  <motion.li key={item.to} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn('block rounded-xl px-4 py-3 font-display text-lg font-medium tracking-[-0.01em]', isActive ? 'bg-brand-50 font-semibold text-brand-900' : 'hover:bg-muted')
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
