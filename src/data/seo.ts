// SEO copy for category landing pages and local "area" pages.
// Written for people searching in Bhavani, Erode and across Tamil Nadu.
// Keep facts here in sync with config/site.ts — never invent delivery times or client counts.
import { site } from '@/config/site'

export interface Faq {
  q: string
  a: string
}

export interface CategorySeo {
  h1: string
  title: string
  description: string
  intro: string[]
  uses: string[]
  /** Tamil search terms people actually type, shown naturally on the page. */
  tamil?: string
  faqs: Faq[]
}

export const categorySeo: Record<string, CategorySeo> = {
  'marriage-gift-bags': {
    h1: 'Thamboolam & Return Gift Bags',
    title: 'Thamboolam & Return Gift Bags in Bulk – Bhavani, Erode',
    description:
      'Printed thamboolam bags and return gift bags for weddings, housewarmings and temple functions. Ganesha, Venkateswara, Amman & Radha Krishna designs. Bulk packs from Bhavani, Erode.',
    intro: [
      'Thamboolam bags are part of every Tamil wedding, valaikappu, housewarming and temple function. We make them in non-woven fabric with bright, high-definition prints of Lord Ganesha, Venkateswara–Padmavati, Amman, Rama Darbar, Radha Krishna and more — with traditional Tamil greetings like “Vazhga Valamudan”.',
      'Order in packs of 25, 50, 100 or 500, or ask us to print your family name and function details on the bag. Every batch is checked before it leaves our unit in Bhavani, Erode district.',
    ],
    uses: ['Weddings & receptions', 'Valaikappu / seemantham', 'Housewarming (griha pravesam)', 'Temple festivals & kumbabishekam', 'Ear-piercing & naming ceremonies', 'Corporate Pongal / Deepavali gifting'],
    tamil: 'தாம்பூலப் பை · திருமண ரிட்டர்ன் கிஃப்ட் பை',
    faqs: [
      { q: 'Can you print our names and function date on thamboolam bags?', a: 'Yes. Share the names, date and any message on WhatsApp — we send a design proof before printing.' },
      { q: 'What pack sizes are available?', a: 'Most designs come in packs of 25, 50, 100 and 500. Larger quantities are quoted separately with better rates.' },
      { q: 'How early should we order for a wedding?', a: 'Message us as soon as your date is fixed. We confirm the dispatch date in the quotation so the bags reach you well before the function.' },
    ],
  },
  'non-woven-bags': {
    h1: 'Non-Woven Bags',
    title: 'Non-Woven Bags – D-Cut, W-Cut, Loop | Bhavani, Erode',
    description:
      'Non-woven carry bags in 20–150 GSM — D-cut, W-cut, loop handle and box bags. Plain or custom printed, bulk supply across Tamil Nadu from our unit in Bhavani, Erode.',
    intro: [
      'Non-woven bags are strong, reusable and a practical replacement for single-use plastic carry bags. We manufacture them in a wide GSM range — from light 20–40 GSM bags for promotions to sturdy 100–150 GSM bags for heavy goods.',
      'Choose the handle style (D-cut, W-cut, loop or box/gusset), size, colour and printing. Ready designs are available below; anything else we make to order.',
    ],
    uses: ['Supermarkets & provision stores', 'Textile & saree shops', 'Medical shops', 'Sweet & bakery shops', 'Events and exhibitions', 'Promotional giveaways'],
    tamil: 'நான்-வோவன் பை · துணிப்பை',
    faqs: [
      { q: 'Which GSM should I choose?', a: '50–70 GSM suits everyday retail; 80–100 GSM is better for gifts and boutiques; 120 GSM and above for heavy items. We can suggest the right one for your use.' },
      { q: 'Are non-woven bags eco-friendly?', a: 'They are reusable many times and replace single-use plastic carry bags, which makes them a greener everyday choice.' },
      { q: 'Do you print shop names and logos?', a: 'Yes — one or two sides, in your colours. See Customized Bags or send your logo on WhatsApp.' },
    ],
  },
  'custom-printed-bags': {
    h1: 'Custom Printed Bags & Kattapai',
    title: 'Custom Printed Bags & Kattapai with Your Logo – Erode',
    description:
      'Kattapai and custom printed non-woven bags with your shop name or logo. Strong patch handles, bright colours, bulk orders for shops and temples across Tamil Nadu.',
    intro: [
      'Kattapai bags are the everyday workhorse of Tamil Nadu shops — strong patch handles, bright colours and space for your shop name. We print them with your logo, phone number and address so every bill carries your brand home.',
      'Pick a ready colour below or design your own bag with our live bag designer and send it to us for a quote.',
    ],
    uses: ['Textile & readymade shops', 'Jewellery stores', 'Supermarkets', 'Temples & trusts', 'Political & community events', 'Corporate gifting'],
    tamil: 'கட்டப்பை · பிரிண்ட் பை',
    faqs: [
      { q: 'What is the minimum quantity for logo printing?', a: 'It depends on the bag type and printing. Share your quantity and we will suggest the most economical option.' },
      { q: 'Can I see how my logo will look?', a: 'Yes — use the bag designer on our Customized Bags page, then send the preview to us on WhatsApp.' },
      { q: 'Can you match my brand colour?', a: 'Send your colour or logo file and we will match it as closely as the fabric and print allow, and confirm on the proof.' },
    ],
  },
  'jute-bags': {
    h1: 'Jute & Reusable Tote Bags',
    title: 'Jute & Reusable Tote Bags in Bulk – Bhavani, Erode',
    description:
      'Reusable tote, camouflage and royal-look bags plus jute-style shopping bags. Strong, washable and printable — bulk supply from Bhavani, Erode across Tamil Nadu.',
    intro: [
      'Our reusable totes are made for daily shopping — camouflage, royal-look stripes and mandala prints that customers are happy to carry again and again.',
      'They make good premium carry bags for boutiques and gift shops, and can be printed with your name or logo for a branded look.',
    ],
    uses: ['Boutiques & gift shops', 'Daily shopping', 'Corporate & event kits', 'Return gifts', 'Retail branding'],
    tamil: 'சணல் பை · ஷாப்பிங் பை',
    faqs: [
      { q: 'Are these bags washable?', a: 'Yes, they can be gently hand-washed and reused. See our Care & Reuse Tips article for more.' },
      { q: 'Can these be printed with a logo?', a: 'Yes. Tell us your quantity and design and we will send a proof and quotation.' },
    ],
  },
  'shopping-bags': {
    h1: 'Reusable Shopping Bags',
    title: 'Reusable Shopping Bags – Royal Look, Kattapai & Mandala',
    description:
      'Colourful reusable shopping bags — royal look, kattapai and mandala designs. Ready stock and bulk orders for retail shops across Tamil Nadu from Bhavani, Erode.',
    intro: [
      'Bright, sturdy shopping bags your customers will keep using — royal-look stripes, kattapai colours and mandala prints in ready stock.',
      'Buy ready designs below, or get them printed with your shop name for repeat brand visibility.',
    ],
    uses: ['Supermarkets', 'Textile shops', 'Vegetable & fruit shops', 'Daily household use', 'Promotions'],
    tamil: 'ஷாப்பிங் பை · கட்டப்பை',
    faqs: [
      { q: 'Do you sell single pieces?', a: 'Our focus is bulk supply for shops and functions. Message us with your quantity and we will advise.' },
      { q: 'Can I mix colours in one order?', a: 'Yes — use the Bulk Order page to add each colour and quantity as a separate line.' },
    ],
  },
}

// ───────────────────────── Area pages ─────────────────────────

export interface AreaPage {
  slug: string
  place: string
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string[]
  highlights: { title: string; text: string }[]
  /** Nearby towns we deliver to — used for internal context, not separate pages. */
  serves: string[]
  tamil: string
  faqs: Faq[]
}

export const areaPages: AreaPage[] = [
  {
    slug: 'bag-shop-bhavani',
    place: 'Bhavani',
    eyebrow: 'Bhavani, Erode district',
    h1: 'Visit Our Bag Unit in Bhavani',
    title: 'Bag Shop & Factory in Bhavani – Visit or Order on WhatsApp',
    description: `Sri Keshava Fabrics, ${site.address}. Non-woven, thamboolam, kattapai & custom printed bags in bulk. Visit, call or WhatsApp ${site.phone}.`,
    intro: [
      `Sri Keshava Fabrics is a non-woven bag manufacturer right here in Bhavani, near Madha Kovil on Anna Nagar 2nd Street. Shops, temples and families in Bhavani can visit us, see samples and collect their order directly — no courier wait.`,
      'We make thamboolam and return gift bags for weddings, kattapai and shopping bags for local shops, and custom printed bags with your shop name or logo, in a GSM range of 20 to 150.',
    ],
    highlights: [
      { title: 'Local pick-up', text: 'Collect from our Bhavani unit by appointment — ideal for urgent function orders.' },
      { title: 'See samples first', text: 'Check fabric, colours and print quality in person before you order.' },
      { title: 'Printed with your details', text: 'Shop name, logo or wedding names printed on the bag.' },
    ],
    serves: ['Bhavani', 'Kalingarayanpalayam', 'Kumarapalayam', 'Anthiyur', 'Ammapettai', 'Chithode', 'Perundurai', 'Erode'],
    tamil: 'பவானியில் நான்-வோவன் பை, தாம்பூலப் பை, கட்டப்பை தயாரிப்பாளர்',
    faqs: [
      { q: 'Where exactly are you located in Bhavani?', a: `${site.address}. Use the Directions button for the exact map pin, and message us before visiting.` },
      { q: 'Can I collect the bags myself?', a: 'Yes, self pick-up from our Bhavani unit is available by appointment.' },
      { q: 'Do you make bags for Bhavani temple functions?', a: 'Yes — thamboolam, prasadam and kattapai bags for temple festivals and functions, printed if needed.' },
    ],
  },
  {
    slug: 'non-woven-bags-erode',
    place: 'Erode',
    eyebrow: 'Erode district',
    h1: 'Non-Woven Bags Supplier in Erode',
    title: 'Non-Woven Bags in Erode – Thamboolam, Kattapai & Printed',
    description:
      'Bulk non-woven bags for Erode shops, textile showrooms, weddings and temples — thamboolam, kattapai, D-cut, loop and custom printed bags from our unit in Bhavani.',
    intro: [
      'Erode is one of Tamil Nadu’s busiest textile and trading centres — and every showroom, supermarket and wholesale shop needs carry bags in volume. We supply non-woven, kattapai and custom printed bags to businesses across Erode district from our manufacturing unit in Bhavani.',
      'For weddings and functions in Erode, choose from our thamboolam and return gift bags in ready packs, or get them printed with names and greetings.',
    ],
    highlights: [
      { title: 'Close to Erode', text: 'Our unit is in Bhavani, within Erode district — quick dispatch and easy pick-up.' },
      { title: 'Textile-shop ready', text: 'Loop handle and laminated bags that suit saree and readymade showrooms.' },
      { title: 'Bulk & repeat orders', text: 'Consistent GSM and print across every re-order.' },
    ],
    serves: ['Erode', 'Bhavani', 'Perundurai', 'Gobichettipalayam', 'Sathyamangalam', 'Kodumudi', 'Chennimalai', 'Anthiyur'],
    tamil: 'ஈரோட்டில் நான்-வோவன் பை மொத்த விற்பனை',
    faqs: [
      { q: 'Do you deliver to Erode town?', a: 'Yes. Share your address and quantity — we confirm delivery or pick-up options and charges in the quotation.' },
      { q: 'Do you supply textile showrooms in Erode?', a: 'Yes, we make loop handle, box and laminated bags printed with your showroom name and logo.' },
      { q: 'Can I get a quotation quickly?', a: 'WhatsApp your bag type, size, GSM, quantity and printing details for the fastest reply.' },
    ],
  },
  {
    slug: 'non-woven-bags-tamil-nadu',
    place: 'Tamil Nadu',
    eyebrow: 'Across Tamil Nadu',
    h1: 'Non-Woven Bags Manufacturer in Tamil Nadu',
    title: 'Non-Woven Bags Manufacturer in Tamil Nadu – Bulk Supply',
    description:
      'Bulk non-woven, thamboolam, kattapai and custom printed bags for shops, temples and weddings across Tamil Nadu — Coimbatore, Tiruppur, Salem, Namakkal, Karur, Madurai, Trichy & Chennai.',
    intro: [
      'From our unit in Bhavani, Erode district, we supply bags to businesses and families all over Tamil Nadu. Courier for smaller orders and transport services for bulk loads, with freight shown clearly in your quotation.',
      'Whether you run a supermarket in Coimbatore, a textile shop in Tiruppur or are planning a wedding in Chennai, send your requirement on WhatsApp and we will reply with price and a dispatch plan.',
    ],
    highlights: [
      { title: 'State-wide dispatch', text: 'Courier, transport or self pick-up — whichever suits your quantity and city.' },
      { title: 'Clear freight', text: 'Delivery charges are shown separately in your quotation.' },
      { title: 'Tracking on WhatsApp', text: 'We share the LR copy or tracking number as soon as it ships.' },
    ],
    serves: ['Coimbatore', 'Tiruppur', 'Salem', 'Namakkal', 'Karur', 'Madurai', 'Tiruchirappalli', 'Chennai', 'Dindigul', 'Pollachi', 'Mettur', 'Vellore'],
    tamil: 'தமிழ்நாடு முழுவதும் நான்-வோவன் பை மொத்த விற்பனை',
    faqs: [
      { q: 'Do you deliver outside Erode district?', a: 'Yes, across Tamil Nadu. Share your city and quantity for a freight estimate.' },
      { q: 'How are bulk orders shipped?', a: 'Smaller parcels go by courier; bulk orders by transport/lorry service. Details are in our Shipping Policy.' },
      { q: 'Can I order without visiting?', a: 'Yes — everything can be done on WhatsApp: requirement, design proof, payment and dispatch updates.' },
    ],
  },
]

export const getArea = (slug: string) => areaPages.find((a) => a.slug === slug)
