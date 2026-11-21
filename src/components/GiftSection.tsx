import { useRef } from 'react';
import { Gift } from 'lucide-react';
import { whatsappLink } from '../data/content';
import { useMagnetic, usePressFeedback } from '../hooks/useInteractions';
import { gsap, useGSAP } from '../lib/gsap';
import { asset, linkProps, prefersReducedMotion } from '../lib/utils';
import { SectionTitle } from './SectionTitle';

/**
 * Vale presente: cartão 3D com frente e verso.
 *
 * Estrutura (de fora para dentro):
 *   stage    → perspectiva 3D
 *   floater  → flutuação contínua (sobe/desce + leve balanço)
 *   card     → giro em Y (360° na entrada, 180° ao tocar)
 *     face frente / face verso (rotacionada 180°, costas ocultas)
 *
 * Na entrada (ao rolar até a seção) o cartão surge girando 360° — mostrando o verso
 * no meio do giro — desacelera, para de frente e começa a flutuar.
 * Tocar/clicar no cartão vira para o verso e de volta.
 */
export function GiftSection() {
  const stage = useRef<HTMLDivElement>(null);
  const flipped = useRef(false);
  const busy = useRef(true);
  const cta = useRef<HTMLAnchorElement>(null);
  useMagnetic(cta);
  const press = usePressFeedback();

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) {
        busy.current = false;
        return;
      }

      gsap.set('.gift-card', { rotationY: 0 });
      gsap.set('.gift-floater', { autoAlpha: 0, y: 140, scale: 0.7, rotationX: 28 });
      gsap.set('.gift-shadow', { autoAlpha: 0, scaleX: 0.4 });

      const float = () => {
        // Flutuação contínua (y) + balanço sutil (x/z), sem sincronia para parecer natural
        gsap.to('.gift-floater', { y: -12, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.fromTo('.gift-floater', { rotationZ: -1.5, rotationX: 4 }, { rotationZ: 1.5, rotationX: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.gift-shadow', { scaleX: 0.82, autoAlpha: 0.35, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        busy.current = false;
      };

      gsap
        .timeline({
          scrollTrigger: { trigger: stage.current, start: 'top 80%', once: true },
          onComplete: float,
        })
        .to('.gift-floater', { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 0)
        .to('.gift-floater', { y: 0, scale: 1, rotationX: 0, duration: 2.4, ease: 'expo.out' }, 0)
        // Giro de 360°: acelera, passa pelo verso e desacelera suave até parar de frente
        .to('.gift-card', { rotationY: 360, duration: 2.8, ease: 'power2.inOut' }, 0.1)
        .to('.gift-shadow', { autoAlpha: 0.55, scaleX: 1, duration: 2.2, ease: 'expo.out' }, 0.2)
        .set('.gift-card', { rotationY: 0 });
    },
    { scope: stage },
  );

  // Virar o cartão ao tocar/clicar
  const flip = contextSafe(() => {
    if (busy.current || prefersReducedMotion()) return;
    flipped.current = !flipped.current;
    gsap.to('.gift-card', { rotationY: flipped.current ? 180 : 0, duration: 1.1, ease: 'power3.inOut' });
  });

  const face = 'absolute inset-0 size-full rounded-[18px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]';

  return (
    <section aria-labelledby="t-gift" className="w-full">
      <SectionTitle id="t-gift">Vale presente</SectionTitle>

      <div ref={stage} className="relative flex justify-center pt-4 pb-8 [perspective:1200px]">
        {/* Sombra no "chão" */}
        <div className="gift-shadow absolute bottom-1 left-1/2 h-6 w-[70%] max-w-[300px] -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl" />

        <div className="gift-floater relative w-[min(340px,88%)] [transform-style:preserve-3d] lg:w-[400px]">
          <button
            type="button"
            onClick={flip}
            aria-label="Cartão presente Migateliê: toque para ver o verso"
            className="gift-card relative block aspect-[420/264] w-full cursor-pointer [transform-style:preserve-3d] focus-visible:outline-offset-8"
          >
            <img
              src={asset('images/gift/cartao-frente.png')}
              alt="Cartão presente Migateliê — vale R$ 300 para serviços, cursos e produtos Mighome"
              className={`${face} drop-shadow-[0_24px_40px_rgb(40_12_0/0.45)]`}
            />
            <img
              src={asset('images/gift/cartao-verso.png')}
              alt="Verso do cartão: use seu vale em serviços, cursos e produtos Mighome. Válido por 45 dias."
              className={`${face} [transform:rotateY(180deg)] drop-shadow-[0_24px_40px_rgb(40_12_0/0.45)]`}
            />
          </button>
        </div>
      </div>

      <div data-reveal="up" className="flex justify-center pt-2">
        <a
          ref={cta}
          {...linkProps(whatsappLink('Olá! Quero presentear alguém com um vale presente Migateliê 🎁'))}
          onPointerDown={press}
          className="glass-brand shine relative inline-flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-bold text-cream no-underline"
        >
          <span className="relative z-[1] inline-flex items-center gap-2">
            <Gift size={16} strokeWidth={2.2} />
            Presentear
          </span>
        </a>
      </div>
    </section>
  );
}
