import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// A4 dimensions in mm
const A4_WIDTH_MM  = 210
const A4_HEIGHT_MM = 297
// A4 at 96dpi in pixels (what html2canvas works in)
const A4_WIDTH_PX  = 794  // 210mm at 96dpi

export async function generatePDF(elementId, filename = 'resume.pdf') {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  // Force the element to render at exactly A4 width regardless of screen size
  // Save original styles
  const originalWidth    = element.style.width
  const originalMaxWidth = element.style.maxWidth
  const originalTransform = element.style.transform

  // Temporarily set A4 width so html2canvas captures full width
  element.style.width    = `${A4_WIDTH_PX}px`
  element.style.maxWidth = `${A4_WIDTH_PX}px`
  element.style.transform = 'none'

  let canvas
  try {
    canvas = await html2canvas(element, {
      scale: 2,                        // high-DPI for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: A4_WIDTH_PX,              // capture exactly A4 width
      windowWidth: A4_WIDTH_PX,        // simulate A4 viewport
    })
  } finally {
    // Always restore original styles
    element.style.width     = originalWidth
    element.style.maxWidth  = originalMaxWidth
    element.style.transform = originalTransform
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const pdfW = pdf.internal.pageSize.getWidth()   // 210mm
  const pdfH = pdf.internal.pageSize.getHeight()  // 297mm

  const imgW = canvas.width   // A4_WIDTH_PX * scale = 1588px
  const imgH = canvas.height

  // Scale image to fill full A4 width — no centering, no padding
  const ratio       = pdfW / imgW         // mm per pixel
  const imgHeightMM = imgH * ratio

  if (imgHeightMM <= pdfH) {
    // Fits on one page — add at top-left, full width
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, imgHeightMM)
  } else {
    // Multi-page: slice canvas into page-sized chunks
    let yOffset = 0
    const pageHeightPx = Math.floor(pdfH / ratio)

    while (yOffset < imgH) {
      const sliceH = Math.min(pageHeightPx, imgH - yOffset)

      // Create a canvas slice for this page
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width  = imgW
      pageCanvas.height = sliceH
      const ctx = pageCanvas.getContext('2d')
      ctx.drawImage(canvas, 0, yOffset, imgW, sliceH, 0, 0, imgW, sliceH)

      const sliceHeightMM = sliceH * ratio
      if (yOffset > 0) pdf.addPage()
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, sliceHeightMM)

      yOffset += sliceH
    }
  }

  pdf.save(filename)
  return true
}

export async function generatePDFBlob(elementId) {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Resume element not found')

  const originalWidth    = element.style.width
  const originalMaxWidth = element.style.maxWidth

  element.style.width    = `${A4_WIDTH_PX}px`
  element.style.maxWidth = `${A4_WIDTH_PX}px`

  let canvas
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
    })
  } finally {
    element.style.width    = originalWidth
    element.style.maxWidth = originalMaxWidth
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const pdfW  = pdf.internal.pageSize.getWidth()
  const ratio = pdfW / canvas.width
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfW, canvas.height * ratio)
  return pdf.output('blob')
}
