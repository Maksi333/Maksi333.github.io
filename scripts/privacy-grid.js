/* ============================================================================
 *  privacy-grid.js — renders the app picker at /privacy/ from privacy.js.
 *  You never edit this to add an app; that all lives in scripts/privacy.js.
 *  Loads deferred, after privacy.js, so window.PRIVACY_APPS exists.
 *
 *  Paths are built here rather than stored in the data file, so the data has
 *  no idea where it is being rendered from. Both are relative to /privacy/.
 * ========================================================================== */
(function () {
  'use strict';

  var host = document.getElementById('privacy-grid');
  if (!host) return;

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var APPS = window.PRIVACY_APPS || [];
  var cards = [];
  var empty = document.getElementById('privacy-empty');
  if (empty) empty.hidden = APPS.length !== 0;

  host.innerHTML = '';

  APPS.forEach(function (app) {
    var card = document.createElement('a');
    card.className = 'papp';
    card.setAttribute('href', app.id + '/');

    var logo = document.createElement('img');
    logo.className = 'papp-logo';
    logo.setAttribute('src', '../assets/apps/' + app.id + '/logo.svg');
    logo.setAttribute('alt', '');
    logo.setAttribute('width', '96');
    logo.setAttribute('height', '96');
    logo.setAttribute('loading', 'lazy');

    var updated = document.createElement('span');
    updated.className = 'papp-updated';
    updated.textContent = 'Updated ' + app.updated;

    var art = document.createElement('div');
    art.className = 'papp-art';
    art.appendChild(logo);
    art.appendChild(updated);

    var head = document.createElement('div');
    head.className = 'papp-head';
    var title = document.createElement('h3');
    title.className = 'papp-title';
    title.textContent = app.name;
    var platform = document.createElement('span');
    platform.className = 'tag';
    platform.textContent = app.platform;
    head.appendChild(title);
    head.appendChild(platform);

    var tagline = document.createElement('p');
    tagline.className = 'papp-tagline';
    tagline.textContent = app.tagline;

    var cta = document.createElement('span');
    cta.className = 'papp-cta';
    cta.textContent = 'Read the privacy policy →';

    var body = document.createElement('div');
    body.className = 'papp-body';
    body.appendChild(head);
    body.appendChild(tagline);
    body.appendChild(cta);

    card.appendChild(art);
    card.appendChild(body);
    host.appendChild(card);
    cards.push(card);
  });

  /* These cards are built after app.js has already swept the page for
   * [data-reveal], so they get the same scroll-reveal here — same timings, and
   * the same settled end state (inline opacity 1) once a card comes into view. */
  if (reduced || !window.IntersectionObserver || !cards.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var elm = en.target;
      var d = parseInt(elm.getAttribute('data-reveal-index') || '0', 10);
      elm.style.transitionDelay = Math.min(d, 8) * 65 + 'ms';
      elm.style.opacity = '1';
      elm.style.transform = 'none';
      obs.unobserve(elm);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  cards.forEach(function (card, i) {
    card.setAttribute('data-reveal-index', String(i));
    card.style.opacity = '0';
    card.style.transform = 'translateY(22px)';
    card.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
    obs.observe(card);
  });
})();
