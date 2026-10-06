# Keshava Fabrics — Web (Phase 1)

A rebuild of [keshavafabrics.in](https://keshavafabrics.in) (WordPress/WooCommerce) as a fast React storefront.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4 · Magic UI (via shadcn registry) · Motion (`motion/react`) · React Router

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build
node scripts/scrape.mjs   # re-pull products/categories/blog from the live site
```

## Data (Phase 1 = static JSON)

| File | Source | Notes |
|---|---|---|
| `src/data/products.json` | WooCommerce Store API | 34 products, variant (pack size) prices, cleaned HTML, local images |
| `src/data/categories.json` | Store API | 5 non-empty categories |
| `src/data/posts.json` | WP REST API | 8 blog posts |
| `public/images/**` | downloaded | 600px thumbs + 1200px full |

All reads go through **`src/data/index.ts`**. When the admin panel/API arrives, swap that one file to `fetch` (or React Query) — pages don't change.

Business details (phone, WhatsApp, hours, email) live in **`src/config/site.ts`**.

## UX decisions

- **Quote list instead of cart.** Buyers are mostly B2B / bulk (weddings, temples, shops). They add items + pack sizes, then send the whole list to WhatsApp in one tap. No sign-up, no payment friction. Persisted in `localStorage`.
- **Per-bag price** shown on every pack size (e.g. Pack of 100 = ₹720 → ≈ ₹7.20/bag), so buyers can compare packs at a glance.
- **Mobile-first:** sticky bottom bar (Call · WhatsApp · Quote), 375px tested with no horizontal scroll, scrollable category chips.
- **Shop filters in the URL** (`/shop?category=jute-bags&q=royal&sort=price-asc`), so filtered views can be shared on WhatsApp.
- **Guided enquiry builders:** Customized Bags (type/size/GSM/colour/printing) and Bulk Order (multi-line mixer), both producing structured WhatsApp messages.
- **Old URLs redirect** (`/product-category/*`, `/about-us`, `/contact-us`), so existing Google links and shares keep working.
- Accessibility: skip link, `aria-*` on toggles/tabs, `prefers-reduced-motion` respected, semantic headings.

## Magic UI components in use

Marquee, NumberTicker, ShimmerButton, BorderBeam, BlurFade, DotPattern, MagicCard, ShineBorder, AnimatedShinyText, Ripple.
Add more with: `npx shadcn@latest add @magicui/<name>`

## Known gaps / TODO

- `site.email` is empty: the live site shows a placeholder email.
- Policy pages are placeholders: the live site's policies are empty templates.
- "Rama Darbar … Thamboolam Bag" has no category on the live site, so it only appears under "All".
- Several products have generic names and duplicate titles (e.g. "Royal Look Non-Woven Shopping Bag" ×2). Clean them up in the admin later.
- Large `public/images` (~23 MB). Consider an image CDN later.

## Roadmap

1. **Phase 1 (done):** public storefront on static JSON.
2. **Phase 2 — Admin panel:** product/category/blog CRUD, image upload, pack-size pricing, site settings. Suggested: same Vite app under `/admin` + a backend (Supabase or Node + Postgres). Replace `src/data/index.ts` with API calls.
3. **Phase 3 — CRM:** save every WhatsApp/quote enquiry as a lead (status: new → quoted → won/lost), customer history, follow-up reminders, quotation PDF.
4. **Launch video:** after deploy, run the [`/brag`](https://github.com/latent-spaces/brag) skill to generate a shareable launch video of the site.
