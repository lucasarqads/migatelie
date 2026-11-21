/**
 * Conteúdo da página em um só lugar.
 * Para editar links, textos ou serviços, mexa apenas neste arquivo.
 */

/*
 * ⚠️ LINKS DESATIVADOS: todos os links e redirecionamentos apontam para '#'
 * (não levam a lugar nenhum). Para reativar, troque os '#' pelas URLs abaixo:
 *
 *   WhatsApp ......... https://wa.me/<WHATSAPP_NUMBER>?text=<mensagem>
 *                      (volte o corpo de whatsappLink para a linha comentada)
 *   AGENDA_URL ....... https://agendamigatelie.as.me/
 *   MIGHOME_URL ...... https://mercadolivre.com/sec/1VD3s8f
 *   Brow Lamination .. https://agendamigatelie.as.me/schedule/0bc2e8b2/category/%25F0%259F%258D%2583Sobrancelhas%2520/appointment/80890411/calendar/12439979
 *   Lash Lifting ..... https://agendamigatelie.as.me/schedule/0bc2e8b2/category/%F0%9F%8C%80%20C%C3%ADlios%20/appointment/80890636
 *   Revitalização .... https://agendamigatelie.as.me/schedule/0bc2e8b2/category/%F0%9F%AB%A6L%C3%A1bios%20/appointment/80892301/calendar/12439979
 *   Design e Buço .... AGENDA_URL
 */

// TROQUE pelo número real (formato 55 + DDD + número)
export const WHATSAPP_NUMBER = '5511999999999';

export const whatsappLink = (_message: string) => '#';
// export const whatsappLink = (message: string) =>
//   `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const AGENDA_URL = '#';
export const MIGHOME_URL = '#';

/**
 * `focus` (opcional): qual parte da foto fica visível no card (CSS object-position).
 * Ex.: 'center 30%' mostra a região a 30% do topo. Padrão: centro.
 * `zoom` (opcional): aproxima a foto a partir do ponto de `focus` (1 = sem zoom extra).
 * Útil quando a foto é mais "aberta" que as outras.
 */
export const services: { name: string; image: string; href: string; tag?: string; focus?: string; zoom?: number }[] = [
  {
    name: 'Brow Lamination',
    image: 'images/services/brow.png',
    focus: 'center 28%',
    tag: 'mais pedido',
    href: '#',
  },
  {
    name: 'Lash Lifting',
    image: 'images/services/lash.png',
    focus: 'center 45%',
    href: '#',
  },
  {
    name: 'Revitalização labial',
    image: 'images/services/revitaliza.png',
    focus: 'center 40%',
    href: '#',
  },
  {
    name: 'Design de sobrancelhas',
    image: 'images/services/design.png',
    focus: 'center 30%',
    href: AGENDA_URL,
  },
  {
    name: 'Limpeza buço',
    image: 'images/services/buco.png',
    focus: '95% 46%',
    zoom: 1.5,
    href: AGENDA_URL,
  },
];

/**
 * Indicações de produtos (seção abaixo do vale presente).
 * - image: caminho em public/ (opcional; sem imagem aparece um ícone)
 * - coupon: código de desconto (opcional)
 * Os itens marcados como EXEMPLO devem ser trocados pelos produtos reais.
 */
export type Product = {
  name: string;
  category: string;
  description: string;
  href: string;
  image?: string;
  coupon?: string;
};

export const products: Product[] = [
  {
    name: 'Aromatizador Mighome',
    category: 'casa',
    description: 'A sensação de estar em uma casa de praia, em qualquer ambiente.',
    href: MIGHOME_URL,
    image: 'images/products/homespray.png',
  },
  // EXEMPLO — troque pelo produto real
  {
    name: 'Gel fixador de sobrancelhas',
    category: 'sobrancelhas',
    description: 'Mantém os fios alinhados o dia todo, com acabamento natural.',
    href: '#',
    coupon: 'MIGA10',
  },
  // EXEMPLO — troque pelo produto real
  {
    name: 'Sérum fortalecedor de cílios',
    category: 'cílios',
    description: 'Nutre e fortalece os fios entre um procedimento e outro.',
    href: '#',
  },
  // EXEMPLO — troque pelo produto real
  {
    name: 'Hidratante labial',
    category: 'lábios',
    description: 'Hidratação profunda para manter o resultado da revitalização.',
    href: '#',
  },
];

