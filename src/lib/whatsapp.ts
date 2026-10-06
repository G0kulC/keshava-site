import { site } from '@/config/site'
import { formatINR } from '@/lib/format'
import type { QuoteItem } from '@/types'

export const waLink = (text: string) => `https://wa.me/${site.phoneRaw}?text=${encodeURIComponent(text)}`

export const telLink = `tel:+${site.phoneRaw}`

export function quoteMessage(items: QuoteItem[], extra?: Record<string, string>) {
  const lines = items.map(
    (i, n) =>
      `${n + 1}. ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ''} × ${i.qty}` +
      (i.unitPrice ? ` — ${formatINR(i.unitPrice)} ${i.variantLabel ? 'per pack' : 'each'}` : ''),
  )
  const details = Object.entries(extra ?? {})
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
  return [
    `Hello ${site.name}! I'd like a quotation for:`,
    '',
    ...lines,
    ...(details.length ? ['', ...details] : []),
    '',
    'Please share price & dispatch timeline. Thank you!',
  ].join('\n')
}

export const productEnquiry = (name: string, variant?: string) =>
  `Hello ${site.name}! I'm interested in "${name}"${variant ? ` (${variant})` : ''}. Please share price and availability.`
