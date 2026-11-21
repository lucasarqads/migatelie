import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Curvas padrão do projeto: suaves, sem "quique". */
export const EASE = {
  soft: 'power4.out',
  silk: 'expo.out',
} as const;

export { gsap, ScrollTrigger, useGSAP };
