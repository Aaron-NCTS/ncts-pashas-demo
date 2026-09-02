import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { SectionHeading, Card, Button, Field, inputClass } from '../../components/ui/primitives';
import { brand } from '../../config/brand';
import { resetDemoData } from '../../services/db';
import { useApp } from '../../store/AppContext';

export function AdminSettings() {
  const { showToast } = useApp();
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    resetDemoData();
    showToast('Datos de demostración restablecidos', 'success');
    setConfirming(false);
    setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div>
      <SectionHeading title="Configuración" description="Datos de marca, ambiente de demostración y preferencias generales." />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-ink-950 mb-4">Datos de marca</p>
          <Field label="Nombre comercial"><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.companyName} /></Field>
          <Field label="Razón social"><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.legalName} /></Field>
          <Field label="Correo de contacto"><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.contact.email} /></Field>
          <Field label="Teléfono"><input disabled className={`${inputClass} bg-ink-950/5`} value={brand.contact.phoneDisplay} /></Field>
          <p className="text-xs text-ink-700/70">Estos datos se editan desde <code className="bg-ink-950/5 px-1 rounded-sm">src/config/brand.ts</code> — punto único de configuración de la plantilla.</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-ink-950 mb-2">Datos de demostración</p>
          <p className="text-sm text-ink-700 mb-6 leading-relaxed">
            Todos los pedidos, clientes, cotizaciones y movimientos de esta demo se almacenan en el navegador (localStorage).
            Puedes restablecerlos en cualquier momento para volver al estado inicial.
          </p>
          {!confirming ? (
            <Button variant="danger" onClick={() => setConfirming(true)}><RotateCcw className="w-4 h-4" /> Restablecer datos de demostración</Button>
          ) : (
            <div className="bg-oxblood-500/10 rounded-sm p-4">
              <p className="text-sm text-oxblood-600 mb-3">Esto borrará todos los cambios hechos en esta demo (pedidos nuevos, clientes, etc.) y regenerará los datos originales. ¿Confirmar?</p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleReset}>Sí, restablecer</Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancelar</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
