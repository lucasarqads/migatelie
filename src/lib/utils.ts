/** Caminho de arquivos da pasta /public respeitando o `base` do Vite. */
export const asset = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

/**
 * Atributos de link: só abre em nova aba quando o destino é externo (http/https).
 * Links '#' ficam na mesma página e não abrem abas novas.
 */
export const linkProps = (href: string) =>
  /^https?:\/\//.test(href) ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };

/** Junta classes condicionais. */
export const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
