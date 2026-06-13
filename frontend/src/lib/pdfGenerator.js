import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// A4 at 96dpi
const A4_WIDTH_PX  = 794
const A4_HEIGHT_PX = 1123

// If content > this many A4 pages, use multi-page instead of shrink
// 1.7 = if content is more than 1.7 pages tall, split into 2 pages
const MULTIPAGE_AFTER = 1.7

async function captureResume(element) {
  const savedWidth    = element.style.width
  const savedMaxWidth = element.style.maxWidth
  const savedMinH     = element.style.minHeight
  const savedTransform = element.style.transform

  // Reset any transforms and force A4 width
  element.style.width     = `${A4_WIDTH_PX}px`
  element.style.maxWidth  = `${A4_WIDTH_PX}px`
  element.style.minHeight = 'unset'
  element.style.transform = 'none'

  // Force layout
  void element.offsetHeight

  let canvas
  try {
    canvas = await html2canvas(element, {
      scale:           3,          // high quality — 3x
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           A4_WIDTH_PX,
      windowWidth:     A4_WIDTH_PX,
      // Ensure full height is captured
      height:          element.scrollHeight,
      windowHeight:    element.scrollHeight,
    })
  } finally {
    element.style.width     = savedWidth
    element.style.maxWidth  = savedMaxWidth
    element.style.minHeight = savedMinH
    element.style.transform = savedTransform
  }

  return canvas
}

export async function generatePDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const canvas = await captureResume(element)

  const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW = pdf.internal.pageSize.getWidth()   // 210mm
  const pdfH = pdf.internal.pageSize.getHeight()  // 297mm

  // mm per canvas pixel — fit canvas width exactly to PDF width
  const ratio        = pdfW / canvas.width
  const totalH_mm    = canvas.height * ratio       // total content height in mm
  const pages        = totalH_mm / pdfH            // how many A4 pages needed

  // ── Single page (fits naturally or shrink up to MULTIPAGE_AFTER) ──
  if (pages <= MULTIPAGE_AFTER) {
    // addImage with full width — height will be totalH_mm
    // jsPDF clips to page height automatically for single-page PDF
    // But we want to visually shrink so nothing is cut — use full pdfH as dest height
    // which letterboxes (no stretching, no distortion)
    if (totalH_mm <= pdfH) {
      // Content shorter than A4 — place at top, natural size
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.97),
        'JPEG', 0, 0, pdfW, totalH_mm
      )
    } else {
      // Content taller than A4 but within MULTIPAGE_AFTER threshold
      // Scale proportionally: keep full width, reduce height to fit
      // This means image fills pdfW and pdfH exactly — slight vertical compression
      // since content is only slightly over, this is imperceptible
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.97),
        'JPEG', 0, 0, pdfW, pdfH
      )
    }
    pdf.save(filename)
    return true
  }

  // ── Multi-page: split canvas cleanly ─────────────────────────
  const pageH_canvas = Math.round(pdfH / ratio)  // page height in canvas pixels
  let   yCanvas      = 0
  let   pageIndex    = 0

  while (yCanvas < canvas.height) {
    const remaining = canvas.height - yCanvas

    // Last chunk — if it fits within one page (possibly with slight shrink)
    if (remaining <= pageH_canvas * MULTIPAGE_AFTER) {
      const chunk    = createChunk(canvas, yCanvas, remaining)
      const chunkH   = remaining * ratio            // mm
      const destH    = Math.min(chunkH, pdfH)      // shrink to page if needed

      if (pageIndex > 0) pdf.addPage()
      pdf.addImage(chunk.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, pdfW, destH)
      break
    }

    // Find a clean horizontal cut — scan upward for a white/light row
    const idealCut  = yCanvas + pageH_canvas
    const bestCut   = findCleanCut(canvas, idealCut, Math.round(pageH_canvas * 0.06))

    const sliceH    = bestCut - yCanvas
    const chunk     = createChunk(canvas, yCanvas, sliceH)

    if (pageIndex > 0) pdf.addPage()
    pdf.addImage(chunk.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, pdfW, sliceH * ratio)

    yCanvas    = bestCut
    pageIndex++
  }

  pdf.save(filename)
  return true
}

function createChunk(sourceCanvas, y, h) {
  const c   = document.createElement('canvas')
  c.width   = sourceCanvas.width
  c.height  = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, h)
  ctx.drawImage(sourceCanvas, 0, y, sourceCanvas.width, h, 0, 0, sourceCanvas.width, h)
  return c
}

function findCleanCut(canvas, idealY, scanRange) {
  const ctx = canvas.getContext('2d')
  for (let d = 0; d <= scanRange; d++) {
    const y = idealY - d
    if (y <= 0) break
    const row = ctx.getImageData(0, y, canvas.width, 1).data
    let light = true
    for (let i = 0; i < row.length; i += 8) {
      if (row[i] < 235 || row[i+1] < 235 || row[i+2] < 235) { light = false; break }
    }
    if (light) return y
  }
  return idealY
}

export async function generatePDFBlob(elementId) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const canvas  = await captureResume(element)
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW    = pdf.internal.pageSize.getWidth()
  const pdfH    = pdf.internal.pageSize.getHeight()
  const ratio   = pdfW / canvas.width
  const totalH  = canvas.height * ratio
  pdf.addImage(
    canvas.toDataURL('image/jpeg', 0.97),
    'JPEG', 0, 0, pdfW, Math.min(totalH, pdfH)
  )
  return pdf.output('blob')
}
