# Migateliê — Link na bio

Página de links da Migateliê em **React 19 + TypeScript + Tailwind CSS v4**, com animações em **GSAP** (ScrollTrigger + `@gsap/react`), rolagem suave com **Lenis** e carrossel com **Swiper**.

## Comandos

```bash
npm install       # instala as dependências
npm run dev       # ambiente de desenvolvimento (http://localhost:5173)
npm run build     # checa os tipos e gera a versão final em dist/
npm run preview   # serve a pasta dist/ localmente
```

O conteúdo de `dist/` pode ser publicado em qualquer hospedagem estática (Vercel, Netlify, Hostinger…). O `base: './'` no `vite.config.ts` permite publicar também em subpastas.

## Estrutura

```
├── index.html                    # HTML base (meta tags, fontes)
├── public/                       # Arquivos servidos como estão
│   ├── favicon.png
│   └── images/
│       ├── brand/                # logo.png, capamig.jpg (abertura)
│       ├── backgrounds/          # marrom.jpg (fundo)
│       ├── products/             # homespray.png
│       ├── services/             # brow.png, lash.png, revitaliza.png, design.png, buco.png
│       └── gift/                 # cartao-frente.png, cartao-verso.png (cartão 3D)
└── src/
    ├── main.tsx                  # ponto de entrada
    ├── App.tsx                   # layout + timeline de abertura + entradas no scroll
    ├── index.css                 # Tailwind, tokens (@theme), utilitários de vidro
    ├── data/content.ts           # TODOS os textos, links e serviços
    ├── lib/
    │   ├── gsap.ts               # registro dos plugins e curvas padrão
    │   └── utils.ts              # asset(), cn(), detecção de movimento reduzido
    ├── hooks/
    │   └── useInteractions.ts    # botão magnético, tilt 3D, ripple de toque
    └── components/
        ├── Preloader.tsx         # tela de abertura com a capa
        ├── Background.tsx        # fundo + barra de progresso
        ├── SmoothScroll.tsx      # Lenis sincronizado ao GSAP
        ├── Profile.tsx           # logo e botão Agendar (painel fixo no desktop)
        ├── ShareButton.tsx       # compartilhar / copiar link
        ├── SectionTitle.tsx      # títulos com fonte display
        ├── ServicesCarousel.tsx  # carrossel de serviços
        ├── FeatureMighome.tsx    # destaque do aromatizador
        ├── GiftSection.tsx       # vale presente (cartão 3D girando e flutuando)
        ├── ProductsSection.tsx   # indicações de produtos
        ├── ContactSection.tsx    # contato via WhatsApp
        └── Footer.tsx
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Número do WhatsApp, links, textos, serviços | `src/data/content.ts` |
| Cores, fontes, breakpoints | bloco `@theme` em `src/index.css` |
| Intensidade do vidro | utilitários `glass*` em `src/index.css` |
| Tempo da abertura | timeline em `src/App.tsx` |
| Giro e flutuação do cartão presente | timeline em `src/components/GiftSection.tsx` |

## Breakpoints

| Faixa | Layout |
|---|---|
| ≤ 360px | Celular pequeno (compacto) |
| padrão | Celular, coluna única |
| `tab:` ≥ 720px | Tablet, blocos em 2 colunas |
| `lg:` ≥ 1024px | Notebook/desktop com painel lateral fixo |
| `short:` ≥ 1024px e altura ≤ 820px | Notebook com pouca altura (ex.: ThinkPad T450) |
| `xxl:` ≥ 1440px | Telas grandes |

## Acessibilidade e desempenho

- Com "reduzir movimento" ativo no sistema, a abertura é pulada e as animações são desligadas.
- Imagens de serviço que não existirem são ocultadas (fica o degradê no lugar).
