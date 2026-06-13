import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const A4_W_PX = 794   // 210mm @ 96dpi
const A4_H_PX = 1123  // 297mm @ 96dpi

// Overflow up to this fraction of a page → shrink to single page
// 0.25 = up to 25% overflow gets squeezed onto 1 page (looks fine)
// Beyond that → add a real second page
const SINGLE_PAGE_OVERFLOW = 0.25

async function captureElement(element) {
  // Save
  const ow = element.style.width, omw = element.style.maxWidth
  const omh = element.style.minHeight, ot = element.style.transform

  // Force exact A4 width, clear any transforms
  element.style.width     = `${A4_W_PX}px`
  element.style.maxWidth  = `${A4_W_PX}px`
  element.style.minHeight = 'unset'
  element.style.transform = 'none'
  void element.offsetHeight // force reflow

  const fullH = element.scrollHeight

  let canvas
  try {
    canvas = await html2canvas(element, {
      scale:           4,        // 4× = very crisp text, like printing at 384dpi
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           A4_W_PX,
      windowWidth:     A4_W_PX,
      height:          fullH,
      windowHeight:    fullH,
      imageTimeout:    0,
    })
  } finally {
    // Always restore
    element.style.width     = ow
    element.style.maxWidth  = omw
    element.style.minHeight = omh
    element.style.transform = ot
  }

  return { canvas, naturalH: fullH }
}

export async function generatePDF(elementId, filename = 'resume.pdf', _unused = null) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const { canvas, naturalH } = await captureElement(element)

  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW = doc.internal.pageSize.getWidth()   // 210
  const pdfH = doc.internal.pageSize.getHeight()  // 297

  // px → mm conversion (based on capturing at A4_W_PX → pdfW mm)
  const pxToMm    = pdfW / A4_W_PX          // mm per CSS pixel
  const contentMM = naturalH * pxToMm       // total content height in mm
  const overflow  = (contentMM - pdfH) / pdfH

  // canvas dimensions (4× the CSS pixels)
  const cw = canvas.width   // A4_W_PX * 4
  const ch = canvas.height  // naturalH * 4

  // mm per canvas pixel
  const ratio = pdfW / cw

  // ── Case 1: fits on one page ──────────────────────────────────
  if (contentMM <= pdfH) {
    doc.addImage(
      canvas.toDataURL('image/png'),
      'PNG', 0, 0, pdfW, ch * ratio
    )
    doc.save(filename)
    return true
  }

  // ── Case 2: small overflow → scale to fit one page ────────────
  if (overflow <= SINGLE_PAGE_OVERFLOW) {
    // Scale the image so its height = pdfH exactly
    // Width scales proportionally — will be slightly less than pdfW
    const scale  = pdfH / (ch * ratio)  // fraction to shrink
    const destW  = pdfW * scale
    const destH  = pdfH
    const offsetX = (pdfW - destW) / 2  // centre horizontally

    doc.addImage(
      canvas.toDataURL('image/png'),
      'PNG', offsetX, 0, destW, destH
    )
    doc.save(filename)
    return true
  }

  // ── Case 3: large overflow → multi-page ───────────────────────
  const pageH_canvas = Math.round(pdfH / ratio) // page height in canvas pixels
  let   yCanvas      = 0
  let   pageIdx      = 0

  while (yCanvas < ch) {
    const remaining = ch - yCanvas

    // Last chunk — if small enough, shrink to fit
    const lastOverflow = (remaining * ratio - pdfH) / pdfH
    if (remaining <= pageH_canvas * (1 + SINGLE_PAGE_OVERFLOW)) {
      const slice = sliceCanvas(canvas, yCanvas, remaining)
      const sliceH_mm = remaining * ratio
      const fits = sliceH_mm <= pdfH

      if (pageIdx > 0) doc.addPage()

      if (fits) {
        doc.addImage(slice.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceH_mm)
      } else {
        // Shrink last chunk to fit
        const sf     = pdfH / sliceH_mm
        const destW  = pdfW * sf
        const offsetX = (pdfW - destW) / 2
        doc.addImage(slice.toDataURL('image/png'), 'PNG', offsetX, 0, destW, pdfH)
      }
      break
    }

    // Find a clean break — scan upward for a light row
    const idealCut = yCanvas + pageH_canvas
    const cut      = findCut(canvas, idealCut, Math.round(pageH_canvas * 0.06))
    const sliceH   = cut - yCanvas
    const slice    = sliceCanvas(canvas, yCanvas, sliceH)

    if (pageIdx > 0) doc.addPage()
    doc.addImage(slice.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceH * ratio)

    yCanvas = cut
    pageIdx++
  }

  doc.save(filename)
  return true
}

function sliceCanvas(src, y, h) {
  const c   = document.createElement('canvas')
  c.width   = src.width
  c.height  = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, h)
  ctx.drawImage(src, 0, y, src.width, h, 0, 0, src.width, h)
  return c
}

function findCut(canvas, idealY, range) {
  const ctx = canvas.getContext('2d')
  for (let d = 0; d <= range; d++) {
    const y = idealY - d
    if (y <= 0) break
    const row = ctx.getImageData(0, y, canvas.width, 1).data
    let light = true
    for (let i = 0; i < row.length; i += 8) {
      if (row[i] < 230 || row[i + 1] < 230 || row[i + 2] < 230) {
        light = false
        break
      }
    }
    if (light) return y
  }
  return idealY
}

export async function generatePDFBlob(elementId, _unused = null) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const { canvas, naturalH } = await captureElement(element)
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW = doc.internal.pageSize.getWidth()
  const pdfH = doc.internal.pageSize.getHeight()
  const ratio = pdfW / canvas.width
  const ch    = canvas.height * ratio
  doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, Math.min(ch, pdfH))
  return doc.output('blob')
}
