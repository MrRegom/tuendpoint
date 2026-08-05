'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2 } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Reveal } from '@/components/motion/Reveal';
import { sectors } from '@/lib/data/sectors';
import { brand } from '@/lib/config/brand';
import { cn } from '@/lib/utils/cn';

const schema = z.object({
  name: z.string().min(2, 'Requerido'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'Requerido'),
  phone: z.string().optional(),
  sector: z.string().min(1, 'Requerido'),
  message: z.string().min(10, 'Mínimo 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations('contacto');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('sending');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log('Form data:', data);
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-surface py-section-y relative z-10">
      <div className="mx-auto w-full max-w-container-wide px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column */}
          <Reveal className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0EA5E9] mb-4 block">
              Escríbenos
            </span>
            <h2 className="text-display-m text-ink text-balance font-bold tracking-tight mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-body-m text-ink-soft text-pretty leading-relaxed mb-10">
              Cuéntanos qué necesitas. No importa si no tienes todo claro todavía, nosotros te ayudamos a ordenar la idea.
            </p>

            {/* Trust builders — con líneas horizontales */}
            <div className="mb-10 divide-y divide-border">
              <p className="text-sm text-ink py-3">Consultar es completamente gratis</p>
              <p className="text-sm text-ink py-3">Sin compromiso ni contrato</p>
              <p className="text-sm text-ink py-3">Te respondemos en menos de 24 horas</p>
              <p className="text-sm text-ink py-3">Tus datos son confidenciales</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Email</p>
                <a href={`mailto:${brand.email}`} className="text-sm text-ink hover:text-[#0EA5E9] transition-colors">
                  {brand.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Teléfono / WhatsApp</p>
                <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="text-sm text-ink hover:text-[#0EA5E9] transition-colors">
                  {brand.phone}
                </a>
              </div>
            </div>
          </Reveal>



          {/* Right Column (Form Card) */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="bg-paper p-8 md:p-10 rounded-sm border border-border">
              <h3 className="text-h3 font-bold text-ink mb-2">Cuéntanos tu idea</h3>
              <p className="text-sm text-muted mb-8">Es gratis consultar. Te respondemos en menos de 24 horas.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-ink-soft mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="Tu nombre"
                      className={cn(
                        'block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors',
                        'focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]',
                        errors.name && 'border-red-500'
                      )}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-ink-soft mb-1.5">
                      Correo *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="tu@empresa.cl"
                      className={cn(
                        'block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors',
                        'focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]',
                        errors.email && 'border-red-500'
                      )}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-ink-soft mb-1.5">
                      Empresa *
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register('company')}
                      placeholder="Tu empresa"
                      className={cn(
                        'block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors',
                        'focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]',
                        errors.company && 'border-red-500'
                      )}
                    />
                    {errors.company && <p className="mt-1.5 text-xs text-red-600">{errors.company.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-ink-soft mb-1.5">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="+56 9 XXXX XXXX"
                      className="block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold text-ink-soft mb-1.5">
                    ¿En qué te podemos ayudar? *
                  </label>
                  <select
                    id="sector"
                    {...register('sector')}
                    className={cn(
                      'block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors appearance-none',
                      'focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]',
                      errors.sector && 'border-red-500'
                    )}
                    defaultValue=""
                  >
                    <option value="" disabled>Elige una opción...</option>
                    <option value="software-medida">Quiero un programa a medida</option>
                    <option value="automatizacion">Quiero automatizar procesos manuales</option>
                    <option value="salud">Sistema para clínica u hospital</option>
                    <option value="educacion">Sistema para colegio o universidad</option>
                    <option value="retail">Sistema de caja / punto de venta</option>
                    <option value="integracion">Conectar sistemas que ya tengo</option>
                    <option value="otro">Otro (lo cuento en el mensaje)</option>
                  </select>
                  {errors.sector && <p className="mt-1.5 text-xs text-red-600">{errors.sector.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-ink-soft mb-1.5">
                    Cuéntanos brevemente qué necesitas *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    placeholder="No te preocupes si no tienes todo claro, cuéntanos la idea y te ayudamos a darle forma..."
                    className={cn(
                      'block w-full rounded-sm border border-border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors resize-y',
                      'focus:border-[#0EA5E9] focus:bg-paper focus:outline-none focus:ring-1 focus:ring-[#0EA5E9]',
                      errors.message && 'border-red-500'
                    )}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || status === 'sending'}
                    className="w-full flex h-12 items-center justify-center gap-2 rounded-sm bg-[#0EA5E9] text-sm font-bold text-white transition-all hover:bg-[#0284c7] disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Enviando...' : 'Enviar consulta — Es gratis'}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">Sin compromiso. Nadie te va a cobrar por consultar.</p>

                  {status === 'success' && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-success bg-success/10 p-3 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                      Mensaje enviado correctamente.
                    </div>
                  )}
                  {status === 'error' && (
                    <p className="mt-4 text-sm text-center text-red-600">Hubo un error. Inténtalo más tarde.</p>
                  )}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
