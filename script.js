/* ═══════════════════════════════════════
   portfolio · script.js
   ═══════════════════════════════════════ */

/* ─── LOADER — swipe/click to dismiss ─── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Block body scroll while loading
  document.body.classList.add('loader-active');

  let ready = false; // true once animations are done

  // Show hint + mark ready after content has animated in
  setTimeout(() => {
    ready = true;
    const hint = document.getElementById('ldrHint');
    if (hint) hint.style.opacity = '1'; // CSS animation takes over
  }, 2000);

  function dismiss() {
    if (!ready) return;
    loader.classList.add('sliding');
    document.body.classList.remove('loader-active');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  }

  // Touch: swipe up on loader
  let touchStartY = 0;
  loader.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  loader.addEventListener('touchend', e => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (dy > 40) dismiss(); // swipe up 40px+
  }, { passive: true });

  // Mouse: click anywhere on loader (desktop fallback)
  loader.addEventListener('click', dismiss);

  // Keyboard: spacebar / enter
  document.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && ready) dismiss();
  });
})();

/* CURSOR */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
});
(function animR() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
  requestAnimationFrame(animR);
})();
document.querySelectorAll('a,button,.proj-card,.svc-card,.biscuit,.skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* BACK TO TOP */
const bt = document.getElementById('back-top');
window.addEventListener('scroll', () => bt.classList.toggle('show', window.scrollY > 300));

/* REVEAL */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

/* ─── FULL-SCREEN MENU ─── */
// Init links: hidden, ready for stagger animation
document.querySelectorAll('.drawer-link').forEach((a) => {
  a.style.opacity = '0';
  a.style.transform = 'translateY(18px)';
  a.style.transition = 'opacity 0.4s ease, transform 0.4s ease, color 0.22s, gap 0.22s';
});

function toggleDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('menuBtn');
  const open = d.classList.toggle('open');
  b.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    // Stagger links in
    document.querySelectorAll('.drawer-link').forEach((a, i) => {
      setTimeout(() => {
        a.style.opacity = '1';
        a.style.transform = 'translateY(0)';
      }, 120 + i * 55);
    });
    // update label
    const lbl = document.querySelector('.menu-btn-label');
    if (lbl) lbl.textContent = 'CLOSE';
  } else {
    document.querySelectorAll('.drawer-link').forEach(a => {
      a.style.opacity = '0';
      a.style.transform = 'translateY(18px)';
    });
    const lbl = document.querySelector('.menu-btn-label');
    if (lbl) lbl.textContent = 'MENU';
  }
}
function closeDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('menuBtn');
  d.classList.remove('open');
  b.classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.drawer-link').forEach(a => {
    a.style.opacity = '0'; a.style.transform = 'translateY(18px)';
  });
  const lbl = document.querySelector('.menu-btn-label');
  if (lbl) lbl.textContent = 'MENU';
}
document.querySelectorAll('.drawer-link').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeDrawer();
      setTimeout(() => {
        const t = document.querySelector(href);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 380);
    }
  });
});
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

/* SKILL TABS */
document.querySelectorAll('.s-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.s-tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.s-tab-panel').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const panel = document.getElementById(t.dataset.panel);
    panel.classList.add('active');
    setTimeout(() => animBars(panel), 60);
  });
});
function animBars(panel) { panel.querySelectorAll('.sk-bar').forEach(b => { b.style.width = b.dataset.w + '%'; }); }
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) animBars(document.querySelector('.s-tab-panel.active')); });
}, { threshold: 0.2 }).observe(document.getElementById('skills'));

/* SERVICES — grid paging */
function toggleSvc(card) {
  const wasActive = card.classList.contains('active');
  document.querySelectorAll('.svc-card').forEach(c => c.classList.remove('active'));
  if (!wasActive) card.classList.add('active');
}
let svcPage = 0;
function getSvcPerPage() { return window.innerWidth <= 960 ? 1 : 3; }
function svcSlide(dir) {
  const maxPage = Math.ceil(document.querySelectorAll('.svc-card').length / getSvcPerPage()) - 1;
  svcPage = Math.max(0, Math.min(maxPage, svcPage + dir));
  renderSvcSlide();
}
function svcGoTo(page) { svcPage = page; renderSvcSlide(); }
function renderSvcSlide() {
  const perPage = getSvcPerPage();
  const cards = Array.from(document.querySelectorAll('.svc-card'));
  const maxPage = Math.ceil(cards.length / perPage) - 1;
  const start = svcPage * perPage;
  cards.forEach((c, i) => { c.style.display = (i >= start && i < start + perPage) ? 'flex' : 'none'; });
  const dotsWrap = document.getElementById('svcDots');
  dotsWrap.innerHTML = '';
  for (let i = 0; i <= maxPage; i++) {
    const d = document.createElement('div');
    d.className = 'svc-dot' + (i === svcPage ? ' active' : '');
    d.onclick = (() => { const p = i; return () => svcGoTo(p); })();
    dotsWrap.appendChild(d);
  }
  document.getElementById('svcPrev').disabled = svcPage === 0;
  document.getElementById('svcNext').disabled = svcPage === maxPage;
}
renderSvcSlide();
window.addEventListener('resize', () => { svcPage = 0; renderSvcSlide(); });

/* PROJECTS OVERLAY */
function openProjOverlay() {
  const o = document.getElementById('projOverlay');
  o.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.ov-card').forEach((c, i) => {
    c.style.animation = 'none'; c.offsetHeight;
    c.style.animation = 'overlayIn .4s ease ' + (i * 0.06) + 's both';
  });
}
function closeProjOverlay() {
  document.getElementById('projOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeProjOverlay(); closeDrawer(); } });

/* EXPERIENCE hover — random color */
const TL_COLORS = ['#e53e3e', '#3182ce', '#38a169'];
function tlHover(item, on) {
  const title = item.querySelector('.tl-title');
  const dot = item.querySelector('.tl-dot');
  if (on) {
    const c = TL_COLORS[Math.floor(Math.random() * TL_COLORS.length)];
    item._tlColor = c;
    title.style.color = c;
    dot.style.background = c;
    dot.style.boxShadow = '0 0 0 2px ' + c;
  } else {
    title.style.color = '';
    dot.style.background = '';
    dot.style.boxShadow = '';
    item._tlColor = null;
  }
}

/* PROJECT CARDS — GitHub btn random color */
document.querySelectorAll('.proj-card').forEach(card => {
  const ghBtn = card.querySelector('.gh-btn');
  if (!ghBtn) return;
  card.addEventListener('mouseenter', () => ghBtn.classList.remove('gh-red', 'gh-blue', 'gh-green'));
  ghBtn.addEventListener('mouseenter', () => {
    const cls = ['gh-red', 'gh-blue', 'gh-green'];
    ghBtn.classList.remove(...cls);
    ghBtn.classList.add(cls[Math.floor(Math.random() * cls.length)]);
  });
  ghBtn.addEventListener('mouseleave', () => ghBtn.classList.remove('gh-red', 'gh-blue', 'gh-green'));
});

/* TIMELINE DOTTED DRAW */
(function () {
  const wrap = document.getElementById('tlWrap');
  if (!wrap) return;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const svg = document.getElementById('tlSvg');
      const list = document.getElementById('tlList');
      const h = list.offsetHeight;
      svg.setAttribute('height', h);
      svg.querySelector('.tl-line-bg').setAttribute('y2', h);
      const anim = document.getElementById('tlAnim');
      anim.setAttribute('y2', h);
      anim.style.strokeDasharray = '4 6';
      anim.style.strokeDashoffset = h;
      requestAnimationFrame(() => {
        anim.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)';
        anim.style.strokeDashoffset = '0';
        setTimeout(() => {
          anim.style.transition = '';
          anim.style.animation = 'dashFlow 0.7s linear infinite';
        }, 2500);
      });
      [0, 1, 2].forEach(i => {
        setTimeout(() => { const d = document.getElementById('dot' + i); if (d) d.classList.add('pop'); }, 350 + i * 450);
      });
    });
  }, { threshold: 0.15 }).observe(wrap);
})();

/* ANCHOR SCROLL */
document.querySelectorAll("a[href^='#']").forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
