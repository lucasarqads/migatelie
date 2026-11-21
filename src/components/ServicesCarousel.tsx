import { useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, FreeMode, Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { services } from '../data/content';
import { useTilt } from '../hooks/useInteractions';
import { asset, linkProps } from '../lib/utils';
import { SectionTitle } from './SectionTitle';

type Service = (typeof services)[number];

function ServiceCard({ service }: { service: Service }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [broken, setBroken] = useState(false);
  useTilt(ref);

  return (
    <a
      ref={ref}
      {...linkProps(service.href)}
      aria-label={`Agendar ${service.name}`}
      className="group glass flex h-full flex-col rounded-[18px] p-2 no-underline will-change-transform [transform-style:preserve-3d] fine:hover:glass-glow"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-linear-135 from-[#d9b08a] to-brand after:absolute after:inset-0 after:bg-linear-to-t after:from-[rgb(35_22_12/0.72)] after:via-[rgb(35_22_12/0.15)] after:via-55% after:to-transparent after:content-['']">
        {service.tag && (
          <span className="glass-sm absolute top-2.5 left-2.5 z-[1] rounded-full px-[9px] py-1 font-display text-[10.5px] font-medium lowercase text-cream">
            {service.tag}
          </span>
        )}
        {!broken && (
          <img
            src={asset(service.image)}
            alt={`Resultado de ${service.name}`}
            loading="lazy"
            onError={() => setBroken(true)}
            style={{
              ...(service.focus && { objectPosition: service.focus, transformOrigin: service.focus }),
              // zoom base por serviço (multiplica o leve zoom padrão e o do hover)
              ...(service.zoom && ({ '--zoom': service.zoom } as CSSProperties)),
            }}
            className="size-full scale-[calc(var(--zoom,1)*1.06)] object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[calc(var(--zoom,1)*1.14)]"
          />
        )}
        <span className="absolute right-3.5 bottom-3.5 left-3.5 z-[1] font-serif text-xl leading-[1.1] text-white">{service.name}</span>
      </div>

      <div className="flex items-center justify-end px-1.5 pt-3 pb-1 text-cream">
        <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
      </div>
    </a>
  );
}

const navBtn =
  'glass-brand grid size-[38px] cursor-pointer place-items-center rounded-full text-cream transition-[background,opacity] duration-300';

export function ServicesCarousel() {
  return (
    <section aria-labelledby="t-services" className="services w-full">
      <div className="flex items-center gap-3">
        <SectionTitle id="t-services">
          Nossos serviços
        </SectionTitle>
        <div className="swiper-nav mb-5 hidden gap-2 lg:flex" aria-label="Navegar serviços">
          <button type="button" className={`swiper-prev ${navBtn}`} aria-label="Serviço anterior">
            <ArrowLeft size={18} strokeWidth={2.2} />
          </button>
          <button type="button" className={`swiper-next ${navBtn}`} aria-label="Próximo serviço">
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[FreeMode, Pagination, Navigation, Keyboard, A11y]}
        slidesPerView="auto"
        spaceBetween={12}
        grabCursor
        speed={700}
        freeMode={{ enabled: true, sticky: true, momentumRatio: 0.6 }}
        pagination={{ clickable: true }}
        navigation={{ prevEl: '.swiper-prev', nextEl: '.swiper-next' }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        watchOverflow
        breakpoints={{ 1024: { spaceBetween: 16, freeMode: { enabled: false } } }}
        a11y={{ prevSlideMessage: 'Anterior', nextSlideMessage: 'Próximo' }}
        className="services-swiper -mx-4 px-4! pt-1.5 pb-[34px]! tab:-mx-6 tab:px-6! lg:mx-0 lg:px-0.5! lg:[mask-image:linear-gradient(90deg,#000_85%,transparent)] max-[360px]:-mx-3 max-[360px]:px-3!"
      >
        {services.map((service) => (
          <SwiperSlide key={service.name} className="service-slide h-auto! w-[214px]! tab:w-[230px]! lg:w-[220px]! xxl:w-[240px]! max-[360px]:w-[190px]!">
            <ServiceCard service={service} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
