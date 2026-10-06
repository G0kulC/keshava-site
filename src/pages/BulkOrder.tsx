import { AnimatePresence, motion } from 'motion/react'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DatePicker, formatISODate } from '@/components/common/DatePicker'
import { PageHero } from '@/components/common/PageHero'
import { Select } from '@/components/common/Select'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { site } from '@/config/site'
import { categories, products } from '@/data'
import { waLink } from '@/lib/whatsapp'

interface Row {
  id: number
  category: string
  product: string
  color: string
  size: string
  qty: string
}

let nextId = 1
const newRow = (): Row => ({ id: nextId++, category: categories[0]?.slug ?? '', product: '', color: '', size: '', qty: '500' })

export default function BulkOrder() {
  const [rows, setRows] = useState<Row[]>(() => [newRow()])
  const [contact, setContact] = useState({ name: '', city: '', date: '' })

  const update = (id: number, patch: Partial<Row>) => setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)

  const message = [
    `Hello ${site.name}! Bulk enquiry:`,
    '',
    ...rows.map((r, i) => {
      const cat = categories.find((c) => c.slug === r.category)?.name
      const prod = products.find((p) => p.slug === r.product)?.name
      return `${i + 1}. ${prod ?? cat ?? 'Bag'}${r.color ? ` · ${r.color}` : ''}${r.size ? ` · ${r.size}` : ''} — ${r.qty || '?'} pcs`
    }),
    '',
    `Total quantity: ${totalQty} pcs`,
    contact.name && `Name/Business: ${contact.name}`,
    contact.city && `Delivery city: ${contact.city}`,
    contact.date && `Needed by: ${formatISODate(contact.date)}`,
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n')

  const field = 'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand-600 focus:ring-3 focus:ring-brand-600/15'

  return (
    <>
      <PageHero
        eyebrow="Bulk enquiry"
        title="Order in bulk — mix any colours, sizes and quantities"
        description="Add each combination as a line. We'll reply with one consolidated quotation and a dispatch plan."
      />

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {rows.map((r, i) => {
              const options = products.filter((p) => p.categories.includes(r.category))
              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">Item {i + 1}</span>
                    {rows.length > 1 && (
                      <button onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} className="text-muted-foreground hover:text-destructive" aria-label="Remove item">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="grid min-w-0 gap-1.5 text-xs font-medium text-muted-foreground">
                      <span>Category</span>
                      <Select
                        label="Category"
                        value={r.category}
                        onChange={(v) => update(r.id, { category: v, product: '' })}
                        options={categories.map((c) => ({
                          value: c.slug,
                          label: c.name,
                          description: `${c.count} designs`,
                          icon: c.image ? <img src={c.image} alt="" className="size-full rounded-md object-cover" /> : undefined,
                        }))}
                      />
                    </div>
                    <div className="grid min-w-0 gap-1.5 text-xs font-medium text-muted-foreground">
                      <span>Model (optional)</span>
                      <Select
                        label="Model"
                        value={r.product}
                        onChange={(v) => update(r.id, { product: v })}
                        options={[
                          { value: '', label: 'Any / custom design', description: 'We will suggest options' },
                          ...options.map((p) => ({
                            value: p.slug,
                            label: p.name,
                            description: p.variants.length ? `${p.variants.length} pack sizes` : undefined,
                            icon: p.images[0] ? <img src={p.images[0].thumb} alt="" className="size-full rounded-md object-cover" /> : undefined,
                          })),
                        ]}
                      />
                    </div>
                    <label className="grid min-w-0 gap-1.5 text-xs font-medium text-muted-foreground">
                      Colour / size
                      <input className={field} value={r.color} onChange={(e) => update(r.id, { color: e.target.value })} placeholder="Green, 12×16" />
                    </label>
                    <label className="grid min-w-0 gap-1.5 text-xs font-medium text-muted-foreground">
                      Quantity
                      <input className={field} inputMode="numeric" value={r.qty} onChange={(e) => update(r.id, { qty: e.target.value.replace(/\D/g, '') })} />
                    </label>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <button
            onClick={() => setRows((r) => [...r, newRow()])}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-semibold text-brand-700 transition hover:border-brand-600 hover:bg-brand-50"
          >
            <Plus className="size-4" /> Add another item
          </button>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold">Enquiry summary</h2>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-brand-50 p-3">
              <dt className="text-xs text-muted-foreground">Items</dt>
              <dd className="font-heading text-2xl font-semibold text-brand-900">{rows.length}</dd>
            </div>
            <div className="rounded-xl bg-marigold-soft p-3">
              <dt className="text-xs text-muted-foreground">Total pcs</dt>
              <dd className="font-heading text-2xl font-semibold text-brand-900">{totalQty.toLocaleString('en-IN')}</dd>
            </div>
          </dl>
          {(['name', 'city'] as const).map((k) => (
            <label key={k} className="grid gap-1 text-xs font-medium text-muted-foreground">
              {k === 'name' ? 'Your name / business' : 'Delivery city'}
              <input className={field} value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} />
            </label>
          ))}
          <div className="grid gap-1 text-xs font-medium text-muted-foreground">
            Needed by
            <DatePicker label="Needed by" value={contact.date} onChange={(date) => setContact({ ...contact, date })} placeholder="Pick delivery date" />
          </div>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon /> Send bulk enquiry
          </a>
          <p className="text-center text-xs text-muted-foreground">Opens WhatsApp with your list pre-filled. Nothing is charged.</p>
        </aside>
      </section>

      <section className="container-page py-12">
        <SectionHeading eyebrow="Our process" title="Simple steps for every bulk order" align="center" />
        <ProcessSteps />
      </section>
    </>
  )
}
