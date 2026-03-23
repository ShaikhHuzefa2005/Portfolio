/* ═══════════════════════════════════════════════════════
   anim.js — Portfolio animations
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const COLORS = ['#e53e3e', '#3182ce', '#38a169'];
  const rand = () => COLORS[Math.floor(Math.random() * 3)];

  /* ── 1. HERO NAME letters — bounce + random color ── */
  function initHeroLetters() {
    document.querySelectorAll('.hn-letter').forEach(span => {
      if (span.classList.contains('hn-space')) return;
      span.addEventListener('mouseenter', () => {
        span.style.color = rand();
        span.classList.remove('bouncing');
        void span.offsetWidth;
        span.classList.add('bouncing');
      });
      span.addEventListener('animationend', () => {
        span.classList.remove('bouncing');
        span.style.color = '';
      });
    });
  }

  /* ── 2. GET IN TOUCH — same hover effect ── */
  function initGetInTouch() {
    document.querySelectorAll('.git-letter').forEach(span => {
      if (span.classList.contains('git-space')) return;
      span.addEventListener('mouseenter', () => {
        span.style.color = rand();
        span.classList.remove('bouncing');
        void span.offsetWidth;
        span.classList.add('bouncing');
      });
      span.addEventListener('animationend', () => {
        span.classList.remove('bouncing');
        span.style.color = '';
      });
    });
  }

  /* ── 3. EXPERIENCE — blur siblings on hover ── */
  function initExperienceBlur() {
    const list = document.getElementById('tlList');
    if (!list) return;
    list.querySelectorAll('.tl-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        list.classList.add('has-hover');
        item.classList.add('tl-focused');
      });
      item.addEventListener('mouseleave', () => {
        list.classList.remove('has-hover');
        item.classList.remove('tl-focused');
      });
    });
  }

  /* ── 4. DRAWER LINKS — random color on hover ── */
  function initDrawerColors() {
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const c = rand();
        link.style.color = c;
        const dot = link.querySelector('.drawer-link-dot');
        if (dot) dot.style.background = c;
      });
      link.addEventListener('mouseleave', () => {
        link.style.color = '';
        const dot = link.querySelector('.drawer-link-dot');
        if (dot) dot.style.background = '';
      });
    });
  }

  /* ── 5. FOOTER BALLS — 3 physics balls confined to footer ── */
  function initFooterBalls() {
    const canvas = document.getElementById('footerCanvas');
    const footer = canvas ? canvas.closest('footer') : null;
    if (!canvas || !footer) return;
    const ctx = canvas.getContext('2d');

    const RADIUS  = 55;
    const COLORS  = [
  '#e53e3e',
  '#3182ce',
  '#38a169',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb',
  '#ffffffbb'
];
    const DAMPING = 0.72;        // energy kept per wall bounce
    const FRICTION= 0.995;       // per-frame velocity decay
    const MOUSE_R = 160;         // mouse repulsion zone radius
    const MOUSE_F = 0.22;        // repulsion force — strong enough to visibly move balls
    const GRAV    = 0.04;        // tiny downward drift

    let W = 0, H = 0;
    let mouseX = -999, mouseY = -999;
    let mouseInside = false;

    // Each ball: position, velocity, color
    const balls = COLORS.map((color, i) => ({
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 3.5,
      vy: (Math.random() - 0.5) * 3.5,
      color,
    }));

    function resize() {
      const rect = footer.getBoundingClientRect();
      W = footer.offsetWidth;
      H = footer.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
      // Only reposition if balls are at 0,0 (first init)
      balls.forEach((b, i) => {
        if (b.x === 0 && b.y === 0) {
          const col = i % 5;
          const row = Math.floor(i / 5);
          b.x = W * (0.1 + col * 0.2) + (Math.random() - 0.5) * 30;
          b.y = H * (0.2 + row * 0.3) + (Math.random() - 0.5) * 20;
        }
        // Clamp inside bounds after resize
        b.x = Math.min(Math.max(b.x, RADIUS), W - RADIUS);
        b.y = Math.min(Math.max(b.y, RADIUS), H - RADIUS);
      });
    }

    function getMouseInFooter(e) {
      const rect = footer.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    footer.addEventListener('mousemove', getMouseInFooter, { passive: true });
    footer.addEventListener('mouseenter', () => { mouseInside = true; });
    footer.addEventListener('mouseleave', () => { mouseInside = false; mouseX = -999; mouseY = -999; });

    function step() {
      // Physics update
      balls.forEach(b => {
        // Gravity
        b.vy += GRAV;

        // Mouse repulsion — fires whenever cursor is in footer
        if (mouseX > -900) {
          const dx = b.x - mouseX;
          const dy = b.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_R && dist > 0.1) {
            const t = 1 - dist / MOUSE_R;          // 0 at edge, 1 at center
            const force = t * t * MOUSE_F;          // quadratic — stronger when closer
            b.vx += (dx / dist) * force * 18;
            b.vy += (dy / dist) * force * 18;
          }
        }

        // Ball–ball soft collision (elastic repulsion)
        balls.forEach(other => {
          if (other === b) return;
          const dx = b.x - other.x;
          const dy = b.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = RADIUS * 2;
          if (dist < minDist && dist > 0.5) {
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            // Push apart
            b.x     += nx * overlap * 0.5;
            b.y     += ny * overlap * 0.5;
            other.x -= nx * overlap * 0.5;
            other.y -= ny * overlap * 0.5;
            // Exchange velocity component along normal (elastic)
            const dvx = b.vx - other.vx;
            const dvy = b.vy - other.vy;
            const dot  = dvx * nx + dvy * ny;
            if (dot < 0) { // only if approaching
              b.vx     -= dot * nx * 0.85;
              b.vy     -= dot * ny * 0.85;
              other.vx += dot * nx * 0.85;
              other.vy += dot * ny * 0.85;
            }
          }
        });

        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Wall bounce — soft (DAMPING < 1)
        if (b.x - RADIUS < 0)   { b.x = RADIUS;   b.vx = Math.abs(b.vx) * DAMPING; }
        if (b.x + RADIUS > W)   { b.x = W - RADIUS; b.vx = -Math.abs(b.vx) * DAMPING; }
        if (b.y - RADIUS < 0)   { b.y = RADIUS;   b.vy = Math.abs(b.vy) * DAMPING; }
        if (b.y + RADIUS > H)   { b.y = H - RADIUS; b.vy = -Math.abs(b.vy) * DAMPING; }

        // Friction — very gentle slowdown
        b.vx *= FRICTION;
        b.vy *= FRICTION;

        // Speed cap
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > 12) { b.vx = (b.vx / spd) * 12; b.vy = (b.vy / spd) * 12; }
        // Minimum speed — keeps them gently alive
        if (spd < 0.2) {
          b.vx += (Math.random() - 0.5) * 0.15;
          b.vy += (Math.random() - 0.5) * 0.15;
        }
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      balls.forEach(b => {
        // Fully solid flat circle — footer content sits above via z-index
        ctx.beginPath();
        ctx.arc(b.x, b.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      });
    }

    let raf;
    function loop() {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    }

    // Only run when footer is visible — stop when off-screen (performance)
    const footerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) loop(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.01 });
    footerObs.observe(footer);

    window.addEventListener('resize', resize, { passive: true });
    resize();
  }

  /* ── LOADER BLOB — color changes on mouse move, throttled ── */
  function initLoaderBlob() {
    const blob = document.querySelector('.ldr-blob');
    const loader = document.getElementById('loader');
    if (!blob || !loader) return;
    const BLOB_COLORS = ['#ffc5c5', '#c5d9ff', '#c5f0d4'];
    let last = -1, cooldown = false;
    loader.addEventListener('mousemove', () => {
      if (cooldown) return;
      cooldown = true;
      let idx;
      do { idx = Math.floor(Math.random() * 3); } while (idx === last);
      last = idx;
      blob.style.background = BLOB_COLORS[idx];
      setTimeout(() => { cooldown = false; }, 700);
    });
  }

  /* ── SECTION BUBBLES — cycle color every 5s between soft red/blue/green ── */
  function initBubbleColors() {
    const bubbles = document.querySelectorAll('.bubble');
    if (!bubbles.length) return;
    // Soft tints — same palette as blob, matches the site's gentle tone
    const SETS = [
      'rgba(229,62,62,0.18)',   // soft red
      'rgba(49,130,206,0.18)',  // soft blue
      'rgba(56,161,105,0.18)',  // soft green
    ];
    let idx = 0;
    function cycle() {
      idx = (idx + 1) % 3;
      bubbles.forEach(b => { b.style.background = SETS[idx]; });
    }
    setInterval(cycle, 5000);
  }

  function init() {
    initLoaderBlob();
    initBubbleColors();
    initHeroLetters();
    initGetInTouch();
    initExperienceBlur();
    initDrawerColors();
    initFooterBalls();

    // Restore any image opacities that may have been left dirty
    ['heroImg','aboutImg','skillsImg','expImg','quoteImg','contactImg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.opacity = '';
    });
    // Remove any ghost element left over
    const old = document.getElementById('morphGhost');
    if (old) old.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
