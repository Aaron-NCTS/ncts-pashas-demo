import { SectionHeading, Card } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { PashaGroupBadge } from '../../components/public/PashaLogo';

export function About() {
  return (
    <div>
      <section className="bg-ink-950 text-ivory-50 py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <PashaGroupBadge className="w-20 h-20 mx-auto mb-5" />
          <p className="text-gold-400 text-sm mb-3">Nosotros</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{brand.legalName}</h1>
          <p className="text-ivory-300 max-w-xl mx-auto">Herramientas para barbería y belleza profesional, distribuidas en {brand.country}.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <SectionHeading title="Quiénes somos" />
        <p className="text-sm text-ink-700 leading-relaxed mb-6">
          {brand.companyName} es una marca de herramientas para barbería y belleza profesional:
          tijeras de corte, tijeras de entresacar, kits de barbería, e instrumentos de manicure y pedicure.
          Ofrece catálogo para distribuidores y compradores mayoristas en México.
        </p>
        <p className="text-sm text-ink-700 leading-relaxed mb-10">
          Esta plataforma es una demostración comercial desarrollada por NovaCore Tech Solutions (NCTS) para mostrar
          cómo {brand.companyName} podría operar su distribución mayorista en México a través de un ecosistema digital
          integral: catálogo, portal de distribuidores y panel administrativo.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">Especializado</p>
            <p className="text-xs text-ink-700">Productos para profesionales del sector barbería y belleza.</p>
          </Card>
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">Mayorista</p>
            <p className="text-xs text-ink-700">Condiciones comerciales pensadas para distribuidores.</p>
          </Card>
          <Card className="p-6">
            <p className="font-display text-2xl text-ink-950 mb-1">México</p>
            <p className="text-xs text-ink-700">Venta y distribución mayorista en el país.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
