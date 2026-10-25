import { NextResponse } from 'next/server';
import { brand } from '@/lib/config/brand';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const contact = String(body?.contact ?? '').trim();
    const topic = String(body?.topic ?? 'Consulta general').trim();
    const message = String(body?.message ?? '').trim();

    if (name.length < 2 || contact.length < 4 || message.length < 4) {
      return NextResponse.json({ ok: false, error: 'Datos incompletos' }, { status: 400 });
    }

    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, topic, message, source: 'tuendpoint.web', at: new Date().toISOString() }),
      }).catch(() => null);
    }

    // Intento de envío directo por correo vía FormSubmit AJAX (sin requerir llaves en servidor)
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(brand.email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `[tuEndpoint] ${topic} — ${name}`,
        Nombre: name,
        Contacto: contact,
        Tema: topic,
        Mensaje: message,
      }),
    }).catch(() => null);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Solicitud inválida' }, { status: 400 });
  }
}
