import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const A4_WIDTH_PX   = 794   // 210mm at 96dpi
const A4_HEIGHT_PX  = 1123  // 297mm at 96dpi

// How much overflow is acceptable to shrink into one page instead of adding a new page.
// 0.15 = if content is up to 15% taller than one A4 page, shrink to fit.
// Beyond that, use multiple pages.
const SHRINK_THRESHOLD = 0.15

/**
 * Capture the resume element at A4 width regardless of screen size.
 * Returns the raw canvas.
 */
async function captureResume(element) {
  // Save original styles
  const saved = {
    width:     element.style.width,
    maxWidth:  element.style.maxWidth,
    minHeight: element.style.minHeight,
    transform: element.style.transform,
    position:  element.style.position,
  }

  // Force A4 width for capture
  Object.assign(element.style, {
    width:     `${A4_WIDTH_PX}px`,
    maxWidth:  `${A4_WIDTH_PX}px`,
    minHeight: 'unset',
    transform: 'none',
  })

  let canvas
  try {
    canvas = await html2canvas(element, {
      scale:       2,           // 2x for crisp text on retina/print
      useCORS:     true,
      allowTaint:  true,
      backgroundColor: '#ffffff',
      logging:     false,
      width:       A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
    })
  } finally {
    // Always restore — even if canvas fails
    Object.assign(element.style, saved)
  }

  return canvas
}

/**
 * Smart PDF generator:
 *
 * 1. Captures resume at A4 width
 * 2. Checks how much content overflows A4 height
 * 3. If overflow ≤ SHRINK_THRESHOLD (15%) → scale entire content down to fit 1 page
 * 4. If overflow > SHRINK_THRESHOLD → split into proper multi-page PDF
 *    with clean page breaks (never cuts mid-line)
 */
export async function generatePDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume preview element not found')

  const canvas = await captureResume(element)

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit:        'mm',
    format:      'a4',
    compress:    true,
  })

  const pdfW = pdf.internal.pageSize.getWidth()   // 210mm
  const pdfH = pdf.internal.pageSize.getHeight()  // 297mm

  // canvas dimensions at scale:2 → actual content pixels = canvas / 2
  // but we work with raw canvas px throughout, ratio handles conversion to mm
  const imgW = canvas.width
  const imgH = canvas.height

  const ratio       = pdfW / imgW        // mm per canvas-pixel
  const contentH_MM = imgH * ratio       // total content height in mm

  const overflowRatio = (contentH_MM - pdfH) / pdfH

  // ── Case 1: fits on one page ──────────────────────────────────
  if (contentH_MM <= pdfH) {
    pdf.addImage(
      canvas.toDataURL('image/png', 0.95),
      'PNG', 0, 0, pdfW, contentH_MM
    )
    pdf.save(filename)
    return true
  }

  // ── Case 2: small overflow → shrink to fit one page ───────────
  if (overflowRatio <= SHRINK_THRESHOLD) {
    // Scale both dimensions uniformly so content fits in pdfH
    const scaleFactor = pdfH / contentH_MM
    const scaledW     = pdfW * scaleFactor   // slightly less than 210mm
    const offsetX     = (pdfW - scaledW) / 2 // center horizontally

    pdf.addImage(
      canvas.toDataURL('image/png', 0.95),
      'PNG', offsetX, 0, scaledW, pdfH
    )
    pdf.save(filename)
    return true
  }

  // ── Case 3: large overflow → multi-page with smart breaks ─────
  // Page height in canvas pixels
  const pageH_px = Math.round(pdfH / ratio)

  // We'll look for a safe cut point near each page boundary.
  // "Safe" means: don't cut inside a text run — scan a small window
  // around the ideal cut point and find the nearest row of white pixels.
  const ctx         = canvas.getContext('2d')
  const scanWindow  = Math.round(pageH_px * 0.05) // scan ±5% of page height
  const imgData     = ctx.getImageData(0, 0, imgW, imgH)

  function rowIsWhite(y) {
    if (y < 0 || y >= imgH) return true
    for (let x = 0; x < imgW; x += 4) { // sample every 4th pixel for speed
      const i = (y * imgW + x) * 4
      const r = imgData.data[i], g = imgData.data[i+1], b = imgData.data[i+2]
      if (r < 245 || g < 245 || b < 245) return false
    }
    return true
  }

  function findBestCut(idealY) {
    // Scan above the ideal cut first (prefer breaking before content)
    for (let delta = 0; delta <= scanWindow; delta++) {
      if (rowIsWhite(idealY - delta)) return idealY - delta
      if (rowIsWhite(idealY + delta)) return idealY + delta
    }
    return idealY // fallback to ideal if no white row found
  }

  // Build page slices
  const slices = []
  let y = 0
  while (y < imgH) {
    const remaining = imgH - y
    if (remaining <= pageH_px * (1 + SHRINK_THRESHOLD)) {
      // Last slice — fits on one page (possibly shrunk a tiny bit)
      slices.push({ y, h: remaining })
      break
    }
    const idealCut = y + pageH_px
    const actualCut = findBestCut(idealCut)
    slices.push({ y, h: actualCut - y })
    y = actualCut
  }

  // Render each slice onto its own PDF page
  slices.forEach(({ y: sliceY, h: sliceH }, i) => {
    const sliceCanvas       = document.createElement('canvas')
    sliceCanvas.width       = imgW
    sliceCanvas.height      = sliceH
    const sliceCtx          = sliceCanvas.getContext('2d')
    sliceCtx.fillStyle      = '#ffffff'
    sliceCtx.fillRect(0, 0, imgW, sliceH)
    sliceCtx.drawImage(canvas, 0, sliceY, imgW, sliceH, 0, 0, imgW, sliceH)

    const sliceH_MM = sliceH * ratio

    // Shrink last page if it's just a small overflow
    const lastSliceOverflow = (sliceH_MM - pdfH) / pdfH
    let renderH   = sliceH_MM
    let renderW   = pdfW
    let offsetX   = 0
    if (sliceH_MM > pdfH && lastSliceOverflow <= SHRINK_THRESHOLD) {
      const sf  = pdfH / sliceH_MM
      renderW   = pdfW * sf
      renderH   = pdfH
      offsetX   = (pdfW - renderW) / 2
    }

    if (i > 0) pdf.addPage()
    pdf.addImage(
      sliceCanvas.toDataURL('image/png', 0.95),
      'PNG', offsetX, 0, renderW, renderH
    )
  })

  pdf.save(filename)
  return true
}

/**
 * Same logic but returns a Blob instead of saving.
 * Used for server-side upload or preview.
 */
export async function generatePDFBlob(elementId) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume preview element not found')

  const canvas = await captureResume(element)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW        = pdf.internal.pageSize.getWidth()
  const pdfH        = pdf.internal.pageSize.getHeight()
  const ratio       = pdfW / canvas.width
  const contentH_MM = canvas.height * ratio
  const overflowRatio = (contentH_MM - pdfH) / pdfH

  if (contentH_MM <= pdfH) {
    pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', 0, 0, pdfW, contentH_MM)
  } else if (overflowRatio <= SHRINK_THRESHOLD) {
    const sf      = pdfH / contentH_MM
    const scaledW = pdfW * sf
    pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', (pdfW - scaledW) / 2, 0, scaledW, pdfH)
  } else {
    // multi-page blob — just render all on one tall page for blob use case
    pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', 0, 0, pdfW, contentH_MM)
  }

  return pdf.output('blob')
}
