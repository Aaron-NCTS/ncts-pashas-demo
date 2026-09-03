import { useLanguage } from '../../i18n/LanguageContext';

/** Selector compacto ES/EN. `tone="dark"` para fondos oscuros (sidebars/header oscuro del sitio público),
 * `tone="light"` para headers claros (admin/portal). */
export function LanguageToggle({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const { lang, setLang } = useLanguage();
  const base = 'flex items-center rounded-sm border text-[11px] font-medium overflow-hidden focus-ring';
  const toneClass = tone === 'dark'
    ? 'border-ivory-100/20'
    : 'border-ink-950/15';

  function optionClass(active: boolean) {
    if (tone === 'dark') {
      return active ? 'bg-gold-500 text-ink-950' : 'text-ivory-300 hover:text-ivory-50';
    }
    return active ? 'bg-ink-950 text-ivory-50' : 'text-ink-700 hover:text-ink-950';
  }

  return (
    <div className={`${base} ${toneClass} ${className}`} role="group" aria-label="Idioma / Language">
      <button onClick={() => setLang('es')} className={`px-2 py-1 transition-colors ${optionClass(lang === 'es')}`}>ES</button>
      <button onClick={() => setLang('en')} className={`px-2 py-1 transition-colors ${optionClass(lang === 'en')}`}>EN</button>
    </div>
  );
}
