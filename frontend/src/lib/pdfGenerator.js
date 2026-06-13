import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const A4_WIDTH_PX  = 794   // 210mm @ 96dpi
const A4_HEIGHT_PX = 1123  // 297mm @ 96dpi

// If content overflows by more than this ratio, add a 2nd page instead of shrinking
// 0.8 = allow up to 80% of a second page before going multi-page
// This is generous — almost always better to shrink than split
const MULTIPAGE_THRESHOLD = 0.80

async function captureElement(element, scale = 2) {
  return html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: A4_WIDTH_PX,
    windowWidth: A4_WIDTH_PX,
  })
}

function saveStyles(element) {
  return {
    width:     element.style.width,
    maxWidth:  element.style.maxWidth,
    minHeight: element.style.minHeight,
    transform: element.style.transform,
    fontSize:  element.style.fontSize,
  }
}

function restoreStyles(element, saved) {
  Object.assign(element.style, saved)
}

export async function generatePDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const saved = saveStyles(element)

  // Step 1 — measure natural content height at A4 width
  Object.assign(element.style, {
    width:     `${A4_WIDTH_PX}px`,
    maxWidth:  `${A4_WIDTH_PX}px`,
    minHeight: 'unset',
    transform: 'none',
  })

  // Force layout recalc
  element.offsetHeight // eslint-disable-line

  const naturalH = element.scrollHeight  // actual rendered height in px
  const overflowPx = naturalH - A4_HEIGHT_PX
  const overflowRatio = overflowPx / A4_HEIGHT_PX

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })
  const pdfW = pdf.internal.pageSize.getWidth()   // 210
  const pdfH = pdf.internal.pageSize.getHeight()  // 297

  // ── Fits perfectly on one page ────────────────────────────────
  if (naturalH <= A4_HEIGHT_PX) {
    let canvas
    try {
      canvas = await captureElement(element)
    } finally {
      restoreStyles(element, saved)
    }
    const ratio = pdfW / canvas.width
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfW, canvas.height * ratio)
    pdf.save(filename)
    return true
  }

  // ── Overflows but less than MULTIPAGE_THRESHOLD → shrink font to fit ──
  if (overflowRatio <= MULTIPAGE_THRESHOLD) {
    // Calculate the font scale needed to fit everything in A4
    const scaleFactor = A4_HEIGHT_PX / naturalH  // e.g. 0.93 for 7% overflow

    // Apply CSS transform scale to the inner content
    // This actually shrinks all text, spacing, and elements proportionally
    element.style.transform       = `scale(${scaleFactor})`
    element.style.transformOrigin = 'top left'
    element.style.width           = `${A4_WIDTH_PX}px`
    element.style.maxWidth        = `${A4_WIDTH_PX}px`
    // Compensate width for the scale so it still captures at A4 width
    element.style.width           = `${Math.round(A4_WIDTH_PX / scaleFactor)}px`

    element.offsetHeight // force layout

    let canvas
    try {
      // Capture at reduced scale — the transform shrinks content
      canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: Math.round(A4_WIDTH_PX / scaleFactor),
        windowWidth: Math.round(A4_WIDTH_PX / scaleFactor),
      })
    } finally {
      restoreStyles(element, saved)
    }

    // The canvas is now wider than A4 but scaled — fit it to A4 width & height
    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfW, pdfH)
    pdf.save(filename)
    return true
  }

  // ── Large overflow → multi-page using canvas slicing ─────────
  // Restore to A4 width for full capture
  let canvas
  try {
    canvas = await captureElement(element)
  } finally {
    restoreStyles(element, saved)
  }

  const ratio      = pdfW / canvas.width
  const pageH_px   = Math.round(pdfH / ratio)  // page height in canvas pixels

  let yOffset = 0
  let pageNum = 0

  while (yOffset < canvas.height) {
    const remaining = canvas.height - yOffset

    // Last slice: if it's small enough, shrink it onto one page
    const isLastSlice = remaining <= pageH_px * (1 + MULTIPAGE_THRESHOLD)

    if (isLastSlice && remaining > pageH_px) {
      // Shrink last slice to fit
      const sliceCanvas       = document.createElement('canvas')
      sliceCanvas.width       = canvas.width
      sliceCanvas.height      = remaining
      const ctx               = sliceCanvas.getContext('2d')
      ctx.fillStyle           = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, remaining)
      ctx.drawImage(canvas, 0, yOffset, canvas.width, remaining, 0, 0, canvas.width, remaining)

      const sliceH_MM = remaining * ratio
      const sf        = pdfH / sliceH_MM
      const scaledW   = pdfW * sf
      const offsetX   = (pdfW - scaledW) / 2

      if (pageNum > 0) pdf.addPage()
      pdf.addImage(sliceCanvas.toDataURL('image/png', 1.0), 'PNG', offsetX, 0, scaledW, pdfH)
      break
    }

    // Normal slice — find a clean break point
    let sliceH = Math.min(pageH_px, remaining)

    if (remaining > pageH_px) {
      // Scan upward from the ideal cut point to find a white row
      const ctx      = canvas.getContext('2d')
      const scanRange = Math.round(pageH_px * 0.08) // scan 8% upward
      const idealCut  = yOffset + pageH_px
      let bestCut     = idealCut

      for (let dy = 0; dy <= scanRange; dy++) {
        const testY = idealCut - dy
        if (testY <= yOffset) break
        const rowData = ctx.getImageData(0, testY, canvas.width, 1).data
        let isWhite   = true
        for (let i = 0; i < rowData.length; i += 16) { // sample every 4th pixel
          if (rowData[i] < 240 || rowData[i+1] < 240 || rowData[i+2] < 240) {
            isWhite = false
            break
          }
        }
        if (isWhite) { bestCut = testY; break }
      }

      sliceH = bestCut - yOffset
    }

    const sliceCanvas       = document.createElement('canvas')
    sliceCanvas.width       = canvas.width
    sliceCanvas.height      = sliceH
    const ctx               = sliceCanvas.getContext('2d')
    ctx.fillStyle           = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, sliceH)
    ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH)

    if (pageNum > 0) pdf.addPage()
    pdf.addImage(
      sliceCanvas.toDataURL('image/png', 1.0),
      'PNG', 0, 0, pdfW, sliceH * ratio
    )

    yOffset += sliceH
    pageNum++
  }

  pdf.save(filename)
  return true
}

export async function generatePDFBlob(elementId) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const saved = saveStyles(element)
  Object.assign(element.style, {
    width: `${A4_WIDTH_PX}px`, maxWidth: `${A4_WIDTH_PX}px`,
    minHeight: 'unset', transform: 'none',
  })

  const naturalH = element.scrollHeight
  const overflowRatio = (naturalH - A4_HEIGHT_PX) / A4_HEIGHT_PX

  let canvas
  if (overflowRatio > 0 && overflowRatio <= MULTIPAGE_THRESHOLD) {
    const sf = A4_HEIGHT_PX / naturalH
    element.style.transform       = `scale(${sf})`
    element.style.transformOrigin = 'top left'
    element.style.width           = `${Math.round(A4_WIDTH_PX / sf)}px`
    element.offsetHeight
    try { canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', logging: false, width: Math.round(A4_WIDTH_PX / sf), windowWidth: Math.round(A4_WIDTH_PX / sf) }) }
    finally { restoreStyles(element, saved) }
  } else {
    try { canvas = await captureElement(element) }
    finally { restoreStyles(element, saved) }
  }

  const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW = pdf.internal.pageSize.getWidth()
  const pdfH = pdf.internal.pageSize.getHeight()
  const ratio = pdfW / canvas.width
  const h     = Math.min(canvas.height * ratio, pdfH)
  pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfW, h)
  return pdf.output('blob')
}
