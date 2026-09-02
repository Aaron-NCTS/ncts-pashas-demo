import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { SectionHeading, Card, Field, inputClass, Button } from '../../components/ui/primitives';

export function ClientProfile() {
  const { session, showToast } = useApp();
  const [name, setName] = useState(session?.name ?? '');
  const [company, setCompany] = useState(session?.companyName ?? '');
  const [email, setEmail] = useState(session?.email ?? '');

  function save(e: React.FormEvent) {
    e.preventDefault();
    showToast('Perfil actualizado', 'success');
  }

  return (
    <div>
      <SectionHeading title="Mi perfil" />
      <Card className="p-8 max-w-lg">
        <form onSubmit={save}>
          <Field label="Nombre"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Empresa"><input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
          <Field label="Correo"><input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Rol">
            <input disabled className={`${inputClass} bg-ink-950/5`} value={session?.role === 'distributor' ? 'Distribuidor' : 'Cliente'} />
          </Field>
          <Button type="submit">Guardar cambios</Button>
        </form>
      </Card>
    </div>
  );
}
