import { useRef } from 'react';
import { CalendarDays } from 'lucide-react';
import { AGENDA_URL } from '../data/content';
import { useMagnetic, usePressFeedback } from '../hooks/useInteractions';
import { asset, linkProps } from '../lib/utils';
import { ShareButton } from './ShareButton';

/** Painel do perfil: logo e botão de agendamento. */
export function Profile() {
  const agenda = useRef<HTMLAnchorElement>(null);
  useMagnetic(agenda);
  const press = usePressFeedback();

  return (
    <aside className="w-full lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center lg:py-6 short:py-4 [@media(min-width:64rem)_and_(max-height:620px)]:static [@media(min-width:64rem)_and_(max-height:620px)]:h-auto">
      <div className="flex w-full flex-col items-center lg:px-6 lg:py-7 short:px-[22px] short:py-5">
        <div className="flex w-full justify-end pt-4 lg:-mb-[18px] lg:pt-0">
          <ShareButton />
        </div>

        <header className="mt-2 mb-8 text-center short:mb-[18px]">
          <h1 className="hero-logo mx-auto mb-[18px] size-28 short:mb-3 short:size-[92px]">
            <img src={asset('images/brand/logo.png')} alt="Migateliê" className="block size-full object-contain" />
          </h1>
        </header>

        <div className="mb-14 flex w-full justify-center tab:mb-16 lg:mb-0">
          <a
            ref={agenda}
            {...linkProps(AGENDA_URL)}
            onPointerDown={press}
            className="agenda-btn glass-brand shine relative inline-flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-bold text-cream no-underline short:h-11 short:px-6"
          >
            <span className="relative z-[1] inline-flex items-center gap-2">
              <CalendarDays size={16} strokeWidth={2.2} />
              Agendar
            </span>
          </a>
        </div>

      </div>
    </aside>
  );
}
