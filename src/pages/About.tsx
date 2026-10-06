import { motion } from 'motion/react'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Factory,
  Leaf,
  Layers,
  MessageCircle,
  Package,
  PackageCheck,
  Receipt,
  Repeat,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactPanel } from '@/components/common/ContactPanel'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { site } from '@/config/site'
import { categories, products } from '@/data'
import { waLink } from '@/lib/whatsapp'
import { paths } from '@/config/routes'

const heroBadges = ['GSM 20–150', 'MOQ-friendly', 'Quality checks', 'On-time dispatch']

const pillars = [
  { icon: Package, title: 'Bulk-ready', text: 'Production is set up for large and repeat orders.' },
  { icon: ShieldCheck, title: 'Quality checks', text: 'GSM and finishing are checked for consistency.' },
  { icon: CalendarClock, title: 'Dispatch focus', text: 'Planned timelines, with clear updates along the way.' },
  { icon: Leaf, title: 'Reusable options', text: 'Eco-friendly bags that replace single-use plastic.' },
]

const storyPoints = [
  { title: 'Consistent production', text: 'Repeatable output with clear checkpoints at every stage.' },
  { title: 'Clear communication', text: 'Fast replies, transparent quotations and order updates.' },
  { title: 'Dispatch planning', text: 'Timelines planned around the date you actually need.' },
]

const strengths = [
  { icon: BadgeCheck, title: 'Quality checks', text: 'Consistent GSM and finishing control on every batch.' },
  { icon: MessageCircle, title: 'Fast response', text: 'Quick quotations and clear, honest communication.' },
  { icon: Truck, title: 'On-time delivery', text: 'Planned dispatch you can rely on for your event or shop.' },
  { icon: Repeat, title: 'Bulk order support', text: 'MOQ-friendly for business buyers and repeat orders.' },
  { icon: Leaf, title: 'Eco-friendly focus', text: 'Reusable bag options your customers will keep using.' },
  { icon: Layers, title: 'Category variety', text: 'Bags for functions, temples, retail and daily use.' },
]

const founderPoints = [
  { icon: BadgeCheck, title: 'Quality-first', text: 'Consistent GSM and finishing checks.' },
  { icon: MessageCircle, title: 'Fast communication', text: 'Quick enquiry response and clear updates.' },
  { icon: Truck, title: 'Delivery discipline', text: 'Planned dispatch and dependable timelines.' },
]

const howWeWork = [
  { icon: ClipboardList, title: 'Requirement', text: 'Category, GSM, quantity, size, delivery city and timeline.' },
  { icon: Receipt, title: 'Quotation', text: 'Clear pricing and a production plan, shared quickly.' },
  { icon: Factory, title: 'Production', text: 'Quality checks during every key stage.' },
  { icon: PackageCheck, title: 'Dispatch', text: 'Packed and shipped on your committed date.' },
]

export default function About() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <PageHero
        eyebrow={`About ${site.name}`}
        title="Reliable bulk supply of non-woven bags, built for repeat buyers"
        description="We focus on consistent quality, stable production timelines and clear communication. If you need MOQ-friendly, process-driven supply for functions, retail, temples or brands — this is what we do every day."
        aside={<HeroCollage />}
      >
        <ul className="mt-6 flex flex-wrap gap-2">
          {heroBadges.map((b) => (
            <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-brand-600/20 bg-card px-3 py-1.5 text-xs font-semibold text-brand-900">
              <BadgeCheck className="size-3.5 text-brand-600" /> {b}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={paths.bulkOrder} className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white hover:bg-brand-900">
            Request bulk quote <ArrowRight className="size-4" />
          </Link>
          <a
            href={waLink(`Hello ${site.name}! I'd like a quotation.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 font-semibold"
          >
            <WhatsAppIcon className="size-5 text-whatsapp" /> WhatsApp
          </a>
          <Link to={paths.shop} className="inline-flex h-12 items-center rounded-full px-4 font-semibold text-brand-700 hover:underline">
            View products
          </Link>
        </div>
      </PageHero>

      {/* ───────── Pillars ───────── */}
      <section className="container-page py-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <BlurFade key={title} inView delay={i * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ───────── Story ───────── */}
      <section className="container-page grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        <BlurFade inView className="relative">
          <img src="/images/about/about-12.webp" alt="Bag production machine at the Keshava Fabrics unit" loading="lazy" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-xl" />
          <div className="absolute -right-3 -bottom-5 rounded-2xl border border-border bg-card p-4 shadow-lg sm:right-6">
            <p className="font-heading text-3xl font-semibold text-brand-900">
              <NumberTicker value={products.length} className="text-brand-900" />+
            </p>
            <p className="text-xs text-muted-foreground">Ready designs in {categories.length} categories</p>
          </div>
        </BlurFade>
        <div>
          <SectionHeading
            eyebrow="Our story"
            title="Built around quality discipline and dependable supply"
            description="We work with business buyers who need stable output, consistent GSM and reliable dispatch. Our internal process is designed to reduce errors and give you confidence in every repeat order."
            className="mb-8"
          />
          <ul className="space-y-3">
            {storyPoints.map((p, i) => (
              <BlurFade key={p.title} inView delay={i * 0.07}>
                <li className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-marigold font-sans text-sm font-bold text-brand-900">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.text}</p>
                  </div>
                </li>
              </BlurFade>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Strengths ───────── */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Our strengths" title="What you can expect from us" description="Process-driven supply built for bulk buyers and repeat business." align="center" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map(({ icon: Icon, title, text }, i) => (
            <BlurFade key={title} inView delay={i * 0.05}>
              <MagicCard className="h-full rounded-2xl" gradientColor="oklch(0.94 0.045 150)" gradientFrom="var(--marigold)" gradientTo="var(--brand-600)">
                <div className="p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ───────── Leadership ───────── */}
      <section className="bg-linear-to-b from-brand-50/70 to-transparent py-16">
        <div className="container-page grid items-stretch gap-6 lg:grid-cols-[1.05fr_1fr]">
          <BlurFade inView className="relative overflow-hidden rounded-[2rem] shadow-xl">
            <img src="/images/about/founder.webp" alt={`${site.founder}, founder of ${site.name}`} loading="lazy" className="size-full min-h-[320px] object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-brand-900/85 to-transparent p-6 pt-20 text-white">
              <p className="font-display text-xl font-semibold">{site.founder}</p>
              <p className="text-sm text-white/80">Founder, {site.legalName}</p>
            </div>
          </BlurFade>
          <BlurFade inView delay={0.1}>
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] border border-border bg-card p-6 md:p-10">
              <BorderBeam size={160} duration={12} colorFrom="var(--marigold)" colorTo="var(--brand-600)" borderWidth={1.5} />
              <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">Leadership</p>
              <h2 className="mt-3 text-3xl font-semibold text-brand-900 md:text-4xl">Founder: {site.founder}</h2>
              <p className="mt-4 text-foreground/75">
                Our focus is simple: consistent quality, reliable supply and clear communication for business buyers. We support repeat orders with stable production and timely dispatch.
              </p>
              <ul className="mt-6 space-y-3">
                {founderPoints.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ───────── How we work ───────── */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="How we work" title="A simple process for bulk orders" description="Designed to remove confusion and speed up quotations and dispatch." align="center" />
        <ol className="relative grid gap-4 md:grid-cols-4">
          {/* connector line on desktop */}
          <div className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-0.5 bg-linear-to-r from-brand-600 via-brand-700 to-marigold md:block" aria-hidden />
          {howWeWork.map(({ icon: Icon, title, text }, i) => (
            <BlurFade key={title} inView delay={i * 0.12}>
              <li className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <motion.span
                  className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-brand-700 text-white shadow-lg shadow-brand-700/25"
                  whileHover={{ scale: 1.08 }}
                >
                  <Icon className="size-6" />
                  <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-background bg-marigold text-[11px] font-bold text-brand-900">{i + 1}</span>
                </motion.span>
                <div className="md:mt-4">
                  <h3 className="font-sans text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            </BlurFade>
          ))}
        </ol>
      </section>

      {/* ───────── CTA + contact ───────── */}
      <section className="container-page pb-4">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-brand-900 p-6 text-white md:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-marigold uppercase">Get started</p>
            <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">Need bulk pricing? Send your requirement.</h2>
            <p className="mt-3 text-brand-50/75">WhatsApp is the fastest way to get a quotation and timeline confirmed.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={paths.bulkOrder} className="inline-flex h-12 items-center gap-2 rounded-full bg-marigold px-6 font-semibold text-brand-900">
                Request quote <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="text-foreground">
            <ContactPanel />
          </div>
        </div>
      </section>
    </>
  )
}

/** Real photos from the unit, layered with floating proof points. */
function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-lg pb-10 lg:pb-0">
      <motion.img
        src="/images/about/about-2.webp"
        alt="Finished bags stacked and ready for dispatch at the Keshava Fabrics warehouse"
        className="aspect-[4/3] w-full rounded-[2rem] border-4 border-white object-cover shadow-2xl shadow-brand-900/15"
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      />
      <motion.img
        src="/images/about/about-12.webp"
        alt="Bag production at the Keshava Fabrics unit"
        className="absolute -bottom-2 -left-3 w-[38%] rounded-2xl border-4 border-white object-cover shadow-xl sm:-left-6 lg:-bottom-10"
        style={{ aspectRatio: '3 / 4' }}
        initial={{ opacity: 0, y: 30, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 90, damping: 16 }}
      />
      <motion.div
        className="absolute -top-4 right-2 flex items-center gap-2 rounded-2xl border border-border bg-card/95 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur sm:-right-4"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ opacity: { delay: 0.5 }, scale: { delay: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-brand-700">
          <ShieldCheck className="size-4" />
        </span>
        Process-driven supply
      </motion.div>
      <motion.div
        className="absolute right-3 bottom-0 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-right-3 sm:block lg:-bottom-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-[11px] font-bold tracking-wider text-brand-600 uppercase">Checks · timelines · repeat orders</p>
        <p className="mt-0.5 text-sm font-semibold text-brand-900">{site.location}</p>
      </motion.div>
    </div>
  )
}
