import { motion } from 'motion/react'
import { ArrowRight, Boxes, CalendarDays, Phone, RefreshCw, Scale, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { site, terms } from '@/config/site'
import { getPolicy, policyPages, type Policy as PolicyT } from '@/data/policies'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { telLink, waLink } from '@/lib/whatsapp'
import NotFound from '@/pages/NotFound'

const icons = { truck: Truck, refresh: RefreshCw, boxes: Boxes, shield: ShieldCheck, scale: Scale }

export default function Policy() {
  const { slug = '' } = useParams()
  const policy = getPolicy(slug)
  return policy ? <PolicyView key={policy.slug} policy={policy} /> : <NotFound />
}

function PolicyView({ policy }: { policy: PolicyT }) {
  const Icon = icons[policy.icon]
  const [current, setCurrent] = useState(policy.sections[0]?.id)

  // Scroll-spy: highlight the section being read in the contents list.
  useEffect(() => {
    const els = policy.sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setCurrent(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [policy])

  useEffect(() => {
    document.title = `${policy.title} — ${site.name}`
  }, [policy.title])

  const others = policyPages.filter((p) => p.slug !== policy.slug)

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-brand-50/80 to-background">
        <DotPattern className="text-brand-600/20 [mask-image:radial-gradient(500px_circle_at_85%_30%,white,transparent)]" />
        <div className="container-page relative py-12 md:py-16">
          <BlurFade>
            <nav aria-label="Policies" className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
              {policyPages.map((p) => {
                const I = icons[p.icon]
                const on = p.slug === policy.slug
                return (
                  <Link
                    key={p.slug}
                    to={`/policies/${p.slug}`}
                    aria-current={on ? 'page' : undefined}
                    className={cn(
                      'relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      on ? 'text-white' : 'bg-card text-foreground/70 hover:text-brand-700',
                    )}
                  >
                    {on && <motion.span layoutId="policy-tab" className="absolute inset-0 rounded-full bg-brand-700" transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }} />}
                    <I className="relative size-4" />
                    <span className="relative">{p.title.replace(' Policy', '')}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-start gap-4">
              <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-brand-700 text-marigold shadow-lg sm:grid">
                <Icon className="size-7" />
              </span>
              <div>
                <h1 className="text-4xl font-semibold text-brand-900 md:text-5xl">{policy.title}</h1>
                <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{policy.summary}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="size-3.5" /> Last updated {formatDate(terms.updated)}
                </p>
              </div>
            </div>
          </BlurFade>

          {/* At a glance */}
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {policy.highlights.map((h, i) => (
              <BlurFade key={h.title} delay={0.1 + i * 0.07}>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">At a glance</p>
                  <p className="mt-2 font-semibold text-brand-900">{h.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{h.text}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[240px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">On this page</p>
            <ol className="space-y-0.5 border-l border-border">
              {policy.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn(
                      '-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors',
                      current === s.id ? 'border-brand-700 font-semibold text-brand-900' : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          {policy.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-border py-8 first:pt-0 last:border-0">
              <h2 className="flex items-baseline gap-3 text-2xl font-semibold text-brand-900">
                <span className="font-sans text-sm font-bold text-marigold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-foreground/80">
                {s.blocks.map((b, j) =>
                  'p' in b ? (
                    <p key={j}>{b.p}</p>
                  ) : 'ul' in b ? (
                    <ul key={j} className="space-y-2">
                      {b.ul.map((li) => (
                        <li key={li} className="flex gap-3">
                          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j} className="rounded-xl bg-marigold-soft px-4 py-3 text-sm">
                      {b.note}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}

          {(terms.legalName || terms.address || terms.gstin) && (
            <div className="mt-4 rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground">
              {terms.legalName && <p className="font-semibold text-foreground">{terms.legalName}</p>}
              {terms.address && <p>{terms.address}</p>}
              {terms.gstin && <p>GSTIN: {terms.gstin}</p>}
            </div>
          )}

          {/* Help */}
          <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div>
              <p className="text-lg font-semibold">Questions about this policy?</p>
              <p className="text-sm text-brand-50/70">We're happy to explain anything before you order.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={waLink(`Hello ${site.name}! I have a question about your ${policy.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold"
              >
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
              <a href={telLink} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold hover:bg-white/10">
                <Phone className="size-4" /> Call
              </a>
            </div>
          </div>

          {/* Other policies */}
          <div className="mt-12">
            <p className="mb-4 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">Other policies</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((p) => {
                const I = icons[p.icon]
                return (
                  <Link key={p.slug} to={`/policies/${p.slug}`} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-brand-600/40 hover:shadow-md">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <I className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{p.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{p.summary}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-brand-600 transition group-hover:translate-x-1" />
                  </Link>
                )
              })}
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
