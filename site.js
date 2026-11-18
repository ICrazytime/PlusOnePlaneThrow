(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const pageComponents = {
    home: {
      home: '#top',
      links: [['Ideas', '#ideas'], ['About', '#about'], ['Connect', '#connect']],
    },
    runes: {
      home: 'index.html', subtitle: 'Rune System · World 10 Suggestion',
      links: [['Overview', '#overview'], ['Chest', '#chest'], ['Rarities', '#rarities'], ['Rune', '#catalog'], ['Fusion', '#fusion']],
    },
    pets: {
      home: 'index.html', subtitle: 'Pet Leveling · +1 Plane Throw',
      links: [['Overview', '#overview'], ['Live preview', '#preview'], ['XP explorer', '#xp'], ['Fusion', '#fusion'], ['Rules', '#details']],
    },
  };

  customElements.define('site-header', class extends HTMLElement {
    connectedCallback() {
      const config = pageComponents[root.dataset.page] || pageComponents.home;
      const subtitle = config.subtitle ? `<small>${config.subtitle}</small>` : '';
      const links = config.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
      this.innerHTML = `<header class="site-header"><div class="header-inner"><a class="brand" href="${config.home}" aria-label="Crazytime's Idea Orbit home"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 14.5 19.5 5l-5.4 14-3.1-5.2L4 14.5Z" fill="currentColor"/><path d="m11 13.8 4.5-4.2" stroke="#986cdb" stroke-width="1.4"/></svg></span><span class="brand-text"><span class="brand-title">CRAZYTIME'S IDEA ORBIT</span>${subtitle}</span></a><nav class="site-nav" aria-label="Main navigation">${links}</nav><div class="nav-actions"><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle color theme" aria-pressed="false"><span id="theme-icon" aria-hidden="true">☼</span><span id="theme-label">Light mode</span></button></div></div></header>`;
    }
  });

  customElements.define('site-footer', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<footer class="footer site-footer"><div class="footer-inner"><span>© <span id="year">2026</span> Crazytime · Made with a little extra sparkle ✦</span><span>Fan-made concepts for <b>+1 Plane Throw</b></span></div></footer>`;
    }
  });
  try {
    const stored = localStorage.getItem('idea-orbit-theme');
    if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;
  } catch (_) {}

  const initialize = () => {
    const toggle = document.getElementById('theme-toggle');
    const label = document.getElementById('theme-label');
    const icon = document.getElementById('theme-icon');
    const themeName = value => value === 'light' ? 'Light' : 'Dark';
    const updateTheme = () => {
      const light = root.dataset.theme === 'light';
      if (label) label.textContent = `${light ? 'Dark' : 'Light'} mode`;
      if (icon) icon.textContent = light ? '☾' : '☼';
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(light));
        toggle.setAttribute('aria-label', `Toggle color theme. Current: ${themeName(root.dataset.theme)}.`);
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = light ? '#faf6ff' : '#100d1b';
    };

    updateTheme();
    if (toggle) toggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('idea-orbit-theme', root.dataset.theme); } catch (_) {}
      updateTheme();
    });

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    const progress = document.querySelector('#scroll-progress, #scrollbar, #prog');
    if (progress) {
      let ticking = false;
      const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const amount = max > 0 ? (window.scrollY / max) * 100 : 0;
        progress.style.width = `${amount}%`;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
      }, { passive: true });
      updateProgress();
    }

    const revealItems = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      }), { threshold: .1, rootMargin: '0px 0px -24px 0px' });
      revealItems.forEach(item => {
        const bounds = item.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) item.classList.add('visible');
        observer.observe(item);
      });
    }

    if (window.matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches) {
      document.querySelectorAll('[data-tilt],.panel,.hero-card,.hero-frame,.hero-orb,.rule,.metric,.qstat,.aura-card,.rune-card,.glass,.game-shell,.inventory,.mini-stat,.step,.mile,.kpi,.chartbox,.controls,.detail,.multi-box,.idea-card,.social-card,.game-feature,.why-point').forEach(surface => {
        surface.addEventListener('pointermove', event => {
          const bounds = surface.getBoundingClientRect();
          surface.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
          surface.style.setProperty('--my', `${event.clientY - bounds.top}px`);
        });
      });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
