'use client';

import React, { useState, useId, useRef } from 'react';
import Link from 'next/link';
import {
  TUENDPOINT_COMPANY,
  CATALOG_ITEMS,
  QUOTATION_TEMPLATES,
  QuoteItem,
  QuoteTemplate,
  numeroAPalabras,
  formatCLP,
  formatFechaChile,
} from '@/lib/cotizador/catalog';
import {
  downloadQuotationPdf,
  printQuotation,
  buildWhatsAppQuoteUrl,
  buildMercadoPublicoText,
} from '@/lib/cotizador/pdf';

export function CotizadorClient() {
  const printDocId = 'tuendpoint-quotation-document';
  const autoId = useId();

  // Tipo de cotización
  const [tipoCotizacion, setTipoCotizacion] = useState<'licitacion' | 'compra_agil' | 'privada'>('licitacion');

  // Datos generales de la cotización
  const [folio, setFolio] = useState(() => `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [fechaEmision, setFechaEmision] = useState(() => new Date().toISOString().split('T')[0]);
  const [validezDias, setValidezDias] = useState<number>(60);
  const [plazoEntrega, setPlazoEntrega] = useState<string>('15 días hábiles a contar de la recepción conforme de la Orden de Compra.');
  const [garantia, setGarantia] = useState<string>('12 meses de garantía técnica de fábrica y soporte nivel 2/3.');
  const [formaPago, setFormaPago] = useState<string>('30 días contra recepción conforme y factura electrónica emitida.');

  // Datos del cliente / organismo licitante
  const [clienteNombre, setClienteNombre] = useState<string>('Hospital Dr. Gustavo Fricke');
  const [clienteRut, setClienteRut] = useState<string>('61.602.000-8');
  const [licitacionId, setLicitacionId] = useState<string>('2408-15-L126');
  const [clienteContacto, setClienteContacto] = useState<string>('Jefatura de Abastecimiento & TIC');
  const [clienteEmail, setClienteEmail] = useState<string>('abastecimiento@redsalud.gob.cl');
  const [clienteTelefono, setClienteTelefono] = useState<string>('+56 32 257 7000');

  // Descuento comercial
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0);

  // Valor referencial UF
  const [valorUF, setValorUF] = useState<number>(38500);
  const [mostrarUF, setMostrarUF] = useState<boolean>(true);

  // Ítems de la cotización (iniciamos con la plantilla de Gestor de Filas)
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const template = QUOTATION_TEMPLATES[0];
    return template.items.map((it, idx) => ({
      ...it,
      id: `${autoId}-init-${idx}`,
    }));
  });

  // Estado de descarga de PDF y copiado
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pestaña activa en vista móvil: 'editor' o 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3500);
  };

  // Cálculos financieros
  const subtotalNetoBruto = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precioUnitarioNeto) || 0),
    0
  );
  const montoDescuento = Math.round(subtotalNetoBruto * ((Number(descuentoPorcentaje) || 0) / 100));
  const subtotalNetoFinal = Math.max(0, subtotalNetoBruto - montoDescuento);
  const montoIVA = Math.round(subtotalNetoFinal * 0.19);
  const montoTotalBruto = subtotalNetoFinal + montoIVA;
  const montoTotalUF = valorUF > 0 ? (montoTotalBruto / valorUF).toFixed(2) : '0.00';
  const totalPalabras = numeroAPalabras(montoTotalBruto);

  // Manejo de plantillas
  const handleLoadTemplate = (tpl: QuoteTemplate) => {
    setTipoCotizacion(tpl.tipo);
    setClienteNombre(tpl.organismoSugerido);
    setValidezDias(tpl.condiciones.validezDias);
    setPlazoEntrega(tpl.condiciones.plazoEntrega);
    setGarantia(tpl.condiciones.garantia);
    setFormaPago(tpl.condiciones.formaPago);
    setItems(
      tpl.items.map((it, idx) => ({
        ...it,
        id: `${autoId}-tpl-${Date.now()}-${idx}`,
      }))
    );
    showToast(`Plantilla "${tpl.nombre}" cargada con éxito.`);
  };

  // Agregar ítem desde el catálogo rápido
  const handleAddCatalogItem = (it: Omit<QuoteItem, 'id'>) => {
    setItems((prev) => [
      ...prev,
      {
        ...it,
        id: `${autoId}-cat-${Date.now()}-${Math.random()}`,
      },
    ]);
    showToast(`Ítem "${it.nombre.slice(0, 32)}..." agregado.`);
  };

  // Agregar ítem personalizado libre
  const handleAddCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${autoId}-custom-${Date.now()}`,
        codigo: `CUSTOM-${items.length + 1}`,
        categoria: 'personalizado',
        nombre: 'Nuevo Ítem de Licitación / Servicio',
        descripcion: 'Detalle técnico y especificaciones requeridas por las bases.',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 100000,
      },
    ]);
  };

  // Actualizar ítem existente
  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  // Eliminar ítem
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      showToast('La cotización debe contener al menos un ítem.');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Generar PDF con jsPDF + html2canvas
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setPdfProgress(10);
      const safeFilename = `Cotizacion_${TUENDPOINT_COMPANY.razonSocial.replace(/\s+/g, '_')}_${folio}`;
      await downloadQuotationPdf({
        elementId: printDocId,
        filename: safeFilename,
        onProgress: (p) => setPdfProgress(p),
      });
      showToast('¡PDF generado y descargado exitosamente!');
    } catch (err) {
      console.error('Error generando PDF:', err);
      showToast('Error generando PDF directo. Puedes usar el botón "Imprimir / Guardar como PDF".');
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress(0);
    }
  };

  // Copiar resumen para Mercado Público
  const handleCopyMercadoPublico = async () => {
    const text = buildMercadoPublicoText({
      folio,
      fecha: formatFechaChile(fechaEmision),
      razonSocial: TUENDPOINT_COMPANY.razonSocial,
      rut: TUENDPOINT_COMPANY.rut,
      cliente: clienteNombre,
      licitacionId,
      items,
      netoFormatted: formatCLP(subtotalNetoFinal),
      ivaFormatted: formatCLP(montoIVA),
      totalFormatted: formatCLP(montoTotalBruto),
      totalPalabras,
      plazo: plazoEntrega,
      garantia,
    });
    try {
      await navigator.clipboard.writeText(text);
      showToast('¡Resumen copiado para Mercado Público al portapapeles!');
    } catch {
      showToast('No se pudo acceder al portapapeles.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-sky-300 bg-white px-5 py-3.5 shadow-2xl transition-all">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
            ✓
          </span>
          <span className="text-sm font-semibold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Header superior oficial de tuEndpoint */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#0F172A] transition-colors hover:text-sky-600"
            >
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </Link>
            <span className="hidden h-5 w-px bg-slate-300 sm:inline-block" />
            <div className="hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                HÁBIL CHILECOMPRA
              </span>
              <span>RUT: {TUENDPOINT_COMPANY.rut}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              ← Volver al portal
            </Link>
            <button
              type="button"
              onClick={printQuotation}
              className="hidden items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:inline-flex"
            >
              <span>🖨️</span> Imprimir / PDF
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0284c7] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition hover:bg-[#0369a1] disabled:opacity-50"
            >
              <span>{isGeneratingPdf ? '⏳' : '📄'}</span>
              <span>{isGeneratingPdf ? `Generando ${pdfProgress}%` : 'Descargar PDF'}</span>
            </button>
          </div>
        </div>

        {/* Selector de vista móvil */}
        <div className="flex border-t border-slate-200 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors ${
              mobileTab === 'editor'
                ? 'border-b-2 border-sky-600 text-sky-600 bg-sky-50/50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ✏️ Editor & Parámetros
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors ${
              mobileTab === 'preview'
                ? 'border-b-2 border-sky-600 text-sky-600 bg-sky-50/50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            👁️ Vista Previa PDF
          </button>
        </div>
      </header>

      {/* Contenedor principal de dos columnas */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ============================================================ */}
          {/* PANEL IZQUIERDO: EDITOR Y CONTROL DE PARÁMETROS             */}
          {/* ============================================================ */}
          <div
            className={`space-y-6 lg:col-span-5 ${
              mobileTab === 'editor' ? 'block' : 'hidden lg:block'
            } no-print`}
          >
            {/* 1. Tipo de Cotización y Plantillas Rápidas */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-sky-600 uppercase">
                  01 · Plantillas Rápidas
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  1 Clic
                </span>
              </div>
              <h2 className="mt-1 text-base font-bold text-slate-900">
                Selecciona una solución o licitación
              </h2>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Carga automáticamente las especificaciones técnicas completas requeridas por las bases.
              </p>

              <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {QUOTATION_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleLoadTemplate(tpl)}
                    className="flex flex-col items-start rounded-xl border border-slate-200 p-3 text-left transition hover:border-sky-500 hover:bg-sky-50/40 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{tpl.icono}</span>
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{tpl.nombre}</span>
                    </div>
                    <span className="mt-1 text-[10px] font-semibold text-sky-700 bg-sky-100/70 rounded px-1.5 py-0.5">
                      {tpl.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Datos de la Entidad / Licitación */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <span className="text-xs font-mono font-bold tracking-wider text-sky-600 uppercase">
                02 · Organismo / Licitación
              </span>
              <h2 className="mt-1 text-base font-bold text-slate-900">
                Datos del Cliente y Convocatoria
              </h2>

              <div className="mt-4 space-y-3.5">
                {/* Tipo de proceso */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">Modalidad de Venta / Contrato</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { id: 'licitacion', label: 'Licitación Pública' },
                      { id: 'compra_agil', label: 'Compra Ágil' },
                      { id: 'privada', label: 'Privada / B2B' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTipoCotizacion(m.id as any)}
                        className={`rounded-lg py-1.5 text-center text-[11px] font-bold transition ${
                          tipoCotizacion === m.id
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Folio y Fecha */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Folio Cotización</label>
                    <input
                      type="text"
                      value={folio}
                      onChange={(e) => setFolio(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Fecha de Emisión</label>
                    <input
                      type="date"
                      value={fechaEmision}
                      onChange={(e) => setFechaEmision(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Organismo licitante y RUT */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      Entidad / Organismo / Empresa
                    </label>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      placeholder="Ej: Hospital Dr. Gustavo Fricke"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">RUT Entidad</label>
                    <input
                      type="text"
                      value={clienteRut}
                      onChange={(e) => setClienteRut(e.target.value)}
                      placeholder="61.602.000-8"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* ID Licitación Mercado Público */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      ID Licitación Mercado Público (Opcional)
                    </label>
                    <span className="text-[10px] text-slate-400">Ej: 2408-15-L126</span>
                  </div>
                  <input
                    type="text"
                    value={licitacionId}
                    onChange={(e) => setLicitacionId(e.target.value)}
                    placeholder="2408-15-L126 o N° de Adquisición"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Contacto y Email */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Contacto / Cargo</label>
                    <input
                      type="text"
                      value={clienteContacto}
                      onChange={(e) => setClienteContacto(e.target.value)}
                      placeholder="Jefe de Abastecimiento / TI"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Correo Electrónico</label>
                    <input
                      type="email"
                      value={clienteEmail}
                      onChange={(e) => setClienteEmail(e.target.value)}
                      placeholder="adquisiciones@organismo.gob.cl"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Ítems de la Cotización */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider text-sky-600 uppercase">
                    03 · Partidas & Especificaciones
                  </span>
                  <h2 className="mt-1 text-base font-bold text-slate-900">
                    Ítems Cotizados ({items.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
                >
                  + Agregar Ítem
                </button>
              </div>

              {/* Botones de catálogo rápido para agregar con un clic */}
              <div className="mt-3 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-semibold text-slate-500">Agregar del catálogo tuEndpoint:</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CATALOG_ITEMS.slice(0, 7).map((cat) => (
                    <button
                      key={cat.codigo}
                      type="button"
                      onClick={() => handleAddCatalogItem(cat)}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-800"
                    >
                      + {cat.nombre.split('—')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista editable de ítems */}
              <div className="mt-4 space-y-3">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={it.nombre}
                        onChange={(e) => handleUpdateItem(it.id, 'nombre', e.target.value)}
                        placeholder="Nombre de la partida / bien / servicio"
                        className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-bold text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        title="Eliminar ítem"
                        className="text-xs text-red-500 hover:text-red-700 font-bold px-1.5"
                      >
                        ✕
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={it.descripcion}
                      onChange={(e) => handleUpdateItem(it.id, 'descripcion', e.target.value)}
                      placeholder="Especificaciones técnicas detalladas según bases..."
                      className="mt-2 w-full rounded-md border border-slate-200 bg-white p-2 text-[11px] text-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 leading-relaxed"
                    />

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500">Cantidad</label>
                        <input
                          type="number"
                          min={1}
                          value={it.cantidad}
                          onChange={(e) => handleUpdateItem(it.id, 'cantidad', Math.max(1, parseInt(e.target.value) || 1))}
                          className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500">Unidad</label>
                        <select
                          value={it.unidad}
                          onChange={(e) => handleUpdateItem(it.id, 'unidad', e.target.value)}
                          className="mt-0.5 w-full rounded border border-slate-300 bg-white px-1.5 py-1 text-xs text-slate-900"
                        >
                          <option value="Unidad">Unidad</option>
                          <option value="Licencia">Licencia</option>
                          <option value="Mes">Mes</option>
                          <option value="Servicio">Servicio</option>
                          <option value="Hora">Hora</option>
                          <option value="Proyecto">Proyecto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500">Unitario Neto ($)</label>
                        <input
                          type="number"
                          step={1000}
                          value={it.precioUnitarioNeto}
                          onChange={(e) =>
                            handleUpdateItem(it.id, 'precioUnitarioNeto', Math.max(0, parseInt(e.target.value) || 0))
                          }
                          className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/70 pt-1.5">
                      <span className="font-mono text-[10px] text-slate-400">Cod: {it.codigo ?? 'S/C'}</span>
                      <span className="font-semibold text-slate-900">
                        Subtotal Neto: {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Condiciones Comerciales y Descuentos */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <span className="text-xs font-mono font-bold tracking-wider text-sky-600 uppercase">
                04 · Condiciones Comerciales
              </span>
              <h2 className="mt-1 text-base font-bold text-slate-900">
                Plazos, Garantías y Descuento
              </h2>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Validez Oferta (Días)</label>
                    <input
                      type="number"
                      value={validezDias}
                      onChange={(e) => setValidezDias(parseInt(e.target.value) || 30)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Descuento Comercial (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={descuentoPorcentaje}
                      onChange={(e) => setDescuentoPorcentaje(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Plazo de Entrega / Ejecución</label>
                  <input
                    type="text"
                    value={plazoEntrega}
                    onChange={(e) => setPlazoEntrega(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Garantía Técnica</label>
                  <input
                    type="text"
                    value={garantia}
                    onChange={(e) => setGarantia(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Forma de Pago</label>
                  <input
                    type="text"
                    value={formaPago}
                    onChange={(e) => setFormaPago(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mostrarUF}
                      onChange={(e) => setMostrarUF(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    Mostrar cálculo referencial en UF
                  </label>
                  {mostrarUF && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Valor UF $:</span>
                      <input
                        type="number"
                        value={valorUF}
                        onChange={(e) => setValorUF(parseInt(e.target.value) || 38500)}
                        className="w-20 rounded border border-slate-300 px-2 py-0.5 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Acciones y Compartir */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5 shadow-sm space-y-3">
              <span className="text-xs font-mono font-bold tracking-wider text-sky-700 uppercase">
                05 · Exportación & Licitaciones
              </span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition hover:bg-sky-700"
                >
                  <span>📄</span> Descargar PDF Oficial
                </button>

                <button
                  type="button"
                  onClick={printQuotation}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  <span>🖨️</span> Imprimir / Guardar PDF
                </button>

                <button
                  type="button"
                  onClick={handleCopyMercadoPublico}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                >
                  <span>📋</span> Copiar para Mercado Público
                </button>

                <a
                  href={buildWhatsAppQuoteUrl({
                    folio,
                    cliente: clienteNombre,
                    licitacionId,
                    totalFormatted: formatCLP(montoTotalBruto),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500 bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <span>💬</span> Enviar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PANEL DERECHO: VISTA PREVIA DEL DOCUMENTO EJECUTIVO (A4)     */}
          {/* ============================================================ */}
          <div
            className={`lg:col-span-7 ${
              mobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Contenedor del documento A4 con sombra y bordes ejecutivos */}
            <div className="sticky top-20">
              <div className="mb-3 flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">Documento Ejecutivo en Tiempo Real</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Formato A4 Oficial ChileCompra / SII</span>
              </div>

              {/* DOCUMENTO OFICIAL PARA CAPTURA PDF E IMPRESIÓN */}
              <div
                id={printDocId}
                className="print-only-document mx-auto w-full max-w-[800px] rounded-xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl text-slate-900 transition-all"
                style={{ minHeight: '1080px' }}
              >
                {/* 1. MEMBRETE OFICIAL Y LOGO */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                        tuEndpoint<span className="text-[#0284c7]">.</span>
                      </span>
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                        TECNOLOGÍA & SOFTWARE
                      </span>
                    </div>

                    <h1 className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                      {TUENDPOINT_COMPANY.razonSocial}
                    </h1>
                    <p className="text-[11px] font-mono text-slate-600">
                      RUT: <strong className="text-slate-900">{TUENDPOINT_COMPANY.rut}</strong>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 leading-tight max-w-sm">
                      {TUENDPOINT_COMPANY.giro}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Casa Matriz: {TUENDPOINT_COMPANY.direccion}, {TUENDPOINT_COMPANY.ciudad}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {TUENDPOINT_COMPANY.email} | {TUENDPOINT_COMPANY.telefono} | {TUENDPOINT_COMPANY.web}
                    </p>
                  </div>

                  {/* Recuadro de Cotización y Folio */}
                  <div className="w-full sm:w-auto min-w-[220px] rounded-xl border-2 border-sky-600 bg-sky-50/60 p-4 text-center">
                    <span className="text-[10px] font-bold tracking-widest text-sky-700 uppercase">
                      {tipoCotizacion === 'licitacion'
                        ? 'PROPUESTA ECONÓMICA Y TÉCNICA'
                        : tipoCotizacion === 'compra_agil'
                        ? 'COTIZACIÓN COMPRA ÁGIL'
                        : 'COTIZACIÓN PRIVADA B2B'}
                    </span>
                    <div className="mt-1 text-2xl font-black font-mono tracking-tight text-slate-950">
                      N° {folio}
                    </div>
                    <div className="mt-2 border-t border-sky-200/80 pt-2 text-[11px] text-slate-600">
                      Emisión: <strong>{formatFechaChile(fechaEmision)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Validez: <strong>{validezDias} días corridos</strong>
                    </div>
                  </div>
                </div>

                {/* 2. SELLO DE HABILIDAD EN MERCADO PÚBLICO */}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                      ✓
                    </span>
                    <div>
                      <span className="text-xs font-bold text-emerald-900">
                        PROVEEDOR DEL ESTADO HÁBIL · CHILECOMPRA / MERCADO PÚBLICO
                      </span>
                      <p className="text-[10px] text-emerald-700">
                        {TUENDPOINT_COMPANY.razonSocial} está habilitado para contratar con organismos del Estado de Chile.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    ESTADO: HÁBIL
                  </span>
                </div>

                {/* 3. RECUADRO DEL ORGANISMO LICITANTE / CLIENTE */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Destinatario / Organismo Adjudicador
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                    <div>
                      <span className="text-slate-500">Razón Social / Institución:</span>
                      <div className="font-bold text-slate-900 text-sm">{clienteNombre || '—'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">RUT Entidad:</span>
                      <div className="font-mono font-bold text-slate-900">{clienteRut || '—'}</div>
                    </div>
                    {licitacionId && (
                      <div className="sm:col-span-2 rounded bg-sky-100/70 border border-sky-200 px-2.5 py-1.5 flex items-center justify-between">
                        <span className="font-bold text-sky-900 text-[11px]">
                          ID LICITACIÓN MERCADO PÚBLICO:
                        </span>
                        <span className="font-mono font-black text-sky-950 text-xs">
                          {licitacionId}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">Contacto / Atención a:</span>
                      <div className="font-semibold text-slate-800">{clienteContacto || '—'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Correo Electrónico:</span>
                      <div className="font-mono text-slate-800">{clienteEmail || '—'}</div>
                    </div>
                  </div>
                </div>

                {/* 4. TABLA DE ESPECIFICACIONES TÉCNICAS Y PARTIDAS */}
                <div className="mt-6">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-900 bg-slate-100/80 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        <th className="py-2 px-2 text-center w-8">#</th>
                        <th className="py-2 px-3">Descripción Técnica del Bien / Servicio</th>
                        <th className="py-2 px-2 text-center w-14">Cant.</th>
                        <th className="py-2 px-2 text-center w-16">Unidad</th>
                        <th className="py-2 px-3 text-right w-24">Unitario Neto</th>
                        <th className="py-2 px-3 text-right w-28">Total Neto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((it, idx) => (
                        <tr key={it.id} className="align-top">
                          <td className="py-3 px-2 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 text-xs">{it.nombre}</div>
                            {it.codigo && (
                              <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-slate-600 mt-0.5">
                                Cod: {it.codigo}
                              </span>
                            )}
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                              {it.descripcion}
                            </p>
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-slate-900">{it.cantidad}</td>
                          <td className="py-3 px-2 text-center text-[11px] text-slate-600">{it.unidad}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-800">
                            {formatCLP(it.precioUnitarioNeto)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">
                            {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 5. TOTALES FINANCIEROS Y DESGLOSE IVA CHILE */}
                <div className="mt-6 border-t-2 border-slate-900 pt-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                    {/* Monto en palabras y moneda */}
                    <div className="flex-1 space-y-2">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Monto Total en Palabras (Exigencia Bases de Licitación):
                        </span>
                        <p className="mt-1 text-xs font-bold text-slate-900 italic">
                          &ldquo;{totalPalabras}&rdquo;
                        </p>
                      </div>

                      {mostrarUF && (
                        <div className="text-[11px] text-slate-500">
                          Equivalencia referencial:{' '}
                          <strong className="text-slate-800 font-mono">{montoTotalUF} UF</strong> (calculado con UF
                          referencial a {formatCLP(valorUF)}).
                        </div>
                      )}
                    </div>

                    {/* Desglose financiero formal */}
                    <div className="w-full sm:w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal Neto:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatCLP(subtotalNetoBruto)}
                        </span>
                      </div>

                      {descuentoPorcentaje > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Descuento Comercial ({descuentoPorcentaje}%):</span>
                          <span className="font-mono">-{formatCLP(montoDescuento)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal Afecto:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatCLP(subtotalNetoFinal)}
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-600 border-b border-slate-200 pb-1.5">
                        <span className="font-bold text-slate-800">I.V.A. (19%):</span>
                        <span className="font-mono font-bold text-slate-900">{formatCLP(montoIVA)}</span>
                      </div>

                      <div className="flex justify-between text-base font-extrabold text-slate-950 pt-1 border-t-2 border-slate-900">
                        <span>TOTAL BRUTO:</span>
                        <span className="font-mono text-sky-700">{formatCLP(montoTotalBruto)}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block text-right">Pesos Chilenos (CLP)</span>
                    </div>
                  </div>
                </div>

                {/* 6. CONDICIONES COMERCIALES Y CLÁUSULAS FORMALES */}
                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-[10px] space-y-1.5">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px]">
                    Condiciones Generales de la Oferta
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                    <div>
                      • <strong>Plazo de Entrega:</strong> {plazoEntrega}
                    </div>
                    <div>
                      • <strong>Garantía Técnica:</strong> {garantia}
                    </div>
                    <div>
                      • <strong>Forma de Pago:</strong> {formaPago}
                    </div>
                    <div>
                      • <strong>Facturación:</strong> Factura Electrónica DTE autorizada por SII.
                    </div>
                  </div>
                </div>

                {/* 7. DATOS BANCARIOS PARA PAGO / TRANSFERENCIA */}
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-[10px] text-slate-600">
                  <strong className="text-slate-800">Datos para Emisión de Orden de Compra y Transferencia:</strong>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px]">
                    <span>Razón Social: {TUENDPOINT_COMPANY.banco.titular}</span>
                    <span>RUT: {TUENDPOINT_COMPANY.banco.rut}</span>
                    <span>Banco: {TUENDPOINT_COMPANY.banco.banco}</span>
                    <span>Tipo: {TUENDPOINT_COMPANY.banco.tipoCuenta}</span>
                    <span>Email de Pago: {TUENDPOINT_COMPANY.banco.email}</span>
                  </div>
                </div>

                {/* 8. TIMBRE Y FIRMA DIGITAL INSTITUCIONAL */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-[9px] text-slate-400">
                    <p>Documento generado electrónicamente por Soluciones tuEndpoint SpA.</p>
                    <p>Conforme a la Ley 19.886 de Compras Públicas y normativa tributaria SII.</p>
                  </div>

                  {/* Sello y Firma Institucional */}
                  <div className="text-center min-w-[180px]">
                    <div className="mx-auto mb-1 flex h-14 w-32 items-center justify-center rounded border border-dashed border-sky-400 bg-sky-50/40 text-[9px] font-bold text-sky-800 uppercase tracking-wider">
                      Firma Digital
                      <br />
                      tuEndpoint.
                    </div>
                    <div className="border-t border-slate-400 pt-1 text-[9px] font-bold text-slate-800">
                      REPRESENTANTE TÉCNICO
                    </div>
                    <div className="text-[8px] text-slate-500">SOLUCIONES TUENDPOINT SPA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
