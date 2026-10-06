// Policy content. Plain data so the admin panel can edit it later.
// Values in `terms` (site config) are business decisions — confirm them before launch.
import { site, terms as t } from '@/config/site'

export type Block = { p: string } | { ul: string[] } | { note: string }

export interface PolicySection {
  id: string
  heading: string
  blocks: Block[]
}

export interface Policy {
  slug: string
  title: string
  summary: string
  icon: 'truck' | 'refresh' | 'boxes' | 'shield' | 'scale'
  highlights: { title: string; text: string }[]
  sections: PolicySection[]
}

const contactLine = `WhatsApp or call us on ${site.phone} (${site.hours}).`

export const policyPages: Policy[] = [
  // ───────────────────────────── Shipping ─────────────────────────────
  {
    slug: 'shipping',
    title: 'Shipping Policy',
    summary: 'How and when your bags are dispatched, what delivery costs, and what to do if something arrives damaged.',
    icon: 'truck',
    highlights: [
      { title: `Ready stock: ${t.readyStockDispatch}`, text: 'Dispatched after your order and payment are confirmed.' },
      { title: 'Custom orders: as quoted', text: 'Your dispatch date is written in the quotation.' },
      { title: `Report damage in ${t.reportDamageHours} hrs`, text: 'Share photos on WhatsApp and we will sort it out.' },
    ],
    sections: [
      {
        id: 'processing',
        heading: 'Order processing time',
        blocks: [
          { p: `Ready-stock bags are usually packed and dispatched within ${t.readyStockDispatch} after your order and payment are confirmed.` },
          { p: `Custom-printed and made-to-order bags have a production timeline that depends on quantity, printing and season. The dispatch date is ${t.customOrderLead}.` },
          { p: 'Orders confirmed after working hours, on Sundays or on public holidays are processed from the next working day.' },
        ],
      },
      {
        id: 'methods',
        heading: 'Shipping methods & charges',
        blocks: [
          { p: 'We choose the most practical option for your quantity and location:' },
          {
            ul: [
              'Courier — for smaller parcels and samples.',
              'Transport / lorry service — for bulk orders and long distances.',
              `Self pick-up — you can collect from our unit in ${site.location}, by appointment.`,
            ],
          },
          { p: 'Freight depends on weight, volume and delivery city. It is shown separately in your quotation unless we have agreed on free delivery.' },
          { p: 'For transport deliveries, goods may need to be collected from the transporter’s local godown. Local unloading and godown charges, if any, are paid by the receiver.' },
        ],
      },
      {
        id: 'tracking',
        heading: 'Tracking & updates',
        blocks: [
          { p: 'Once your order is dispatched we share the courier tracking number or the transport LR copy on WhatsApp, so you always know where your goods are.' },
        ],
      },
      {
        id: 'delays',
        heading: 'Delays',
        blocks: [
          { p: 'We plan dispatch around the date you need. Delivery times given by couriers and transporters are estimates; delays due to weather, strikes, festivals, road closures or other events outside our control can happen. We will keep you informed and help follow up with the carrier.' },
        ],
      },
      {
        id: 'damage',
        heading: 'Checking your delivery',
        blocks: [
          { p: 'Please check the number of bundles and the condition of the packing when you receive the goods.' },
          {
            ul: [
              'If a bundle is torn, wet or missing, note it on the delivery receipt before signing.',
              `Tell us within ${t.reportDamageHours} hours of delivery, with photos (an unboxing video is even better).`,
              'We will arrange a replacement, credit or refund as described in our Return & Refund Policy.',
            ],
          },
        ],
      },
      {
        id: 'address',
        heading: 'Delivery address',
        blocks: [
          { p: 'Please share the full delivery address with PIN code and a phone number that will be available at the time of delivery. Re-delivery caused by a wrong address or an unreachable phone may be charged.' },
        ],
      },
    ],
  },

  // ───────────────────────────── Returns ─────────────────────────────
  {
    slug: 'returns',
    title: 'Return & Refund Policy',
    summary: 'When you can return bags, how replacements and refunds work, and how custom-printed orders are handled.',
    icon: 'refresh',
    highlights: [
      { title: `${t.returnWindowDays}-day returns on ready stock`, text: 'Unused bags in their original packing.' },
      { title: 'Defects always covered', text: 'Wrong, damaged or defective goods are replaced or refunded.' },
      { title: `Refund in ${t.refundDays}`, text: 'After the returned goods are received and checked.' },
    ],
    sections: [
      {
        id: 'ready-stock',
        heading: 'Ready-stock (plain or standard design) bags',
        blocks: [
          { p: `You can request a return within ${t.returnWindowDays} days of delivery if the bags are unused, clean and in their original bundles.` },
          { p: 'Return shipping for change-of-mind returns is paid by the customer. Bags that come back used, soiled or not in their original packing cannot be accepted.' },
        ],
      },
      {
        id: 'custom',
        heading: 'Custom-printed & made-to-order bags',
        blocks: [
          { p: 'Bags printed with your name, logo or design — or made to your size, colour or GSM — are produced only for you and cannot be resold. They are not returnable for change of mind.' },
          { p: 'They are still fully covered for manufacturing defects (see below). Please check your design proof carefully before approving it — spelling, phone numbers and colours on the approved proof are printed as shown.' },
        ],
      },
      {
        id: 'defects',
        heading: 'Wrong, damaged or defective items',
        blocks: [
          { p: `If you receive the wrong product, short quantity, transit damage or a manufacturing defect (for example broken stitching, misprint or wrong colour compared with the approved proof), tell us within ${t.reportDamageHours} hours of delivery with photos.` },
          { p: 'After checking, we will — at our choice and with your agreement — replace the affected bags, give a credit on your next order, or refund the value of the affected bags. We cover the shipping cost in these cases.' },
        ],
      },
      {
        id: 'tolerance',
        heading: 'Normal variations (not defects)',
        blocks: [
          { p: 'Non-woven and natural fabrics have small natural variations. The following are normal and are not treated as defects:' },
          {
            ul: [
              'Slight differences between the colour on your screen and the actual fabric or print.',
              `Fabric weight within ${t.gsmTolerance} of the ordered GSM.`,
              `Production quantity within ${t.quantityTolerance} of the ordered quantity on custom orders (billed on actual quantity supplied).`,
              'Minor print shifts of a few millimetres that do not affect the design.',
            ],
          },
        ],
      },
      {
        id: 'cancellation',
        heading: 'Cancelling an order',
        blocks: [
          { p: 'You can cancel free of charge before production or printing has started. Once material is cut or printed, the order cannot be cancelled; any advance paid will be adjusted against the work already done.' },
        ],
      },
      {
        id: 'refunds',
        heading: 'How refunds are paid',
        blocks: [
          { p: `Approved refunds are paid to your original payment method (or by bank transfer / UPI for cash and cheque payments) within ${t.refundDays} after we receive and check the returned goods.` },
        ],
      },
      {
        id: 'how',
        heading: 'How to request a return',
        blocks: [
          { ul: ['Send your order details and photos on WhatsApp.', 'We confirm whether the return is approved and share pick-up or return instructions.', 'Once the goods are checked, we process the replacement, credit or refund.'] },
          { p: contactLine },
        ],
      },
    ],
  },

  // ───────────────────────────── Bulk orders ─────────────────────────────
  {
    slug: 'bulk-orders',
    title: 'Bulk Order Policy',
    summary: 'How quotations, design approval, payment and production work for bulk and custom-printed orders.',
    icon: 'boxes',
    highlights: [
      { title: `Quotes valid ${t.quoteValidityDays} days`, text: 'Fabric prices change — we re-confirm after that.' },
      { title: `${t.advancePercent}% advance`, text: 'Starts production; balance before dispatch.' },
      { title: 'Proof before print', text: 'Nothing is printed until you approve the design.' },
    ],
    sections: [
      {
        id: 'quotation',
        heading: 'Quotations',
        blocks: [
          { p: 'Send your requirement — bag type, size, GSM, colour, printing, quantity and delivery city — through the website, WhatsApp or phone. We reply with a written quotation.' },
          { p: `Quotations are valid for ${t.quoteValidityDays} days because raw-material prices change. After that we will re-confirm the price before starting.` },
          { p: 'Prices shown on the website are for ready stock in the listed pack sizes. Bulk and custom prices are always confirmed in the quotation.' },
        ],
      },
      {
        id: 'moq',
        heading: 'Minimum order quantity',
        blocks: [
          { p: 'The minimum quantity depends on the bag type, size and printing method, and is mentioned in your quotation. Ask us if you need a smaller quantity — we will suggest the most economical option.' },
        ],
      },
      {
        id: 'design',
        heading: 'Design & proof approval',
        blocks: [
          { p: 'We share a digital proof showing the layout, colours and placement of your logo or text.' },
          {
            ul: [
              'Production starts only after you approve the proof in writing (WhatsApp or email is fine).',
              'Please check spelling, phone numbers, addresses and colours carefully — the approved proof is final.',
              'Changes requested after approval may affect cost and delivery date.',
            ],
          },
          { p: 'By sending us a logo or artwork, you confirm that you have the right to use it. We do not reuse your design for any other customer.' },
        ],
      },
      {
        id: 'payment',
        heading: 'Payment terms',
        blocks: [
          { p: `Custom and bulk orders need a ${t.advancePercent}% advance to start production. The balance is paid before dispatch, unless other terms are agreed in writing.` },
          { p: 'We accept bank transfer, UPI and other methods mentioned in the quotation. A GST invoice is provided for every order.' },
        ],
      },
      {
        id: 'production',
        heading: 'Production & quality',
        blocks: [
          { p: `Your dispatch date is ${t.customOrderLead}. Every batch is checked for GSM, stitching, handle strength and print quality before packing.` },
          { p: `Custom production can vary by ${t.quantityTolerance} from the ordered quantity; you are billed for the actual quantity supplied.` },
        ],
      },
      {
        id: 'repeat',
        heading: 'Repeat orders',
        blocks: [
          { p: 'We keep your approved design on file so repeat orders are faster and match earlier batches. Just tell us the quantity and delivery date.' },
        ],
      },
    ],
  },

  // ───────────────────────────── Privacy ─────────────────────────────
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What information we collect when you use this website or contact us, and how we use and protect it.',
    icon: 'shield',
    highlights: [
      { title: 'No account needed', text: 'Browse and enquire without signing up.' },
      { title: 'Your logo stays on your device', text: 'The bag designer works inside your browser.' },
      { title: 'We never sell your data', text: 'Used only to reply to you and fulfil orders.' },
    ],
    sections: [
      {
        id: 'collect',
        heading: 'Information we collect',
        blocks: [
          { p: 'We only collect what you choose to share with us when you send an enquiry or place an order, such as:' },
          { ul: ['Your name and business name', 'Phone / WhatsApp number and email', 'Delivery city and address', 'Order details — products, quantities, sizes and printing', 'Logos or artwork you send us for printing'] },
        ],
      },
      {
        id: 'browser',
        heading: 'Information stored in your browser',
        blocks: [
          { p: 'Your cart is saved in your own browser (local storage) so it is still there when you come back. It is not sent to us until you choose to send your order on WhatsApp.' },
          { p: 'The bag designer runs entirely in your browser. A logo you upload there is not uploaded to our servers — it only leaves your device if you download or share the preview yourself.' },
          { p: 'This website does not use advertising or tracking cookies.' },
        ],
      },
      {
        id: 'use',
        heading: 'How we use your information',
        blocks: [
          { ul: ['To reply to your enquiry and send quotations', 'To process, produce, invoice and deliver your order', 'To share order and dispatch updates', 'To keep records required by tax and accounting law'] },
          { p: 'We may contact you about your order or a repeat order. We will not send you unrelated marketing without your permission.' },
        ],
      },
      {
        id: 'whatsapp',
        heading: 'WhatsApp and other services',
        blocks: [
          { p: 'When you click a WhatsApp button, your message is sent through WhatsApp, which has its own privacy policy. We share your delivery details with courier or transport companies only to deliver your order.' },
        ],
      },
      {
        id: 'sharing',
        heading: 'Sharing',
        blocks: [{ p: 'We do not sell, rent or trade your personal information. We share it only with delivery partners, payment providers and accountants where needed to complete your order, or when required by law.' }],
      },
      {
        id: 'retention',
        heading: 'How long we keep it',
        blocks: [{ p: 'Enquiry and order details are kept as long as needed to serve you and to meet legal and tax requirements. Your approved designs are kept for repeat orders unless you ask us to delete them.' }],
      },
      {
        id: 'rights',
        heading: 'Your choices',
        blocks: [{ p: `You can ask us to see, correct or delete the information we hold about you, or stop receiving messages from us. ${contactLine}` }],
      },
    ],
  },

  // ───────────────────────────── Terms ─────────────────────────────
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    summary: 'The terms that apply when you use this website and place orders with us.',
    icon: 'scale',
    highlights: [
      { title: 'Prices confirmed in quote', text: 'Website prices are indicative for listed packs.' },
      { title: 'Order = written confirmation', text: 'An order is final once we confirm it in writing.' },
      { title: `Governed by Indian law`, text: `Disputes go to ${t.jurisdiction}.` },
    ],
    sections: [
      {
        id: 'about',
        heading: 'About these terms',
        blocks: [{ p: `This website is operated by ${site.name}${t.legalName ? ` (${t.legalName})` : ''}, ${site.location}. By using the website or placing an order with us, you agree to these terms together with our Shipping, Return & Refund, Bulk Order and Privacy policies.` }],
      },
      {
        id: 'products',
        heading: 'Products, images & prices',
        blocks: [
          { p: 'We try to show products accurately, but photos, colours and printed designs on screen may look slightly different from the actual bags.' },
          { p: 'Prices on the website apply to the listed pack sizes and may change without notice. Prices for bulk, custom or unlisted quantities are given in a written quotation. Taxes and freight are shown separately unless stated.' },
          { p: 'Previews made with the bag designer are for reference only; the final layout is confirmed on the design proof.' },
        ],
      },
      {
        id: 'orders',
        heading: 'Orders',
        blocks: [
          { p: 'Adding items to the cart or sending an enquiry does not create an order. An order is confirmed only when we accept it in writing (WhatsApp or email) and, where applicable, receive the advance payment.' },
          { p: 'We may decline an order, for example if stock is unavailable or the requested design cannot be printed.' },
        ],
      },
      {
        id: 'payment',
        heading: 'Payment',
        blocks: [{ p: 'Payment terms are given in your quotation and our Bulk Order Policy. Goods remain our property until paid for in full.' }],
      },
      {
        id: 'artwork',
        heading: 'Your designs & our content',
        blocks: [
          { p: 'You are responsible for making sure you have the right to use any logo, name or artwork you ask us to print. You remain the owner of your designs.' },
          { p: `All website content — text, photos, graphics and the ${site.name} name and logo — belongs to ${site.name} and may not be copied without permission.` },
        ],
      },
      {
        id: 'liability',
        heading: 'Limitation of liability',
        blocks: [{ p: 'Our responsibility for any order is limited to replacing the goods or refunding the amount paid for the affected goods. We are not liable for indirect losses such as lost profit or business interruption, or for delays caused by events outside our control.' }],
      },
      {
        id: 'law',
        heading: 'Governing law',
        blocks: [{ p: `These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the ${t.jurisdiction}. We always prefer to resolve concerns directly first — just talk to us.` }],
      },
      {
        id: 'changes',
        heading: 'Changes to these terms',
        blocks: [{ p: 'We may update these policies from time to time. The latest version is always on this page, with the date it was last updated.' }],
      },
    ],
  },
]

export const getPolicy = (slug: string) => policyPages.find((p) => p.slug === slug)
