import { useEffect, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { gsap } from '../lib/gsap';
import { hasFinePointer, prefersReducedMotion } from '../lib/utils';

/** Botão "magnético": segue levemente o cursor (apenas mouse). */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, strength]);
}

/** Inclinação 3D seguindo o cursor (apenas mouse). */
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, max = 14) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;

    gsap.set(el, { transformPerspective: 700 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * max);
      rx(-((e.clientY - r.top) / r.height - 0.5) * max);
    };
    const leave = () => { rx(0); ry(0); };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref, max]);
}

/**
 * Feedback de toque: onda (ripple) no ponto clicado + leve "aperto" em telas touch.
 * Retorna o handler para usar em onPointerDown.
 */
export function usePressFeedback() {
  return (e: ReactPointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;

    const dot = document.createElement('span');
    dot.className = 'pointer-events-none absolute z-0 rounded-full bg-white/50';
    Object.assign(dot.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${e.clientX - r.left}px`,
      top: `${e.clientY - r.top}px`,
    });
    el.appendChild(dot);
    gsap.fromTo(dot, { xPercent: -50, yPercent: -50, scale: 0, opacity: 1 }, {
      scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => dot.remove(),
    });

    if (!hasFinePointer()) {
      gsap.to(el, { scale: 0.97, duration: 0.18, ease: 'power2.out' });
      const release = () => {
        gsap.to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, .5)' });
        el.removeEventListener('pointerup', release);
        el.removeEventListener('pointercancel', release);
        el.removeEventListener('pointerleave', release);
      };
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('pointerleave', release);
    }
  };
}
