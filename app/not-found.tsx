import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-body-s uppercase tracking-widest text-muted">404</p>
          <h1 className="display-l mt-4 text-ink">Página no encontrada</h1>
          <p className="mt-4 body-l text-ink-soft">
            La página que buscas no existe o fue movida.
          </p>
          <Link
            href="/"
            className="mt-12 inline-flex h-14 items-center rounded-md bg-ink px-7 text-body-m font-medium text-paper transition-colors hover:bg-accent"
          >
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}
