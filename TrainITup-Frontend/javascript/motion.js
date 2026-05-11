(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const firstSection = document.querySelector('section');
    const pageName = (window.location.pathname.split('/').pop() || '').toLowerCase();

    const heroProfiles = {
        'index.html': { y: 24, scale: 0.99, duration: 420, stagger: 14, cap: 160 },
        'pricing.html': { y: 30, scale: 0.985, duration: 600, stagger: 28, cap: 360 },
        'mentors.html': { y: 28, scale: 0.986, duration: 560, stagger: 24, cap: 320 },
        'community.html': { y: 26, scale: 0.988, duration: 540, stagger: 22, cap: 300 },
        'testimonials.html': { y: 24, scale: 0.989, duration: 520, stagger: 20, cap: 280 }
    };

    const activeHeroProfile = heroProfiles[pageName] || { y: 30, scale: 0.985, duration: 600, stagger: 28, cap: 360 };
    const effectiveHeroProfile = isMobile
        ? {
            y: Math.min(activeHeroProfile.y, 16),
            scale: 0.995,
            duration: Math.min(activeHeroProfile.duration, 320),
            stagger: Math.min(activeHeroProfile.stagger, 10),
            cap: Math.min(activeHeroProfile.cap, 90)
        }
        : activeHeroProfile;
    const tiltEnabledPages = new Set(['mentors.html']);
    const enableTilt = tiltEnabledPages.has(pageName);

    const style = document.createElement('style');
    style.textContent = [
        '.ti-reveal { opacity: 0; transform: translateY(' + (isMobile ? 14 : 24) + 'px) scale(' + (isMobile ? '0.995' : '0.985') + '); transition: opacity ' + (isMobile ? 340 : 560) + 'ms ease, transform ' + (isMobile ? 340 : 560) + 'ms ease; will-change: opacity, transform; }',
        '.ti-reveal.ti-reveal-hero { transform: translateY(' + effectiveHeroProfile.y + 'px) scale(' + effectiveHeroProfile.scale + '); transition-duration: ' + effectiveHeroProfile.duration + 'ms; }',
        '.ti-reveal.ti-reveal-soft { transform: translateY(' + (isMobile ? 8 : 14) + 'px) scale(' + (isMobile ? '0.996' : '0.992') + '); transition-duration: ' + (isMobile ? 280 : 420) + 'ms; }',
        '.ti-reveal.ti-visible { opacity: 1; transform: translateY(0) scale(1); }',
        '.ti-tilt { transition: transform 220ms ease, box-shadow 220ms ease; }',
        '.ti-tilt:hover { box-shadow: 0 18px 34px rgba(0,0,0,0.28); }',
        '@media (prefers-reduced-motion: reduce) { .ti-reveal, .ti-reveal.ti-visible, .ti-tilt { transition: none !important; transform: none !important; opacity: 1 !important; } }'
    ].join('\n');
    document.head.appendChild(style);

    const revealTargets = document.querySelectorAll(
        isMobile
            ? 'section h1, section h2, section .card, section .btn, footer .col-lg-4'
            : 'section h1, section h2, section h3, section p, section .card, section .btn, footer .col-lg-4, footer .col-lg-2'
    );

    const containerCounters = new WeakMap();

    revealTargets.forEach((el, idx) => {
        el.classList.add('ti-reveal');

        if (firstSection && firstSection.contains(el)) {
            el.classList.add('ti-reveal-hero');
        }

        if (el.closest('footer')) {
            el.classList.add('ti-reveal-soft');
        }

        if (!prefersReducedMotion) {
            const container = el.closest('section, footer') || document.body;
            const localIdx = containerCounters.get(container) || 0;
            containerCounters.set(container, localIdx + 1);

            if (el.closest('footer')) {
                el.style.transitionDelay = Math.min(localIdx * (isMobile ? 8 : 14), isMobile ? 60 : 120) + 'ms';
            } else if (firstSection && firstSection.contains(el)) {
                el.style.transitionDelay = Math.min(localIdx * effectiveHeroProfile.stagger, effectiveHeroProfile.cap) + 'ms';
            } else {
                el.style.transitionDelay = Math.min(localIdx * (isMobile ? 10 : 18), isMobile ? 100 : 220) + 'ms';
            }
        }
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('ti-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
        );

        revealTargets.forEach((el) => observer.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('ti-visible'));
    }

    const tiltCards = document.querySelectorAll('.card-lift');
    tiltCards.forEach((card) => {
        card.classList.add('ti-tilt');
        if (prefersReducedMotion || !enableTilt) {
            card.style.transform = '';
            card.style.boxShadow = '';
            return;
        }

        let rafId = null;
        card.addEventListener('mousemove', (event) => {
            if (rafId) {
                return;
            }
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 3;
                const rotateX = (0.5 - (y / rect.height)) * 3;
                card.style.transform = 'translateY(-5px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
                rafId = null;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach((btn) => {
        if (prefersReducedMotion) {
            return;
        }

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();
