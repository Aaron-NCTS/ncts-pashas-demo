import { useApp } from '../../store/AppContext';

export function Toaster() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-enter rounded-sm px-4 py-3 text-sm shadow-lg border ${
            t.tone === 'success' ? 'bg-ink-950 text-ivory-100 border-gold-500/40' :
            t.tone === 'error' ? 'bg-oxblood-600 text-ivory-50 border-oxblood-500' :
            'bg-ink-900 text-ivory-100 border-ink-700'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
