import { paths } from '@/config/routes'

// Single source of truth for business details. Later this can come from the admin panel.
export const site = {
  // Public name: must match the signboard and the Google Business Profile exactly.
  name: 'Sri Keshava Fabrics',
  // Registered name for the legal policy pages and structured data (same as the public name today).
  legalName: 'Sri Keshava Fabrics',
  tagline: 'Eco-friendly bags, made for every occasion',
  founder: 'Mr. Mahendran',
  phone: '+91 93602 86234',
  phoneRaw: '919360286234',
  phone2: '+91 78128 93175',
  phone2Raw: '917812893175',
  email: 'info@keshavafabrics.com',
  address: '289, Anna Nagar 2nd Street, Near Madha Kovil, Bhavani – 638301',
  location: 'Bhavani, Tamil Nadu',
  // Exact pin shared by the owner — used for every "Directions" link.
  mapsUrl: 'https://maps.app.goo.gl/eeZaU6sK7cRhmgTE6',
  // TODO: paste the pin's coordinates here so the embedded map shows the exact spot
  // (open the link above → tap the red pin → copy the numbers like 11.4458, 77.6827).
  geo: null as { lat: number; lng: number } | null,
  // From the live site footer. Used for the "open now" badge (IST).
  hours: 'Mon–Fri · 9:00 AM – 5:00 PM',
  openDays: [1, 2, 3, 4, 5], // 0 = Sunday
  openHour: 9,
  closeHour: 17,
  gsmRange: '20–150 GSM',
} as const

/**
 * Business terms used in the policy pages. These are sensible defaults —
 * confirm each value with the owner before going live.
 */
export const terms = {
  updated: '2026-10-07',
  readyStockDispatch: '2–4 working days',
  customOrderLead: 'confirmed in your quotation (usually after design approval)',
  advancePercent: 50,
  quoteValidityDays: 7,
  returnWindowDays: 7,
  reportDamageHours: 48,
  refundDays: '7–10 working days',
  quantityTolerance: '±5%',
  gsmTolerance: '±5%',
  jurisdiction: 'courts in Tamil Nadu, India',
  // Optional legal details — shown on policy pages only when filled in.
  legalName: 'Sri Keshava Fabrics',
  address: '289, Anna Nagar 2nd Street, Near Madha Kovil, Bhavani – 638301, Tamil Nadu',
  gstin: '',
} as const

export const nav = [
  { label: 'Shop', to: paths.shop },
  { label: 'Customized Bags', to: paths.customBags },
  { label: 'Bulk Order', to: paths.bulkOrder },
  { label: 'About', to: paths.about },
  { label: 'Blog', to: paths.blog },
  { label: 'Contact', to: paths.contact },
] as const

export const policies = [
  { label: 'Shipping Policy', to: paths.policy('shipping') },
  { label: 'Return & Refund', to: paths.policy('returns') },
  { label: 'Bulk Order Policy', to: paths.policy('bulk-orders') },
  { label: 'Privacy Policy', to: paths.policy('privacy') },
  { label: 'Terms & Conditions', to: paths.policy('terms') },
] as const
