import { useState } from 'react';
import { CheckCircle2, TrendingUp, Percent, Clock, Headset, History, BookOpen } from 'lucide-react';
import { SectionHeading, Button, Field, inputClass, Card } from '../../components/ui/primitives';
import { submitDistributorApplication } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import { BUSINESS_TYPE_LABEL, labelFor } from '../../i18n/statusLabels';
import type { BusinessType } from '../../types';
import { useApp } from '../../store/AppContext';

const BUSINESS_TYPES: BusinessType[] = ['Barbería', 'Salón', 'Distribuidor', 'Tienda', 'Academia', 'E-commerce', 'Otro'];

export function Distributors() {
  const { showToast } = useApp();
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', companyName: '', city: '', state: '', country: 'México', phone: '', whatsapp: '', email: '',
    businessType: 'Barbería' as BusinessType, volume: '20-50 piezas/mes', message: '',
  });

  const BENEFITS = [
    { icon: Percent, title: t('pages.distributors.benefit1Title'), desc: t('pages.distributors.benefit1Desc') },
    { icon: TrendingUp, title: t('pages.distributors.benefit2Title'), desc: t('pages.distributors.benefit2Desc') },
    { icon: Clock, title: t('pages.distributors.benefit3Title'), desc: t('pages.distributors.benefit3Desc') },
    { icon: Headset, title: t('pages.distributors.benefit4Title'), desc: t('pages.distributors.benefit4Desc') },
    { icon: History, title: t('pages.distributors.benefit5Title'), desc: t('pages.distributors.benefit5Desc') },
    { icon: BookOpen, title: t('pages.distributors.benefit6Title'), desc: t('pages.distributors.benefit6Desc') },
  ];

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.companyName || !form.email) {
      showToast(t('pages.distributors.requiredFieldsError'), 'error');
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
          <p className="text-gold-400 text-sm mb-3">{t('pages.distributors.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{t('pages.distributors.title')}</h1>
          <p className="text-ivory-300 max-w-xl mx-auto">{t('pages.distributors.subtitle')}</p>
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
              <p className="font-display text-2xl text-ink-950 mb-2">{t('pages.distributors.applicationReceivedTitle')}</p>
              <p className="text-sm text-ink-700 max-w-sm mx-auto">
                {t('pages.distributors.applicationReceivedMsg')}
              </p>
            </Card>
          ) : (
            <Card className="p-8">
              <SectionHeading title={t('pages.distributors.formTitle')} description={t('pages.distributors.formDesc')} />
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-x-6">
                  <Field label={t('pages.distributors.fullName')}><input required className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.company')}><input required className={inputClass} value={form.companyName} onChange={(e) => update('companyName', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.city')}><input className={inputClass} value={form.city} onChange={(e) => update('city', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.state')}><input className={inputClass} value={form.state} onChange={(e) => update('state', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.country')}><input className={inputClass} value={form.country} onChange={(e) => update('country', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.phone')}><input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.whatsapp')}><input className={inputClass} value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.email')}><input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
                  <Field label={t('pages.distributors.businessType')}>
                    <select className={inputClass} value={form.businessType} onChange={(e) => update('businessType', e.target.value as BusinessType)}>
                      {BUSINESS_TYPES.map((bt) => <option key={bt} value={bt}>{labelFor(BUSINESS_TYPE_LABEL, bt, lang)}</option>)}
                    </select>
                  </Field>
                  <Field label={t('pages.distributors.approxVolume')}>
                    <select className={inputClass} value={form.volume} onChange={(e) => update('volume', e.target.value)}>
                      <option>20-50 piezas/mes</option>
                      <option>50-100 piezas/mes</option>
                      <option>100+ piezas/mes</option>
                    </select>
                  </Field>
                </div>
                <Field label={t('pages.distributors.message')}>
                  <textarea rows={4} className={inputClass} value={form.message} onChange={(e) => update('message', e.target.value)} />
                </Field>
                <Button type="submit" size="lg" disabled={loading} className="w-full">
                  {loading ? t('pages.distributors.sending') : t('pages.distributors.submit')}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
