import { useId } from 'react';

/** Logo da Horzone (SVG original com o enquadramento recortado ao desenho). */
function HorzoneLogo({ className }: { className?: string }) {
  // id único para o degradê não colidir com outros SVGs da página
  const gradId = useId();
  return (
    <svg viewBox="200 150 400 510" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradId} x1="30%" y1="10%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="45%" stopColor="#0066ff" />
          <stop offset="100%" stopColor="#0033cc" />
        </linearGradient>
      </defs>
      <circle cx="400" cy="300" r="150" fill={`url(#${gradId})`} />
      <path d="M 200 460 A 200 200 0 0 0 600 460 Z" fill={`url(#${gradId})`} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer data-reveal="fade" className="-mt-4 mb-6 flex flex-col items-center gap-1.5 text-xs text-cream-soft tab:-mt-6 lg:items-start">
      <a href="#" className="inline-flex items-center gap-1.5 font-semibold text-cream no-underline hover:underline">
        <HorzoneLogo className="h-3.5 w-auto shrink-0" />
        Horzone tecnologia
      </a>
      <span>© {new Date().getFullYear()} Migateliê</span>
    </footer>
  );
}
