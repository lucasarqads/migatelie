import { useEffect, useState } from 'react';
import { Share } from 'lucide-react';
import { cn } from '../lib/utils';

/** Compartilha a página (menu nativo no celular) ou copia o link, com aviso. */
export function ShareButton() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const share = async () => {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(location.href);
      setToast('Link copiado ✨');
    } catch {
      /* compartilhamento cancelado */
    }
  };

  return (
    <>
      <button
        id="shareBtn"
        type="button"
        onClick={share}
        aria-label="Compartilhar página"
        className="glass-brand grid size-[42px] cursor-pointer place-items-center rounded-full text-cream transition-[background,box-shadow] duration-300"
      >
        <Share size={18} strokeWidth={2} />
      </button>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed bottom-[calc(24px+env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-[18px] py-3 text-[13px] font-medium text-white shadow-2xl transition-all duration-500 ease-out-expo',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-[140%] opacity-0',
        )}
      >
        {toast}
      </div>
    </>
  );
}
