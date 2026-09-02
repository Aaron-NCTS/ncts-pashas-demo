import { useState } from 'react';
import { LionMark } from './LionMark';

// ============================================================================
// Logos oficiales de PASHA'S / PASHA GROUP, provistos por el cliente
// (public/brand/pasha-logo-main.png y pasha-logo-badge.png).
// El <LionMark /> vectorial queda ÚNICAMENTE como fallback si la imagen no
// carga — no se usa como diseño principal.
// ============================================================================

/** Logotipo horizontal completo: león + wordmark "PASHA'S". Para espacios
 * amplios (header público, footer, login). */
export function PashaLogo({ className = '' }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <LionMark className="h-full w-auto text-gold-400" />
        <span className="font-display text-current">PASHA'S</span>
      </span>
    );
  }
  return (
    <img
      src="/brand/pasha-logo-main.png"
      alt="PASHA'S"
      className={className}
      style={{ objectFit: 'contain' }}
      onError={() => setFailed(true)}
    />
  );
}

/** Sello circular "PASHA GROUP S.A.S & C.V." — para contextos corporativos
 * y espacios compactos/cuadrados (sidebars, favicon-like, sellos). */
export function PashaGroupBadge({ className = '' }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <LionMark className={className + ' text-gold-400'} />;
  }
  return (
    <img
      src="/brand/pasha-logo-badge.png"
      alt="PASHA GROUP"
      className={className}
      style={{ objectFit: 'contain' }}
      onError={() => setFailed(true)}
    />
  );
}
