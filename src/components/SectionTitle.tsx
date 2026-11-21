import type { ReactNode } from 'react';

type Props = { id: string; children: ReactNode; count?: number };

/** Título de seção com tipografia display (Unbounded) e linha decorativa. */
export function SectionTitle({ id, children, count }: Props) {
  return (
    <h2
      id={id}
      data-reveal="line"
      className="mb-5 flex w-full flex-1 items-center gap-3 pl-0.5 font-display text-[15px] font-medium lowercase tracking-[-0.3px] text-cream [text-shadow:0_1px_10px_rgb(40_12_0/0.3)] after:h-px after:flex-1 after:bg-linear-to-r after:from-cream/40 after:to-transparent after:content-[''] max-[360px]:text-sm"
    >
      {children}
      {count !== undefined && <span className="text-xs font-normal tracking-normal text-cream-soft">· {count}</span>}
    </h2>
  );
}
