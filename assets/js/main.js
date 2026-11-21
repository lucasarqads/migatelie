/* ==========================================================================
   Migateliê — Link na bio
   Interações e animações (GSAP + ScrollTrigger, Lenis, Swiper)
   ========================================================================== */

(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hasGSAP = typeof window.gsap !== 'undefined';
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    $('#year').textContent = new Date().getFullYear();

    // Esconde imagens locais que não existirem (evita ícone quebrado)
    $$('img').forEach(img => {
        const mark = () => img.classList.add('is-broken');
        if (img.complete && img.naturalWidth === 0 && img.src) mark();
        img.addEventListener('error', mark);
    });

    // Mapa carregado apenas quando visível
    const iframe = $('.map-frame iframe');
    new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            iframe.src = iframe.dataset.src;
            iframe.addEventListener('load', () => iframe.parentElement.style.animation = 'none');
            obs.disconnect();
        }
    }, { rootMargin: '300px' }).observe(iframe);

    // Swiper — carrossel de serviços
    if (window.Swiper) {
        new Swiper('.services .swiper', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            grabCursor: true,
            speed: 700,
            freeMode: { enabled: true, sticky: true, momentumRatio: 0.6 },
            pagination: { el: '.services .swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-next', prevEl: '.swiper-prev' },
            keyboard: { enabled: true, onlyInViewport: true },
            watchOverflow: true,
            breakpoints: { 1024: { spaceBetween: 16, freeMode: { enabled: false } } },
            a11y: { prevSlideMessage: 'Anterior', nextSlideMessage: 'Próximo' }
        });
    }

    // Toast
    const toast = $('.toast');
    const showToast = (msg) => {
        toast.textContent = msg;
        if (!hasGSAP) { toast.style.opacity = 1; toast.style.transform = 'translate(-50%,0)'; setTimeout(() => toast.style.opacity = 0, 2200); return; }
        gsap.killTweensOf(toast);
        gsap.timeline()
            .fromTo(toast, { xPercent: -50, yPercent: 140, x: 0, y: 0, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)' })
            .to(toast, { yPercent: 140, opacity: 0, duration: .4, ease: 'power2.in', delay: 2 });
    };

    // Compartilhar
    $('#shareBtn').addEventListener('click', async () => {
        const data = { title: document.title, url: location.href };
        try {
            if (navigator.share) { await navigator.share(data); return; }
            await navigator.clipboard.writeText(location.href);
            showToast('Link copiado ✨');
        } catch (e) { /* cancelado */ }
    });

    // Ripple em toques/cliques
    $$('.card-link, .social a, .wa-card, .feature__btn').forEach(el => {
        el.addEventListener('pointerdown', (e) => {
            if (!hasGSAP || reduce) return;
            const r = el.getBoundingClientRect();
            const dot = document.createElement('span');
            const size = Math.max(r.width, r.height) * 2;
            dot.className = 'ripple';
            Object.assign(dot.style, { width: size + 'px', height: size + 'px', left: (e.clientX - r.left) + 'px', top: (e.clientY - r.top) + 'px' });
            el.appendChild(dot);
            gsap.to(dot, { scale: 1, opacity: 0, duration: .8, ease: 'power2.out', onComplete: () => dot.remove() });
        });
    });

    // Spotlight que segue o cursor nos cards
    $$('.card-link').forEach(el => {
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // ===== Inspirações: crossfade com Ken Burns + barra de progresso =====
    const startInspiration = () => {
        $$('.insp-card').forEach((card) => {
            const imgs = $$('img', card);
            if (imgs.length < 2) return;
            const dots = document.createElement('div');
            dots.className = 'insp-dots';
            dots.innerHTML = imgs.map(() => '<i><b></b></i>').join('');
            card.appendChild(dots);
            const bars = $$('b', dots);
            let i = 0;

            if (!hasGSAP || reduce) {
                setInterval(() => {
                    imgs[i].classList.remove('is-active');
                    i = (i + 1) % imgs.length;
                    imgs[i].classList.add('is-active');
                }, 3500);
                return;
            }

            gsap.set(imgs, { opacity: 0 });
            gsap.set(imgs[0], { opacity: 1 });

            const cycle = () => {
                const dur = gsap.utils.random(3, 4.5);
                const cur = imgs[i];
                gsap.fromTo(cur, { scale: 1.12 }, { scale: 1, duration: dur + 1.2, ease: 'none' });
                gsap.set(bars, { scaleX: (k) => (k < i ? 1 : 0) });
                gsap.to(bars[i], {
                    scaleX: 1, duration: dur, ease: 'none',
                    onComplete: () => {
                        const next = (i + 1) % imgs.length;
                        if (next === 0) gsap.set(bars, { scaleX: 0 });
                        gsap.to(cur, { opacity: 0, duration: 1.1, ease: 'power2.inOut' });
                        gsap.to(imgs[next], { opacity: 1, duration: 1.1, ease: 'power2.inOut' });
                        i = next;
                        cycle();
                    }
                });
            };
            gsap.delayedCall(Math.random() * 1.5, cycle);
        });
    };

    // Sem GSAP ou com movimento reduzido: exibe tudo e sai
    if (!hasGSAP || reduce) {
        $('.preloader').remove();
        $$('[data-reveal]').forEach(el => el.style.opacity = 1);
        startInspiration();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ===== Lenis — rolagem suave sincronizada ao GSAP =====
    if (window.Lenis) {
        // Interpolação contínua (lerp) = rolagem mais "sedosa"
        const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // Barra de progresso
    gsap.to('.scroll-progress', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });

    // Fundo desfocado "respirando" bem devagar
    gsap.to('.bg-scene', { scale: 1.08, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });

    // Split de títulos em letras
    $$('.split').forEach(el => {
        const words = el.textContent.trim().split(' ');
        el.innerHTML = words.map(w => `<span class="word"><span>${[...w].map(c => `<span class="ch" style="display:inline-block">${c}</span>`).join('')}</span></span>`).join(' ');
    });

    // ===== Padrões de movimento: curvas suaves, sem "quique" nem rotações =====
    const EASE_SOFT = 'power4.out';
    const EASE_SILK = 'expo.out';

    // Estados iniciais aplicados antes de animar (evita "piscar")
    gsap.set('.preloader__mark span', { y: 0, yPercent: 110 });
    gsap.set('.avatar-wrap', { autoAlpha: 0, y: 24, scale: .92, filter: 'blur(10px)' });
    gsap.set('.social a', { autoAlpha: 0, y: 18, filter: 'blur(6px)' });
    gsap.set('#shareBtn', { autoAlpha: 0, scale: .8 });

    // ===== Intro: preloader -> hero =====
    const intro = gsap.timeline({ defaults: { ease: EASE_SILK } });
    intro
        .to('.preloader__mark span', { yPercent: 0, duration: 1, stagger: .045 })
        .to('.preloader__mark span', { yPercent: -110, duration: .7, stagger: .03, ease: 'power3.in' }, '+=.2')
        // Cortina sobe revelando a capa
        .to('.preloader__curtain', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.inOut' }, '-=.35')
        .fromTo('.preloader__cover', { scale: 1.2, yPercent: 4 }, { scale: 1.03, yPercent: 0, duration: 2.8, ease: 'power2.out' }, '<')
        .from('.preloader__caption > span > span', { yPercent: 110, duration: 1.2, ease: EASE_SOFT }, '-=2')
        .set('.preloader', { background: 'transparent' })
        // Cortina sai pelo topo revelando a página
        .to('.preloader__caption', { yPercent: -60, autoAlpha: 0, duration: .7, ease: 'power2.in' }, '+=.6')
        .addLabel('reveal', '-=.2')
        .to('.preloader__curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut' }, 'reveal')
        .to('.preloader__cover', { scale: 1.12, yPercent: -10, duration: 1.2, ease: 'expo.inOut' }, 'reveal')
        // Hero entra enquanto a cortina ainda sobe (sobreposição = fluidez)
        .to('.avatar-wrap', { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: EASE_SOFT }, 'reveal+=.55')
        .to('.social a', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: { each: .07, from: 'center' }, ease: EASE_SOFT }, 'reveal+=.75')
        .to('#shareBtn', { autoAlpha: 1, scale: 1, duration: 1, ease: EASE_SOFT }, 'reveal+=.9')
        // Animações de rolagem só começam quando a página aparece
        .add(() => initScrollReveals(), 'reveal+=.6')
        .add(() => {
            $('.preloader').remove();
            gsap.set(['.avatar-wrap', '.social a'], { clearProps: 'filter' });
        });

    // ===== Reveals no scroll =====
    function initScrollReveals() {
        const introEls = new Set([$('.avatar-wrap'), ...$$('.social a'), $('#shareBtn')]);
        const pick = (sel) => $$(sel).filter(el => !introEls.has(el));

        // Cards e blocos: sobem suavemente, em cascata
        const ups = pick('[data-reveal="up"]');
        gsap.set(ups, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(ups, {
            start: 'top 88%',
            once: true,
            interval: .08,
            batchMax: 4,
            onEnter: (batch) => gsap.to(batch, {
                autoAlpha: 1, y: 0, duration: 1.3, stagger: .09, ease: EASE_SOFT
            })
        });

        // Galeria: leve zoom-out (o eixo Y fica livre para o parallax)
        const pops = pick('[data-reveal="pop"]');
        gsap.set(pops, { autoAlpha: 0, scale: .94 });
        ScrollTrigger.batch(pops, {
            start: 'top 92%',
            once: true,
            interval: .1,
            onEnter: (batch) => gsap.to(batch, {
                autoAlpha: 1, scale: 1, duration: 1.5, stagger: .12, ease: EASE_SOFT
            })
        });

        // Títulos de seção
        $$('[data-reveal="line"]').forEach(el => {
            gsap.set(el, { autoAlpha: 0, x: -14 });
            gsap.to(el, {
                autoAlpha: 1, x: 0, duration: 1.1, ease: EASE_SOFT,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true }
            });
        });

        // Carrossel: um único movimento, cards em cascata vindo da direita
        const slides = $$('.services .swiper-slide');
        gsap.set('[data-reveal="slide"]', { autoAlpha: 1 });
        gsap.set(slides, { autoAlpha: 0, x: 60 });
        gsap.to(slides, {
            autoAlpha: 1, x: 0, duration: 1.3, stagger: .08, ease: EASE_SOFT,
            clearProps: 'transform',
            scrollTrigger: { trigger: '.services', start: 'top 85%', once: true }
        });

        // Elementos sutis
        pick('[data-reveal="fade"]').forEach(el => {
            if (el.id === 'shareBtn') return;
            gsap.set(el, { autoAlpha: 0 });
            gsap.to(el, { autoAlpha: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
        });

        // Título do destaque, letra a letra
        gsap.from('.feature h2 .ch', {
            yPercent: 110, autoAlpha: 0, duration: 1, stagger: .022, ease: EASE_SOFT,
            scrollTrigger: { trigger: '.feature', start: 'top 80%', once: true }
        });

        ScrollTrigger.refresh();
    }

    // Recalcula posições quando imagens e fontes terminarem de carregar
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    // ===== Destaque Mighome: parallax + flutuação + bolhas =====
    gsap.fromTo('.feature__img', { yPercent: 25, rotate: -6 }, {
        yPercent: -4, rotate: 3, ease: 'none',
        scrollTrigger: { trigger: '.feature', start: 'top bottom', end: 'bottom 40%', scrub: 1 }
    });
    gsap.to('.feature__glow', { scale: 1.25, opacity: .6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    $$('.bubble').forEach(b => {
        gsap.to(b, { y: () => gsap.utils.random(-50, -110), x: () => gsap.utils.random(-18, 18), opacity: 0, duration: () => gsap.utils.random(3, 5.5), repeat: -1, repeatRefresh: true, ease: 'sine.out', delay: Math.random() * 2 });
    });

    // Parallax leve nos cards de inspiração
    $$('.insp-card').forEach((c, k) => {
        gsap.to(c, { y: k % 2 ? -24 : 18, ease: 'none', scrollTrigger: { trigger: '.inspiration', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });

    // ===== Micro-interações (só em mouse) =====
    if (finePointer) {
        // Botões magnéticos
        $$('.magnetic').forEach(el => {
            const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'elastic.out(1, .4)' });
            const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'elastic.out(1, .4)' });
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * .35);
                yTo((e.clientY - (r.top + r.height / 2)) * .35);
            });
            el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
        });

        // Tilt 3D nos cards de serviço
        $$('.tilt').forEach(el => {
            gsap.set(el, { transformPerspective: 700 });
            const rx = gsap.quickTo(el, 'rotationX', { duration: .5, ease: 'power3.out' });
            const ry = gsap.quickTo(el, 'rotationY', { duration: .5, ease: 'power3.out' });
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                ry(((e.clientX - r.left) / r.width - .5) * 14);
                rx(-((e.clientY - r.top) / r.height - .5) * 14);
            });
            el.addEventListener('pointerleave', () => { rx(0); ry(0); });
        });

        // Elevação dos cards de link
        $$('.card-link, .wa-card').forEach(el => {
            el.addEventListener('pointerenter', () => gsap.to(el, { y: -4, duration: .5, ease: 'expo.out' }));
            el.addEventListener('pointerleave', () => gsap.to(el, { y: 0, duration: .6, ease: 'expo.out' }));
        });
    } else {
        // Feedback tátil de toque (press)
        $$('.card-link, .product-card, .wa-card, .social a, .insp-card').forEach(el => {
            el.addEventListener('pointerdown', () => gsap.to(el, { scale: .97, duration: .18, ease: 'power2.out' }));
            ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => el.addEventListener(ev, () => gsap.to(el, { scale: 1, duration: .5, ease: 'elastic.out(1, .5)' })));
        });
    }

    startInspiration();
})();
