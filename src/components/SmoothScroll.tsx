import { useEffect, useRef, type ReactNode } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/utils';

/** Rolagem suave (Lenis) sincronizada com o relógio do GSAP/ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off('scroll', ScrollTrigger.update);
    };
  }, []);

  if (prefersReducedMotion()) return <>{children}</>;

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 }}>
      {children}
    </ReactLenis>
  );
}
