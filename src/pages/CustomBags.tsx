import { ArrowRight, Check, Paintbrush } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { PageHero } from '@/components/common/PageHero'
import { Select } from '@/components/common/Select'
import { BagThumb } from '@/components/designer/BagThumb'
import { HeroBagShowcase } from '@/components/designer/HeroBagShowcase'
import { BagDesigner, bagColors } from '@/components/designer/BagDesigner'
import type { BagKind } from '@/components/designer/bagShapes'
import { BlurFade } from '@/components/ui/blur-fade'
import { MagicCard } from '@/components/ui/magic-card'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'
import { paths } from '@/config/routes'

const bagTypes = [
  { kind: 'd-cut' as BagKind, name: 'D-Cut Bag', tag: 'Supermarket', best: 'Grocery & billing counters', note: 'Most cost-effective for daily wholesale use.' },
  { kind: 'loop' as BagKind, name: 'Loop Handle Bag', tag: 'Premium', best: 'Dress shops & boutiques', note: 'Strong handle with a premium brand look.' },
  { kind: 'box' as BagKind, name: 'Box / Gusset Bag', tag: 'Heavy', best: 'Heavier products', note: 'Holds its shape for premium packaging.' },
  { kind: 'kattapai' as BagKind, name: 'Kattapai', tag: 'Shopping', best: 'Bulk distribution & retail', note: 'Strong patch handle for everyday carrying.' },
  { kind: 'w-cut' as BagKind, name: 'W-Cut Bag', tag: 'Daily use', best: 'Supermarkets & medical shops', note: 'The classic general-retail shopping bag.' },
  { kind: 'laminated' as BagKind, name: 'Laminated / Matte', tag: 'Branding', best: 'Jewellery, gifts, corporate', note: 'Premium finish for weddings and temple functions.' },
]

const gsmGuide = [
  { range: '20–40 GSM', use: 'Light items, giveaways, promotions', strength: 1 },
  { range: '50–70 GSM', use: 'Grocery, textiles, everyday retail', strength: 2 },
  { range: '80–100 GSM', use: 'Return gifts, boutiques, reusable totes', strength: 3 },
  { range: '120–150 GSM', use: 'Heavy goods, premium & long-life bags', strength: 4 },
]

const gsmOptions = [
  ...['30', '40', '50', '60', '70', '80', '90', '100', '120', '150'].map((g) => {
    const n = Number(g)
    return { value: g, label: `${g} GSM`, description: n <= 40 ? 'Light — giveaways' : n <= 70 ? 'Everyday retail' : n <= 100 ? 'Gifts & boutiques' : 'Heavy duty' }
  }),
  { value: 'Not sure', label: 'Not sure', description: 'We will suggest the right one' },
]

const industries = ['Supermarkets', 'Textile & saree shops', 'Jewellery stores', 'Medical shops', 'Weddings', 'Temples', 'Corporate events', 'Sweet shops']

export default function CustomBags() {
  // Shared between the live designer and the quote form so choices carry over.
  const [kind, setKind] = useState<BagKind>('loop')
  const [color, setColor] = useState(bagColors[2].hex)
  const [sides, setSides] = useState<1 | 2>(1)
  const goDesigner = (k?: BagKind) => {
    if (k) setKind(k)
    document.getElementById('designer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        eyebrow="Customized bags"
        title="Custom-printed bags that carry your brand"
        description="Pick a bag type, size, GSM and colour. Send your logo. We print on one or both sides, check every batch and dispatch on your date."
        aside={<HeroBagShowcase onTry={() => goDesigner()} />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#designer" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-700 px-6 font-semibold text-white hover:bg-brand-900">
            <Paintbrush className="size-4" /> Design your bag
          </a>
          <a href="#builder" className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 font-semibold">
            Get a quote <ArrowRight className="size-4" />
          </a>
          <a
            href={waLink(`Hello ${site.name}! I need custom printed bags.`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 font-semibold"
          >
            <WhatsAppIcon className="size-5 text-whatsapp" /> Send logo on WhatsApp
          </a>
        </div>
      </PageHero>

      <section id="designer" className="container-page scroll-mt-24 py-12 md:py-16">
        <SectionHeading
          eyebrow="Live bag designer"
          title="See your logo on the bag — before you order"
          description="Choose a style and colour, upload your logo, add your shop name. Drag, resize and rotate until it looks right, then share it with us."
        />
        <BagDesigner kind={kind} onKind={setKind} color={color} onColor={setColor} onSidesChange={setSides} />
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Bag types" title="Choose your style" description="Every style can be customised for size, GSM, colour and printing." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bagTypes.map((b, i) => (
            <BlurFade key={b.name} inView delay={i * 0.05}>
              <MagicCard className="h-full rounded-2xl" gradientColor="oklch(0.95 0.06 85)" gradientFrom="var(--marigold)" gradientTo="var(--brand-600)">
                <button type="button" onClick={() => goDesigner(b.kind)} className="group block w-full p-6 text-left">
                  <div className="flex items-start justify-between">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-brand-700 uppercase">{b.tag}</span>
                    <BagThumb kind={b.kind} color={b.kind === kind ? color : '#2f8a4c'} className="size-20 -mt-2 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-brand-900">{b.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.note}</p>
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium">
                    <Check className="size-4 text-brand-600" /> Best for: {b.best}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Design this bag <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </section>

      <section className="bg-brand-50/60 py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="GSM guide" title="Not sure which thickness?" description="GSM is the fabric weight — higher GSM means a stronger, longer-lasting bag." className="mb-6" />
            <Link to={paths.post('how-to-choose-gsm-for-non-woven-bags')} className="inline-block py-2 text-sm font-semibold text-brand-700 hover:underline">
              Read the full GSM guide →
            </Link>
          </div>
          <ul className="space-y-3">
            {gsmGuide.map((g, i) => (
              <BlurFade key={g.range} inView delay={i * 0.06}>
                <li className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
                  <span className="w-28 shrink-0 font-heading text-lg font-semibold text-brand-900">{g.range}</span>
                  <span className="flex-1 text-sm text-foreground/75">{g.use}</span>
                  <span className="flex gap-1" aria-label={`Strength ${g.strength} of 4`}>
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={cn('h-5 w-1.5 rounded-full', n <= g.strength ? 'bg-brand-600' : 'bg-border')} />
                    ))}
                  </span>
                </li>
              </BlurFade>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Who we supply" title="Trusted across industries" align="center" />
        <div className="flex flex-wrap justify-center gap-2.5">
          {industries.map((n) => (
            <span key={n} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
              {n}
            </span>
          ))}
        </div>
      </section>

      <section id="builder" className="container-page scroll-mt-28 pb-8">
        <CustomQuoteBuilder kind={kind} onKind={setKind} color={color} sides={sides} />
      </section>
    </>
  )
}

function CustomQuoteBuilder({ kind, onKind, color, sides }: { kind: BagKind; onKind: (k: BagKind) => void; color: string; sides: 1 | 2 }) {
  const designColor = bagColors.find((c) => c.hex === color)?.name ?? color
  const [f, setF] = useState({ size: '', gsm: '60', color: '', print: '', qty: '1000', city: '', name: '' })
  const type = bagTypes.find((b) => b.kind === kind)?.name ?? bagTypes[0].name
  const colour = f.color || designColor
  const print = f.print || (sides === 2 ? '2 sides' : '1 side')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })

  const msg = [
    `Hello ${site.name}! Custom bag enquiry:`,
    `• Bag type: ${type}`,
    f.size && `• Size: ${f.size}`,
    `• GSM: ${f.gsm}`,
    colour && `• Colour: ${colour}`,
    `• Printing: ${print}`,
    `• Quantity: ${f.qty}`,
    f.city && `• Delivery city: ${f.city}`,
    f.name && `• Name/Business: ${f.name}`,
    '',
    'I will share my logo / design preview here.',
  ]
    .filter(Boolean)
    .join('\n')

  const field = 'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15'

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card lg:grid-cols-[1fr_1.3fr]">
      <div className="bg-brand-900 p-8 text-white md:p-10">
        <p className="text-xs font-bold tracking-[0.2em] text-marigold uppercase">Quick quote</p>
        <h2 className="mt-3 text-3xl font-semibold">Tell us what you need</h2>
        <p className="mt-3 text-brand-50/75">Fill what you know — leave the rest blank. We'll reply on WhatsApp with price and timeline.</p>
        <ul className="mt-8 space-y-3 text-sm text-brand-50/85">
          {['Design support for logo placement', 'Clean finishing, consistent GSM', 'Bulk orders welcome'].map((t) => (
            <li key={t} className="flex gap-2">
              <Check className="size-4 text-marigold" /> {t}
            </li>
          ))}
        </ul>
      </div>
      <form
        className="grid gap-4 p-6 sm:grid-cols-2 md:p-10"
        onSubmit={(e) => {
          e.preventDefault()
          window.open(waLink(msg), '_blank', 'noopener')
        }}
      >
        <Field label="Bag type">
          <Select
            label="Bag type"
            value={kind}
            onChange={onKind}
            options={bagTypes.map((b) => ({ value: b.kind, label: b.name, description: b.best, icon: <BagThumb kind={b.kind} color={color} className="size-7" /> }))}
          />
        </Field>
        <Field label="Size (W × H × Gusset)">
          <input className={field} value={f.size} onChange={set('size')} placeholder='e.g. 12 × 16 × 4"' />
        </Field>
        <Field label="GSM">
          <Select
            label="GSM"
            value={f.gsm}
            onChange={(v) => setF({ ...f, gsm: v })}
            options={gsmOptions}
          />
        </Field>
        <Field label="Bag colour">
          <input className={field} value={colour} onChange={set('color')} placeholder="e.g. Green, Cream" />
        </Field>
        <Field label="Printing">
          <Select
            label="Printing"
            value={print}
            onChange={(v) => setF({ ...f, print: v })}
            options={[
              { value: '1 side', label: '1 side', description: 'Logo on the front' },
              { value: '2 sides', label: '2 sides', description: 'Front and back' },
              { value: 'No printing', label: 'No printing', description: 'Plain bags' },
            ]}
          />
        </Field>
        <Field label="Quantity (pcs)">
          <input className={field} inputMode="numeric" value={f.qty} onChange={set('qty')} />
        </Field>
        <Field label="Delivery city">
          <input className={field} value={f.city} onChange={set('city')} placeholder="e.g. Chennai" />
        </Field>
        <Field label="Your name / business">
          <input className={field} value={f.name} onChange={set('name')} placeholder="Optional" />
        </Field>
        <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white transition hover:brightness-110 sm:col-span-2">
          <WhatsAppIcon /> Send enquiry on WhatsApp
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}
