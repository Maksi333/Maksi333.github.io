/* ============================================================================
 *  app.js — renders the site from scripts/projects.js and wires interactions.
 *  You never edit this to add a project; that all lives in projects.js.
 *  Loads deferred, after projects.js, so window.SITE / window.PROJECTS exist.
 * ========================================================================== */
(function () {
  'use strict';

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var SITE = window.SITE || {};
  var PROJECTS = window.PROJECTS || [];

  var state = { cat: 'All', roleIdx: 0, modalId: null, lightbox: null, copiedEmail: false };
  var orderedIds = [];
  var lastFocus = null;
  var copyTimer = null;
  var revObs = null;

  /* -------------------------------------------------------------------------
   *  DOM helper
   * ----------------------------------------------------------------------- */
  function el(tag, props, kids) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'onClick') node.addEventListener('click', v);
      else if (k === 'onKeyDown') node.addEventListener('keydown', v);
      else node.setAttribute(k, v);
    });
    if (kids != null) {
      if (!Array.isArray(kids)) kids = [kids];
      kids.forEach(function (c) {
        if (c == null || c === false) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function byId(id) { return document.getElementById(id); }
  function setText(id, txt) { var n = byId(id); if (n) n.textContent = txt; }

  /* -------------------------------------------------------------------------
   *  Helpers ported from the prototype's DCLogic
   * ----------------------------------------------------------------------- */
  function statusColor(status) {
    return ({ 'Live': '#22D3A8', 'In Development': '#F5C542', 'Prototype': '#A78BFA' })[status] || '#8A93A0';
  }

  function strip(u) { return (u || '').replace(/^https?:\/\//, '').replace(/\/$/, ''); }

  /* [key, label, arrow]. `apk` is a file in this repo rather than an outbound
   * link, so it gets a download arrow and the download attribute. */
  var LINK_ORDER = [
    ['github', 'GitHub'], ['demo', 'Live Demo'], ['playStore', 'Play Store'],
    ['appStore', 'App Store'], ['apk', 'Download APK', '↓'], ['video', 'Video'], ['caseStudy', 'Case Study']
  ];

  function augment(p) {
    var l = p.links || {};
    var links = [];
    LINK_ORDER.forEach(function (pair) {
      if (!l[pair[0]]) return;
      links.push({ href: l[pair[0]], label: pair[1], arrow: pair[2] || '↗', download: pair[0] === 'apk' });
    });
    var gallery = p.gallery || [];
    return {
      id: p.id, title: p.title, tagline: p.tagline, category: p.category, description: p.description,
      thumbnail: p.thumbnail, logo: p.logo, logoGlow: p.logoGlow,
      status: p.status, year: p.year, featured: p.featured,
      tags: p.tags || [],
      links: links, hasLinks: links.length > 0,
      gallery: gallery, hasGallery: gallery.length > 0,
      statusColor: statusColor(p.status)
    };
  }

  function categories() {
    var cats = ['All'];
    PROJECTS.forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
    return cats;
  }

  function orderedProjects() {
    return PROJECTS
      .filter(function (p) { return state.cat === 'All' || p.category === state.cat; })
      .slice()
      .sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.year || 0) - (a.year || 0); })
      .map(augment);
  }

  /* -------------------------------------------------------------------------
   *  Rendering
   * ----------------------------------------------------------------------- */
  function renderStatic() {
    setText('hero-name', SITE.name || '');
    setText('about-text', SITE.about || '');
    setText('footer-name', SITE.name || '');
    setText('footer-year', String(new Date().getFullYear()));
    var roles = (SITE.roles && SITE.roles.length) ? SITE.roles : ['Software Developer'];
    setText('hero-role', roles[state.roleIdx % roles.length] || '');
    // Subpages (e.g. /privacy/) set window.SITE_ROOT to their path back to the
    // site root, so a relative résumé path from projects.js still resolves.
    var resume = (SITE.contact && SITE.contact.resume) || '#';
    var rooted = /^([a-z]+:)?\/\//i.test(resume) || resume.charAt(0) === '/' || resume.charAt(0) === '#';
    if (!rooted) resume = (window.SITE_ROOT || '') + resume;
    Array.prototype.forEach.call(document.querySelectorAll('[data-resume]'), function (a) { a.setAttribute('href', resume); });
  }

  function renderChips() {
    var host = byId('chips'); if (!host) return;
    host.innerHTML = '';
    categories().forEach(function (label) {
      var active = state.cat === label;
      host.appendChild(el('button', {
        'class': 'chip' + (active ? ' is-active' : ''),
        type: 'button',
        text: label,
        onClick: function () { state.cat = label; renderChips(); renderGrid(); applyReveal(); }
      }));
    });
  }

  /* A project shows either a wide screenshot (`thumbnail`, stretched to fill) or
   * a square app icon (`logo`, centred on a glow like the /privacy/ picker).
   * `logoGlow` tints that glow; leaving it out falls back to the site accent. */
  function glowStyle(p) { return p.logoGlow ? '--logo-glow:' + p.logoGlow + ';' : null; }

  function cardEl(p, i) {
    var thumbKids = [p.logo
      ? el('img', { 'class': 'thumb-logo', src: p.logo, alt: '', width: '104', height: '104', loading: 'lazy' })
      : el('div', { 'class': 'thumbwrap', style: "background-image:url('" + p.thumbnail + "'),var(--stripe);" })];
    if (p.featured) thumbKids.push(el('span', { 'class': 'badge-featured', text: 'Featured' }));
    thumbKids.push(el('span', { 'class': 'status-pill' }, [
      el('span', { 'class': 'status-dot', style: 'background:' + p.statusColor + ';' }),
      p.status
    ]));

    var bodyKids = [
      el('div', { 'class': 'card-head' }, [
        el('h3', { 'class': 'card-title', text: p.title }),
        el('span', { 'class': 'card-year', text: String(p.year || '') })
      ]),
      el('p', { 'class': 'card-tagline', text: p.tagline }),
      el('div', { 'class': 'tags' }, p.tags.map(function (t) { return el('span', { 'class': 'tag', text: t }); }))
    ];
    if (p.hasLinks) {
      bodyKids.push(el('div', { 'class': 'card-links' }, p.links.map(function (lnk) {
        return el('a', {
          'class': 'link-pill', href: lnk.href, target: '_blank', rel: 'noopener',
          download: lnk.download ? '' : null,
          text: lnk.label + ' ' + lnk.arrow,
          onClick: function (e) { e.stopPropagation(); }
        });
      })));
    }

    return el('article', {
      'class': 'card', 'data-reveal': '', 'data-reveal-index': String(i),
      role: 'button', tabindex: '0',
      onClick: function () { openProject(p.id); },
      onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(p.id); } }
    }, [
      el('div', { 'class': 'thumb' + (p.logo ? ' thumb--logo' : ''), style: glowStyle(p) }, thumbKids),
      el('div', { 'class': 'card-body' }, bodyKids)
    ]);
  }

  function renderGrid() {
    var host = byId('grid'); if (!host) return;
    host.innerHTML = '';
    var list = orderedProjects();
    orderedIds = list.map(function (p) { return p.id; });
    var emptyEl = byId('empty');
    if (emptyEl) emptyEl.hidden = list.length !== 0;
    list.forEach(function (p, i) { host.appendChild(cardEl(p, i)); });
  }

  function renderSkills() {
    var host = byId('skills-grid'); if (!host) return;
    host.innerHTML = '';
    (SITE.skills || []).forEach(function (g, i) {
      host.appendChild(el('div', { 'class': 'skill-group', 'data-reveal': '', 'data-reveal-index': String(i) }, [
        el('div', { 'class': 'skill-group-label', text: g.group }),
        el('div', { 'class': 'skill-pills' }, (g.items || []).map(function (s) { return el('span', { 'class': 'skill-pill', text: s }); }))
      ]));
    });
  }

  function renderContact() {
    var host = byId('contact-grid'); if (!host) return;
    host.innerHTML = '';
    var c = SITE.contact || {};
    var items = [];
    if (c.email) items.push({ label: state.copiedEmail ? 'Email — copied ✓' : 'Email', href: 'mailto:' + c.email, display: c.email, suffix: '  ⧉', target: '_self', email: c.email });
    if (c.github) items.push({ label: 'GitHub', href: c.github, display: strip(c.github), suffix: '  ↗', target: '_blank' });
    if (c.linkedin) items.push({ label: 'LinkedIn', href: c.linkedin, display: strip(c.linkedin), suffix: '  ↗', target: '_blank' });
    if (c.resume) items.push({ label: 'Résumé', href: c.resume, display: 'Download PDF', suffix: '  ↗', target: '_blank' });

    items.forEach(function (it) {
      var props = { 'class': 'contact-card', href: it.href, target: it.target, rel: 'noopener' };
      if (it.email) { props['data-email'] = it.email; props.onClick = function (e) { copyEmail(e, it.email); }; }
      host.appendChild(el('a', props, [
        el('span', { 'class': 'contact-label', text: it.label }),
        el('span', { 'class': 'contact-value', text: it.display + it.suffix })
      ]));
    });
  }

  function renderAll() {
    renderStatic();
    renderChips();
    renderGrid();
    renderSkills();
    renderContact();
    applyReveal();
  }

  function copyEmail(e, email) {
    e.preventDefault();
    function done() {
      state.copiedEmail = true;
      renderContact();
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { state.copiedEmail = false; renderContact(); }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done).catch(done);
    else done();
  }

  /* -------------------------------------------------------------------------
   *  Project modal + lightbox (rendered into #overlay-root)
   * ----------------------------------------------------------------------- */
  function buildModal(p) {
    var coverKids = [el('button', { 'class': 'modal-close', 'aria-label': 'Close', type: 'button', text: '×', onClick: closeModal })];
    if (p.logo) coverKids.unshift(el('img', { 'class': 'modal-cover-logo', src: p.logo, alt: p.title + ' app icon', width: '132', height: '132' }));
    if (orderedIds.length > 1) {
      coverKids.push(el('button', { 'class': 'modal-nav modal-nav--prev', 'aria-label': 'Previous project', type: 'button', text: '‹', onClick: function () { navModal(-1); } }));
      coverKids.push(el('button', { 'class': 'modal-nav modal-nav--next', 'aria-label': 'Next project', type: 'button', text: '›', onClick: function () { navModal(1); } }));
    }

    var bodyKids = [
      el('div', { 'class': 'modal-meta' }, [
        el('span', { 'class': 'modal-pill', text: p.category }),
        el('span', { 'class': 'modal-pill modal-pill--status' }, [
          el('span', { 'class': 'status-dot', style: 'background:' + p.statusColor + ';' }),
          p.status
        ]),
        el('span', { 'class': 'modal-year', text: String(p.year || '') })
      ]),
      el('h3', { 'class': 'modal-title', id: 'modal-title-h', text: p.title }),
      el('p', { 'class': 'modal-tagline', text: p.tagline }),
      el('p', { 'class': 'modal-desc', text: p.description }),
      el('div', { 'class': 'modal-tags' }, p.tags.map(function (t) { return el('span', { 'class': 'tag', text: t }); }))
    ];
    if (p.hasGallery) {
      bodyKids.push(el('div', { 'class': 'gallery' }, p.gallery.map(function (src) {
        return el('div', {
          'class': 'gallery-item', role: 'button', tabindex: '0',
          'aria-label': 'Enlarge screenshot',
          style: "background-image:url('" + src + "'),var(--stripe);",
          onClick: function () { openLightbox(src); },
          onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(src); } }
        });
      })));
    }
    if (p.hasLinks) {
      bodyKids.push(el('div', { 'class': 'modal-links' }, p.links.map(function (lnk) {
        return el('a', {
          'class': 'btn btn--accent btn--modal', href: lnk.href, target: '_blank', rel: 'noopener',
          download: lnk.download ? '' : null, text: lnk.label + ' ' + lnk.arrow
        });
      })));
    }

    var coverProps = p.logo
      ? { 'class': 'modal-cover modal-cover--logo', style: glowStyle(p) }
      : { 'class': 'modal-cover', style: "background-image:url('" + p.thumbnail + "'),var(--stripe-lg);" };

    var dialog = el('div', { 'class': 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title-h', tabindex: '-1' }, [
      el('div', coverProps, coverKids),
      el('div', { 'class': 'modal-body' }, bodyKids)
    ]);

    return el('div', { 'class': 'modal-backdrop', onClick: function (e) { if (e.target === e.currentTarget) closeModal(); } }, [dialog]);
  }

  function buildLightbox(src) {
    return el('div', { 'class': 'lightbox', onClick: closeLightbox }, [
      el('img', { 'class': 'lightbox-img', src: src, alt: 'Project screenshot enlarged' })
    ]);
  }

  function renderOverlay() {
    var root = byId('overlay-root'); if (!root) return;
    root.innerHTML = '';
    if (state.modalId) {
      var raw = PROJECTS.filter(function (p) { return p.id === state.modalId; })[0];
      if (raw) root.appendChild(buildModal(augment(raw)));
    }
    if (state.lightbox) root.appendChild(buildLightbox(state.lightbox));
    document.body.style.overflow = state.modalId ? 'hidden' : '';
  }

  function focusModal() { var dlg = document.querySelector('.modal'); if (dlg) dlg.focus(); }

  function openProject(id) {
    lastFocus = document.activeElement;
    state.modalId = id;
    renderOverlay();
    focusModal();
  }
  function closeModal() {
    state.modalId = null; state.lightbox = null;
    renderOverlay();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }
  function navModal(dir) {
    var i = orderedIds.indexOf(state.modalId);
    if (i === -1 || orderedIds.length < 2) return;
    state.modalId = orderedIds[(i + dir + orderedIds.length) % orderedIds.length];
    renderOverlay();
    focusModal();
  }
  function openLightbox(src) { state.lightbox = src; renderOverlay(); }
  function closeLightbox() { state.lightbox = null; renderOverlay(); }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (state.lightbox) { closeLightbox(); return; }
      if (state.modalId) { closeModal(); }
      return;
    }
    if (state.modalId && !state.lightbox) {
      if (e.key === 'ArrowLeft') navModal(-1);
      else if (e.key === 'ArrowRight') navModal(1);
    }
  });

  /* -------------------------------------------------------------------------
   *  Ambient interactions
   * ----------------------------------------------------------------------- */
  function startRoles() {
    var roleEl = byId('hero-role');
    setInterval(function () {
      var roles = SITE.roles || [];
      if (roles.length < 2) return;
      if (reduced) {
        state.roleIdx = (state.roleIdx + 1) % roles.length;
        if (roleEl) roleEl.textContent = roles[state.roleIdx];
        return;
      }
      if (roleEl) roleEl.style.opacity = '0';
      setTimeout(function () {
        state.roleIdx = (state.roleIdx + 1) % roles.length;
        if (roleEl) { roleEl.textContent = roles[state.roleIdx]; roleEl.style.opacity = '1'; }
      }, 380);
    }, 2800);
  }

  function applyReveal() {
    if (reduced) return;
    if (!revObs) {
      revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var elm = en.target;
            var d = parseInt(elm.getAttribute('data-reveal-index') || '0', 10);
            elm.style.transitionDelay = Math.min(d, 8) * 65 + 'ms';
            elm.style.opacity = '1';
            elm.style.transform = 'none';
            revObs.unobserve(elm);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    }
    var els = document.querySelectorAll('[data-reveal]:not([data-reveal-done])');
    Array.prototype.forEach.call(els, function (elm) {
      elm.setAttribute('data-reveal-done', '');
      elm.style.opacity = '0';
      elm.style.transform = 'translateY(22px)';
      elm.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
      revObs.observe(elm);
    });
  }

  function setupNav() {
    var ids = ['work', 'about', 'skills', 'contact'];
    var sections = ids.map(function (id) { return byId(id); }).filter(Boolean);
    if (!sections.length) return;
    var links = document.querySelectorAll('[data-nav]');
    function setActive(id) {
      Array.prototype.forEach.call(links, function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-nav') === id);
      });
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  function setupBackToTop() {
    var btn = document.querySelector('[data-totop]'); if (!btn) return;
    function onScroll() { btn.classList.toggle('is-visible', window.scrollY > 600); }
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setupConstellation() {
    if (reduced) return;
    var cv = document.querySelector('[data-constellation]'); if (!cv) return;
    var ctx = cv.getContext('2d'); if (!ctx) return;
    var S = { w: 0, h: 0, mx: -9999, my: -9999, dpr: Math.min(window.devicePixelRatio || 1, 2) };
    var parts = [];
    function build() {
      var n = Math.min(140, Math.round(S.w * S.h / 15000));
      parts = [];
      for (var i = 0; i < n; i++) parts.push({ x: Math.random() * S.w, y: Math.random() * S.h, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28 });
    }
    function resize() {
      S.w = window.innerWidth; S.h = window.innerHeight;
      cv.width = S.w * S.dpr; cv.height = S.h * S.dpr;
      ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
      build();
    }
    window.addEventListener('mousemove', function (e) { S.mx = e.clientX; S.my = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', function () { S.mx = -9999; S.my = -9999; });
    window.addEventListener('resize', resize);
    resize();
    function draw() {
      var i, j;
      ctx.clearRect(0, 0, S.w, S.h);
      for (i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > S.w) p.vx *= -1;
        if (p.y < 0 || p.y > S.h) p.vy *= -1;
        var dx = S.mx - p.x, dy = S.my - p.y, d = Math.hypot(dx, dy);
        if (d < 170 && d > 0.1) { p.x += dx / d * .55; p.y += dy / d * .55; }
      }
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j < parts.length; j++) {
          var a = parts[i], b = parts[j], dd = Math.hypot(a.x - b.x, a.y - b.y);
          if (dd < 130) {
            ctx.strokeStyle = 'rgba(79,140,255,' + (1 - dd / 130) * .22 + ')';
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < parts.length; i++) {
        var pp = parts[i];
        var near = Math.hypot(S.mx - pp.x, S.my - pp.y) < 170;
        ctx.fillStyle = near ? 'rgba(143,182,255,.9)' : 'rgba(110,140,190,.5)';
        ctx.beginPath(); ctx.arc(pp.x, pp.y, near ? 2.4 : 1.5, 0, 7); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* -------------------------------------------------------------------------
   *  Boot
   * ----------------------------------------------------------------------- */
  renderAll();
  startRoles();
  setupNav();
  setupBackToTop();
  setupConstellation();
})();
