import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { SectionHeading, Card, Button, Field, inputClass } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { useApp } from '../../store/AppContext';
import { useState } from 'react';

export function Contact() {
  const { showToast } = useApp();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    showToast('Mensaje enviado', 'success');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <SectionHeading eyebrow="Contacto" title="Hablemos" description="Escríbenos para cotizaciones, dudas sobre productos o para iniciar tu proceso como distribuidor." />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Card className="p-5 flex items-center gap-4">
            <Phone className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">Teléfono</p><p className="text-sm font-medium text-ink-950">{brand.contact.phoneDisplay}</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <Mail className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">Correo</p><p className="text-sm font-medium text-ink-950">{brand.contact.email}</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">Ubicación</p><p className="text-sm font-medium text-ink-950">{brand.contact.city}, {brand.contact.country}</p></div>
          </Card>
          <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="w-full"><MessageCircle className="w-4 h-4" /> Escribir por WhatsApp</Button>
          </a>
        </div>

        <Card className="p-8">
          {sent ? (
            <p className="text-sm text-ink-700">Gracias por escribirnos, te contactaremos pronto.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field label="Nombre"><input required className={inputClass} /></Field>
              <Field label="Correo"><input required type="email" className={inputClass} /></Field>
              <Field label="Mensaje"><textarea required rows={5} className={inputClass} /></Field>
              <Button type="submit" className="w-full">Enviar mensaje</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
