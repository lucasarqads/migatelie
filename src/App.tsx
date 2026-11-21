import { useEffect, useRef, useState } from 'react';
import { Background, ScrollProgress } from './components/Background';
import { ContactSection } from './components/ContactSection';
import { FeatureMighome } from './components/FeatureMighome';
import { Footer } from './components/Footer';
import { GiftSection } from './components/GiftSection';
import { ProductsSection } from './components/ProductsSection';
import { Preloader } from './components/Preloader';
import { Profile } from './components/Profile';
import { ServicesCarousel } from './components/ServicesCarousel';
import { SmoothScroll } from './components/SmoothScroll';
import { EASE, gsap, ScrollTrigger, useGSAP } from './lib/gsap';
import { prefersReducedMotion } from './lib/utils';

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [showPreloader, setShowPreloader] = useState(() => !prefersReducedMotion());

  // Links desativados ('#'): o clique não leva a lugar nenhum (nem rola para o topo)
  useEffect(() => {
    const block = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href="#"]');
      if (link) e.preventDefault();
    };
    document.addEventListener('click', block);
    return () => document.removeEventListener('click', block);
  }, []);

  // Proteção básica de conteúdo: sem clique direito, seleção de texto ou arrastar imagens
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    const preventImgDrag = (e: DragEvent) => {
      if ((e.target as Element | null)?.closest?.('img, a')) e.preventDefault();
    };
    document.addEventListener('contextmenu', prevent);
    document.addEventListener('selectstart', prevent);
    document.addEventListener('dragstart', preventImgDrag);
    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('selectstart', prevent);
      document.removeEventListener('dragstart', preventImgDrag);
    };
  }, []);

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return;
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.current!.querySelectorAll<T>(sel));

      // ---------- Barra de progresso ----------
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      });

      // ---------- Entradas na rolagem (iniciadas quando a cortina sai) ----------
      const initScrollReveals = contextSafe!(() => {
        const introEls = new Set<Element>([...q('.hero-logo'), ...q('.agenda-btn'), ...q('#shareBtn')]);
        const pick = (sel: string) => q(sel).filter((el) => !introEls.has(el));

        const ups = pick('[data-reveal="up"]');
        gsap.set(ups, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(ups, {
          start: 'top 88%',
          once: true,
          interval: 0.08,
          batchMax: 4,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.09, ease: EASE.soft }),
        });

        q('[data-reveal="line"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 0, x: -14 });
          gsap.to(el, { autoAlpha: 1, x: 0, duration: 1.1, ease: EASE.soft, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });

        // Carrossel: cards em cascata vindo da direita
        const slides = q('.service-slide');
        gsap.set(slides, { autoAlpha: 0, x: 60 });
        gsap.to(slides, {
          autoAlpha: 1, x: 0, duration: 1.3, stagger: 0.08, ease: EASE.soft, clearProps: 'transform',
          scrollTrigger: { trigger: '.services', start: 'top 85%', once: true },
        });

        pick('[data-reveal="fade"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 0 });
          gsap.to(el, { autoAlpha: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
        });

        gsap.from('.feature-title .ch', {
          yPercent: 110, autoAlpha: 0, duration: 1, stagger: 0.022, ease: EASE.soft,
          scrollTrigger: { trigger: '.feature-title', start: 'top 85%', once: true },
        });

        ScrollTrigger.refresh();
      });

      // ---------- Abertura: preloader → capa → página ----------
      gsap.set('.preloader-letter', { yPercent: 110 });
      gsap.set('.hero-logo', { autoAlpha: 0, y: 24, scale: 0.92, filter: 'blur(10px)' });
      gsap.set('.agenda-btn', { autoAlpha: 0, y: 18, filter: 'blur(6px)' });
      gsap.set('#shareBtn', { autoAlpha: 0, scale: 0.8 });

      gsap
        .timeline({ defaults: { ease: EASE.silk } })
        .to('.preloader-letter', { yPercent: 0, duration: 1, stagger: 0.045 })
        .to('.preloader-letter', { yPercent: -110, duration: 0.7, stagger: 0.03, ease: 'power3.in' }, '+=.2')
        .to('.preloader-curtain', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.35')
        .fromTo('.preloader-cover', { scale: 1.2, yPercent: 4 }, { scale: 1.03, yPercent: 0, duration: 2.8, ease: 'power2.out' }, '<')
        .from('.preloader-line', { yPercent: 110, duration: 1.2, ease: EASE.soft }, '-=2')
        // Com a capa cobrindo a tela, o fundo da abertura sai para a página aparecer por trás
        .set('.preloader', { backgroundColor: 'transparent', backgroundImage: 'none' })
        .set('.preloader-bg-noise', { autoAlpha: 0 })
        .to('.preloader-caption', { yPercent: -60, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, '+=.6')
        .addLabel('reveal', '-=.2')
        .to('.preloader-curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' }, 'reveal')
        .to('.preloader-cover', { scale: 1.12, yPercent: -10, duration: 1.2, ease: 'expo.inOut' }, 'reveal')
        // Hero entra enquanto a cortina ainda sobe
        .to('.hero-logo', { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: EASE.soft }, 'reveal+=.55')
        .to('.agenda-btn', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: EASE.soft }, 'reveal+=.75')
        .to('#shareBtn', { autoAlpha: 1, scale: 1, duration: 1, ease: EASE.soft }, 'reveal+=.9')
        .add(initScrollReveals, 'reveal+=.6')
        .add(() => {
          gsap.set(['.hero-logo', '.agenda-btn'], { clearProps: 'filter' });
          setShowPreloader(false);
        });

      // Recalcula posições quando imagens e fontes terminarem de carregar
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener('load', refresh);
    },
    { scope: root },
  );

  return (
    <SmoothScroll>
      <div ref={root}>
        {showPreloader && <Preloader />}
        <ScrollProgress />
        <Background />

        <main className="mx-auto flex w-full max-w-[520px] flex-col items-center px-4 pb-[calc(24px+env(safe-area-inset-bottom))] tab:max-w-[680px] tab:px-6 lg:grid lg:max-w-[1180px] lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-8 xxl:max-w-[1280px] xxl:grid-cols-[380px_minmax(0,1fr)] xxl:gap-16 max-[360px]:px-3">
          <Profile />

          <div className="flex w-full flex-col gap-16 tab:gap-20 lg:pt-16 lg:pb-8 short:gap-14 short:pt-10">
            <ServicesCarousel />
            <FeatureMighome />
            <GiftSection />
            <ProductsSection />
            <ContactSection />
            <Footer />
          </div>
        </main>
      </div>
    </SmoothScroll>
  );
}
