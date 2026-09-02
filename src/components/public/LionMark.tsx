// Recreación vectorial estilizada del emblema de león de PASHA'S — mismo
// concepto visual (perfil de león dorado con melena radiante y estrella)
// que el logo de referencia del cliente. No es el archivo original: al
// pasar a producción, sustituir por el logo oficial en /public/brand/.

export function LionMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M30 46 C24 40, 18 34, 10 32" opacity="0.55" />
        <path d="M32 40 C27 32, 22 25, 14 20" opacity="0.7" />
        <path d="M37 35 C33 26, 30 18, 24 11" opacity="0.85" />
        <path d="M44 32 C42 22, 41 13, 38 5" />
      </g>
      <path
        d="M44 32 C52 28 62 29 69 36 C75 42 78 50 76 58 C82 57 87 60 89 65 C84 66 80 68 78 72 C74 68 68 67 63 69 C56 72 47 71 41 65 C36 60 34 53 36 46 C38 40 41 35 44 32 Z"
        fill="currentColor"
      />
      <circle cx="72" cy="47" r="2.4" fill="#100E0C" />
      <path d="M79 51 L86 49 L80 54 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function StarMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z" />
    </svg>
  );
}
