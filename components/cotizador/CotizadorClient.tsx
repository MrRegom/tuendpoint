'use client';

import React, { useState, useId, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Printer,
  Copy,
  Share2,
  CheckCircle2,
  FileText,
  Building2,
  Plus,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
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
  const docId = 'tuendpoint-quotation-document';
  const autoId = useId();

  // Modo de vista: 'split' (ambos), 'doc_only' (solo documento)
  const [viewMode, setViewMode] = useState<'split' | 'doc_only'>('split');
  // Pestaña en vista móvil: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('preview');

  // Pestaña activa en el configurador: 'cliente' | 'partidas' | 'condiciones'
  const [configTab, setConfigTab] = useState<'cliente' | 'partidas' | 'condiciones'>('cliente');

  // Datos del encabezado de cotización (determinísticos para evitar hydration mismatch)
  const [folio, setFolio] = useState('COT-2026-156');
  const [fecha, setFecha] = useState('2026-10-26');
  const [validezDias, setValidezDias] = useState<number>(30);
  const [modalidad, setModalidad] = useState<string>('Licitación Pública (Mercado Público)');

  // Datos del organismo / cliente
  const [clienteNombre, setClienteNombre] = useState<string>('Hospital Dr. Gustavo Fricke');
  const [clienteRut, setClienteRut] = useState<string>('61.602.000-8');
  const [licitacionId, setLicitacionId] = useState<string>('2408-15-L126');
  const [clienteContacto, setClienteContacto] = useState<string>('Jefatura de Abastecimiento & TIC');
  const [clienteEmail, setClienteEmail] = useState<string>('abastecimiento@redsalud.gob.cl');
  const [clienteTelefono, setClienteTelefono] = useState<string>('+56 32 257 7000');

  // Condiciones comerciales
  const [plazoEntrega, setPlazoEntrega] = useState<string>('15 días hábiles tras recepción de Orden de Compra');
  const [garantia, setGarantia] = useState<string>('12 meses de garantía técnica y soporte nivel 2/3');
  const [formaPago, setFormaPago] = useState<string>('30 días contra recepción conforme y factura electrónica');

  // Descuento comercial (%)
  const [descuentoPct, setDescuentoPct] = useState<number>(0);

  // Valor UF referencial
  const [valorUF, setValorUF] = useState<number>(38500);

  // Ítems (por defecto plantilla Gestor de Filas)
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const tpl = QUOTATION_TEMPLATES[0];
    return tpl.items.map((it, i) => ({
      ...it,
      id: `init-${i}`,
    }));
  });

  // Efecto de inicialización en cliente
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
  }, []);

  // Estado de descarga PDF y feedback
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  // Cálculos financieros
  const subtotalBruto = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precioUnitarioNeto) || 0),
    0
  );
  const montoDescuento = Math.round(subtotalBruto * ((Number(descuentoPct) || 0) / 100));
  const subtotalNeto = Math.max(0, subtotalBruto - montoDescuento);
  const iva = Math.round(subtotalNeto * 0.19);
  const total = subtotalNeto + iva;
  const montoUF = valorUF > 0 ? (total / valorUF).toFixed(2) : '0.00';
  const totalPalabras = numeroAPalabras(total);

  // Manejo de plantillas
  const handleSelectTemplate = (tplId: string) => {
    const tpl = QUOTATION_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    setClienteNombre(tpl.organismoSugerido);
    setValidezDias(tpl.condiciones.validezDias);
    setPlazoEntrega(tpl.condiciones.plazoEntrega);
    setGarantia(tpl.condiciones.garantia);
    setFormaPago(tpl.condiciones.formaPago);
    setItems(
      tpl.items.map((it, i) => ({
        ...it,
        id: `${autoId}-tpl-${Date.now()}-${i}`,
      }))
    );
    notify(`Plantilla cargada: ${tpl.nombre}`);
  };

  // Agregar ítem libre
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${autoId}-${Date.now()}`,
        codigo: `SRV-${prev.length + 1}`,
        categoria: 'personalizado',
        nombre: 'Nuevo Servicio / Partida Técnica',
        descripcion: 'Especificación y alcance según bases de licitación.',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 150000,
      },
    ]);
  };

  // Agregar desde catálogo tuEndpoint
  const handleAddFromCatalog = (codigo: string) => {
    const cat = CATALOG_ITEMS.find((c) => c.codigo === codigo);
    if (!cat) return;
    setItems((prev) => [
      ...prev,
      {
        ...cat,
        id: `${autoId}-cat-${Date.now()}-${Math.random()}`,
      },
    ]);
    notify(`Agregado: ${cat.nombre.split('—')[0].trim()}`);
  };

  // Actualizar ítem
  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  // Eliminar ítem
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      notify('La propuesta debe incluir al menos una partida.');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Abrir y previsualizar PDF oficial en una pestaña nueva
  const handleOpenPdf = async () => {
    // Abrir la pestaña sincrónicamente para evitar restricciones de popups del navegador
    const newWindow = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;
    if (newWindow) {
      try {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Generando PDF Oficial — tuEndpoint</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
                .card { text-align: center; padding: 2.5rem 2rem; border-radius: 12px; background: #1e293b; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                .spinner { width: 40px; height: 40px; border: 3px solid #334155; border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
                @keyframes spin { to { transform: rotate(360deg); } }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="spinner"></div>
                <div style="font-weight: 700; font-size: 16px;">Generando PDF Oficial tuEndpoint...</div>
                <div style="font-size: 13px; color: #94a3b8; margin-top: 8px;">Compilando propuesta A4 en alta resolución</div>
              </div>
            </body>
          </html>
        `);
      } catch (e) {
        console.warn('No se pudo escribir en la pestaña previa', e);
      }
    }

    try {
      setIsGenerating(true);
      setPdfProgress(15);
      const filename = `Cotizacion_${TUENDPOINT_COMPANY.razonSocial.replace(/\s+/g, '_')}_${folio}.pdf`;
      const res = await downloadQuotationPdf({
        elementId: docId,
        filename,
        onProgress: (p) => setPdfProgress(p),
      });

      if (res?.blobUrl) {
        setLastPdfUrl(res.blobUrl);
        if (newWindow && !newWindow.closed) {
          newWindow.location.href = res.blobUrl;
        } else {
          window.open(res.blobUrl, '_blank');
        }
        notify('PDF oficial abierto con éxito');
      }
    } catch (err) {
      console.error(err);
      if (newWindow && !newWindow.closed) newWindow.close();
      notify('No se pudo abrir el PDF directo. Usa el botón Imprimir / PDF.');
    } finally {
      setIsGenerating(false);
      setPdfProgress(0);
    }
  };

  // Descargar PDF oficial
  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      setPdfProgress(15);
      const filename = `Cotizacion_${TUENDPOINT_COMPANY.razonSocial.replace(/\s+/g, '_')}_${folio}`;
      const res = await downloadQuotationPdf({
        elementId: docId,
        filename,
        onProgress: (p) => setPdfProgress(p),
      });
      if (res && res.blobUrl) {
        setLastPdfUrl(res.blobUrl);
      }
      notify('PDF oficial exportado con éxito');
    } catch (err) {
      console.error(err);
      notify('No se pudo generar el PDF directo. Usa el botón Imprimir.');
    } finally {
      setIsGenerating(false);
      setPdfProgress(0);
    }
  };

  // Copiar resumen Mercado Público
  const handleCopy = async () => {
    const text = buildMercadoPublicoText({
      folio,
      fecha: formatFechaChile(fecha),
      razonSocial: TUENDPOINT_COMPANY.razonSocial,
      rut: TUENDPOINT_COMPANY.rut,
      cliente: clienteNombre,
      licitacionId,
      items,
      netoFormatted: formatCLP(subtotalNeto),
      ivaFormatted: formatCLP(iva),
      totalFormatted: formatCLP(total),
      totalPalabras,
      plazo: plazoEntrega,
      garantia,
    });
    try {
      await navigator.clipboard.writeText(text);
      notify('Resumen copiado para Mercado Público al portapapeles');
    } catch {
      notify('No se pudo acceder al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Toast flotante */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          {lastPdfUrl && (
            <a
              href={lastPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-1 rounded bg-sky-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-sky-500 transition"
            >
              <span>Abrir PDF</span>
              <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* BARRA SUPERIOR ENTERPRISE */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-[#0F172A] hover:text-[#0284c7] transition-colors"
            >
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </Link>
            <span className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs font-semibold text-slate-700">Cotizador Enterprise</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                HÁBIL CHILECOMPRA
              </span>
            </div>
          </div>

          {/* Actions & Tools */}
          <div className="flex items-center gap-2">
            {/* Selector de Soluciones Rápidas */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <select
                aria-label="Cargar solución rápida"
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectTemplate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-2 pr-7 text-xs font-medium text-slate-700 hover:bg-slate-100 transition focus:outline-none focus:ring-1 focus:ring-sky-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Plantillas de Licitación...
                </option>
                {QUOTATION_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              title="Copiar resumen para ficha de oferta en Mercado Público"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>Copiar</span>
            </button>

            <button
              type="button"
              onClick={printQuotation}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              title="Imprimir o Guardar como PDF oficial"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
              <span className="sm:hidden">Imprimir</span>
            </button>

            <a
              href={buildWhatsAppQuoteUrl({
                folio,
                cliente: clienteNombre,
                licitacionId,
                totalFormatted: formatCLP(total),
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Alternar modo pantalla completa en desktop */}
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === 'split' ? 'doc_only' : 'split'))}
              className="hidden xl:inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-slate-900 transition shadow-sm"
              title={viewMode === 'split' ? 'Modo Solo Documento' : 'Modo Dividido'}
            >
              {viewMode === 'split' ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>

            {/* Botón Abrir PDF */}
            <button
              type="button"
              onClick={handleOpenPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 rounded-md border border-sky-300 bg-sky-50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs disabled:opacity-50"
              title="Abrir y previsualizar PDF oficial en una nueva pestaña"
            >
              <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
              <span>Abrir PDF</span>
            </button>

            {/* Botón Descargar PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-[#0284c7] px-3 sm:px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#0369a1] transition disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isGenerating ? `Exportando ${pdfProgress}%` : 'Descargar PDF'}</span>
            </button>
          </div>
        </div>

        {/* Selector de pestañas para móvil */}
        <div className="flex border-t border-slate-200 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 text-center text-xs font-bold transition ${
              mobileTab === 'editor'
                ? 'border-b-2 border-sky-600 text-sky-600 bg-sky-50/40'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Configuración
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-center text-xs font-bold transition ${
              mobileTab === 'preview'
                ? 'border-b-2 border-sky-600 text-sky-600 bg-sky-50/40'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Documento A4
          </button>
        </div>
      </header>

      {/* ÁREA DE TRABAJO */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className={`grid grid-cols-1 gap-8 ${viewMode === 'split' ? 'lg:grid-cols-12' : 'lg:grid-cols-1'}`}>
          {/* ============================================================ */}
          {/* PANEL DE CONTROL EJECUTIVO (Solo en modo split)             */}
          {/* ============================================================ */}
          {viewMode === 'split' && (
            <aside
              className={`space-y-4 lg:col-span-5 ${
                mobileTab === 'editor' ? 'block' : 'hidden lg:block'
              } no-print`}
            >
              {/* Pestañas del configurador */}
              <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                {[
                  { id: 'cliente', label: '1. Licitación' },
                  { id: 'partidas', label: '2. Partidas' },
                  { id: 'condiciones', label: '3. Condiciones' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConfigTab(t.id as any)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
                      configTab === t.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* PESTAÑA 1: DATOS CLIENTE & LICITACIÓN */}
              {configTab === 'cliente' && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Organismo Convocante
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">RUT: 78.411.033-8</span>
                  </div>

                  {/* Modalidad de Contrato */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Modalidad de Contratación</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {[
                        'Licitación Pública (Mercado Público)',
                        'Compra Ágil',
                        'Privada B2B',
                      ].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setModalidad(m)}
                          className={`rounded-md px-2 py-1.5 text-center text-[10px] font-bold border transition ${
                            modalidad === m
                              ? 'border-sky-600 bg-sky-50 text-sky-900'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {m.split('(')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Folio y Fecha */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Folio Cotización</label>
                      <input
                        type="text"
                        value={folio}
                        onChange={(e) => setFolio(e.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Fecha Emisión</label>
                      <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Organismo licitante y RUT */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">
                        Institución / Razón Social
                      </label>
                      <input
                        type="text"
                        value={clienteNombre}
                        onChange={(e) => setClienteNombre(e.target.value)}
                        placeholder="Ej: Hospital Dr. Gustavo Fricke"
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">RUT Entidad</label>
                        <input
                          type="text"
                          value={clienteRut}
                          onChange={(e) => setClienteRut(e.target.value)}
                          placeholder="61.602.000-8"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          ID Licitación ChileCompra
                        </label>
                        <input
                          type="text"
                          value={licitacionId}
                          onChange={(e) => setLicitacionId(e.target.value)}
                          placeholder="2408-15-L126"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">Contacto / Cargo</label>
                        <input
                          type="text"
                          value={clienteContacto}
                          onChange={(e) => setClienteContacto(e.target.value)}
                          placeholder="Jefatura Adquisiciones"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block">Correo</label>
                        <input
                          type="email"
                          value={clienteEmail}
                          onChange={(e) => setClienteEmail(e.target.value)}
                          placeholder="contacto@entidad.gob.cl"
                          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: PARTIDAS Y CATÁLOGO TUENDPOINT */}
              {configTab === 'partidas' && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Partidas Técnicas ({items.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 rounded bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Partida Libre</span>
                    </button>
                  </div>

                  {/* Acceso Rápido al Catálogo */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Añadir Solución tuEndpoint
                    </label>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {CATALOG_ITEMS.map((c) => (
                        <button
                          key={c.codigo}
                          type="button"
                          onClick={() => handleAddFromCatalog(c.codigo!)}
                          className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-900 transition"
                        >
                          + {c.nombre.split('—')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Partidas Editables */}
                  <div className="space-y-3 pt-2">
                    {items.map((it, idx) => (
                      <div
                        key={it.id}
                        className="rounded-lg border border-slate-200 p-3 bg-slate-50/60 space-y-2 hover:border-slate-300 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 pt-0.5">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={it.nombre}
                            onChange={(e) => handleUpdateItem(it.id, 'nombre', e.target.value)}
                            className="flex-1 font-bold text-xs text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 focus:border-sky-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="text-slate-400 hover:text-red-500 transition p-1"
                            title="Eliminar partida"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={it.descripcion}
                          onChange={(e) => handleUpdateItem(it.id, 'descripcion', e.target.value)}
                          className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-2 focus:border-sky-500 focus:outline-none resize-none leading-relaxed"
                          placeholder="Especificaciones técnicas..."
                        />

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Cant.</span>
                            <input
                              type="number"
                              min={1}
                              value={it.cantidad}
                              onChange={(e) =>
                                handleUpdateItem(it.id, 'cantidad', Math.max(1, parseInt(e.target.value) || 1))
                              }
                              className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 font-bold text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Unidad</span>
                            <input
                              type="text"
                              value={it.unidad}
                              onChange={(e) => handleUpdateItem(it.id, 'unidad', e.target.value)}
                              className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Unitario Neto ($)</span>
                            <input
                              type="number"
                              step={1000}
                              value={it.precioUnitarioNeto}
                              onChange={(e) =>
                                handleUpdateItem(it.id, 'precioUnitarioNeto', Math.max(0, parseInt(e.target.value) || 0))
                              }
                              className="mt-0.5 w-full rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-right"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 border-t border-slate-200/60 pt-1.5">
                          <span className="font-mono text-[10px] text-slate-400">Cod: {it.codigo ?? 'N/A'}</span>
                          <span className="font-bold text-slate-900">
                            Subtotal: {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: CONDICIONES COMERCIALES */}
              {configTab === 'condiciones' && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Términos Contractuales
                    </span>
                    <span className="text-[11px] text-slate-400">Normativa Ley 19.886</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Validez Oferta (Días)</label>
                      <input
                        type="number"
                        value={validezDias}
                        onChange={(e) => setValidezDias(parseInt(e.target.value) || 30)}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block">Descuento Comercial (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={90}
                        value={descuentoPct}
                        onChange={(e) => setDescuentoPct(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Plazo de Entrega</label>
                    <input
                      type="text"
                      value={plazoEntrega}
                      onChange={(e) => setPlazoEntrega(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Garantía Técnica</label>
                    <input
                      type="text"
                      value={garantia}
                      onChange={(e) => setGarantia(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Forma de Pago</label>
                    <input
                      type="text"
                      value={formaPago}
                      onChange={(e) => setFormaPago(e.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Valor UF Referencial ($)</label>
                    <input
                      type="number"
                      value={valorUF}
                      onChange={(e) => setValorUF(parseInt(e.target.value) || 38500)}
                      className="mt-1 w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* ============================================================ */}
          {/* HOJA EJECUTIVA A4 EN TIEMPO REAL                            */}
          {/* ============================================================ */}
          <main
            className={`${
              viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'
            } ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}
          >
            {/* Barra rápida de acciones móvil */}
            <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-xs lg:hidden no-print shadow-xs">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                Documento Oficial A4
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 rounded border border-sky-300 bg-sky-50 px-2 py-1 text-[11px] font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
                >
                  <ExternalLink className="h-3 w-3 text-sky-600" />
                  <span>Abrir PDF</span>
                </button>
                <button
                  type="button"
                  onClick={printQuotation}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="h-3 w-3 text-slate-500" />
                  <span>Imprimir</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 rounded bg-[#0284c7] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0369a1] transition disabled:opacity-50 shadow-xs"
                >
                  <Download className="h-3 w-3" />
                  <span>{isGenerating ? `Generando ${pdfProgress}%` : 'Descargar PDF'}</span>
                </button>
              </div>
            </div>

            {/* DOCUMENTO OFICIAL A4 PARA EXPORTACIÓN E IMPRESIÓN */}
            <div
              id={docId}
              className="print-only-document mx-auto max-w-[820px] bg-white p-8 sm:p-12 border border-slate-200/90 shadow-sm text-slate-900 transition-all"
              style={{ minHeight: '1080px' }}
            >
              {/* 1. MEMBRETE OFICIAL */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-200 pb-7">
                <div>
                  <div className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                    tuEndpoint<span className="text-[#0284c7]">.</span>
                  </div>
                  <div className="mt-1.5 text-xs font-bold text-slate-900 tracking-wide uppercase">
                    {TUENDPOINT_COMPANY.razonSocial}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-600 font-mono">
                    RUT: <strong>{TUENDPOINT_COMPANY.rut}</strong>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500 max-w-sm leading-tight">
                    {TUENDPOINT_COMPANY.giro}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Casa Matriz: {TUENDPOINT_COMPANY.direccion}, {TUENDPOINT_COMPANY.ciudad}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {TUENDPOINT_COMPANY.email} · {TUENDPOINT_COMPANY.telefono} · {TUENDPOINT_COMPANY.web}
                  </p>
                </div>

                {/* Recuadro Ejecutivo de Cotización */}
                <div className="w-full sm:w-auto min-w-[220px] rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-left sm:text-right space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Propuesta Económica & Técnica
                  </div>
                  <div className="font-mono text-xl font-bold tracking-tight text-slate-950">
                    {folio}
                  </div>
                  <div className="text-xs text-slate-600">
                    Fecha: <strong className="text-slate-900">{formatFechaChile(fecha)}</strong>
                  </div>
                  <div className="text-xs text-slate-600">
                    Validez: <strong className="text-slate-900">{validezDias} días corridos</strong>
                  </div>
                </div>
              </div>

              {/* 2. BARRA DE VERIFICACIÓN MERCADO PÚBLICO */}
              <div className="mt-4 flex items-center justify-between rounded-md border border-emerald-200/80 bg-emerald-50/50 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-950 text-[11px]">
                    PROVEEDOR DEL ESTADO HÁBIL · CHILECOMPRA / MERCADO PÚBLICO
                  </span>
                </div>
                <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-800">
                  RUT: {TUENDPOINT_COMPANY.rut}
                </span>
              </div>

              {/* 3. DATOS DE LA CONVOCATORIA Y ORGANISMO */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border-y border-slate-200 py-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Organismo Licitante / Entidad
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{clienteNombre || '—'}</div>
                  <div className="font-mono text-slate-600 mt-0.5">RUT: {clienteRut || '—'}</div>
                  <div className="text-slate-600 mt-0.5">Atención: {clienteContacto || '—'}</div>
                  <div className="font-mono text-slate-500 text-[11px]">{clienteEmail || '—'}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Referencia & Contratación
                  </span>
                  {licitacionId && (
                    <div className="mt-0.5 inline-flex items-center gap-1.5 rounded bg-sky-50 px-2 py-0.5 text-xs font-mono font-bold text-sky-900 border border-sky-200">
                      ID: {licitacionId}
                    </div>
                  )}
                  <div className="text-slate-700 mt-1">
                    Modalidad: <strong>{modalidad}</strong>
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Plazo: {plazoEntrega}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Garantía: {garantia}
                  </div>
                </div>
              </div>

              {/* 4. TABLA EJECUTIVA DE PARTIDAS */}
              <div className="mt-5">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      <th className="py-2.5 px-2 text-center w-8">#</th>
                      <th className="py-2.5 px-3">Descripción Técnica del Bien o Servicio</th>
                      <th className="py-2.5 px-2 text-center w-14">Cant.</th>
                      <th className="py-2.5 px-2 text-center w-16">Unidad</th>
                      <th className="py-2.5 px-3 text-right w-28">Unitario Neto</th>
                      <th className="py-2.5 px-3 text-right w-28">Total Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it, idx) => (
                      <tr key={it.id} className="align-top hover:bg-slate-50/50 transition">
                        <td className="py-3 px-2 text-center font-mono text-[11px] text-slate-400 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 text-xs">{it.nombre}</div>
                          {it.codigo && (
                            <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                              Código: {it.codigo}
                            </span>
                          )}
                          <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
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

              {/* 5. TOTALES FINANCIEROS Y MONTO EN PALABRAS */}
              <div className="mt-6 border-t-2 border-slate-900 pt-5">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  {/* Monto en palabras (Exigencia legal en bases de licitación) */}
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="rounded border border-slate-200 bg-slate-50/80 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Monto Total en Palabras (Exigencia Bases de Licitación)
                      </span>
                      <p className="mt-1 font-bold text-slate-900 italic leading-relaxed text-[11px]">
                        &ldquo;{totalPalabras}&rdquo;
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <div>
                        Equivalencia referencial:{' '}
                        <strong className="text-slate-800 font-mono">{montoUF} UF</strong> (UF a {formatCLP(valorUF)}).
                      </div>
                      <div>
                        Condición de pago: <strong>{formaPago}</strong>.
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta de Totales */}
                  <div className="w-full sm:w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Neto:</span>
                      <span className="font-mono text-slate-900">{formatCLP(subtotalBruto)}</span>
                    </div>

                    {descuentoPct > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Descuento ({descuentoPct}%):</span>
                        <span className="font-mono">-{formatCLP(montoDescuento)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Afecto:</span>
                      <span className="font-mono text-slate-900">{formatCLP(subtotalNeto)}</span>
                    </div>

                    <div className="flex justify-between text-slate-700 font-semibold border-t border-slate-200 pt-1">
                      <span>I.V.A. (19%):</span>
                      <span className="font-mono text-slate-900">{formatCLP(iva)}</span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-slate-950 border-t-2 border-slate-900 pt-1.5">
                      <span>TOTAL BRUTO:</span>
                      <span className="font-mono text-[#0284c7]">{formatCLP(total)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">Pesos Chilenos (CLP)</span>
                  </div>
                </div>
              </div>

              {/* 6. FIRMA Y TIMBRE INSTITUCIONAL */}
              <div className="mt-8 border-t border-slate-200 pt-4 flex items-end justify-between">
                <div className="text-[10px] text-slate-400 max-w-sm leading-relaxed">
                  Documento formal emitido electrónicamente por Soluciones tuEndpoint SpA. Conforme a Ley 19.886 de Bases
                  sobre Contratos Administrativos de Suministro y Prestación de Servicios.
                </div>

                <div className="text-right min-w-[200px]">
                  <div className="mx-auto mb-1 flex h-12 w-32 items-center justify-center rounded border border-dashed border-sky-400 bg-sky-50/40 text-[9px] font-bold text-sky-800 uppercase tracking-wider">
                    Firma Digital
                    <br />
                    tuEndpoint.
                  </div>
                  <div className="border-t border-slate-300 pt-1 text-xs font-bold text-slate-900">
                    SOLUCIONES TUENDPOINT SPA
                  </div>
                  <div className="text-[10px] text-slate-500">Representante Técnico · Viña del Mar</div>
                </div>
              </div>
            </div>

            {/* BARRA DE ACCIONES POST-DOCUMENTO */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm no-print">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <FileText className="h-4 w-4 text-[#0284c7]" />
                <span className="font-bold text-slate-800">
                  Propuesta Formal Lista ({folio})
                </span>
                <span className="text-slate-300">·</span>
                <span>Válida por {validezDias} días</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100 transition shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-sky-600" />
                  <span>Abrir PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0284c7] px-4 py-2 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={printQuotation}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* BARRA FLOTANTE FIJA INFERIOR - ACCIONES RÁPIDAS PERMANENTES */}
      <aside
        aria-label="Acciones rápidas de cotización"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/95 px-4 py-2 shadow-2xl backdrop-blur-md no-print text-white"
      >
        <span className="text-[11px] font-mono text-slate-300 hidden sm:inline border-r border-slate-700 pr-3">
          {folio}
        </span>
        <button
          type="button"
          onClick={handleOpenPdf}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/80 border border-sky-500/40 px-3.5 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-900 hover:text-white transition shadow-sm"
        >
          <ExternalLink className="h-3.5 w-3.5 text-sky-400" />
          <span>Abrir PDF</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0369a1] transition shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isGenerating ? `${pdfProgress}%` : 'Descargar PDF'}</span>
        </button>
        <button
          type="button"
          onClick={printQuotation}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title="Imprimir o Guardar como PDF"
        >
          <Printer className="h-3.5 w-3.5 text-slate-400" />
          <span>Imprimir</span>
        </button>
      </aside>
    </div>
  );
}
