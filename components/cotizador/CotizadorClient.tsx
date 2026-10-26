'use client';

import React, { useState, useId } from 'react';
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
  const docId = 'tuendpoint-quotation-document';
  const autoId = useId();

  // Datos del encabezado de cotización
  const [folio, setFolio] = useState(() => `COT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [validezDias, setValidezDias] = useState<number>(30);
  const [modalidad, setModalidad] = useState<string>('Licitación Pública (Mercado Público)');

  // Datos del organismo / cliente
  const [clienteNombre, setClienteNombre] = useState<string>('Hospital Dr. Gustavo Fricke');
  const [clienteRut, setClienteRut] = useState<string>('61.602.000-8');
  const [licitacionId, setLicitacionId] = useState<string>('2408-15-L126');
  const [clienteContacto, setClienteContacto] = useState<string>('Jefatura de Abastecimiento & TIC');
  const [clienteEmail, setClienteEmail] = useState<string>('abastecimiento@redsalud.gob.cl');

  // Condiciones
  const [plazoEntrega, setPlazoEntrega] = useState<string>('15 días hábiles tras recepción de Orden de Compra');
  const [garantia, setGarantia] = useState<string>('12 meses de garantía técnica y soporte');
  const [formaPago, setFormaPago] = useState<string>('30 días contra recepción conforme y factura electrónica');

  // Descuento comercial (%)
  const [descuentoPct, setDescuentoPct] = useState<number>(0);

  // Ítems (por defecto plantilla Gestor de Filas)
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const tpl = QUOTATION_TEMPLATES[0];
    return tpl.items.map((it, i) => ({
      ...it,
      id: `${autoId}-init-${i}`,
    }));
  });

  // Estado de descarga PDF y feedback
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
        codigo: `ITM-${prev.length + 1}`,
        categoria: 'personalizado',
        nombre: 'Nuevo Ítem / Servicio',
        descripcion: 'Descripción técnica del requerimiento.',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 100000,
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
      notify('Debe existir al menos un ítem');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Descargar PDF oficial
  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      const filename = `Cotizacion_${TUENDPOINT_COMPANY.razonSocial.replace(/\s+/g, '_')}_${folio}`;
      await downloadQuotationPdf({
        elementId: docId,
        filename,
      });
      notify('PDF descargado con éxito');
    } catch (err) {
      console.error(err);
      notify('Error al generar PDF. Usa la opción Imprimir.');
    } finally {
      setIsGenerating(false);
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
      notify('Resumen copiado para Mercado Público');
    } catch {
      notify('No se pudo copiar');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Toast minimalista */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-lg transition-all">
          {toast}
        </div>
      )}

      {/* Barra superior de herramientas: limpia, sin ruido */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md no-print">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-[#0F172A] hover:text-sky-600 transition-colors"
            >
              tuEndpoint<span className="text-[#0284c7]">.</span>
            </Link>
            <span className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs text-slate-500 hidden sm:block">Cotizador de Licitaciones</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Selector de plantilla sutil */}
            <select
              aria-label="Cargar plantilla"
              onChange={(e) => {
                if (e.target.value) {
                  handleSelectTemplate(e.target.value);
                  e.target.value = '';
                }
              }}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Cargar plantilla...
              </option>
              {QUOTATION_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopy}
              className="hidden sm:inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              title="Copiar texto formateado para Mercado Público"
            >
              Copiar texto
            </button>

            <button
              type="button"
              onClick={printQuotation}
              className="hidden sm:inline-flex rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Imprimir
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
              className="hidden md:inline-flex rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition"
            >
              WhatsApp
            </a>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="rounded-md bg-[#0284c7] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0369a1] transition disabled:opacity-50"
            >
              {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* Contenedor del documento: Formato A4 limpio y minimalista */}
      <main className="py-8 sm:py-12 px-3 sm:px-6">
        <div
          id={docId}
          className="print-only-document mx-auto max-w-4xl bg-white p-8 sm:p-14 shadow-sm border border-slate-200/70 text-slate-900 rounded-lg transition-all"
        >
          {/* 1. ENCABEZADO INSTITUCIONAL */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="text-2xl font-bold tracking-tight text-[#0F172A]">
                tuEndpoint<span className="text-[#0284c7]">.</span>
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900 tracking-wide">
                {TUENDPOINT_COMPANY.razonSocial}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                RUT: <span className="font-mono text-slate-700">{TUENDPOINT_COMPANY.rut}</span> · Giro: {TUENDPOINT_COMPANY.giro}
              </div>
              <div className="text-xs text-slate-500">
                Casa Matriz: {TUENDPOINT_COMPANY.direccion}, {TUENDPOINT_COMPANY.ciudad}
              </div>
              <div className="text-xs text-slate-500">
                {TUENDPOINT_COMPANY.email} · {TUENDPOINT_COMPANY.telefono} · {TUENDPOINT_COMPANY.web}
              </div>
            </div>

            {/* Metadatos de la cotización alineados a la derecha */}
            <div className="w-full sm:w-auto text-left sm:text-right space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Propuesta Económica & Técnica
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <span className="text-xs text-slate-400">Folio:</span>
                <input
                  type="text"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  className="font-mono text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none sm:text-right w-36"
                  title="Editar folio"
                />
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600">
                <span>Fecha:</span>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="font-mono text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-600">
                <span>Validez:</span>
                <input
                  type="number"
                  value={validezDias}
                  onChange={(e) => setValidezDias(parseInt(e.target.value) || 30)}
                  className="w-10 text-center font-mono text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
                <span>días corridos</span>
              </div>
              <div className="pt-1 text-[11px] text-emerald-700 font-medium">
                ✓ Proveedor Hábil Mercado Público (ChileCompra)
              </div>
            </div>
          </div>

          {/* 2. DATOS DEL CLIENTE Y LICITACIÓN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-200 text-xs">
            {/* Columna izquierda: Cliente */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Organismo o Empresa
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Nombre / Razón Social</label>
                <input
                  type="text"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="Ej: Hospital Dr. Gustavo Fricke"
                  className="w-full text-sm font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">RUT</label>
                <input
                  type="text"
                  value={clienteRut}
                  onChange={(e) => setClienteRut(e.target.value)}
                  placeholder="Ej: 61.602.000-8"
                  className="w-full font-mono text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Contacto / Atención a</label>
                <input
                  type="text"
                  value={clienteContacto}
                  onChange={(e) => setClienteContacto(e.target.value)}
                  placeholder="Ej: Jefatura de Abastecimiento & TIC"
                  className="w-full text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Correo Electrónico</label>
                <input
                  type="email"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  placeholder="Ej: abastecimiento@redsalud.gob.cl"
                  className="w-full font-mono text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Columna derecha: Licitación & Proceso */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Referencia & Condiciones
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">ID Licitación Mercado Público</label>
                <input
                  type="text"
                  value={licitacionId}
                  onChange={(e) => setLicitacionId(e.target.value)}
                  placeholder="Ej: 2408-15-L126 (o N/A)"
                  className="w-full font-mono font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Modalidad de Contrato</label>
                <input
                  type="text"
                  value={modalidad}
                  onChange={(e) => setModalidad(e.target.value)}
                  placeholder="Ej: Licitación Pública / Compra Ágil / Privada"
                  className="w-full text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Plazo de Entrega</label>
                <input
                  type="text"
                  value={plazoEntrega}
                  onChange={(e) => setPlazoEntrega(e.target.value)}
                  placeholder="Ej: 15 días hábiles tras Orden de Compra"
                  className="w-full text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Garantía Técnica</label>
                <input
                  type="text"
                  value={garantia}
                  onChange={(e) => setGarantia(e.target.value)}
                  placeholder="Ej: 12 meses sobre software y soporte"
                  className="w-full text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. TABLA DE PARTIDAS Y ESPECIFICACIONES TÉCNICAS */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 pr-2 w-8 text-center">#</th>
                  <th className="py-2.5 px-3">Descripción Técnica del Bien o Servicio</th>
                  <th className="py-2.5 px-2 text-center w-14">Cant.</th>
                  <th className="py-2.5 px-2 text-center w-16">Unidad</th>
                  <th className="py-2.5 px-3 text-right w-28">Unitario Neto</th>
                  <th className="py-2.5 pl-3 text-right w-28">Total Neto</th>
                  <th className="w-6 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={it.id} className="group align-top hover:bg-slate-50/50 transition">
                    <td className="py-3 pr-2 text-center text-slate-400 font-mono text-[11px] pt-3.5">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <textarea
                        rows={1}
                        value={it.nombre}
                        onChange={(e) => handleUpdateItem(it.id, 'nombre', e.target.value)}
                        placeholder="Nombre de la partida / bien / servicio"
                        className="w-full font-bold text-slate-900 bg-transparent resize-none border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={it.descripcion}
                        onChange={(e) => handleUpdateItem(it.id, 'descripcion', e.target.value)}
                        placeholder="Especificaciones técnicas..."
                        className="mt-0.5 w-full text-[11px] text-slate-500 bg-transparent resize-none border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none leading-relaxed"
                      />
                      {it.codigo && (
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          Cod: {it.codigo}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="number"
                        min={1}
                        value={it.cantidad}
                        onChange={(e) =>
                          handleUpdateItem(it.id, 'cantidad', Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="w-12 text-center font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <input
                        type="text"
                        value={it.unidad}
                        onChange={(e) => handleUpdateItem(it.id, 'unidad', e.target.value)}
                        className="w-16 text-center text-[11px] text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <span className="text-slate-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step={1000}
                          value={it.precioUnitarioNeto}
                          onChange={(e) =>
                            handleUpdateItem(
                              it.id,
                              'precioUnitarioNeto',
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-24 text-right font-mono text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-3 pl-3 text-right font-mono font-bold text-slate-950 pt-3.5">
                      {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                    </td>
                    <td className="py-3 pl-1 text-center no-print">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(it.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition font-bold px-1"
                        title="Eliminar ítem"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Controles para agregar partidas sin ruido */}
            <div className="mt-4 flex flex-wrap items-center gap-2 no-print">
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-500 hover:text-slate-900 transition"
              >
                + Agregar ítem libre
              </button>

              <select
                aria-label="Agregar ítem del catálogo"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddFromCatalog(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  + Agregar del catálogo tuEndpoint...
                </option>
                {CATALOG_ITEMS.map((c) => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.nombre.split('—')[0].trim()} ({formatCLP(c.precioUnitarioNeto)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. TOTALES FINANCIEROS Y MONTO EN PALABRAS */}
          <div className="py-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              {/* Monto en palabras (exigencia formal de licitaciones) */}
              <div className="flex-1 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Monto Total en Palabras
                </span>
                <p className="font-medium text-slate-800 italic leading-relaxed">
                  &ldquo;{totalPalabras}&rdquo;
                </p>
                <div className="pt-2 text-[11px] text-slate-500">
                  Forma de pago: {formaPago}
                </div>
              </div>

              {/* Desglose financiero a la derecha */}
              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Neto:</span>
                  <span className="font-mono text-slate-900">{formatCLP(subtotalBruto)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Descuento</span>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={descuentoPct}
                      onChange={(e) =>
                        setDescuentoPct(Math.min(90, Math.max(0, parseInt(e.target.value) || 0)))
                      }
                      className="w-10 text-center font-mono text-[11px] bg-transparent border-b border-slate-200 hover:border-slate-400 focus:outline-none"
                    />
                    <span>%:</span>
                  </span>
                  <span className="font-mono text-slate-900">
                    {descuentoPct > 0 ? `-${formatCLP(montoDescuento)}` : '$0'}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Afecto:</span>
                  <span className="font-mono text-slate-900">{formatCLP(subtotalNeto)}</span>
                </div>

                <div className="flex justify-between text-slate-700 font-medium border-t border-slate-200 pt-1.5">
                  <span>I.V.A. (19%):</span>
                  <span className="font-mono">{formatCLP(iva)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-slate-950 border-t border-slate-300 pt-2">
                  <span>TOTAL:</span>
                  <span className="font-mono text-[#0284c7]">{formatCLP(total)}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right">Pesos Chilenos (CLP)</div>
              </div>
            </div>
          </div>

          {/* 5. DATOS BANCARIOS Y CLAUSULAS FORMALES */}
          <div className="py-6 border-b border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Datos Institucionales para Pago / Orden de Compra
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-slate-700">
              <div>Razón Social: {TUENDPOINT_COMPANY.banco.titular}</div>
              <div>RUT: {TUENDPOINT_COMPANY.banco.rut}</div>
              <div>Banco: {TUENDPOINT_COMPANY.banco.banco}</div>
              <div>Tipo: {TUENDPOINT_COMPANY.banco.tipoCuenta}</div>
              <div>Facturación: Factura Electrónica DTE (SII)</div>
              <div>Email: {TUENDPOINT_COMPANY.banco.email}</div>
            </div>
          </div>

          {/* 6. FIRMA Y TIMBRE INSTITUCIONAL */}
          <div className="pt-8 flex items-end justify-between">
            <div className="text-[10px] text-slate-400 max-w-sm leading-relaxed">
              Documento emitido electrónicamente por Soluciones tuEndpoint SpA. Conforme a Ley 19.886 de Bases
              sobre Contratos Administrativos de Suministro y Prestación de Servicios.
            </div>

            <div className="text-right">
              <div className="border-t border-slate-300 pt-2 text-xs font-bold text-slate-900">
                SOLUCIONES TUENDPOINT SPA
              </div>
              <div className="text-[11px] text-slate-500">Representación Técnica · Viña del Mar</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
