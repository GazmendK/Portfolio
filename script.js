document.addEventListener('DOMContentLoaded', function () {

    // ── THEME TOGGLE ──────────────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // ── MOBILE MENU ───────────────────────────────────────────────
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks  = document.getElementById('navLinks');

    mobileBtn.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        mobileBtn.innerHTML = open
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // ── SMOOTH SCROLL ─────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // ── HEADER SCROLL EFFECT ──────────────────────────────────────
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        header.style.borderBottomColor = window.scrollY > 20
            ? 'rgba(0,201,167,0.15)'
            : '';
    });

    // ── SCROLL ANIMATIONS ─────────────────────────────────────────
    const fadeTargets = document.querySelectorAll(
        '.section-header, .project-row, .about-grid, ' +
        '.contact-intro, .contact-grid, .skill-item'
    );

    fadeTargets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeTargets.forEach(el => observer.observe(el));

    // ── CONTACT FORM ──────────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const json = JSON.stringify(Object.fromEntries(formData));

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wird gesendet…';
            submitBtn.disabled = true;

            try {
                const res  = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: json
                });
                const data = await res.json();

                if (res.status === 200) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Erfolgreich gesendet!';
                    submitBtn.style.background = '#22c55e';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Unbekannter Fehler');
                }
            } catch (err) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Fehler beim Senden';
                submitBtn.style.background = '#ef4444';
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = 'Nachricht senden <i class="fas fa-paper-plane"></i>';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }

    // ── ALGO BAR ANIMATION (AlgoVision mockup) ────────────────────
    const bars = document.querySelectorAll('.pv-bar');
    if (bars.length) {
        setInterval(() => {
            const activeIdx = Math.floor(Math.random() * bars.length);
            bars.forEach((bar, i) => bar.classList.toggle('active', i === activeIdx || i === activeIdx + 1));
        }, 1200);
    }

});
