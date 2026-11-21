import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { MIGHOME_URL } from '../data/content';
import { useMagnetic, usePressFeedback } from '../hooks/useInteractions';
import { gsap, useGSAP } from '../lib/gsap';
import { asset, linkProps, prefersReducedMotion } from '../lib/utils';

const TITLE = 'Aromatizador Mighome';

const bubbles = [
  { size: 18, style: { left: '18%', bottom: '40%' } },
  { size: 10, style: { left: '26%', bottom: '70%' } },
  { size: 14, style: { right: '20%', bottom: '55%' } },
  { size: 8, style: { right: '28%', bottom: '80%' } },
];

/** Destaque do produto: parallax do frasco, brilho pulsando e bolhas subindo. */
export function FeatureMighome() {
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);
  useMagnetic(btn);
  const press = usePressFeedback();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo('.feature-img', { yPercent: 25, rotate: -6 }, {
        yPercent: -4, rotate: 3, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom 40%', scrub: 1 },
      });
      gsap.to('.feature-glow', { scale: 1.25, opacity: 0.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.utils.toArray<HTMLElement>('.bubble').forEach((b) => {
        gsap.to(b, {
          y: () => gsap.utils.random(-50, -110),
          x: () => gsap.utils.random(-18, 18),
          opacity: 0,
          duration: () => gsap.utils.random(3, 5.5),
          repeat: -1,
          repeatRefresh: true,
          ease: 'sine.out',
          delay: Math.random() * 2,
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="t-feature"
      data-reveal="up"
      className="glass relative w-full overflow-hidden rounded-[28px] px-[22px] pt-9 text-center tab:grid tab:grid-cols-2 tab:items-center tab:gap-3 tab:px-8 tab:pt-8 tab:text-left lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pt-9 max-[360px]:px-4 max-[360px]:pt-[30px]"
    >
      <div className="relative z-[1] tab:pb-8">
        <div className="mb-2.5 font-display text-[13px] font-medium lowercase text-peach">linha casa</div>
        <h2 id="t-feature" className="feature-title mb-2.5 font-serif text-[clamp(28px,7.5vw,34px)] leading-[1.1] font-semibold text-cream">
          {TITLE.split(' ').map((word, w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom">
              {[...word].map((c, i) => (
                <span key={i} className="ch inline-block">{c}</span>
              ))}
              {w < TITLE.split(' ').length - 1 && ' '}
            </span>
          ))}
        </h2>
        <p className="mx-auto mb-5 max-w-[330px] text-[14.5px] leading-relaxed text-cream-soft tab:mx-0">
          Onde a leveza se conecta à sensação de estar em uma casa de praia.
        </p>
        <a
          ref={btn}
          {...linkProps(MIGHOME_URL)}
          onPointerDown={press}
          className="glass-brand shine relative inline-flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-bold text-cream no-underline"
        >
          <span className="relative z-[1] inline-flex items-center gap-2">
            Quero o meu <ArrowRight size={16} strokeWidth={2.2} />
          </span>
        </a>
      </div>

      <div className="relative mt-[18px] h-[300px] tab:mt-0 tab:h-80 lg:h-[300px] short:h-[260px] max-[360px]:h-[250px]">
        <div className="feature-glow absolute bottom-[30px] left-1/2 size-[230px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(217_176_138/0.8),transparent_70%)]" />
        {bubbles.map((b, i) => (
          <span key={i} className="bubble" style={{ width: b.size, height: b.size, ...b.style }} />
        ))}
        <img
          src={asset('images/products/homespray.png')}
          alt="Frasco do aromatizador Mighome"
          loading="lazy"
          className="feature-img absolute bottom-0 left-1/2 w-[250px] max-w-[80%] -translate-x-1/2 drop-shadow-[0_24px_30px_rgb(80_50_25/0.3)]"
        />
      </div>
    </section>
  );
}
