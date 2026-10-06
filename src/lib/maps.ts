import { site } from '@/config/site'

const pin = site.geo ? `${site.geo.lat},${site.geo.lng}` : null

/**
 * "Get directions": opens Google Maps in navigation mode (app on phones) with the shop as the
 * destination. Until the pin's coordinates are set we fall back to the owner's shared pin link,
 * because the street address alone doesn't resolve to the exact spot.
 */
export const directionsUrl = pin ? `https://www.google.com/maps/dir/?api=1&destination=${pin}&travelmode=driving` : site.mapsUrl

/** Embedded map with a red pin on the shop. */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${pin ?? encodeURIComponent(`${site.legalName}, ${site.address}`)}&z=17&hl=en&output=embed`
