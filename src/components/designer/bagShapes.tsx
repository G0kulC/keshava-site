// Original SVG drawings of each bag style, on a 400 × 480 canvas.
// `print` is the printable area — design layers are clipped and clamped to it.

export const VIEW = { w: 400, h: 480 }

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type BagKind = 'd-cut' | 'loop' | 'box' | 'kattapai' | 'w-cut' | 'laminated'

interface ShapeProps {
  color: string
  handle: string
}

export interface BagShape {
  label: string
  print: Rect
  /** Drawn under the design (body, back handles). */
  Back: (p: ShapeProps) => React.ReactNode
  /** Drawn over the design (front straps, shading, gloss). */
  Front: (p: ShapeProps) => React.ReactNode
}

// Shared fabric shading + stitched hem, clipped to the body outline.
function Shade({ d, glossy }: { d: string; glossy?: boolean }) {
  return (
    <g pointerEvents="none">
      <path d={d} fill="url(#kf-shade)" />
      <path d={d} fill="url(#kf-fabric)" opacity={glossy ? 0.15 : 0.55} />
      {glossy && <path d={d} fill="url(#kf-gloss)" />}
      <path d={d} fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1.5" />
    </g>
  )
}

const hem = (y: number, x1 = 58, x2 = 342) => (
  <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(0,0,0,.22)" strokeWidth="1.2" strokeDasharray="5 4" pointerEvents="none" />
)

const D_BODY = 'M50 40 H350 V438 Q350 450 338 450 H62 Q50 450 50 438 Z'
const D_HOLE = 'M158 66 H242 Q242 112 200 112 Q158 112 158 66 Z'

const LOOP_BODY = 'M50 112 H350 V438 Q350 450 338 450 H62 Q50 450 50 438 Z'

const BOX_FRONT = 'M72 120 H328 V448 H72 Z'
const BOX_LEFT = 'M48 132 L72 120 V448 L48 440 Z'
const BOX_RIGHT = 'M352 132 L328 120 V448 L352 440 Z'

const W_BODY =
  'M50 450 V44 Q50 22 72 22 H122 Q144 22 144 44 V112 Q144 168 200 168 Q256 168 256 112 V44 Q256 22 278 22 H328 Q350 22 350 44 V450 Z'

export const bagShapes: Record<BagKind, BagShape> = {
  'd-cut': {
    label: 'D-Cut',
    print: { x: 78, y: 140, w: 244, h: 285 },
    Back: ({ color }) => <path d={`${D_BODY} ${D_HOLE}`} fillRule="evenodd" fill={color} />,
    Front: () => (
      <>
        <Shade d={`${D_BODY} ${D_HOLE}`} />
        <path d={D_HOLE} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="2" />
        {hem(440)}
      </>
    ),
  },
  loop: {
    label: 'Loop handle',
    print: { x: 78, y: 150, w: 244, h: 275 },
    Back: ({ color, handle }) => (
      <>
        <path d="M150 114 C150 30, 250 30, 250 114" fill="none" stroke={handle} strokeWidth="13" strokeLinecap="round" opacity=".75" transform="translate(10 -6)" />
        <path d={LOOP_BODY} fill={color} />
      </>
    ),
    Front: ({ handle }) => (
      <>
        <Shade d={LOOP_BODY} />
        <path d="M140 116 C140 18, 260 18, 260 116" fill="none" stroke={handle} strokeWidth="14" strokeLinecap="round" />
        <path d="M140 116 C140 18, 260 18, 260 116" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="3" strokeLinecap="round" />
        {hem(124)}
        {hem(440)}
      </>
    ),
  },
  box: {
    label: 'Box / Gusset',
    print: { x: 96, y: 158, w: 208, h: 270 },
    Back: ({ color, handle }) => (
      <>
        <path d="M150 122 C150 40, 250 40, 250 122" fill="none" stroke={handle} strokeWidth="12" strokeLinecap="round" opacity=".7" transform="translate(8 -8)" />
        <path d={BOX_LEFT} fill={color} />
        <path d={BOX_RIGHT} fill={color} />
        <path d={BOX_FRONT} fill={color} />
      </>
    ),
    Front: ({ handle }) => (
      <>
        <path d={BOX_LEFT} fill="rgba(0,0,0,.18)" pointerEvents="none" />
        <path d={BOX_RIGHT} fill="rgba(0,0,0,.24)" pointerEvents="none" />
        <Shade d={BOX_FRONT} />
        <path d="M148 124 C148 30, 252 30, 252 124" fill="none" stroke={handle} strokeWidth="13" strokeLinecap="round" />
        {hem(132, 78, 322)}
        {hem(440, 78, 322)}
      </>
    ),
  },
  kattapai: {
    label: 'Kattapai',
    print: { x: 78, y: 222, w: 244, h: 208 },
    Back: ({ color }) => <path d={LOOP_BODY} fill={color} />,
    Front: ({ handle }) => (
      <>
        <Shade d={LOOP_BODY} />
        {/* patch straps stitched onto the front */}
        {[120, 258].map((x) => (
          <g key={x}>
            <rect x={x} y={112} width="22" height="96" fill={handle} />
            <rect x={x + 3} y={170} width="16" height="16" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="1" />
            <path d={`M${x + 3} 170 l16 16 M${x + 19} 170 l-16 16`} stroke="rgba(0,0,0,.3)" strokeWidth="1" />
          </g>
        ))}
        <path d="M131 114 C131 4, 269 4, 269 114" fill="none" stroke={handle} strokeWidth="22" />
        {hem(440)}
      </>
    ),
  },
  'w-cut': {
    label: 'W-Cut',
    print: { x: 78, y: 200, w: 244, h: 228 },
    Back: ({ color }) => <path d={W_BODY} fill={color} />,
    Front: () => (
      <>
        <Shade d={W_BODY} />
        {[76, 276].map((x) => (
          <rect key={x} x={x} y={40} width="48" height="18" rx="9" fill="#fbfaf6" stroke="rgba(0,0,0,.25)" strokeWidth="1.5" />
        ))}
        {hem(440)}
      </>
    ),
  },
  laminated: {
    label: 'Laminated',
    print: { x: 78, y: 150, w: 244, h: 275 },
    Back: ({ color, handle }) => (
      <>
        <path d="M150 114 C150 30, 250 30, 250 114" fill="none" stroke={handle} strokeWidth="12" strokeLinecap="round" opacity=".75" transform="translate(10 -6)" />
        <path d={LOOP_BODY} fill={color} />
      </>
    ),
    Front: ({ handle }) => (
      <>
        <Shade d={LOOP_BODY} glossy />
        <path d="M140 116 C140 18, 260 18, 260 116" fill="none" stroke={handle} strokeWidth="13" strokeLinecap="round" />
        {hem(440)}
      </>
    ),
  },
}

export function BagDefs() {
  return (
    <defs>
      <linearGradient id="kf-shade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".14" />
        <stop offset=".18" stopColor="#000" stopOpacity="0" />
        <stop offset=".8" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".18" />
      </linearGradient>
      <linearGradient id="kf-gloss" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".38" />
        <stop offset=".35" stopColor="#fff" stopOpacity="0" />
        <stop offset=".7" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity=".15" />
      </linearGradient>
      {/* non-woven speckle texture */}
      <pattern id="kf-fabric" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r=".6" fill="#000" opacity=".07" />
        <circle cx="4" cy="3.5" r=".5" fill="#fff" opacity=".12" />
      </pattern>
    </defs>
  )
}
