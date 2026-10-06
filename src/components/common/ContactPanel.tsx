import { motion } from 'motion/react'
import { CheckCircle2, ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { BorderBeam } from '@/components/ui/border-beam'
import { site } from '@/config/site'
import { useOpenStatus } from '@/hooks/useOpenStatus'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'

const checklist = ['Bag type & size', 'GSM & colour', 'Quantity', 'Printing (logo / text)', 'Delivery city & date']

/** Quick-contact card: live open status, one-tap actions and a "what to send" checklist. */
export function ContactPanel() {
  const status = useOpenStatus()

  const actions = [
    { icon: WhatsAppIcon, title: 'WhatsApp', value: 'Fastest reply', href: waLink(`Hello ${site.name}! I'd like a quotation.`), tone: 'bg-whatsapp text-white', external: true },
    { icon: Phone, title: 'Call', value: site.phone, href: `tel:+${site.phoneRaw}`, tone: 'bg-brand-50 text-brand-700' },
    { icon: Phone, title: 'Call (alternate)', value: site.phone2, href: `tel:+${site.phone2Raw}`, tone: 'bg-brand-50 text-brand-700' },
    { icon: Mail, title: 'Email', value: site.email, href: `mailto:${site.email}`, tone: 'bg-marigold-soft text-brand-900' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 18 }}
      className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-xl shadow-brand-900/5 sm:p-6"
    >
      <BorderBeam size={140} duration={10} colorFrom="var(--marigold)" colorTo="var(--brand-600)" borderWidth={1.5} />

      {/* status */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-brand-900">{site.legalName}</p>
          <p className="text-xs text-muted-foreground">{site.hours}</p>
        </div>
        {status && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold',
            status.open ? 'bg-brand-50 text-brand-700' : 'bg-muted text-foreground/70',
          )}
        >
          <span className="relative flex size-2">
            {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-600 opacity-60" />}
            <span className={cn('relative inline-flex size-2 rounded-full', status.open ? 'bg-brand-600' : 'bg-muted-foreground')} />
          </span>
          {status.label}
        </span>
        )}
      </div>
      <p className="mt-1 min-h-4 text-xs text-muted-foreground">{status?.detail}</p>

      {/* actions */}
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {actions.map(({ icon: Icon, title, value, href, tone, external }, i) => (
          <motion.li key={title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="group flex items-center gap-3 rounded-2xl border border-border p-3 transition hover:border-brand-600/40 hover:shadow-md"
            >
              <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', tone)}>
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">{title}</span>
                <span className="block text-sm font-semibold [overflow-wrap:anywhere]">{value}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
            </a>
          </motion.li>
        ))}
      </ul>

      <a
        href={site.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="group mt-2 flex items-center gap-3 rounded-2xl border border-border p-3 transition hover:border-brand-600/40 hover:shadow-md"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-marigold">
          <MapPin className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted-foreground">Visit / directions</span>
          <span className="block text-sm font-semibold">{site.address}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
      </a>

      {/* checklist */}
      <div className="mt-5 rounded-2xl bg-brand-50/70 p-4">
        <p className="text-xs font-bold tracking-wider text-brand-700 uppercase">For the fastest quote, share</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {checklist.map((c) => (
            <li key={c} className="flex items-center gap-1.5 text-sm text-foreground/80">
              <CheckCircle2 className="size-3.5 text-brand-600" /> {c}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
