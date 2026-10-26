import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  elementId: string;
  filename: string;
  onProgress?: (progress: number) => void;
  openInNewTab?: boolean;
}

export interface GeneratePdfResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
}

/**
 * Genera y descarga un PDF oficial de alta fidelidad para cotizaciones y licitaciones
 * utilizando un contenedor clonado offscreen con ancho A4 estricto (794px).
 * Esto garantiza que el PDF siempre tenga proporciones A4 de escritorio impecables,
 * sin importar si el usuario está en un celular, tablet o si el contenedor original
 * está temporalmente oculto.
 */
export async function downloadQuotationPdf({
  elementId,
  filename,
  onProgress,
  openInNewTab = false,
}: GeneratePdfOptions): Promise<GeneratePdfResult> {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    throw new Error(`Elemento con ID #${elementId} no encontrado en el documento.`);
  }

  onProgress?.(15);

  // Crear un clon fuera de pantalla con ancho A4 estricto (794px = 210mm a 96 DPI)
  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.id = `${elementId}-print-clone`;
  Object.assign(clone.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '794px',
    minWidth: '794px',
    maxWidth: '794px',
    zIndex: '-99999',
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    backgroundColor: '#ffffff',
    margin: '0',
    padding: '36px',
    boxSizing: 'border-box',
    boxShadow: 'none',
    transform: 'none',
  });

  // Remover elementos con clase no-print del clon
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  document.body.appendChild(clone);

  try {
    onProgress?.(35);
    // Pausa breve para renderizado de fuentes y estilos computados
    await new Promise((resolve) => setTimeout(resolve, 80));

    const canvas = await html2canvas(clone, {
      scale: 2, // 2x retina para ultra nitidez sin sobrecargar memoria
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      width: 794,
    });

    onProgress?.(70);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Primera página
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Páginas subsiguientes si la cotización excede 1 página A4
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.(85);

    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // 1. Disparar descarga directa mediante elemento <a>
    try {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (link.parentNode) link.parentNode.removeChild(link);
      }, 500);
    } catch (e) {
      console.warn('Descarga por enlace falló, ejecutando pdf.save():', e);
      pdf.save(safeName);
    }

    // 2. Si se solicitó abrir en nueva pestaña (ideal para previsualización o móviles):
    if (openInNewTab) {
      window.open(blobUrl, '_blank');
    }

    onProgress?.(100);
    return { blob, blobUrl, filename: safeName };
  } finally {
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}

/**
 * Dispara el diálogo de impresión nativo del navegador con reglas de CSS vectoriales
 */
export function printQuotation(): void {
  // Dispara el diálogo del sistema (permite 'Guardar como PDF' con texto vectorial 100% nítido)
  window.print();
}

/**
 * Construye el enlace de WhatsApp con el resumen de la propuesta
 */
export function buildWhatsAppQuoteUrl({
  phone = '+5694925337',
  folio,
  cliente,
  licitacionId,
  totalFormatted,
}: {
  phone?: string;
  folio: string;
  cliente: string;
  licitacionId?: string;
  totalFormatted: string;
}): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const lines = [
    `Estimados, adjunto resumen de propuesta formal de *SOLUCIONES TUENDPOINT SPA*:`,
    `📄 *Cotización N°:* ${folio}`,
    `🏢 *Organismo / Cliente:* ${cliente}`,
    licitacionId ? `🏛️ *ID Licitación:* ${licitacionId}` : null,
    `💰 *Monto Total (IVA inc.):* ${totalFormatted}`,
    `⭐ *Proveedor Hábil Mercado Público* (RUT 78.411.033-8)`,
    `\nDocumento formal disponible con garantía técnica y soporte.`,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

/**
 * Genera el resumen en texto plano formateado para copiar y pegar en la
 * oferta económica del portal www.mercadopublico.cl
 */
export function buildMercadoPublicoText({
  folio,
  fecha,
  razonSocial,
  rut,
  cliente,
  licitacionId,
  items,
  netoFormatted,
  ivaFormatted,
  totalFormatted,
  totalPalabras,
  plazo,
  garantia,
}: {
  folio: string;
  fecha: string;
  razonSocial: string;
  rut: string;
  cliente: string;
  licitacionId?: string;
  items: Array<{ nombre: string; cantidad: number; unidad: string; precioUnitarioNeto: number }>;
  netoFormatted: string;
  ivaFormatted: string;
  totalFormatted: string;
  totalPalabras: string;
  plazo: string;
  garantia: string;
}): string {
  const itemLines = items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.nombre} | Cant: ${it.cantidad} ${it.unidad} | Unitario Neto: $${new Intl.NumberFormat(
          'es-CL'
        ).format(it.precioUnitarioNeto)}`
    )
    .join('\n');

  return `=====================================================
OFERTA ECONÓMICA Y TÉCNICA · MERCADO PÚBLICO
SOLUCIONES TUENDPOINT SPA (RUT: ${rut})
ESTADO: PROVEEDOR HÁBIL CHILECOMPRA
=====================================================
FOLIO COTIZACIÓN: ${folio}
FECHA EMISIÓN: ${fecha}
ORGANISMO LICITANTE: ${cliente}
${licitacionId ? `ID LICITACIÓN MERCADO PÚBLICO: ${licitacionId}\n` : ''}
DETALLE DE ÍTEMS:
${itemLines}

RESUMEN FINANCIERO:
- SUBTOTAL NETO: ${netoFormatted}
- IVA (19%): ${ivaFormatted}
- TOTAL BRUTO: ${totalFormatted}
- MONTO EN PALABRAS: ${totalPalabras}

CONDICIONES COMERCIALES:
- Plazo de Entrega: ${plazo}
- Garantía Técnica: ${garantia}
- Forma de Pago: 30 días contra recepción conforme y factura electrónica.
- Proveedor del Estado Hábil para contratar.

Contacto: contacto@tuendpoint.cl | +56 9 492 5337 | Viña del Mar, Chile
=====================================================`;
}
