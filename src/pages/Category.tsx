import { ArrowRight, Check, Paintbrush } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Faqs } from '@/components/common/Faqs'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { ProductCard } from '@/components/shop/ProductCard'
import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { paths } from '@/config/routes'
import { site } from '@/config/site'
import { categories, getCategory, productsInCategory } from '@/data'
import { categorySeo } from '@/data/seo'
import { waLink } from '@/lib/whatsapp'
import NotFound from '@/pages/NotFound'

export default function Category() {
  const { slug = '' } = useParams()
  const cat = getCategory(slug)
  if (!cat) return <NotFound />
  const seo = categorySeo[cat.slug]
  const items = productsInCategory(cat.slug)
  const others = categories.filter((c) => c.slug !== cat.slug)

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-brand-50/80 to-background">
        <DotPattern className="text-brand-600/20 [mask-image:radial-gradient(500px_circle_at_85%_30%,white,transparent)]" />
        <div className="container-page relative grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[1.3fr_1fr]">
          <BlurFade>
            <Breadcrumbs items={[['Shop', paths.shop], [cat.name]]} />
            <h1 className="text-4xl font-semibold text-balance text-brand-900 md:text-5xl">{seo?.h1 ?? cat.name}</h1>
            {seo?.tamil && <p className="mt-2 text-sm font-medium text-brand-700">{seo.tamil}</p>}
            <div className="mt-5 max-w-2xl space-y-3 text-[15px] leading-relaxed text-foreground/80 md:text-base">
              {(seo?.intro ?? [`${cat.name} in bulk from ${site.legalName}, ${site.location}.`]).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#products" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white hover:bg-brand-900">
                See {items.length} designs <ArrowRight className="size-4" />
              </a>
              <a
                href={waLink(`Hello ${site.name}! I'd like a quote for ${cat.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 font-semibold"
              >
                <WhatsAppIcon className="size-5 text-whatsapp" /> Get a quote
              </a>
            </div>
          </BlurFade>

          {seo?.uses && (
            <BlurFade delay={0.1}>
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-brand-900/5">
                {cat.image && <img src={cat.image} alt={`${cat.name} by Keshava Fabrics`} width={600} height={600} className="mb-5 aspect-[16/10] w-full rounded-2xl object-cover" />}
                <p className="text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">Popular for</p>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {seo.uses.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-600" /> {u}
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          )}
        </div>
      </section>

      <section id="products" className="container-page scroll-mt-24 py-12">
        <h2 className="mb-6 text-2xl font-semibold text-brand-900">
          {cat.name} <span className="text-base font-normal text-muted-foreground">· {items.length} designs</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-brand-900 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-lg font-semibold">Want it printed with your name or logo?</p>
            <p className="text-sm text-brand-50/75">Design it live and send us the preview for a quote.</p>
          </div>
          <Link to={paths.customBags} className="inline-flex h-11 items-center gap-2 rounded-full bg-marigold px-5 text-sm font-semibold text-brand-900">
            <Paintbrush className="size-4" /> Design your bag
          </Link>
        </div>
      </section>

      {seo?.faqs.length ? (
        <section className="container-page max-w-3xl py-8">
          <SectionHeading eyebrow="FAQ" title={`${cat.name}: common questions`} className="mb-6" />
          <Faqs faqs={seo.faqs} />
        </section>
      ) : null}

      <section className="container-page py-10">
        <h2 className="mb-5 text-2xl font-semibold text-brand-900">More bag categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {others.map((c) => (
            <Link key={c.slug} to={paths.category(c.slug)} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg">
              {c.image && <img src={c.image} alt={c.name} loading="lazy" width={600} height={600} className="aspect-[16/10] w-full object-cover" />}
              <p className="flex items-center justify-between p-3 text-sm font-semibold">
                {c.name} <ArrowRight className="size-4 text-brand-600 transition group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
