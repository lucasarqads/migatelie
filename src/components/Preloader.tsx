import { asset } from '../lib/utils';

/**
 * Tela de abertura. A animação é orquestrada pela timeline de intro em App.tsx
 * (classes preloader-* servem de alvo para o GSAP).
 */
export function Preloader() {
  return (
    <div
      className="preloader fixed inset-0 z-[100] grid place-items-center bg-[#7a3a17] bg-cover bg-center"
      style={{ backgroundImage: `url(${asset('images/backgrounds/marrom.jpg')})` }}
      aria-hidden="true"
    >
      {/* Mesmo fundo da página: degradê marrom + granulado */}
      <div className="preloader-bg-noise noise absolute inset-0 opacity-25 mix-blend-overlay" />
      <div className="relative flex overflow-hidden font-serif text-[clamp(34px,9vw,52px)] text-cream [text-shadow:0_2px_20px_rgb(40_12_0/0.35)]">
        {[...'Migateliê'].map((char, i) => (
          <span key={i} className="preloader-letter inline-block">
            {char}
          </span>
        ))}
      </div>

      <div className="preloader-curtain absolute inset-0 overflow-hidden bg-brand [clip-path:inset(100%_0_0_0)]">
        <img
          src={asset('images/brand/capamig.jpg')}
          alt=""
          fetchPriority="high"
          className="preloader-cover absolute inset-0 size-full object-cover object-[60%_25%] will-change-transform tab:object-[58%_30%]"
        />
        <div className="preloader-shade absolute inset-0" />
        <div className="preloader-caption absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-cream [text-shadow:0_2px_18px_rgb(40_22_10/0.4)]">
          <span className="block overflow-hidden">
            <span className="preloader-line inline-block whitespace-nowrap font-serif text-[clamp(15px,1.9vw,26px)] leading-tight">
              muito além de sobrancelhas, <em className="italic">é arte.</em>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
