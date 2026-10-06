import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'

interface Options {
  /** Minimum popover width in px (defaults to the trigger width). */
  minWidth?: number
  /** Fixed popover width in px (ignores the trigger width — e.g. calendars). */
  fixedWidth?: number
  /** Expected popover height, used to decide whether to open upward. */
  estHeight?: number
  gap?: number
}

/**
 * Positions a popover (rendered in a portal on <body>) next to its trigger, so it is never
 * clipped by `overflow: hidden` parents or covered by other stacking contexts.
 * Flips above the trigger when there isn't room below, and stays inside the viewport.
 */
export function usePopover<T extends HTMLElement>(triggerRef: RefObject<T | null>, open: boolean, { minWidth = 0, fixedWidth, estHeight = 300, gap = 8 }: Options = {}) {
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden' })
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const frame = useRef(0)

  const update = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(fixedWidth ?? Math.max(r.width, minWidth), vw - 16)
    // Align to the trigger's left edge; if that overflows, align to its right edge instead.
    const left = Math.min(Math.max(8, r.left + width > vw - 8 ? r.right - width : r.left), vw - width - 8)
    const below = vh - r.bottom
    const up = below < estHeight + gap && r.top > below
    setPlacement(up ? 'top' : 'bottom')
    setStyle({
      position: 'fixed',
      left,
      width,
      zIndex: 70,
      ...(up ? { bottom: vh - r.top + gap, maxHeight: r.top - gap - 8 } : { top: r.bottom + gap, maxHeight: below - gap - 8 }),
    })
  }, [triggerRef, minWidth, fixedWidth, estHeight, gap])

  useLayoutEffect(() => {
    if (open) update()
  }, [open, update])

  useEffect(() => {
    if (!open) return
    const onMove = () => {
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(update)
    }
    // capture: also follow scrolling inside nested scroll containers (drawers, lists)
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open, update])

  return { style, placement }
}

/** Close when pressing outside of any of the given elements. */
export function useOutsidePress(refs: RefObject<HTMLElement | null>[], open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!refs.some((r) => r.current?.contains(t))) onClose()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, onClose, refs])
}
