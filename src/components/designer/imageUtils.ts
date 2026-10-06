/** Read an uploaded file as a data URL and report its natural size. */
export function loadImageFile(file: File): Promise<{ src: string; w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const src = reader.result as string
      const img = new Image()
      img.onload = () => resolve({ src, w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => reject(new Error('Unsupported image'))
      img.src = src
    }
    reader.readAsDataURL(file)
  })
}

/** Turn near-white pixels transparent — most shop logos arrive as JPGs on white. */
export function removeWhiteBackground(src: string, threshold = 235): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const max = 1200
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      const ctx = c.getContext('2d')!
      ctx.drawImage(img, 0, 0, c.width, c.height)
      const data = ctx.getImageData(0, 0, c.width, c.height)
      const px = data.data
      for (let i = 0; i < px.length; i += 4) {
        const min = Math.min(px[i], px[i + 1], px[i + 2])
        if (min >= threshold) px[i + 3] = 0
        else if (min > threshold - 25) px[i + 3] = Math.round(px[i + 3] * ((threshold - min) / 25)) // soft edge
      }
      ctx.putImageData(data, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    img.onerror = () => resolve(src)
    img.src = src
  })
}

/** Rasterise the bag SVG (minus editor-only UI) to a PNG blob. */
export function svgToPng(svg: SVGSVGElement, width = 1200): Promise<Blob> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.querySelectorAll('[data-ui]').forEach((n) => n.remove())
  // Drop animation styles (Motion writes opacity/transform inline) so the export never
  // captures a mid-fade frame.
  clone.querySelectorAll('[style]').forEach((n) => n.removeAttribute('style'))
  const vb = svg.viewBox.baseVal
  const height = Math.round((width * vb.height) / vb.width)
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }))

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = width
      c.height = height
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Export failed'))), 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Export failed'))
    }
    img.src = url
  })
}
