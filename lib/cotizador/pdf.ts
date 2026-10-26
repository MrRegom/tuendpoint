import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  elementId: string;
  filename: string;
  onProgress?: (progress: number) => void;
}

/**
 * Genera y descarga un PDF de alta fidelidad para cotizaciones/licitaciones
 * utilizando clonación en sandbox offscreen para asegurar tipografía nítida
 * y evitar artefactos de inputs y botones interactivos.
 */
export async function downloadQuotationPdf({
  elementId,
  filename,
  onProgress,
}: GeneratePdfOptions): Promise<void> {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    throw new Error(`Elemento con ID #${elementId} no encontrado.`);
  }

  onProgress?.(20);

  // Guardar estado temporal si tiene overflow o transform
  const prevTransform = sourceEl.style.transform;
  sourceEl.style.transform = 'none';

  try {
    const canvas = await html2canvas(sourceEl, {
      scale: 2.2, // Resolución retina nítida para impresión y visualización ejecutiva
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      ignoreElements: (element) => element.classList.contains('no-print'),
    });

    onProgress?.(65);

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
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

    // Páginas subsiguientes si la cotización excede A4
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.(90);

    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Disparar descarga nativa del PDF
    pdf.save(safeName);

    onProgress?.(100);
  } finally {
    sourceEl.style.transform = prevTransform;
  }
}

/**
 * Dispara el diálogo de impresión nativo del navegador con reglas de CSS vectoriales
 */
export function printQuotation(): void {
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
