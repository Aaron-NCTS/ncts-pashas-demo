// ============================================================================
// brand.ts — Configuración central de marca
// ----------------------------------------------------------------------------
// Toda la identidad específica del cliente vive aquí. El resto de la
// aplicación consume estos valores y nunca debe tener textos ni datos de
// marca "hardcodeados". Para reutilizar esta plantilla con otro
// distribuidor/mayorista, basta con crear un nuevo objeto BrandConfig y
// apuntar `brand` hacia él.
// ============================================================================

export interface BrandConfig {
  companyName: string;
  legalName: string;
  tagline: string;
  taglineEs: string;
  logoText: string;
  emblem: 'lion' | 'none';
  colors: {
    bg: string;
    surface: string;
    ink: string;
    gold: string;
    goldDark: string;
    goldLight: string;
    ivory: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    email: string;
    city: string;
    country: string;
    address?: string;
  };
  currency: {
    code: string;
    symbol: string;
    locale: string;
  };
  country: string;
  social?: {
    instagram?: string;
    facebook?: string;
  };
  orderPrefix: string; // ej. PSH-MX-
  quotePrefix: string; // ej. COT-
}

export const pashaBrand: BrandConfig = {
  companyName: "PASHA'S",
  legalName: 'PASHA GROUP S.A.S & C.V.',
  tagline: 'Professional tools for professionals.',
  taglineEs: 'Herramientas profesionales para profesionales.',
  logoText: "PASHA'S",
  emblem: 'lion',
  colors: {
    bg: '#100E0C',
    surface: '#171310',
    ink: '#100E0C',
    gold: '#B08D3F',
    goldDark: '#6B5122',
    goldLight: '#D9BD79',
    ivory: '#F3EEE4',
  },
  contact: {
    phone: '+525565414158',
    phoneDisplay: '+52 55 6541 4158',
    whatsapp: '525565414158',
    email: 'pashagroupmex@gmail.com',
    city: 'Ciudad de México',
    country: 'México',
  },
  currency: {
    code: 'MXN',
    symbol: '$',
    locale: 'es-MX',
  },
  country: 'México',
  orderPrefix: 'PSH-MX-',
  quotePrefix: 'COT-',
};

// Punto único de import para el resto de la app.
// Cambiar esta línea es lo único necesario para "reetiquetar" la plantilla.
export const brand: BrandConfig = pashaBrand;

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(brand.currency.locale, {
    style: 'currency',
    currency: brand.currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}
