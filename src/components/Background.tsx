import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { asset, prefersReducedMotion } from '../lib/utils';

/** Fundo fixo em degradê marrom com granulado e "respiração" lenta. */
export function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.to(ref.current, { scale: 1.08, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-[#7a3a17] bg-cover bg-center"
      style={{ backgroundImage: `url(${asset('images/backgrounds/marrom.jpg')})` }}
    >
      <div className="noise absolute inset-0 opacity-25 mix-blend-overlay" />
    </div>
  );
}

/** Barra fina de progresso de rolagem no topo. */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="scroll-progress fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-linear-to-r from-brand-2 to-brand"
    />
  );
}
