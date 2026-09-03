import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { SectionHeading, Card, Button, Field, inputClass } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useState } from 'react';

export function Contact() {
  const { showToast } = useApp();
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    showToast(t('pages.contact.sentToast'), 'success');
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <SectionHeading eyebrow={t('pages.contact.eyebrow')} title={t('pages.contact.title')} description={t('pages.contact.description')} />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Card className="p-5 flex items-center gap-4">
            <Phone className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">{t('pages.contact.phone')}</p><p className="text-sm font-medium text-ink-950">{brand.contact.phoneDisplay}</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <Mail className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">{t('pages.contact.email')}</p><p className="text-sm font-medium text-ink-950">{brand.contact.email}</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
            <div><p className="text-xs text-ink-700">{t('pages.contact.location')}</p><p className="text-sm font-medium text-ink-950">{brand.contact.city}, {brand.contact.country}</p></div>
          </Card>
          <a href={`https://wa.me/${brand.contact.whatsapp}`} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="w-full"><MessageCircle className="w-4 h-4" /> {t('pages.contact.writeWhatsApp')}</Button>
          </a>
        </div>

        <Card className="p-8">
          {sent ? (
            <p className="text-sm text-ink-700">{t('pages.contact.thanks')}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field label={t('pages.contact.name')}><input required className={inputClass} /></Field>
              <Field label={t('pages.contact.email')}><input required type="email" className={inputClass} /></Field>
              <Field label={t('pages.contact.message')}><textarea required rows={5} className={inputClass} /></Field>
              <Button type="submit" className="w-full">{t('pages.contact.send')}</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
