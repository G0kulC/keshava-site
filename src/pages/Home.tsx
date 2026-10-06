import { ArrowRight, BadgeCheck, Leaf, Palette, Recycle, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { HomeHeroShowcase } from '@/components/home/HomeHeroShowcase'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { ProductCard } from '@/components/shop/ProductCard'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { BlurFade } from '@/components/ui/blur-fade'
import { DotPattern } from '@/components/ui/dot-pattern'
import { MagicCard } from '@/components/ui/magic-card'
import { Marquee } from '@/components/ui/marquee'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Ripple } from '@/components/ui/ripple'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { RotatingWord } from '@/components/common/RotatingWord'
import { site } from '@/config/site'
import { categories, featuredProducts, posts, products } from '@/data'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'

const trust = [
  { icon: Leaf, text: 'Eco-friendly & reusable' },
  { icon: BadgeCheck, text: 'Consistent GSM, checked every batch' },
  { icon: Palette, text: 'Custom printing — 1 or 2 sides' },
  { icon: Truck, text: 'Planned, on-time dispatch' },
  { icon: Recycle, text: 'Plastic-free alternative' },
  { icon: Sparkles, text: 'MOQ-friendly bulk pricing' },
]

const occasions = [
  { title: 'Weddings & Thamboolam', desc: 'Return-gift bags with Ganesha, Venkateswara, Radha-Krishna and more.', to: '/shop?category=marriage-gift-bags', tone: 'bg-marigold-soft' },
  { title: 'Retail & Supermarkets', desc: 'D-cut, W-cut and loop bags that carry your brand home with every bill.', to: '/customized-bags', tone: 'bg-brand-50' },
  { title: 'Temples & Functions', desc: 'Kattapai and prasadam bags in bulk, ready before your festival date.', to: '/shop?category=custom-printed-bags', tone: 'bg-[oklch(0.95_0.04_30)]' },
  { title: 'Everyday Shopping', desc: 'Sturdy, washable totes in camouflage, mandala and royal-look prints.', to: '/shop?category=shopping-bags', tone: 'bg-[oklch(0.95_0.03_250)]' },
]

export default function Home() {
  const featured = featuredProducts()

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <DotPattern className="text-brand-600/25 [mask-image:radial-gradient(600px_circle_at_30%_40%,white,transparent)]" />
        <div className="container-page relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <BlurFade delay={0.05}>
              <Link
                to="/customized-bags"
                className="group mb-6 inline-flex min-h-9 items-center rounded-full border border-brand-600/20 bg-brand-50 px-1 py-1 pr-3 text-xs font-medium"
              >
                <span className="mr-2 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white uppercase">New</span>
                <AnimatedShinyText className="mx-0 text-brand-900/70">Custom logo printing on bulk orders</AnimatedShinyText>
                <ArrowRight className="ml-1 size-3 transition group-hover:translate-x-0.5" />
              </Link>
            </BlurFade>
            <BlurFade delay={0.12}>
              <h1 className="text-[2.6rem] leading-[1.05] font-semibold text-brand-900 sm:text-6xl lg:text-7xl">
                Beautiful bags for
                <RotatingWord
                  words={['weddings.', 'temples.', 'your shop.', 'your brand.']}
                  className="bg-linear-to-r from-brand-600 via-brand-700 to-marigold bg-clip-text pr-2 text-transparent italic"
                />
              </h1>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
                Non-woven, jute and cotton bags made in {site.location.split(',')[0]} — printed with your design, packed in bulk and dispatched on the date you need.
              </p>
            </BlurFade>
            <BlurFade delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/shop">
                  <ShimmerButton background="var(--brand-700)" className="h-12 px-7 text-[15px] font-semibold">
                    Browse all bags <ArrowRight className="ml-2 size-4" />
                  </ShimmerButton>
                </Link>
                <a
                  href={waLink(`Hello ${site.name}! I'd like a quotation.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-[15px] font-semibold transition hover:border-whatsapp hover:text-[#128c4b]"
                >
                  <WhatsAppIcon className="size-5 text-whatsapp" /> Get a quote in minutes
                </a>
              </div>
            </BlurFade>
            <BlurFade delay={0.36}>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6 sm:gap-6">
                <Stat value={products.length} suffix="+" label="Ready designs" />
                <Stat value={categories.length} label="Bag categories" />
                <div>
                  <dt className="sr-only">GSM range</dt>
                  <dd className="font-heading text-2xl font-semibold whitespace-nowrap text-brand-900 sm:text-3xl">20–150</dd>
                  <p className="text-xs text-muted-foreground">GSM options</p>
                </div>
              </dl>
            </BlurFade>
          </div>

          <HomeHeroShowcase />
        </div>
      </section>

      {/* ───────────── Trust marquee ───────────── */}
      <section className="border-y border-border bg-card" aria-label="Why buyers choose us">
        <Marquee pauseOnHover className="py-4 [--duration:35s] [--gap:3rem]">
          {trust.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2.5 text-sm font-medium whitespace-nowrap text-foreground/75">
              <Icon className="size-4 text-brand-600" /> {text}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ───────────── Categories ───────────── */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Shop by category"
          title="Find the right bag, fast"
          description="Every category is available in bulk, with custom printing on request."
          action={<ViewAll to="/shop" label="All products" />}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <BlurFade key={c.slug} inView delay={i * 0.06}>
              <Link to={`/shop?category=${c.slug}`} className="block h-full">
                <MagicCard className="h-full rounded-2xl" gradientColor="oklch(0.94 0.045 150)" gradientFrom="var(--marigold)" gradientTo="var(--brand-600)">
                  <div className="p-3">
                    <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                      {c.image && <img src={c.image} alt="" loading="lazy" className="size-full object-cover transition duration-500 hover:scale-105" />}
                    </div>
                    <div className="flex items-center justify-between px-1 pt-3 pb-1">
                      <div>
                        <h3 className="font-sans text-sm font-semibold">{c.name}</h3>
                        <p className="text-xs text-muted-foreground">{c.count} designs</p>
                      </div>
                      <ArrowRight className="size-4 text-brand-600" />
                    </div>
                  </div>
                </MagicCard>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ───────────── Occasions ───────────── */}
      <section className="container-page pb-20">
        <SectionHeading eyebrow="Shop by need" title="Made for the moments that matter" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((o, i) => (
            <BlurFade key={o.title} inView delay={i * 0.07}>
              <Link to={o.to} className={cn('group flex h-full flex-col justify-between rounded-3xl p-6 transition hover:-translate-y-1', o.tone)}>
                <div>
                  <span className="font-heading text-5xl text-brand-900/15">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold text-brand-900">{o.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{o.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Explore <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ───────────── Featured ───────────── */}
      <section className="bg-linear-to-b from-brand-50/70 to-transparent py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Best value" title="Popular right now" action={<ViewAll to="/shop" label="Shop all" />} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Process ───────────── */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow="How bulk orders work"
          title="From requirement to doorstep in 6 clear steps"
          description="No guesswork. You get updates at every stage."
          align="center"
        />
        <ProcessSteps />
      </section>

      {/* ───────────── Custom CTA ───────────── */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 px-6 py-16 text-center text-white md:px-16 md:py-24">
          <Ripple mainCircleSize={260} numCircles={6} className="opacity-30" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-marigold uppercase">Customized bags</p>
            <h2 className="mt-4 text-4xl font-semibold text-balance md:text-5xl">Your logo. Your colours. Your bag.</h2>
            <p className="mt-4 text-brand-50/75">
              Choose the bag type, size, GSM and colour — we handle design support, printing and dispatch. Ideal for supermarkets, textile shops, jewellers and events.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/customized-bags" className="inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-7 font-semibold text-brand-900 transition hover:brightness-105">
                Design your bag <ArrowRight className="size-4" />
              </Link>
              <Link to="/bulk-order" className="inline-flex h-12 items-center rounded-full border border-white/25 px-7 font-semibold transition hover:bg-white/10">
                Bulk enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Blog ───────────── */}
      <section className="container-page py-20">
        <SectionHeading eyebrow="Guides" title="Learn before you buy" action={<ViewAll to="/blog" label="All articles" />} />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <BlurFade key={p.slug} inView delay={i * 0.08}>
              <Link to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {p.cover && <img src={p.cover} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">{formatDate(p.date)}</p>
                <h3 className="mt-1 text-xl font-semibold group-hover:text-brand-700">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  )
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-heading text-2xl font-semibold text-brand-900 sm:text-3xl">
        <NumberTicker value={value} className="text-brand-900" />
        {suffix}
      </dd>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function ViewAll({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="group inline-flex shrink-0 items-center gap-1.5 py-2 text-sm font-semibold text-brand-700">
      {label} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
    </Link>
  )
}
