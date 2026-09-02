import { useState } from 'react';
import { CheckCircle2, TrendingUp, Percent, Clock, Headset, History, BookOpen } from 'lucide-react';
import { SectionHeading, Button, Field, inputClass, Card } from '../../components/ui/primitives';
import { submitDistributorApplication } from '../../services/api';
import type { BusinessType } from '../../types';
import { useApp } from '../../store/AppContext';

const BUSINESS_TYPES: BusinessType[] = ['Barbería', 'Salón', 'Distribuidor', 'Tienda', 'Academia', 'E-commerce', 'Otro'];

const BENEFITS = [
  { icon: Percent, title: 'Precios mayoristas', desc: 'Acceso a lista de precios preferenciales en todo el catálogo.' },
  { icon: TrendingUp, title: 'Descuentos por volumen', desc: 'Escalas de descuento adicionales según el tamaño de cada pedido.' },
  { icon: Clock, title: 'Acceso anticipado', desc: 'Prioridad en el lanzamiento de nuevos productos y ediciones.' },
  { icon: Headset, title: 'Atención comercial', desc: 'Ejecutivo de cuenta dedicado para tu negocio.' },
  { icon: History, title: 'Seguimiento de pedidos', desc: 'Visibilidad completa del estatus de cada envío.' },
  { icon: BookOpen, title: 'Catálogo digital', desc: 'Catálogo actualizado y material de venta para tu equipo.' },
];

export function Distributors() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', companyName: '', city: '', state: '', country: 'México', phone: '', whatsapp: '', email: '',
    businessType: 'Barbería' as BusinessType, volume: '20-50 piezas/mes', message: '',
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.companyName || !form.email) {
      showToast('Completa los campos obligatorios', 'error');
      return;
    }
    setLoading(true);
    await submitDistributorApplication(form);
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div>
      <section className="bg-ink-950 text-ivory-50 py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <p className="text-gold-400 text-sm mb-3">Programa de distribuidores</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Conviértete en distribuidor PASHA'S</h1>
          <p className="text-ivory-300 max-w-xl mx-auto">Súmate a la red de barberías, salones y tiendas que distribuyen herramientas profesionales PASHA'S en México.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6">
              <Icon className="w-6 h-6 text-gold-500 mb-3" strokeWidth={1.5} />
              <p className="font-medium text-ink-950 text-sm mb-1.5">{title}</p>
              <p className="text-xs text-ink-700 leading-relaxed">{desc}</p>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <Card className="p-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-signal-green mx-auto mb-4" strokeWidth={1.3} />
              <p className="font-display text-2xl text-ink-950 mb-2">Solicitud recibida</p>
              <p className="text-sm text-ink-700 max-w-sm mx-auto">
                Gracias por tu interés en distribuir PASHA'S. Nuestro equipo comercial revisará tu solicitud y se pondrá en contacto contigo pronto.
              </p>
            </Card>
          ) : (
            <Card className="p-8">
              <SectionHeading title="Solicitar ser distribuidor" description="Completa el formulario y nuestro equipo comercial te contactará." />
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-x-6">
                  <Field label="Nombre completo *"><input required className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
                  <Field label="Empresa *"><input required className={inputClass} value={form.companyName} onChange={(e) => update('companyName', e.target.value)} /></Field>
                  <Field label="Ciudad"><input className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} /></Field>
                  <Field label="Estado"><input className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)} /></Field>
                  <Field label="País"><input className={inputClass} value={form.country} onChange={(e) => update('country', e.target.value)} /></Field>
                  <Field label="Teléfono"><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
                  <Field label="WhatsApp"><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></Field>
                  <Field label="Correo *"><input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
                  <Field label="Tipo de negocio">
                    <select className={inputClass} value={form.businessType} onChange={(e) => update('businessType', e.target.value as BusinessType)}>
                      {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Volumen aproximado de compra">
                    <select className={inputClass} value={form.volume} onChange={(e) => update('volume', e.target.value)}>
                      <option>20-50 piezas/mes</option>
                      <option>50-100 piezas/mes</option>
                      <option>100+ piezas/mes</option>
                    </select>
                  </Field>
                </div>
                <Field label="Mensaje">
                  <textarea rows={4} className={inputClass} value={form.message} onChange={(e) => update('message', e.target.value)} />
                </Field>
                <Button type="submit" size="lg" disabled={loading} className="w-full">
                  {loading ? 'Enviando...' : 'Solicitar ser distribuidor'}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
