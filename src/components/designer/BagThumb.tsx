import { BagDefs, bagShapes, VIEW, type BagKind } from './bagShapes'

/** Small static drawing of a bag style — used in dropdowns and cards. */
export function BagThumb({ kind, color = '#2f8a4c', handle, className = 'size-7' }: { kind: BagKind; color?: string; handle?: string; className?: string }) {
  const s = bagShapes[kind]
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className={className} aria-hidden>
      <BagDefs />
      {s.Back({ color, handle: handle ?? color })}
      {s.Front({ color, handle: handle ?? color })}
    </svg>
  )
}
