import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { useState } from 'react'
import { ContactPanel } from '@/components/common/ContactPanel'
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

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Send your requirement — we'll reply with a quote & timeline"
        description="For bulk orders, WhatsApp is the fastest. Prefer a form? Fill it below and it opens WhatsApp pre-filled."
        aside={<ContactPanel />}
      />


      <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
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
      {/* Visit us */}
      <section className="container-page pt-8 pb-4">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">Visit us</p>
            <h2 className="text-3xl font-semibold text-brand-900">{site.legalName}</h2>
            <p className="flex gap-2 text-foreground/80">
              <MapPin className="mt-1 size-4 shrink-0 text-brand-600" /> {site.address}
            </p>
            <p className="flex gap-2 text-foreground/80">
              <Clock className="mt-1 size-4 shrink-0 text-brand-600" /> {site.hours}
            </p>
            <p className="text-sm text-muted-foreground">Please message us before visiting so we can keep samples ready for you.</p>
            <div className="flex flex-wrap gap-2">
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-900">
                <Navigation className="size-4" /> Get directions
              </a>
              <a href={telLink} className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:border-brand-600">
                <Phone className="size-4" /> Call before visiting
              </a>
            </div>
          </div>
          <iframe
            title={`Map to ${site.legalName}`}
            src={`https://www.google.com/maps?q=${site.geo ? `${site.geo.lat},${site.geo.lng}` : encodeURIComponent(site.address)}&z=17&output=embed`}
            className="h-72 w-full border-0 lg:h-full lg:min-h-[380px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
