import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { SectionHeading, Card, Field, inputClass, Button } from '../../components/ui/primitives';

export function ClientProfile() {
  const { session, showToast } = useApp();
  const { t } = useLanguage();
  const [name, setName] = useState(session?.name ?? '');
  const [company, setCompany] = useState(session?.companyName ?? '');
  const [email, setEmail] = useState(session?.email ?? '');

  function save(e: React.FormEvent) {
    e.preventDefault();
    showToast(t('client.profile.updatedToast'), 'success');
  }

  return (
    <div>
      <SectionHeading title={t('client.profile.title')} />
      <Card className="p-8 max-w-lg">
        <form onSubmit={save}>
          <Field label={t('client.profile.name')}><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label={t('client.profile.company')}><input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
          <Field label={t('client.profile.email')}><input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label={t('client.profile.role')}>
            <input disabled className={`${inputClass} bg-ink-950/5`} value={session?.role === 'distributor' ? t('client.profile.roleDistributor') : t('client.profile.roleClient')} />
          </Field>
          <Button type="submit">{t('client.profile.save')}</Button>
        </form>
      </Card>
    </div>
  );
}
