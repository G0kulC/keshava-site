import { Clock, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { nav, policies, site } from '@/config/site'
import { categories } from '@/data'
import { telLink, waLink } from '@/lib/whatsapp'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-900 text-brand-50/80">
      <div className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-marigold/10 blur-3xl" />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-sm text-sm leading-relaxed">
            Reliable bulk supply of non-woven, jute, cotton and custom-printed bags — for weddings, temples, retail shops and brands.
          </p>
          <a
            href={waLink(`Hello ${site.name}!`)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="size-4" /> Chat on WhatsApp
          </a>
        </div>

        <FooterCol title="Shop by category">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?category=${c.slug}`} className="hover:text-marigold">
                {c.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          {nav.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="hover:text-marigold">
                {n.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Reach us">
          <li className="flex gap-2.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-marigold" />
            <a href={telLink} className="hover:text-marigold">
              {site.phone}
            </a>
          </li>
          <li className="flex gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-marigold" /> {site.location}
          </li>
          <li className="flex gap-2.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-marigold" /> {site.hours}
          </li>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 pb-24 text-xs md:flex-row md:items-center md:justify-between md:pb-6">
          <p>© {YEAR} {site.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {policies.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="hover:text-marigold">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-xs font-bold tracking-[0.2em] text-white uppercase">{title}</h3>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}
