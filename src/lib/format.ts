const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 })

export const formatINR = (n: number | null | undefined) => (n == null ? '—' : inr.format(n))

export const discountPct = (price: number | null, regular: number | null) =>
  price && regular && regular > price ? Math.round(((regular - price) / regular) * 100) : 0

/** "Pack of 100" / "100 Units" / "500" → 100. Lets us show a per-bag price. */
export const packQty = (label?: string) => {
  const m = label?.match(/(\d[\d,]*)/)
  return m ? Number(m[1].replace(/,/g, '')) : null
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
