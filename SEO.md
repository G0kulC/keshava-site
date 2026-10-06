# Keshava Fabrics — SEO Plan & Launch Checklist

Goal: rank #1 for bag searches in **Bhavani → Erode → Tamil Nadu**, in Google Search and Google Maps.

---

## 1. Research summary (Oct 2026)

**Who ranks today for "non woven bags manufacturer Bhavani / Erode" and "thamboolam bags Erode":**
mostly **directory listings**, not real websites:
- IndiaMART profiles: Magilmathi Traders (Bhavani), Balaji B.S. Easterrn Fabs (Bhavani), Rani Traders (Bhavani), Subha Packaging (Gobichettipalayam), NKS Industries (Bhavani), Regent Bags (Erode)
- Dial4Trade, TradeIndia and GST-lookup pages
- Larger players in Tiruppur and Coimbatore (E Bags, Green Packaging) with IndiaMART-led presence

**What this means:** no local competitor has a fast, well-structured website of its own. A site with the right technical SEO, local signals and real content can outrank directory pages. Directories still matter as **citations** (see §4).

**Old site audit (WordPress):** the home title was just "Keshava Fabrics", there were no meta descriptions and no structured data, and the policy pages were empty. Little ranking was built up, so the migration risk is low, and we kept every old URL anyway.

### Target keywords

| Intent | Primary keywords | Page |
|---|---|---|
| Head term (local) | non woven bags manufacturer bhavani, non woven bags erode | `/` (home) |
| Visit / near me | bag shop bhavani, bag factory near me, bags bhavani | `/bag-shop-bhavani/` |
| District | non woven bags erode, kattapai erode, carry bags wholesale erode | `/non-woven-bags-erode/` |
| State | non woven bags manufacturer tamil nadu, bulk carry bags tamil nadu | `/non-woven-bags-tamil-nadu/` |
| Wedding | thamboolam bags, return gift bags bulk, தாம்பூலப் பை | `/product-category/marriage-gift-bags/` |
| Shop branding | custom printed bags with logo, kattapai with shop name, கட்டப்பை | `/product-category/custom-printed-bags/`, `/customized-bags/` |
| Product type | d cut / w cut / loop handle non woven bags, 60 gsm bags | `/product-category/non-woven-bags/` |
| Info (blog) | how to choose gsm, non woven vs plastic, bag types explained | blog posts |

Each page targets **one** main intent, so pages don't compete with each other (no keyword cannibalisation).

---

## 2. What's built into the site

**Crawlable HTML**
- Every URL is **prerendered to static HTML**, so Google gets full content, titles and structured data without running JavaScript.
- 64 pages in total: home, shop, 5 category pages, 34 products, 3 area pages, 8 blog posts, 5 policies, about, contact, bulk order, customized bags, industries and gallery.

**Same URLs as WordPress**
- `/product/...`, `/product-category/...`, `/about-us/`, `/contact-us/`, `/shipping-policy/` and blog posts at `/<slug>/` all keep their addresses.
- Trailing slashes are consistent everywhere.

**On every page**
- A unique `<title>` of at most 65 characters, a meta description of 70–160 characters, and a canonical URL.
- `robots` meta, Open Graph and Twitter cards (good WhatsApp/Facebook link previews), `lang="en-IN"`, and geo meta tags.
- Exactly one H1, plus breadcrumbs (both visible and in structured data).
- Alt text on all images.

**Structured data (JSON-LD), 129 blocks, all valid**
- `WholesaleStore` (LocalBusiness): name, address, phone ×2, email, opening hours, founder, areas served (Bhavani, Erode, Tamil Nadu), map link.
- `Product` + `AggregateOffer` (INR price range, stock) on every product page.
- `BreadcrumbList`, `CollectionPage`/`ItemList`, `FAQPage`, `BlogPosting`, `WebSite`, `AboutPage`, `ContactPage`, `Service`.

**Local content**
- Area pages for Bhavani, Erode and Tamil Nadu, each with unique copy, local FAQs and the towns served.
- Category pages carry intro copy, typical uses, FAQs and the **Tamil search terms** people actually type.

**Supporting files**
- `sitemap.xml` (all 64 URLs with priorities) and `robots.txt`.

**`.htaccess` (Hostinger)**
- HTTPS + non-www forcing and trailing-slash normalisation.
- 301 redirects for old WooCommerce URLs (cart, checkout, my-account, wishlist, compare, feeds, `?add-to-cart=`) and for the old WP sitemap.
- Old `/wp-content/uploads/...` images redirect to their new copies, so Google Images rankings carry over.
- WordPress admin URLs return "410 Gone".
- Gzip compression, long-term caching for build assets, and security headers.

**Speed (Core Web Vitals)**
- The first screen's content is visible in the HTML immediately; no invisible-until-JavaScript hero.
- Images are WebP, lazy-loaded, with width and height set (no layout shift).
- Code is split per page, with framework code in long-cached chunks.

---

## 3. Launch steps (do in this order)

1. **Build**: `npm run build` → upload the **contents of `dist/`** (including `.htaccess`) to Hostinger `public_html`, replacing WordPress. Keep a backup of the old site.
2. **Check**: open a few old URLs (e.g. `/about-us/`, `/product/kattapai-green-bag/`, `/cart/`) and confirm they load or redirect.
3. **Google Search Console** (search.google.com/search-console):
   - Add the property `keshavafabrics.in` (Domain property, verified by DNS).
   - Submit `https://keshavafabrics.in/sitemap.xml`.
   - Use **URL Inspection → Request indexing** for the home page, the 5 category pages and the 3 area pages.
4. **Bing Webmaster Tools**: import from Search Console (one click) and submit the sitemap.
5. **Rich Results Test** (search.google.com/test/rich-results): test the home page, one product and one category page.
6. **PageSpeed Insights** (pagespeed.web.dev): aim for 90+ on mobile.

---

## 4. Off-site work — the biggest factor for local ranking

The website alone won't win the Google **Maps / "near me"** results. These steps do.

### Google Business Profile (most important)
- [ ] Claim or create the profile at business.google.com: **Sri Keshava Fabrics**.
- [ ] Primary category **"Bag manufacturer"**; secondary categories "Wholesaler", "Packaging supply store", "Bag shop".
- [ ] Address exactly as on the website: *289, Anna Nagar 2nd Street, Near Madha Kovil, Bhavani – 638301*. Place the pin to match the Maps link.
- [ ] Phone +91 93602 86234, website `https://keshavafabrics.in/`, and hours (**must match the site**: Mon–Fri 9–5, or update both).
- [ ] Upload 20+ real photos: unit, machines, stacked bags, each product type, founder, storefront sign.
- [ ] Add products (thamboolam bags, kattapai, non-woven, custom printed) with prices and links to the matching pages.
- [ ] Post weekly updates (new designs, wedding-season offers, Pongal and Deepavali bulk deals).
- [ ] **Reviews:** ask every happy customer to leave one. Share the review link on WhatsApp after each delivery and reply to every review. Target: 30+ reviews in the first 3 months.

### Citations (same Name, Address, Phone everywhere)
- [ ] IndiaMART, JustDial, TradeIndia, Sulekha, ExportersIndia, Dial4Trade
- [ ] Facebook Page and Instagram (post finished orders, with the customer's permission)
- [ ] YouTube Shorts of production: printing, cutting, packing
- [ ] Add each profile URL to `sameAs` in `src/seo/meta.ts` → `localBusinessLd()`

### Links and mentions
- [ ] Ask regular customers (shops, temples, wedding halls) to mention or link "bags by Keshava Fabrics, Bhavani".
- [ ] Erode / Bhavani business associations and chamber-of-commerce directories.
- [ ] Local news or blogs about plastic-free shopping bags.

---

## 5. Ongoing content (1–2 posts a month)

Ideas that match real searches:
- "Thamboolam bag ideas for weddings 2026" (with photos of your designs)
- "Non-woven bag price per piece: what affects it (GSM, size, printing)"
- "Kattapai vs D-cut vs W-cut: which is best for a supermarket?"
- "Plastic ban in Tamil Nadu: alternatives for shop owners"
- "Temple festival bag orders: planning checklist"
- A Tamil-language post on choosing thamboolam bags

Each new post: add it to `src/data/posts.json` (or the future admin panel), rebuild and redeploy. It appears in the sitemap automatically.

---

## 6. Things to fix in the data (they help SEO)

- **Duplicate products:** e.g. two "Floral Print Non-Woven Carry Bag" and two "Royal Look Non-Woven Shopping Bag". Merge them, or give each a distinct name and size. The site currently tells them apart automatically.
- **Missing prices:** many packs are ₹0 in the store. Real prices improve product rich results.
- **Placeholder text:** one description still says "[Insert Dimensions…]" (Ganesha Thamboolam). Fill in the real size.
- **Exact map pin:** add coordinates to `site.geo` in `src/config/site.ts` for the map embed and structured data.

---

## 7. How to measure

- **Search Console → Performance:** queries, impressions and position. Watch "bhavani", "erode", "thamboolam", "kattapai".
- **Google Business Profile → Performance:** calls, direction requests, website clicks.
- **Expect:** indexing within 1–2 weeks; local rankings improve over 1–3 months as reviews and citations build up.
