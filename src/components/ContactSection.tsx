import { ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { whatsappLink } from '../data/content';
import { usePressFeedback } from '../hooks/useInteractions';
import { linkProps } from '../lib/utils';
import { SectionTitle } from './SectionTitle';

/** Contato via WhatsApp. */
export function ContactSection() {
  const press = usePressFeedback();
  return (
    <section aria-labelledby="t-contact" className="w-full">
      <SectionTitle id="t-contact">Fale comigo</SectionTitle>
      <a
        {...linkProps(whatsappLink('Olá! Vim pelo link da bio e gostaria de mais informações.'))}
        data-reveal="up"
        onPointerDown={press}
        className="group glass relative flex flex-col gap-3.5 overflow-hidden rounded-3xl p-5 text-cream no-underline transition-[translate,box-shadow] duration-500 ease-out-expo before:absolute before:-top-[110px] before:-right-[90px] before:size-[260px] before:rounded-full before:bg-[radial-gradient(circle,rgb(255_255_255/0.08),transparent_70%)] before:content-[''] fine:hover:-translate-y-1 fine:hover:glass-glow tab:flex-row tab:items-center tab:justify-between"
      >
        <span className="relative flex items-center gap-3 text-left">
          <span className="relative grid size-[46px] shrink-0 place-items-center rounded-full bg-[#25d366] text-white after:absolute after:inset-0 after:animate-ping-soft after:rounded-full after:border-2 after:border-[#25d366] after:content-['']">
            <FaWhatsapp size={24} />
          </span>
          <span>
            <strong className="block text-base">WhatsApp</strong>
            <span className="text-[12.5px] opacity-75">Respondo em horário comercial</span>
          </span>
        </span>
        <span className="glass-brand shine relative flex items-center justify-center gap-2 overflow-hidden rounded-[14px] p-[13px] text-sm font-bold text-cream tab:px-6">
          <span className="relative z-[1] inline-flex items-center gap-2">
            Iniciar conversa
            <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
          </span>
        </span>
      </a>
    </section>
  );
}
