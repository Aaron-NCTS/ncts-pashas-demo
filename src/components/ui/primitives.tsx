import React from 'react';

// ---------------------------------------------------------------------------
export function Button({
  variant = 'primary', size = 'md', className = '', children, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg' }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 focus-ring disabled:opacity-40 disabled:cursor-not-allowed rounded-sm';
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-6 py-3' };
  const variants = {
    primary: 'bg-gold-500 text-ink-950 hover:bg-gold-400',
    secondary: 'bg-transparent border border-gold-500/60 text-gold-500 hover:bg-gold-500/10',
    ghost: 'bg-transparent text-ink-900 hover:bg-ink-950/5',
    danger: 'bg-oxblood-500 text-ivory-50 hover:bg-oxblood-600',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-white border border-ink-950/10 rounded-md ${className}`}>{children}</div>;
}

// ---------------------------------------------------------------------------
export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gold'; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    neutral: 'bg-ink-950/5 text-ink-700',
    green: 'bg-signal-green/10 text-signal-green',
    amber: 'bg-signal-amber/10 text-signal-amber',
    red: 'bg-signal-red/10 text-signal-red',
    blue: 'bg-signal-blue/10 text-signal-blue',
    gold: 'bg-gold-500/15 text-gold-600',
  };
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

// ---------------------------------------------------------------------------
export function EmptyState({ title, message, action }: { title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-ink-950/15 rounded-md">
      <p className="font-display text-lg text-ink-900 mb-1">{title}</p>
      <p className="text-sm text-ink-700 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} />;
}

// ---------------------------------------------------------------------------
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-ivory-50 rounded-md w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[88vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-950/10 sticky top-0 bg-ivory-50">
          <h3 className="font-display text-lg text-ink-950">{title}</h3>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink-700 hover:text-ink-950 text-xl leading-none focus-ring rounded-sm px-1">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function KpiCard({ label, value, sub, trend }: { label: string; value: string; sub?: string; trend?: 'up' | 'down' | 'flat' }) {
  const trendColor = trend === 'up' ? 'text-signal-green' : trend === 'down' ? 'text-signal-red' : 'text-ink-700';
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-ink-700/70 mb-2">{label}</p>
      <p className="font-display text-2xl text-ink-950">{value}</p>
      {sub && <p className={`text-xs mt-1.5 ${trendColor}`}>{sub}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-ink-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const inputClass = 'w-full border border-ink-950/15 rounded-sm px-3 py-2 text-sm bg-white focus-ring focus:border-gold-500 outline-none';

// ---------------------------------------------------------------------------
export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-sm text-gold-500 mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl text-ink-950 mb-2">{title}</h2>
      {description && <p className="text-ink-700 max-w-xl">{description}</p>}
    </div>
  );
}
