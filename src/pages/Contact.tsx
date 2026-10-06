import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Clock, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { PageHero } from '@/components/common/PageHero'
import { Select } from '@/components/common/Select'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { telLink, waLink } from '@/lib/whatsapp'

const faqs = [
  { q: 'What details should I share for a bulk quote?', a: 'Bag category, GSM, quantity, size (width × height × gusset), handle type, printing (1 or 2 sides), delivery city and the date you need it.' },
  { q: 'Do you have a minimum order quantity?', a: 'We are MOQ-friendly. Share your quantity and we will suggest the most cost-effective option for it.' },
  { q: 'Can you print my logo or design?', a: 'Yes. Send your logo or artwork on WhatsApp — we help with layout and placement before production.' },
  { q: 'How fast is dispatch?', a: 'It depends on quantity and printing. We confirm a dispatch date along with the quotation, and keep you updated.' },
  { q: 'Do you deliver outside Tamil Nadu?', a: 'Share your delivery city and we will give a freight estimate and a dispatch plan.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', category: '', qty: '', city: '', notes: '' })
  const [openFaq, setOpenFaq] = useState(0)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  const field = 'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15'

  const message = [
    `Hello ${site.name}! New enquiry:`,
    form.name && `Name: ${form.name}`,
    form.phone && `Phone: ${form.phone}`,
    form.category && `Category: ${form.category}`,
    form.qty && `Quantity / GSM: ${form.qty}`,
    form.city && `Delivery city: ${form.city}`,
    form.notes && `Notes: ${form.notes}`,
  ]
    .filter(Boolean)
    .join('\n')

  const cards = [
    { icon: Phone, title: 'Call us', value: site.phone, href: telLink, hint: 'Urgent dispatch & production queries' },
    { icon: WhatsAppIcon, title: 'WhatsApp', value: 'Chat now', href: waLink(`Hello ${site.name}!`), hint: 'Fastest way to get price + timeline' },
    { icon: MapPin, title: 'Location', value: site.location, hint: 'Share your city for a freight estimate' },
    { icon: Clock, title: 'Working hours', value: site.hours, hint: 'We reply on WhatsApp after hours too' },
  ]

  return (
    <>
      <PageHero eyebrow="Contact" title="Send your requirement — we'll reply with a quote & timeline" description="For bulk orders, WhatsApp is the fastest. Prefer a form? Fill it below and it opens WhatsApp pre-filled." />

      <section className="container-page grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, title, value, href, hint }) => {
          const inner = (
            <>
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</p>
              <p className="mt-1 font-semibold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            </>
          )
          return href ? (
            <a key={title} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-2xl border border-border bg-card p-5 transition hover:border-brand-600/50 hover:shadow-lg">
              {inner}
            </a>
          ) : (
            <div key={title} className="rounded-2xl border border-border bg-card p-5">
              {inner}
            </div>
          )
        })}
      </section>

      <section className="container-page grid gap-10 pb-8 lg:grid-cols-2">
        <form
          className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 md:p-8"
          onSubmit={(e) => {
            e.preventDefault()
            window.open(waLink(message), '_blank', 'noopener')
          }}
        >
          <h2 className="text-2xl font-semibold sm:col-span-2">Send an enquiry</h2>
          <input className={field} placeholder="Your name" value={form.name} onChange={set('name')} aria-label="Your name" />
          <input className={field} placeholder="Phone number" inputMode="tel" value={form.phone} onChange={set('phone')} aria-label="Phone number" />
          <Select
            label="Category"
            placeholder="Category"
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={['Non-woven', 'Marriage / Gift', 'Kovil / Temple', 'Cotton', 'Jute', 'Custom printed'].map((c) => ({ value: c, label: c }))}
          />
          <input className={field} placeholder="Quantity + GSM (e.g. 2000 pcs, 60 GSM)" value={form.qty} onChange={set('qty')} aria-label="Quantity and GSM" />
          <input className={cn(field, 'sm:col-span-2')} placeholder="Delivery city & expected date" value={form.city} onChange={set('city')} aria-label="Delivery city" />
          <textarea
            className={cn(field, 'h-28 py-3 sm:col-span-2')}
            placeholder="Size, handle type, printing, anything else…"
            value={form.notes}
            onChange={set('notes')}
            aria-label="Notes"
          />
          <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white transition hover:brightness-110 sm:col-span-2">
            <WhatsAppIcon /> Send via WhatsApp
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-semibold">Common questions</h2>
          <ul className="mt-5 divide-y divide-border rounded-3xl border border-border bg-card">
            {faqs.map((f, i) => (
              <li key={f.q}>
                <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                  {f.q}
                  <ChevronDown className={cn('size-4 shrink-0 transition-transform', openFaq === i && 'rotate-180')} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 text-sm text-muted-foreground">
                      <span className="block pb-5">{f.a}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
