import { useEffect, useState } from 'react'
import { site } from '@/config/site'

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const fmtHour = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? 'AM' : 'PM'}`

/** Current time in India, regardless of the visitor's own time zone. */
function nowIST() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, hour: Number(get('hour')) + Number(get('minute')) / 60 }
}

export interface OpenStatus {
  open: boolean
  label: string
  detail: string
}

export function getOpenStatus(): OpenStatus {
  const { day, hour } = nowIST()
  const days = site.openDays as readonly number[]
  const open = days.includes(day) && hour >= site.openHour && hour < site.closeHour
  if (open) return { open, label: 'Open now', detail: `Until ${fmtHour(site.closeHour)} IST` }

  // Find the next opening day.
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7
    if (!days.includes(d)) continue
    if (i === 0 && hour >= site.openHour) continue
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY[d]
    return { open, label: 'Closed now', detail: `Opens ${when} at ${fmtHour(site.openHour)} · WhatsApp anytime` }
  }
  return { open, label: 'Closed now', detail: 'WhatsApp us anytime' }
}

/** Re-evaluates every minute so the badge stays correct while the page is open. */
export function useOpenStatus() {
  // null until mounted: the status depends on the visitor's clock, not the build time.
  const [status, setStatus] = useState<OpenStatus | null>(null)
  useEffect(() => {
    setStatus(getOpenStatus())
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000)
    return () => clearInterval(t)
  }, [])
  return status
}
