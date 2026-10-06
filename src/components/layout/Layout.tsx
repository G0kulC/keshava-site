import { Suspense, useEffect, useRef } from 'react'
import { applyHead } from '@/seo/head'
import { getPageMeta } from '@/seo/meta'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileActionBar } from './MobileActionBar'
import { QuoteDrawer } from './QuoteDrawer'
import { WishlistDrawer } from './WishlistDrawer'

/** Scroll to top and update <head> (title, meta, canonical, JSON-LD) on every navigation. */
function RouteEffects() {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    // The prerendered page already has the right <head>; only update on later navigations.
    if (first.current) {
      first.current = false
      if (document.head.querySelector('[data-seo]')) return
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    applyHead(getPageMeta(pathname))
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <RouteEffects />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-background focus:p-2">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="container-page py-32 text-center text-muted-foreground">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
      <QuoteDrawer />
      <WishlistDrawer />
    </div>
  )
}
