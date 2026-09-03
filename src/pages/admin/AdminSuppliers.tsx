import { SectionHeading, Card, Badge } from '../../components/ui/primitives';
import { useLanguage } from '../../i18n/LanguageContext';

// Proveedores ficticios únicamente para fines de demostración del módulo.
// Nombres y contactos genéricos, sin relación con proveedores reales de
// PASHA GROUP ni con su dominio o correo corporativo real.
const SUPPLIERS = [
  { name: 'Proveedor Demo — Tijeras y Kits', category: 'Tijeras y kits de barbería', contact: 'compras@proveedor-demo.mx', status: 'Activo', leadTime: '15-20 días' },
  { name: 'Proveedor Demo — Insumos de Afilado', category: 'Insumos para afilado', contact: 'ventas@proveedor-demo.mx', status: 'Activo', leadTime: '7-10 días' },
  { name: 'Proveedor Demo — Manicure y Pedicure', category: 'Kits de manicure y pedicure', contact: 'contacto@proveedor-demo.mx', status: 'Activo', leadTime: '20-25 días' },
  { name: 'Proveedor Demo — Empaque y Estuches', category: 'Estuches y empaque', contact: 'pedidos@proveedor-demo.mx', status: 'Inactivo', leadTime: '10 días' },
];

export function AdminSuppliers() {
  const { t } = useLanguage();
  return (
    <div>
      <SectionHeading title={t('admin.suppliers.title')} description={t('admin.suppliers.description')} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-950/10 text-left text-xs text-ink-700 uppercase tracking-wide">
              <th className="px-4 py-3">{t('admin.suppliers.supplier')}</th><th className="px-4 py-3">{t('admin.suppliers.category')}</th><th className="px-4 py-3">{t('admin.suppliers.contact')}</th>
              <th className="px-4 py-3">{t('admin.suppliers.leadTime')}</th><th className="px-4 py-3">{t('admin.suppliers.status')}</th>
            </tr>
          </thead>
          <tbody>
            {SUPPLIERS.map((s) => (
              <tr key={s.name} className="border-b border-ink-950/5 last:border-0">
                <td className="px-4 py-3 text-ink-950 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-ink-700">{s.category}</td>
                <td className="px-4 py-3 text-ink-700">{s.contact}</td>
                <td className="px-4 py-3 text-ink-700">{s.leadTime}</td>
                <td className="px-4 py-3">{s.status === 'Activo' ? <Badge tone="green">{t('common.active')}</Badge> : <Badge tone="neutral">{t('common.inactive')}</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-ink-700/70 mt-4">
        {t('admin.suppliers.note')}
      </p>
    </div>
  );
}
