// Entrance animations are skipped on the page the visitor first lands on: that page is
// prerendered, so its hero content must be visible immediately (fast LCP, no blank flash
// before JavaScript loads). Pages reached by in-app navigation still animate in.

const initialPath = typeof window !== 'undefined' ? window.location.pathname : null

/** True while rendering the landing page (always true during prerender). */
export const isLandingRender = () => typeof window === 'undefined' || window.location.pathname === initialPath
