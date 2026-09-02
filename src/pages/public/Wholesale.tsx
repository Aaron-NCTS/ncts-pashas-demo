import { Link } from 'react-router-dom';
import { SectionHeading, Button, Card } from '../../components/ui/primitives';

const TIERS = [
  { range: '1–5 unidades', desc: 'Precio de lista' },
  { range: '6–20 unidades', desc: '~7% de descuento' },
  { range: '21–50 unidades', desc: '~14% de descuento' },
  { range: '50+ unidades', desc: '~22% de descuento' },
];

export function Wholesale() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
      <SectionHeading
        eyebrow="Mayoreo"
        title="Venta al por mayor para tu negocio"
        description="PASHA'S ofrece condiciones especiales para compras en volumen, pensadas para barberías, salones, academias y tiendas de belleza."
      />
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-sm text-ink-700 leading-relaxed mb-6">
            Nuestro modelo de mayoreo escala automáticamente según la cantidad de piezas por pedido.
            Los distribuidores registrados acceden además a precio preferencial permanente en todo el catálogo.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {TIERS.map((t) => (
              <Card key={t.range} className="p-4">
                <p className="text-xs text-ink-700 mb-1">{t.range}</p>
                <p className="font-display text-lg text-ink-950">{t.desc}</p>
              </Card>
            ))}
          </div>
          <p className="text-xs text-ink-700/70 mb-6">Escalas demostrativas. El descuento final se confirma en cotización formal.</p>
          <div className="flex gap-3">
            <Link to="/distribuidores"><Button>Solicitar ser distribuidor</Button></Link>
            <Link to="/productos"><Button variant="secondary">Ver catálogo</Button></Link>
          </div>
        </div>
        <Card className="p-8 bg-ink-950 text-ivory-100 border-none">
          <p className="font-display text-xl mb-4">¿Cómo funciona?</p>
          <ol className="space-y-4 text-sm text-ivory-300">
            <li><span className="text-gold-400 font-medium">1.</span> Solicita tu cotización mayorista desde el catálogo o el portal de distribuidores.</li>
            <li><span className="text-gold-400 font-medium">2.</span> Nuestro equipo comercial revisa el volumen y confirma el precio final.</li>
            <li><span className="text-gold-400 font-medium">3.</span> Aceptas la cotización y damos seguimiento a tu pedido hasta la entrega.</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
