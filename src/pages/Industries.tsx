import { ArrowRight, Building2, Gem, Gift, HeartHandshake, Landmark, Pill, ShoppingBasket, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { paths } from '@/config/routes'

const industries = [
  { icon: ShoppingBasket, name: 'Supermarkets & provision stores', bag: 'D-cut / W-cut non-woven bags, 40–70 GSM', why: 'Low cost per bag for daily billing-counter use, printed with your store name.', link: paths.category('non-woven-bags') },
  { icon: Shirt, name: 'Textile & saree showrooms', bag: 'Loop handle or box bags, 80–100 GSM', why: 'A premium carry bag that holds folded sarees and dress sets neatly.', link: paths.customBags },
  { icon: Gem, name: 'Jewellery stores', bag: 'Laminated / matte box bags', why: 'A rich finish that matches the value of what your customer carries home.', link: paths.customBags },
  { icon: Pill, name: 'Medical shops', bag: 'Small W-cut / D-cut bags', why: 'Light, cheap and printable with your pharmacy name and phone.', link: paths.category('non-woven-bags') },
  { icon: HeartHandshake, name: 'Weddings & family functions', bag: 'Thamboolam & return gift bags', why: 'Ready devotional designs, or printed with names and the function date.', link: paths.category('marriage-gift-bags') },
  { icon: Landmark, name: 'Temples & trusts', bag: 'Prasadam & kattapai bags', why: 'Bulk supply for festivals and kumbabishekam, with the temple name printed.', link: paths.category('custom-printed-bags') },
  { icon: Gift, name: 'Gift & boutique shops', bag: 'Reusable totes & royal-look bags', why: 'Bags customers keep using — good for repeat brand visibility.', link: paths.category('jute-bags') },
  { icon: Building2, name: 'Corporate & events', bag: 'Printed loop / box bags', why: 'Conference kits, Pongal and Deepavali gifting with your logo.', link: paths.customBags },
]

export default function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries & use cases"
        title="The right bag for your business"
        description="Every business uses bags differently. Here is what works best for each — with the GSM and style we usually recommend. Not sure? Ask us on WhatsApp."
      />
      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map(({ icon: Icon, name, bag, why, link }, i) => (
            <BlurFade key={name} inView delay={i * 0.04}>
              <MagicCard className="h-full rounded-2xl" gradientColor="oklch(0.94 0.045 150)" gradientFrom="var(--marigold)" gradientTo="var(--brand-600)">
                <Link to={link} className="group flex h-full flex-col p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="size-5" />
                  </span>
                  <h2 className="mt-4 font-sans text-lg font-semibold">{name}</h2>
                  <p className="mt-1 text-sm font-semibold text-brand-700">{bag}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{why}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    See options <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>
      <section className="container-page pb-6">
        <SectionHeading eyebrow="Still deciding?" title="Read our guides" className="mb-4" />
        <div className="flex flex-wrap gap-2">
          {[
            ['How to choose GSM', paths.post('how-to-choose-gsm-for-non-woven-bags')],
            ['Bag types explained', paths.post('best-bag-types-explained-d-cut-w-cut-loop-box')],
            ['Best bags for saree shops', paths.post('best-bags-for-saree-textile-shops')],
            ['Packaging for temple functions', paths.post('packaging-for-events-temple-functions')],
          ].map(([label, to]) => (
            <Link key={to} to={to} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-brand-600 hover:text-brand-700">
              {label}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
