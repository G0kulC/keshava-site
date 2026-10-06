import { ArrowRight, MapPin, Navigation, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ContactPanel } from '@/components/common/ContactPanel'
import { Faqs } from '@/components/common/Faqs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ProductCard } from '@/components/shop/ProductCard'
import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { paths } from '@/config/routes'
import { site } from '@/config/site'
import { directionsUrl } from '@/lib/maps'
import { categories, featuredProducts } from '@/data'
import { areaPages, type AreaPage } from '@/data/seo'

/** Local landing page (Bhavani / Erode / Tamil Nadu). */
export default function Area({ area }: { area: AreaPage }) {
  const others = areaPages.filter((a) => a.slug !== area.slug)
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-brand-50/80 to-background">
        <DotPattern className="text-brand-600/20 [mask-image:radial-gradient(500px_circle_at_85%_30%,white,transparent)]" />
        <div className="container-page relative grid items-start gap-10 py-10 md:py-14 lg:grid-cols-[1.15fr_1fr]">
          <BlurFade>
            <Breadcrumbs items={[[area.h1]]} />
            <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
              <MapPin className="size-3.5" /> {area.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-balance text-brand-900 md:text-5xl">{area.h1}</h1>
            <p className="mt-2 text-sm font-medium text-brand-700">{area.tamil}</p>
            <div className="mt-5 max-w-2xl space-y-3 text-[15px] leading-relaxed text-foreground/80 md:text-base">
              {area.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-3">
              {area.highlights.map((h) => (
                <li key={h.title} className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-semibold text-brand-900">{h.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
                </li>
              ))}
            </ul>
          </BlurFade>
          <BlurFade delay={0.1}>
            <ContactPanel />
          </BlurFade>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeading
          eyebrow={`Popular in ${area.place}`}
          title="Bags our customers order most"
          action={
            <Link to={paths.shop} className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-brand-700">
              All products <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featuredProducts().slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container-page grid gap-8 py-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-brand-900">
            <Truck className="size-6 text-brand-600" /> Areas we supply
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">From our unit in {site.location} — courier, transport or self pick-up.</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {area.serves.map((s) => (
              <li key={s} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-900">
                {s}
              </li>
            ))}
          </ul>
          <a href={directionsUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-900">
            <Navigation className="size-4" /> Directions to our unit
          </a>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-brand-900">Shop by category</h2>
          <ul className="mt-5 grid gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={paths.category(c.slug)} className="group flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-brand-50">
                  <span className="font-medium">
                    {c.name} in {area.place}
                  </span>
                  <ArrowRight className="size-4 text-brand-600 transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page max-w-3xl py-10">
        <SectionHeading eyebrow="FAQ" title={`Bags in ${area.place}: common questions`} className="mb-6" />
        <Faqs faqs={area.faqs} />
      </section>

      <section className="container-page pb-4">
        <p className="text-sm text-muted-foreground">
          Also serving:{' '}
          {others.map((o, i) => (
            <span key={o.slug}>
              {i > 0 && ' · '}
              <Link to={paths.area(o.slug)} className="font-semibold text-brand-700 hover:underline">
                {o.h1}
              </Link>
            </span>
          ))}
        </p>
      </section>
    </>
  )
}
