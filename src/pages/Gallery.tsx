import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { paths } from '@/config/routes'
import { categories, products } from '@/data'
import { cn } from '@/lib/utils'

interface Photo {
  src: string
  full: string
  alt: string
  group: string
  href?: string
}

const unitPhotos: Photo[] = [
  { src: '/images/about/about-2.webp', full: '/images/about/about-2.webp', alt: 'Finished bags stacked for dispatch at our Bhavani unit', group: 'unit' },
  { src: '/images/about/about-12.webp', full: '/images/about/about-12.webp', alt: 'Bag production machine at our Bhavani unit', group: 'unit' },
]

export default function Gallery() {
  const photos = useMemo<Photo[]>(
    () => [
      ...unitPhotos,
      ...products.flatMap((p) =>
        p.images.slice(0, 2).map((img) => ({ src: img.thumb, full: img.full, alt: img.alt, group: p.categories[0] ?? 'other', href: paths.product(p.slug) })),
      ),
    ],
    [],
  )
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState<number | null>(null)
  const shown = filter === 'all' ? photos : photos.filter((p) => p.group === filter)
  const tabs = [{ slug: 'all', name: 'All' }, { slug: 'unit', name: 'Our unit' }, ...categories]

  useEffect(() => {
    if (open == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i == null ? i : (i + 1) % shown.length))
      if (e.key === 'ArrowLeft') setOpen((i) => (i == null ? i : (i - 1 + shown.length) % shown.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, shown.length])

  const cur = open != null ? shown[open] : null

  return (
    <>
      <PageHero eyebrow="Gallery" title="Our bags, prints and production" description="A look at the bags we make and the unit where they're made in Bhavani, Erode." />
      <section className="container-page py-10">
        <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.slug}
              role="tab"
              aria-selected={filter === t.slug}
              onClick={() => setFilter(t.slug)}
              className={cn('shrink-0 rounded-full px-4 py-2 text-sm font-medium transition', filter === t.slug ? 'bg-brand-700 text-white' : 'bg-muted hover:bg-brand-50')}
            >
              {t.name}
            </button>
          ))}
        </div>
        <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {shown.map((p, i) => (
            <li key={p.src} className="mb-3 break-inside-avoid">
              <button onClick={() => setOpen(i)} className="block w-full overflow-hidden rounded-2xl bg-muted" aria-label={`View ${p.alt}`}>
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full transition duration-500 hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {cur && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-900/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={cur.alt}
          >
            <motion.figure key={cur.full} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <img src={cur.full} alt={cur.alt} className="max-h-[78vh] w-auto rounded-2xl object-contain" />
              <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white">
                <span>{cur.alt}</span>
                {cur.href && (
                  <Link to={cur.href} className="shrink-0 rounded-full bg-white px-4 py-2 font-semibold text-brand-900">
                    View product
                  </Link>
                )}
              </figcaption>
            </motion.figure>
            {[
              { label: 'Previous', icon: ChevronLeft, cls: 'left-3', d: -1 },
              { label: 'Next', icon: ChevronRight, cls: 'right-3', d: 1 },
            ].map(({ label, icon: Icon, cls, d }) => (
              <button
                key={label}
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen((i) => (i == null ? i : (i + d + shown.length) % shown.length))
                }}
                className={`absolute top-1/2 ${cls} grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25`}
                aria-label={label}
              >
                <Icon className="size-5" />
              </button>
            ))}
            <button onClick={() => setOpen(null)} className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/15 text-white" aria-label="Close">
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
