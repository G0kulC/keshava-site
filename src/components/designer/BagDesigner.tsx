import { AnimatePresence, motion } from 'motion/react'
import {
  AlignCenter,
  Copy,
  Download,
  ImagePlus,
  Loader2,
  RotateCw,
  Trash2,
  Type,
  Wand2,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { WhatsAppIcon } from '@/components/common/WhatsAppIcon'
import { site } from '@/config/site'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'
import { BagDefs, bagShapes, VIEW, type BagKind } from './bagShapes'
import { loadImageFile, removeWhiteBackground, svgToPng } from './imageUtils'

// ───────────────────────── types & presets ─────────────────────────

interface Base {
  id: string
  x: number
  y: number
  rot: number
}
interface ImageLayer extends Base {
  kind: 'image'
  src: string
  original: string
  aspect: number // w / h
  w: number
  bgRemoved: boolean
}
interface TextLayer extends Base {
  kind: 'text'
  text: string
  size: number
  color: string
  font: string
}
type Layer = ImageLayer | TextLayer
type Side = 'front' | 'back'

export const bagColors = [
  { name: 'White', hex: '#f7f6f2' },
  { name: 'Cream', hex: '#efe3c4' },
  { name: 'Green', hex: '#2f8a4c' },
  { name: 'Parrot Green', hex: '#7cc142' },
  { name: 'Red', hex: '#c8282d' },
  { name: 'Maroon', hex: '#7a1f2b' },
  { name: 'Yellow', hex: '#f2c230' },
  { name: 'Orange', hex: '#ec7a26' },
  { name: 'Pink', hex: '#e2589a' },
  { name: 'Sky Blue', hex: '#5ab4e5' },
  { name: 'Navy', hex: '#1f2f5c' },
  { name: 'Black', hex: '#1d1d1f' },
]

const inkColors = ['#1d1d1f', '#ffffff', '#c8282d', '#1f5c3a', '#1f2f5c', '#c99a2e', '#ec7a26', '#7a1f2b']

const fonts = [
  { label: 'Bold', css: '"Arial Black", "Arial", sans-serif' },
  { label: 'Classic', css: 'Georgia, "Times New Roman", serif' },
  { label: 'Modern', css: '"Trebuchet MS", "Segoe UI", sans-serif' },
  { label: 'Script', css: '"Brush Script MT", "Segoe Script", cursive' },
  { label: 'தமிழ்', css: '"Nirmala UI", "Latha", "Noto Sans Tamil", sans-serif' },
]

const uid = () => Math.random().toString(36).slice(2, 9)

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return 0.299 * r + 0.587 * g + 0.114 * b > 160
}

const colorName = (hex: string) => bagColors.find((c) => c.hex === hex)?.name ?? hex

// Rough text width — good enough for the selection box & clamping.
const textBox = (l: TextLayer) => ({ w: Math.max(l.size, l.text.length * l.size * 0.58), h: l.size * 1.2 })
const layerBox = (l: Layer) => (l.kind === 'image' ? { w: l.w, h: l.w / l.aspect } : textBox(l))

// ───────────────────────── component ─────────────────────────

interface Props {
  kind: BagKind
  onKind: (k: BagKind) => void
  color: string
  onColor: (hex: string) => void
  onSidesChange?: (n: 1 | 2) => void
}

export function BagDesigner({ kind, onKind, color, onColor, onSidesChange }: Props) {
  const shape = bagShapes[kind]
  const P = shape.print
  const [handle, setHandle] = useState<string | null>(null) // null = match bag
  const [side, setSide] = useState<Side>('front')
  const [layers, setLayers] = useState<Record<Side, Layer[]>>(() => ({
    front: [
      {
        id: uid(),
        kind: 'text',
        text: 'YOUR SHOP NAME',
        x: 200,
        y: 375,
        rot: 0,
        size: 24,
        color: isLight(color) ? '#1f5c3a' : '#ffffff',
        font: fonts[0].css,
      },
    ],
    back: [],
  }))
  const [selected, setSelected] = useState<string | null>(null)
  const [busy, setBusy] = useState<'upload' | 'export' | null>(null)
  const [error, setError] = useState('')
  const svgRef = useRef<SVGSVGElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const drag = useRef<{ id: string; mode: 'move' | 'resize'; dx: number; dy: number; startDist: number; startSize: number } | null>(null)

  const current = layers[side]
  const sel = current.find((l) => l.id === selected) ?? null
  const handleColor = handle ?? color

  useEffect(() => {
    onSidesChange?.(layers.back.length > 0 ? 2 : 1)
  }, [layers.back.length, onSidesChange])

  // ── layer helpers
  const clampPos = useCallback(
    (l: Layer, x: number, y: number) => {
      const { w, h } = layerBox(l)
      // keep at least the centre inside the print area, allow partial overflow (it gets clipped)
      return {
        x: Math.min(P.x + P.w - Math.min(w / 2, P.w / 2) * 0.2, Math.max(P.x + Math.min(w / 2, P.w / 2) * 0.2, x)),
        y: Math.min(P.y + P.h - Math.min(h / 2, P.h / 2) * 0.2, Math.max(P.y + Math.min(h / 2, P.h / 2) * 0.2, y)),
      }
    },
    [P],
  )

  const patch = useCallback(
    (id: string, p: Partial<ImageLayer> | Partial<TextLayer>) =>
      setLayers((all) => ({ ...all, [side]: all[side].map((l) => (l.id === id ? ({ ...l, ...p } as Layer) : l)) })),
    [side],
  )

  const addLayer = (l: Layer) => {
    setLayers((all) => ({ ...all, [side]: [...all[side], l] }))
    setSelected(l.id)
  }

  const removeLayer = (id: string) => {
    setLayers((all) => ({ ...all, [side]: all[side].filter((l) => l.id !== id) }))
    setSelected(null)
  }

  // ── upload
  const onFile = async (file?: File) => {
    if (!file) return
    setError('')
    if (!file.type.startsWith('image/')) return setError('Please choose an image file (PNG, JPG, SVG or WEBP).')
    if (file.size > 8 * 1024 * 1024) return setError('That file is over 8 MB — please use a smaller logo.')
    setBusy('upload')
    try {
      const img = await loadImageFile(file)
      // JPGs almost always have a white box behind the logo — remove it by default.
      const auto = file.type === 'image/jpeg'
      const src = auto ? await removeWhiteBackground(img.src) : img.src
      const aspect = img.w / img.h
      const w = Math.min(P.w * 0.6, (P.h * 0.5) * aspect)
      addLayer({ id: uid(), kind: 'image', src, original: img.src, aspect, w, x: P.x + P.w / 2, y: P.y + P.h * 0.4, rot: 0, bgRemoved: auto })
    } catch {
      setError("We couldn't read that image. Try a PNG or JPG.")
    } finally {
      setBusy(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const toggleBg = async (l: ImageLayer) => {
    if (l.bgRemoved) return patch(l.id, { src: l.original, bgRemoved: false })
    setBusy('upload')
    patch(l.id, { src: await removeWhiteBackground(l.original), bgRemoved: true })
    setBusy(null)
  }

  // ── pointer interaction (mouse + touch via pointer events)
  const toSvg = (e: React.PointerEvent) => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svg.getScreenCTM()!.inverse())
  }

  const startDrag = (e: React.PointerEvent, l: Layer, mode: 'move' | 'resize') => {
    e.stopPropagation()
    e.preventDefault()
    setSelected(l.id)
    const p = toSvg(e)
    drag.current = {
      id: l.id,
      mode,
      dx: p.x - l.x,
      dy: p.y - l.y,
      startDist: Math.hypot(p.x - l.x, p.y - l.y) || 1,
      startSize: l.kind === 'image' ? l.w : l.size,
    }
    svgRef.current?.setPointerCapture(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const l = current.find((x) => x.id === d.id)
    if (!l) return
    const p = toSvg(e)
    if (d.mode === 'move') {
      patch(l.id, clampPos(l, p.x - d.dx, p.y - d.dy))
    } else {
      const k = Math.hypot(p.x - l.x, p.y - l.y) / d.startDist
      if (l.kind === 'image') patch(l.id, { w: Math.max(24, Math.min(P.w * 1.2, d.startSize * k)) })
      else patch(l.id, { size: Math.max(8, Math.min(90, d.startSize * k)) })
    }
  }

  const endDrag = () => (drag.current = null)

  const onKey = (e: React.KeyboardEvent) => {
    if (!sel) return
    const step = e.shiftKey ? 10 : 2
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    if (moves[e.key]) {
      e.preventDefault()
      patch(sel.id, clampPos(sel, sel.x + moves[e.key][0], sel.y + moves[e.key][1]))
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if ((e.target as HTMLElement).tagName !== 'INPUT') removeLayer(sel.id)
    }
  }

  // ── export / share
  const exportPng = async () => {
    setSelected(null)
    await new Promise((r) => requestAnimationFrame(() => r(null)))
    return svgToPng(svgRef.current!)
  }

  const download = async () => {
    setBusy('export')
    try {
      const blob = await exportPng()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `keshava-bag-${kind}-${side}.png`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } finally {
      setBusy(null)
    }
  }

  const summary = [
    `Hello ${site.name}! I designed a custom bag on your website:`,
    `• Style: ${shape.label}`,
    `• Bag colour: ${colorName(color)}`,
    `• Handle colour: ${handle ? colorName(handle) : 'Same as bag'}`,
    `• Printing: ${layers.back.length ? '2 sides' : '1 side'}`,
    ...layers.front.filter((l): l is TextLayer => l.kind === 'text').map((l) => `• Front text: "${l.text}"`),
    ...layers.back.filter((l): l is TextLayer => l.kind === 'text').map((l) => `• Back text: "${l.text}"`),
    '',
    'Sharing my design preview. Please send a quotation.',
  ].join('\n')

  const share = async () => {
    setBusy('export')
    try {
      const blob = await exportPng()
      const file = new File([blob], `keshava-bag-${kind}.png`, { type: 'image/png' })
      // On phones, the native share sheet can attach the image straight into WhatsApp.
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: summary }).catch(() => {})
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        a.click()
        window.open(waLink(summary), '_blank', 'noopener')
      }
    } finally {
      setBusy(null)
    }
  }

  const copyToBack = () => {
    setLayers((all) => ({ ...all, back: all.front.map((l) => ({ ...l, id: uid() })) }))
    setSide('back')
    setSelected(null)
  }

  // ───────────────────────── render ─────────────────────────
  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card lg:grid-cols-[1.15fr_1fr]">
      {/* Canvas */}
      <div className="relative bg-[radial-gradient(circle_at_50%_40%,var(--brand-50),var(--muted))] p-4 sm:p-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="inline-flex rounded-full bg-card p-1 shadow-sm" role="tablist" aria-label="Bag side">
            {(['front', 'back'] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={side === s}
                onClick={() => {
                  setSide(s)
                  setSelected(null)
                }}
                className={cn('relative rounded-full px-4 py-1.5 text-sm font-semibold capitalize', side === s ? 'text-white' : 'text-foreground/70')}
              >
                {side === s && <motion.span layoutId="side-pill" className="absolute inset-0 rounded-full bg-brand-700" />}
                <span className="relative">
                  {s}
                  {layers[s].length > 0 && <span className="ml-1 opacity-70">· {layers[s].length}</span>}
                </span>
              </button>
            ))}
          </div>
          {side === 'front' && layers.front.length > 0 && (
            <button onClick={copyToBack} className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-sm hover:text-brand-700">
              <Copy className="size-3.5" /> Same on back
            </button>
          )}
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          className="mx-auto block w-full max-w-[460px] touch-none select-none outline-none focus-visible:ring-3 focus-visible:ring-brand-600/30"
          tabIndex={0}
          role="img"
          aria-label={`${shape.label} bag preview, ${side} side. Use arrow keys to move the selected item.`}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerDown={() => setSelected(null)}
          onKeyDown={onKey}
        >
          <BagDefs />
          <clipPath id="kf-print">
            <rect x={P.x} y={P.y} width={P.w} height={P.h} />
          </clipPath>

          <ellipse cx="200" cy="462" rx="150" ry="10" fill="rgba(0,0,0,.12)" />
          <motion.g key={kind + side} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: '200px 260px' }}>
            {shape.Back({ color, handle: handleColor })}

            {/* printable area guide */}
            <rect data-ui x={P.x} y={P.y} width={P.w} height={P.h} fill="none" stroke={isLight(color) ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.3)'} strokeDasharray="6 5" rx="4" />

            <g clipPath="url(#kf-print)">
              {current.map((l) => (
                <g
                  key={l.id}
                  transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}
                  onPointerDown={(e) => startDrag(e, l, 'move')}
                  className="cursor-move"
                >
                  {l.kind === 'image' ? (
                    <image href={l.src} x={-l.w / 2} y={-l.w / l.aspect / 2} width={l.w} height={l.w / l.aspect} preserveAspectRatio="xMidYMid meet" />
                  ) : (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily={l.font}
                      fontSize={l.size}
                      fontWeight={l.font.includes('Brush') ? 400 : 700}
                      fill={l.color}
                    >
                      {l.text || ' '}
                    </text>
                  )}
                </g>
              ))}
            </g>

            {shape.Front({ color, handle: handleColor })}

            {/* selection chrome */}
            {sel && (
              <g data-ui transform={`translate(${sel.x} ${sel.y}) rotate(${sel.rot})`}>
                {(() => {
                  const { w, h } = layerBox(sel)
                  return (
                    <>
                      <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} fill="none" stroke="var(--brand-600)" strokeWidth="1.5" strokeDasharray="4 3" rx="4" pointerEvents="none" />
                      <circle
                        cx={w / 2 + 6}
                        cy={h / 2 + 6}
                        r="9"
                        fill="#fff"
                        stroke="var(--brand-600)"
                        strokeWidth="2"
                        className="cursor-nwse-resize"
                        onPointerDown={(e) => startDrag(e, sel, 'resize')}
                      />
                    </>
                  )
                })()}
              </g>
            )}
          </motion.g>
        </svg>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Drag to move · pull the round handle to resize · dashed box = printable area
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6 p-5 sm:p-8">
        <Group title="1. Bag style">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(bagShapes) as BagKind[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  onKind(k)
                  setSelected(null)
                }}
                aria-pressed={kind === k}
                className={cn(
                  'rounded-xl border-2 px-2 py-2.5 text-xs font-semibold transition',
                  kind === k ? 'border-brand-600 bg-brand-50 text-brand-900' : 'border-border hover:border-brand-600/40',
                )}
              >
                {bagShapes[k].label}
              </button>
            ))}
          </div>
        </Group>

        <Group title="2. Bag colour" hint={colorName(color)}>
          <Swatches value={color} onChange={onColor} colors={bagColors.map((c) => c.hex)} custom />
        </Group>

        <Group title="Handle colour" hint={handle ? colorName(handle) : 'Same as bag'}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHandle(null)}
              className={cn('h-8 rounded-full border-2 px-3 text-xs font-semibold', handle === null ? 'border-brand-600 bg-brand-50' : 'border-border')}
            >
              Match bag
            </button>
            <Swatches value={handle ?? ''} onChange={setHandle} colors={bagColors.map((c) => c.hex)} />
          </div>
        </Group>

        <Group title={`3. Your design · ${side}`}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={busy === 'upload'}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:opacity-60"
            >
              {busy === 'upload' ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />} Upload logo
            </button>
            <button
              onClick={() =>
                addLayer({
                  id: uid(),
                  kind: 'text',
                  text: 'Your text',
                  x: P.x + P.w / 2,
                  y: P.y + P.h * 0.75,
                  rot: 0,
                  size: 20,
                  color: isLight(color) ? '#1d1d1f' : '#ffffff',
                  font: fonts[0].css,
                })
              }
              className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-border text-sm font-semibold transition hover:border-brand-600"
            >
              <Type className="size-4" /> Add text
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
          <p className="mt-2 text-[11px] text-muted-foreground">PNG with transparent background works best. JPG white backgrounds are removed automatically.</p>
        </Group>

        <AnimatePresence mode="wait">
          {sel ? (
            <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 rounded-2xl bg-muted/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{sel.kind === 'image' ? 'Logo' : 'Text'} settings</span>
                <div className="flex gap-1">
                  <IconBtn label="Centre" onClick={() => patch(sel.id, { x: P.x + P.w / 2 })}>
                    <AlignCenter className="size-4" />
                  </IconBtn>
                  <IconBtn label="Delete" onClick={() => removeLayer(sel.id)} danger>
                    <Trash2 className="size-4" />
                  </IconBtn>
                </div>
              </div>

              {sel.kind === 'text' && (
                <>
                  <input
                    value={sel.text}
                    onChange={(e) => patch(sel.id, { text: e.target.value })}
                    maxLength={40}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm outline-none focus:border-brand-600"
                    aria-label="Text"
                    placeholder="Shop name, phone, tagline…"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {fonts.map((f) => (
                      <button
                        key={f.label}
                        onClick={() => patch(sel.id, { font: f.css })}
                        style={{ fontFamily: f.css }}
                        className={cn('rounded-lg border-2 px-3 py-1.5 text-sm', sel.font === f.css ? 'border-brand-600 bg-background' : 'border-transparent bg-background/60')}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <Swatches value={sel.color} onChange={(c) => patch(sel.id, { color: c })} colors={inkColors} custom />
                </>
              )}

              <Slider
                label="Size"
                min={sel.kind === 'image' ? 24 : 8}
                max={sel.kind === 'image' ? Math.round(P.w * 1.2) : 90}
                value={sel.kind === 'image' ? sel.w : sel.size}
                onChange={(v) => patch(sel.id, sel.kind === 'image' ? { w: v } : { size: v })}
              />
              <Slider label="Rotate" icon={<RotateCw className="size-3.5" />} min={-180} max={180} value={sel.rot} onChange={(v) => patch(sel.id, { rot: v })} suffix="°" />

              {sel.kind === 'image' && (
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-background px-3.5 py-2.5 text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Wand2 className="size-4 text-brand-600" /> Remove white background
                  </span>
                  <input type="checkbox" checked={sel.bgRemoved} onChange={() => toggleBg(sel)} className="size-4 accent-[var(--brand-600)]" />
                </label>
              )}
            </motion.div>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Tap your logo or text on the bag to edit it.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-auto grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
          <button
            onClick={share}
            disabled={!!busy}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy === 'export' ? <Loader2 className="size-4 animate-spin" /> : <WhatsAppIcon className="size-4" />} Share design
          </button>
          <button
            onClick={download}
            disabled={!!busy}
            className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-border text-sm font-semibold transition hover:border-brand-600 disabled:opacity-60"
          >
            <Download className="size-4" /> Download PNG
          </button>
          <p className="text-center text-[11px] text-muted-foreground sm:col-span-2">
            Preview is for reference — final print colours and placement are confirmed with you before production.
          </p>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────── small controls ─────────────────────────

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <h3 className="font-sans text-sm font-bold">{title}</h3>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function Swatches({ value, onChange, colors, custom }: { value: string; onChange: (c: string) => void; colors: string[]; custom?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          aria-label={colorName(c)}
          aria-pressed={value === c}
          title={colorName(c)}
          style={{ background: c }}
          className={cn(
            'size-8 rounded-full border border-black/10 shadow-inner transition hover:scale-110',
            value === c && 'ring-2 ring-brand-600 ring-offset-2 ring-offset-card',
          )}
        />
      ))}
      {custom && (
        <label
          className="relative grid size-8 cursor-pointer place-items-center overflow-hidden rounded-full border border-black/10 bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]"
          title="Custom colour"
        >
          <input type="color" value={value || '#ffffff'} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom colour" />
        </label>
      )}
    </div>
  )
}

function Slider({
  label,
  icon,
  min,
  max,
  value,
  onChange,
  suffix = '',
}: {
  label: string
  icon?: React.ReactNode
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          {icon} {label}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {Math.round(value)}
          {suffix}
        </span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--brand-600)]" />
    </label>
  )
}

function IconBtn({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn('grid size-8 place-items-center rounded-lg bg-background transition', danger ? 'hover:text-destructive' : 'hover:text-brand-700')}
    >
      {children}
    </button>
  )
}
