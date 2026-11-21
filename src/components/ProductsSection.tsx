import { useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Sparkles, Ticket } from 'lucide-react';
import { products, type Product } from '../data/content';
import { usePressFeedback } from '../hooks/useInteractions';
import { EASE, gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { asset, cn, linkProps, prefersReducedMotion } from '../lib/utils';
import { SectionTitle } from './SectionTitle';

/** Foto do produto (ou ícone, se não houver foto). */
function ProductThumb({ product, className, imgClassName }: { product: Product; className?: string; imgClassName?: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className={cn('relative grid shrink-0 place-items-center overflow-hidden bg-white/[0.06] shadow-[inset_1px_1px_0_rgb(255_255_255/0.18)]', className)}>
      {product.image && !broken ? (
        <img src={asset(product.image)} alt="" loading="lazy" onError={() => setBroken(true)} className={cn('object-contain', imgClassName)} />
      ) : (
        <Sparkles size={22} strokeWidth={1.6} className="text-peach" />
      )}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const press = usePressFeedback();

  return (
    <a
      {...linkProps(product.href)}
      onPointerDown={press}
      aria-label={`Ver produto: ${product.name}`}
      className="product-card group glass relative isolate flex items-center gap-4 overflow-hidden rounded-[22px] p-3 pr-4 text-cream no-underline transition-[translate,box-shadow] duration-500 ease-out-expo fine:hover:-translate-y-1 fine:hover:glass-glow"
    >
      <ProductThumb
        product={product}
        className="size-[88px] rounded-2xl max-[360px]:size-[76px]"
        imgClassName="size-[84%] drop-shadow-[0_8px_12px_rgb(40_12_0/0.35)] transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:-rotate-3"
      />

      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="mb-1 font-display text-[11px] font-medium lowercase text-peach">{product.category}</span>
        <span className="mb-1 text-[15px] leading-tight font-semibold text-cream">{product.name}</span>
        <span className="line-clamp-2 text-[12.5px] leading-snug text-cream-soft">{product.description}</span>

        <span className="mt-2.5 flex items-center justify-between gap-2">
          {product.coupon ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-cream/50 px-2 py-0.5 font-display text-[10.5px] font-medium tracking-wide text-cream">
              <Ticket size={12} strokeWidth={2} /> {product.coupon}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1.5 font-display text-[11.5px] font-medium lowercase text-cream">
            ver produto
            <ArrowRight size={14} strokeWidth={2.2} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </span>
        </span>
      </span>
    </a>
  );
}

/**
 * Indicações de produtos: um card-resumo que, ao ser tocado, expande e revela o grid.
 * Os produtos ficam em src/data/content.ts (products).
 */
export function ProductsSection() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const press = usePressFeedback();

  const { contextSafe } = useGSAP({ scope: root });

  const toggle = contextSafe(() => {
    const el = panel.current;
    if (!el) return;
    const next = !open;
    setOpen(next);

    if (prefersReducedMotion()) {
      gsap.set(el, { height: next ? 'auto' : 0 });
      ScrollTrigger.refresh();
      return;
    }

    gsap.killTweensOf(el);
    if (next) {
      gsap.fromTo(el, { height: el.offsetHeight }, {
        height: 'auto', duration: 0.75, ease: 'power3.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
      gsap.fromTo(el.querySelectorAll('.product-card'), { autoAlpha: 0, y: 28, scale: 0.97 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.08, ease: EASE.soft, delay: 0.15,
      });
    } else {
      gsap.to(el.querySelectorAll('.product-card'), { autoAlpha: 0, y: -10, duration: 0.3, stagger: 0.03, ease: 'power2.in' });
      gsap.to(el, {
        height: 0, duration: 0.6, ease: 'power3.inOut', delay: 0.1,
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  });

  const preview = products.slice(0, 3);

  return (
    <section ref={root} aria-labelledby="t-products" className="w-full">
      <SectionTitle id="t-products">Minhas indicações</SectionTitle>

      {/* Card-resumo (abre/fecha o grid) */}
      <button
        type="button"
        data-reveal="up"
        onClick={toggle}
        onPointerDown={press}
        aria-expanded={open}
        aria-controls={panelId}
        className="group glass relative isolate flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-[22px] p-4 text-left text-cream transition-[translate,box-shadow] duration-500 ease-out-expo fine:hover:-translate-y-1 fine:hover:glass-glow"
      >
        {/* Fotos sobrepostas */}
        <span className="flex shrink-0 -space-x-5 pl-0.5 tab:-space-x-4">
          {preview.map((p) => (
            <ProductThumb
              key={p.name}
              product={p}
              className="size-12 rounded-full border border-white/20 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 tab:size-14"
              imgClassName="size-[78%]"
            />
          ))}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="mb-0.5 font-display text-[11px] font-medium lowercase text-peach">eu uso e recomendo</span>
          <span className="text-[15px] leading-tight font-semibold">Ver indicações</span>
          <span className="text-[12.5px] text-cream-soft">{products.length} favoritos para usar em casa</span>
        </span>

        <span
          aria-hidden="true"
          className={cn(
            'glass-brand grid size-[38px] shrink-0 place-items-center rounded-full transition-[rotate,background] duration-500 ease-out-expo',
            open && 'rotate-180',
          )}
        >
          <ChevronDown size={18} strokeWidth={2.2} />
        </span>
      </button>

      {/* Grid de produtos (expande abaixo do card) */}
      <div ref={panel} id={panelId} inert={!open} className="-mx-2 h-0 overflow-hidden px-2">
        <div className="grid gap-4 pt-4 pb-3 tab:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
