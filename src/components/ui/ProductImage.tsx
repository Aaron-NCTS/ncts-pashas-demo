import { Scissors, Sparkles, Package, Hand, Footprints, ShoppingBag } from 'lucide-react';
import type { ProductCategory } from '../../types';

const ICONS: Record<ProductCategory, typeof Scissors> = {
  'Tijeras profesionales': Scissors,
  'Tijeras de corte': Scissors,
  'Tijeras de entresacar': Scissors,
  'Kits de barbería': Package,
  'Manicure': Hand,
  'Pedicure': Footprints,
  'Kits de belleza': Sparkles,
  'Accesorios profesionales': ShoppingBag,
};

/**
 * Ficha visual tipo "estudio fotográfico": fondo con viñeta suave, pedestal
 * con sombra y el icono del producto en gran formato con acabado dorado —
 * pensado para parecer una fotografía de producto de catálogo real, no un
 * gradiente decorativo. No se usan fotografías reales porque el cliente no
 * proporcionó material fotográfico de producto.
 */
export function ProductImage({ category, className = '' }: { gradient?: string; category: ProductCategory; className?: string }) {
  const Icon = ICONS[category] ?? Sparkles;
  return (
    <div className={`relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,_#2A2420_0%,_#171310_62%,_#100E0C_100%)] ${className}`}>
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55)' }} />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 16px)' }}
      />
      <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 w-[58%] h-[14%] rounded-full bg-black/50 blur-md" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-[38%] h-[38%] text-gold-400 drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)]" strokeWidth={1.1} />
      </div>
      <img src="/brand/pasha-badge-mini.png" alt="" aria-hidden className="absolute bottom-2 right-2 w-6 h-6 opacity-70" />
    </div>
  );
}
