import { BadgeCheck, Clock, Leaf, MessageCircle, Package, Repeat } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { NumberTicker } from '@/components/ui/number-ticker'
import { categories, products } from '@/data'

const strengths = [
  { icon: BadgeCheck, title: 'Quality checks', text: 'GSM and finishing are checked so every batch matches the last.' },
  { icon: MessageCircle, title: 'Fast response', text: 'Quick quotations and clear updates — usually on WhatsApp.' },
  { icon: Clock, title: 'On-time delivery', text: 'Dispatch is planned around the date you actually need.' },
  { icon: Package, title: 'Bulk-ready', text: 'Production is structured for large and repeat orders.' },
  { icon: Leaf, title: 'Eco-friendly focus', text: 'Reusable bags that replace single-use plastic.' },
  { icon: Repeat, title: 'Built for repeat buyers', text: 'Consistent output so your re-orders look identical.' },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Dependable bulk bag supply, built for repeat buyers"
        description="Keshava Fabrics supplies non-woven, jute and cotton bags to wedding families, temples, retail shops and brands — with steady quality, clear communication and planned dispatch."
      />

      <section className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center">
        <BlurFade inView>
          <h2 className="text-3xl font-semibold text-brand-900 md:text-4xl">Quality discipline, every single batch</h2>
          <p className="mt-4 text-muted-foreground">
            Business buyers need the same bag, the same strength and the same print — order after order. Our internal process is designed around checkpoints that reduce errors and build
            repeat-order confidence.
          </p>
          <p className="mt-4 text-muted-foreground">Whether it's 500 thamboolam bags for a wedding or a monthly supply for a supermarket, you get a clear quote, a realistic timeline and updates until delivery.</p>
          <Link to="/contact" className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-900">
            Talk to us
          </Link>
        </BlurFade>
        <dl className="grid grid-cols-2 gap-4">
          {[
            { v: products.length, s: '+', l: 'Ready-made designs' },
            { v: categories.length, s: '', l: 'Product categories' },
            { v: 150, s: '', l: 'Max GSM available', p: '20–' },
            { v: 6, s: '', l: 'Step quality process' },
          ].map((x, i) => (
            <BlurFade key={x.l} inView delay={i * 0.06}>
              <div className="rounded-3xl border border-border bg-card p-6">
                <dd className="font-heading text-4xl font-semibold text-brand-900">
                  {x.p}
                  <NumberTicker value={x.v} className="text-brand-900" />
                  {x.s}
                </dd>
                <dt className="mt-1 text-sm text-muted-foreground">{x.l}</dt>
              </div>
            </BlurFade>
          ))}
        </dl>
      </section>

      <section className="container-page py-8">
        <SectionHeading eyebrow="Our strengths" title="What you can expect from us" align="center" />
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
    </>
  )
}
