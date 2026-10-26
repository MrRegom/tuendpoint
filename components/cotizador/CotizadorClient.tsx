'use client';

import React, { useState, useId, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  FileText,
  Users,
  Package,
  Clock,
  ShoppingCart,
  Layers,
  BarChart3,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Eye,
  X,
  Menu,
  Building2,
  Sparkles,
} from 'lucide-react';
import {
  TUENDPOINT_COMPANY,
  CATALOG_ITEMS,
  QUOTATION_TEMPLATES,
  QuoteItem,
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

// Organismos y clientes chilenos precargados
const CLIENTES_PRECARGADOS = [
  { nombre: 'Constructora ABC Ltda.', rut: '76.123.456-7', contacto: 'Gerencia de Proyectos' },
  { nombre: 'Hospital Dr. Gustavo Fricke', rut: '61.602.000-8', contacto: 'Jefatura de Abastecimiento & TIC' },
  { nombre: 'Servicio de Salud Valparaíso - San Antonio', rut: '61.606.300-9', contacto: 'Subdirección de Operaciones' },
  { nombre: 'Ilustre Municipalidad de Viña del Mar', rut: '69.050.100-3', contacto: 'SECPLA / Dirección de Informática' },
  { nombre: 'Servicio de Salud Metropolitano Central', rut: '61.602.100-4', contacto: 'Unidad de Compras Públicas' },
  { nombre: 'Red Salud S.A.', rut: '96.852.120-K', contacto: 'Gerencia de Adquisiciones' },
  { nombre: 'Clínica Ciudad del Mar', rut: '77.412.300-1', contacto: 'Área de TI & Soporte' },
];

export function CotizadorClient() {
  const docId = 'tuendpoint-quotation-document';
  const autoId = useId();

  // Estado del menú lateral móvil
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado del modal de vista previa del documento A4 oficial
  const [showDocModal, setShowDocModal] = useState(false);

  // Folio y fechas (inicialización determinística para SSR)
  const [folio, setFolio] = useState('COT-2026-156');
  const [fecha, setFecha] = useState('2026-10-26');
  const [validezDias, setValidezDias] = useState<number>(30);
  const [moneda, setMoneda] = useState<'CLP' | 'UF'>('CLP');

  // Cliente
  const [clienteNombre, setClienteNombre] = useState<string>('Constructora ABC Ltda.');
  const [clienteRut, setClienteRut] = useState<string>('76.123.456-7');
  const [clienteContacto, setClienteContacto] = useState<string>('Gerencia de Operaciones & TIC');

  // Licitación Mercado Público (opcional)
  const [licitacionId, setLicitacionId] = useState<string>('2408-15-L126');
  const [modalidad, setModalidad] = useState<string>('Licitación Pública (Mercado Público)');

  // Condiciones comerciales
  const [plazoEntrega, setPlazoEntrega] = useState<string>('15 días hábiles tras recepción de Orden de Compra');
  const [garantia, setGarantia] = useState<string>('12 meses de garantía técnica y soporte nivel 2/3');
  const [formaPago, setFormaPago] = useState<string>('30 días contra recepción conforme y factura electrónica');

  // Descuento comercial (%)
  const [descuentoPct, setDescuentoPct] = useState<number>(0);

  // Valor UF referencial
  const [valorUF, setValorUF] = useState<number>(38500);

  // Partidas precargadas estilo Prodesk / tuEndpoint
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 'it-1',
      codigo: 'SRV-01',
      categoria: 'servicio',
      nombre: 'Instalación y puesta en marcha de paneles',
      descripcion: 'Montaje, cableado estructurado, fijaciones normadas y pruebas operativas.',
      cantidad: 5,
      unidad: 'Servicio',
      precioUnitarioNeto: 120000,
    },
    {
      id: 'it-2',
      codigo: 'MAT-02',
      categoria: 'hardware',
      nombre: 'Materiales y equipamiento técnico industrial',
      descripcion: 'Componentes de alta resistencia, soportes antivandálicos y protecciones eléctricas.',
      cantidad: 1,
      unidad: 'Unidad',
      precioUnitarioNeto: 750000,
    },
    {
      id: 'it-3',
      codigo: 'SRV-03',
      categoria: 'servicio',
      nombre: 'Mano de obra especializada e integración de software',
      descripcion: 'Horas de ingeniería senior en terreno, parametrización y pruebas de estrés.',
      cantidad: 3,
      unidad: 'Hora',
      precioUnitarioNeto: 80000,
    },
  ]);

  // Inicialización de fecha actual en cliente
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
  }, []);

  // Feedback y progreso de generación PDF
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  // Cálculos financieros en tiempo real
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

  // Manejo de partidas
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `${autoId}-${Date.now()}`,
        codigo: `SRV-${prev.length + 1}`,
        categoria: 'servicio',
        nombre: 'Nuevo producto o servicio',
        descripcion: 'Detalle técnico y especificación del servicio contratado.',
        cantidad: 1,
        unidad: 'Unidad',
        precioUnitarioNeto: 100000,
      },
    ]);
  };

  const handleAddFromCatalog = (codigo: string) => {
    const cat = CATALOG_ITEMS.find((c) => c.codigo === codigo);
    if (!cat) return;
    setItems((prev) => [
      ...prev,
      {
        ...cat,
        id: `${autoId}-cat-${Date.now()}`,
      },
    ]);
    notify(`Agregado: ${cat.nombre.split('—')[0].trim()}`);
  };

  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      notify('La cotización debe incluir al menos un producto o servicio.');
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Cargar plantilla completa (ej: Gestor Hospitalario, TICPanel, CajaYA)
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

  // Abrir y previsualizar PDF oficial en una pestaña nueva
  const handleOpenPdf = async () => {
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
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
                .card { text-align: center; padding: 2.5rem 2rem; border-radius: 12px; background: #1e293b; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                .spinner { width: 40px; height: 40px; border: 3px solid #334155; border-top-color: #10b981; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
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
      if (res?.blobUrl) {
        setLastPdfUrl(res.blobUrl);
      }
      notify('PDF oficial descargado con éxito');
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
    <div className="min-h-screen bg-[#F4F6F8] text-[#0F172A] font-sans antialiased flex flex-col lg:flex-row">
      {/* Toast Flotante */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          {lastPdfUrl && (
            <a
              href={lastPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2 inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-emerald-500 transition"
            >
              <span>Abrir PDF</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SIDEBAR ESTILO PRODESK                                             */}
      {/* =================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static no-print ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Prodesk Style */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded-md bg-[#059669] flex items-center justify-center text-white shadow-xs">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#0F172A]">
                tuEndpoint<span className="text-[#059669]">.</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menú de Navegación Lateral */}
          <nav className="p-3 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Inicio</span>
            </Link>

            {/* Pestaña Activa: Cotizaciones */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#ECFDF5] text-[#059669] transition">
              <FileText className="h-4 w-4 text-[#059669]" />
              <span>Cotizaciones</span>
            </div>

            <button
              type="button"
              onClick={() => notify('Módulo de Clientes sincronizado con ChileCompra.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <Users className="h-4 w-4 text-slate-400" />
              <span>Clientes</span>
            </button>

            <button
              type="button"
              onClick={() => notify('Catálogo de soluciones tuEndpoint precargado en las partidas.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <Package className="h-4 w-4 text-slate-400" />
              <span>Productos</span>
            </button>

            <button
              type="button"
              onClick={() => notify('Ficha técnica y bases de licitación activas.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Trabajos</span>
            </button>

            <button
              type="button"
              onClick={() => notify('Portal Mercado Público y Órdenes de Compra habilitadas.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <ShoppingCart className="h-4 w-4 text-slate-400" />
              <span>Compras</span>
            </button>

            <button
              type="button"
              onClick={() => notify('Control de hardware y kits de autoatención.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <Layers className="h-4 w-4 text-slate-400" />
              <span>Inventario</span>
            </button>

            <button
              type="button"
              onClick={() => notify('Métricas y exportación de reportes DTE SII.')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left"
            >
              <BarChart3 className="h-4 w-4 text-slate-400" />
              <span>Reportes</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar - Estado Legal ChileCompra */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-lg bg-emerald-50/70 p-3 border border-emerald-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-950">PROVEEDOR HÁBIL</span>
            </div>
            <p className="mt-1 text-[10px] text-emerald-800 leading-tight">
              ChileCompra · Mercado Público
              <br />
              RUT: 78.411.033-8
            </p>
          </div>
        </div>
      </aside>

      {/* Backdrop móvil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* =================================================================== */}
      {/* CONTENIDO PRINCIPAL                                                */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR ESTILO PRODESK */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between no-print sticky top-0 z-30">
          {/* Botón menú móvil + Buscador */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-700 lg:hidden rounded-md"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar clientes, cotizaciones..."
                aria-label="Buscar clientes o cotizaciones"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-[#059669] transition"
              />
            </div>
          </div>

          {/* Notificaciones y Perfil de Empresa */}
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            <button
              type="button"
              aria-label="Notificaciones"
              onClick={() => notify('No hay notificaciones pendientes.')}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                TE
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">SOLUCIONES TUENDPOINT</span>
                <span className="text-[10px] text-slate-400">RUT: 78.411.033-8</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* ÁREA DE TRABAJO - TARJETA PRODESK */}
        <main className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            {/* Título y Acciones de Cabecera */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Nueva cotización</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generador comercial y licitaciones de Estado · Folio: <span className="font-mono font-bold text-slate-800">{folio}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Selector rápido de plantilla */}
                <select
                  aria-label="Cargar plantilla"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectTemplate(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:border-[#059669]"
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
                  onClick={() => setShowDocModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                  title="Ver documento oficial formal A4"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Ver Hoja A4</span>
                </button>

                <button
                  type="button"
                  onClick={() => notify('Borrador guardado localmente.')}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  Guardar borrador
                </button>
              </div>
            </div>

            {/* FORMULARIO DE CABECERA (2 Columnas estilo Prodesk) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Cliente */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Cliente</label>
                <div className="relative">
                  <select
                    value={clienteNombre}
                    aria-label="Seleccionar cliente"
                    onChange={(e) => {
                      const sel = CLIENTES_PRECARGADOS.find((c) => c.nombre === e.target.value);
                      if (sel) {
                        setClienteNombre(sel.nombre);
                        setClienteRut(sel.rut);
                        setClienteContacto(sel.contacto);
                      } else {
                        setClienteNombre(e.target.value);
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-medium text-slate-800 focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669] transition"
                  >
                    {CLIENTES_PRECARGADOS.map((c) => (
                      <option key={c.nombre} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Fecha</label>
                <div className="relative">
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-medium text-slate-800 focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669] transition"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Validez de la oferta */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Validez de la oferta</label>
                <div className="relative">
                  <select
                    value={validezDias}
                    aria-label="Validez de la oferta"
                    onChange={(e) => setValidezDias(Number(e.target.value))}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-medium text-slate-800 focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669] transition"
                  >
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                    <option value={60}>60 días</option>
                    <option value={90}>90 días corridos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Moneda */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Moneda</label>
                <div className="relative">
                  <select
                    value={moneda}
                    aria-label="Moneda"
                    onChange={(e) => setMoneda(e.target.value as any)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-xs font-medium text-slate-800 focus:border-[#059669] focus:outline-none focus:ring-1 focus:ring-[#059669] transition"
                  >
                    <option value="CLP">Peso Chileno (CLP)</option>
                    <option value="UF">Unidad de Fomento (UF referencial)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* TABLA DE PRODUCTOS Y SERVICIOS ESTILO PRODESK */}
            <div className="pt-2">
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-3 px-4">Producto / Servicio</th>
                      <th className="py-3 px-3 text-center w-24">Cantidad</th>
                      <th className="py-3 px-4 text-right w-36">Precio unitario</th>
                      <th className="py-3 px-4 text-right w-36">Total</th>
                      <th className="py-3 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50/50 transition group">
                        {/* Descripción / Título */}
                        <td className="py-3 px-4 align-top">
                          <input
                            type="text"
                            value={it.nombre}
                            onChange={(e) => handleUpdateItem(it.id, 'nombre', e.target.value)}
                            className="w-full font-semibold text-slate-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 text-xs"
                          />
                          <input
                            type="text"
                            value={it.descripcion}
                            onChange={(e) => handleUpdateItem(it.id, 'descripcion', e.target.value)}
                            className="w-full text-[11px] text-slate-500 bg-transparent border-0 p-0 mt-0.5 focus:outline-none focus:ring-0"
                          />
                        </td>

                        {/* Cantidad */}
                        <td className="py-3 px-3 text-center align-top">
                          <input
                            type="number"
                            min="1"
                            value={it.cantidad}
                            onChange={(e) => handleUpdateItem(it.id, 'cantidad', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center font-bold text-slate-900 rounded border border-slate-200 py-1 text-xs focus:border-[#059669] focus:outline-none"
                          />
                        </td>

                        {/* Precio Unitario */}
                        <td className="py-3 px-4 text-right font-mono align-top">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-slate-400 text-[11px]">$</span>
                            <input
                              type="number"
                              step="5000"
                              value={it.precioUnitarioNeto}
                              onChange={(e) =>
                                handleUpdateItem(it.id, 'precioUnitarioNeto', Math.max(0, parseInt(e.target.value) || 0))
                              }
                              className="w-28 text-right font-mono text-slate-900 rounded border border-slate-200 py-1 px-1.5 text-xs focus:border-[#059669] focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Total Fila */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 align-top pt-3.5">
                          {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                        </td>

                        {/* Eliminar */}
                        <td className="py-3 px-2 text-center align-top pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="opacity-40 group-hover:opacity-100 text-rose-500 hover:text-rose-700 transition p-1"
                            title="Eliminar partida"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botón Agregar Producto o Servicio */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:text-[#047857] transition py-1 px-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar producto o servicio</span>
                </button>

                {/* Agregar desde catálogo oficial */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <select
                    aria-label="Insertar desde catálogo"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddFromCatalog(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="rounded border border-slate-200 bg-slate-50 py-1 px-2 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition focus:outline-none"
                  >
                    <option value="" disabled>
                      Insertar de Catálogo tuEndpoint...
                    </option>
                    {CATALOG_ITEMS.map((cat) => (
                      <option key={cat.codigo} value={cat.codigo}>
                        {cat.nombre.split('—')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE TOTALES ESTILO PRODESK */}
            <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Monto en palabras y notas legales */}
              <div className="flex-1 space-y-2 text-xs text-slate-500 max-w-md">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Monto Total en Palabras (Exigencia Bases Licitación)
                  </span>
                  <p className="mt-1 font-bold text-slate-900 italic leading-relaxed text-[11px]">
                    &ldquo;{totalPalabras}&rdquo;
                  </p>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>
                    Condición de pago: <strong>{formaPago}</strong>
                  </div>
                  {licitacionId && (
                    <div>
                      ID Licitación Mercado Público: <strong className="font-mono text-slate-700">{licitacionId}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarjeta de Cálculos Financieros */}
              <div className="w-full md:w-72 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 font-semibold">{formatCLP(subtotalNeto)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>IVA (19%)</span>
                  <span className="font-mono text-slate-900 font-semibold">{formatCLP(iva)}</span>
                </div>

                {/* Total Destacado en Píldora Verde Prodesk */}
                <div className="mt-2 rounded-lg bg-[#DCFCE7] px-4 py-2.5 flex items-center justify-between text-[#15803D] font-bold">
                  <span className="text-base">Total</span>
                  <span className="text-lg font-extrabold font-mono tracking-tight">{formatCLP(total)}</span>
                </div>

                {moneda === 'UF' && (
                  <div className="text-[11px] font-mono text-slate-500 text-right">
                    Equivalente aprox: <strong>{montoUF} UF</strong>
                  </div>
                )}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN PRINCIPALES ESTILO PRODESK */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setItems([
                    {
                      id: 'it-1',
                      codigo: 'SRV-01',
                      categoria: 'servicio',
                      nombre: 'Instalación y puesta en marcha de paneles',
                      descripcion: 'Montaje, cableado estructurado, fijaciones normadas y pruebas operativas.',
                      cantidad: 5,
                      unidad: 'Servicio',
                      precioUnitarioNeto: 120000,
                    },
                  ]);
                  notify('Cotización reiniciada.');
                }}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                Cancelar
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                  title="Copiar texto formal para el portal Mercado Público"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copiar Mercado Público</span>
                </button>

                <button
                  type="button"
                  onClick={printQuotation}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                  title="Imprimir o Guardar como PDF"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" />
                  <span>Imprimir</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs disabled:opacity-50"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Abrir PDF</span>
                </button>

                {/* Botón Principal Prominente Prodesk */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#059669] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#047857] transition shadow-sm disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>{isGenerating ? `Generando ${pdfProgress}%` : 'Enviar cotización (PDF)'}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =================================================================== */}
      {/* MODAL VISTA PREVIA HOJA A4 OFICIAL                                  */}
      {/* =================================================================== */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">
                  Vista Previa Hoja Oficial A4 · {folio}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPdf}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Abrir PDF
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="rounded-md bg-[#059669] px-3 py-1 text-xs font-bold text-white hover:bg-[#047857] transition"
                >
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
              {/* Documento mostrado dentro del modal */}
              <div className="bg-white p-8 sm:p-12 shadow-md max-w-[760px] w-full text-slate-900 text-xs">
                {/* Membrete */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div>
                    <div className="text-2xl font-extrabold text-[#0F172A]">
                      tuEndpoint<span className="text-[#059669]">.</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1 uppercase">
                      {TUENDPOINT_COMPANY.razonSocial}
                    </div>
                    <div className="text-[11px] font-mono text-slate-600">RUT: {TUENDPOINT_COMPANY.rut}</div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {TUENDPOINT_COMPANY.direccion}, {TUENDPOINT_COMPANY.ciudad} · {TUENDPOINT_COMPANY.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-slate-900">{folio}</div>
                    <div className="text-[11px] text-slate-500">Fecha: {formatFechaChile(fecha)}</div>
                    <div className="text-[11px] text-slate-500">Validez: {validezDias} días</div>
                  </div>
                </div>

                {/* Cliente */}
                <div className="mt-4 p-3 rounded bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Organismo / Cliente</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{clienteNombre}</div>
                  <div className="font-mono text-[11px] text-slate-600 mt-0.5">RUT: {clienteRut}</div>
                </div>

                {/* Tabla modal */}
                <div className="mt-4">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 font-bold text-slate-600">
                        <th className="py-2">Descripción</th>
                        <th className="py-2 text-center w-16">Cant.</th>
                        <th className="py-2 text-right w-24">Unitario</th>
                        <th className="py-2 text-right w-24">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((it) => (
                        <tr key={it.id}>
                          <td className="py-2.5">
                            <div className="font-semibold text-slate-900">{it.nombre}</div>
                            <div className="text-[10px] text-slate-500">{it.descripcion}</div>
                          </td>
                          <td className="py-2.5 text-center">{it.cantidad}</td>
                          <td className="py-2.5 text-right font-mono">{formatCLP(it.precioUnitarioNeto)}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                            {formatCLP(it.cantidad * it.precioUnitarioNeto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div className="mt-5 border-t border-slate-200 pt-4 flex justify-between items-start">
                  <div className="max-w-xs text-[10px] text-slate-500">
                    <p className="font-semibold text-slate-800 italic">&ldquo;{totalPalabras}&rdquo;</p>
                  </div>
                  <div className="w-52 space-y-1 text-right text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Neto:</span>
                      <span className="font-mono">{formatCLP(subtotalNeto)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>IVA (19%):</span>
                      <span className="font-mono">{formatCLP(iva)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-950 border-t border-slate-200 pt-1">
                      <span>Total:</span>
                      <span className="font-mono text-[#059669]">{formatCLP(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DOCUMENTO OFICIAL A4 PARA EXPORTACIÓN E IMPRESIÓN (OFFSCREEN DOM)  */}
      {/* =================================================================== */}
      <div
        id={docId}
        className="print-only-document mx-auto max-w-[820px] bg-white p-8 sm:p-12 border border-slate-200/90 shadow-sm text-slate-900 transition-all"
        style={{ minHeight: '1080px', position: 'absolute', left: '-99999px', top: '0' }}
      >
        {/* 1. MEMBRETE OFICIAL */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-200 pb-7">
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
              tuEndpoint<span className="text-[#059669]">.</span>
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

          {/* Recuadro de Cotización */}
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
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Referencia & Contratación
            </span>
            {licitacionId && (
              <div className="mt-0.5 inline-flex items-center gap-1.5 rounded bg-emerald-50 px-2 py-0.5 text-xs font-mono font-bold text-emerald-900 border border-emerald-200">
                ID: {licitacionId}
              </div>
            )}
            <div className="text-slate-700 mt-1">
              Modalidad: <strong>{modalidad}</strong>
            </div>
            <div className="text-slate-600 mt-0.5">Plazo: {plazoEntrega}</div>
            <div className="text-slate-600 mt-0.5">Garantía: {garantia}</div>
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
                <tr key={it.id} className="align-top">
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
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{it.descripcion}</p>
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
                <span className="font-mono text-[#059669]">{formatCLP(total)}</span>
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
            <div className="mx-auto mb-1 flex h-12 w-32 items-center justify-center rounded border border-dashed border-emerald-400 bg-emerald-50/40 text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
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
    </div>
  );
}
