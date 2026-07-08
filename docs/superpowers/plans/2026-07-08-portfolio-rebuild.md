# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Claude-design portfolio prototype as a production-ready, zero-build vanilla static site (`index.html` + `styles.css` + `scripts/app.js`) that renders entirely from `scripts/projects.js` and deploys to GitHub Pages.

**Architecture:** `scripts/projects.js` (globals `window.SITE`/`window.PROJECTS`) and `scripts/app.js` load in order with `defer`. `index.html` is a static shell (head, background layers, header, section scaffolds with static headings + empty mount containers, footer, FAB, overlay root). `app.js` reads the data globals and renders the data-driven parts, then wires all interactions. `styles.css` holds design tokens as CSS custom properties in `:root` plus semantic component classes — same pixel output as the prototype, maintainable form.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla ES2019 JS (no build, no bundler, no framework, no deps). Google Fonts. GitHub Pages.

## Global Constraints

- Content model is sacred: **all owner-editable content lives in `scripts/projects.js`**; rendering never hard-codes name/roles/about/skills/contact/projects. Exceptions matching the prototype: header brand text "Simon N. Andersen" (hardcoded) and static section headings/eyebrows/sub-copy.
- Fidelity is **pixel-accurate** to the prototype. Exact token values live in `reference/DESIGN-SPEC.md` and `reference/Portfolio.dc.html` — copy them verbatim; do not approximate.
- Zero build step, zero runtime dependencies. No `support.js`. No `<x-dc>`/`<sc-for>`/`<sc-if>`/`{{ }}`.
- `prefers-reduced-motion: reduce` must disable: constellation canvas, scroll reveal, role crossfade (instant swap), smooth scroll.
- Accent `#4F8CFF`; base `#0B0D10`; fonts Space Grotesk / Inter / JetBrains Mono.
- Additive a11y upgrades allowed (no visual-spec impact): `<html lang="en">`, `<meta name="theme-color" content="#0B0D10">`, `:focus-visible` outlines, modal focus management.
- Reference source of truth in repo: `reference/Portfolio.dc.html` (markup + inline style values + `DCLogic` interaction logic), `reference/DESIGN-SPEC.md` (token/behavior spec).

---

### Task 1: Repo hygiene & reference reorganization

**Files:**
- Create: `.nojekyll` (empty)
- Create: `.gitattributes`
- Create: `reference/` (dir); Move: `Portfolio.dc.html` → `reference/Portfolio.dc.html`
- Move: `README.md` → `reference/DESIGN-SPEC.md`
- Delete: `original_README.md`

**Interfaces:**
- Produces: `reference/DESIGN-SPEC.md` (authoritative spec referenced by later tasks); `reference/Portfolio.dc.html` (authoritative markup/logic reference).

- [ ] **Step 1: Create `.nojekyll`** (empty file — makes GitHub Pages serve every file untouched).

- [ ] **Step 2: Create `.gitattributes`**

```
* text=auto eol=lf
*.png binary
*.svg text
*.pdf binary
```

- [ ] **Step 3: Move reference files** (`git mv` to preserve history)

```bash
mkdir -p reference
git mv Portfolio.dc.html reference/Portfolio.dc.html
git mv README.md reference/DESIGN-SPEC.md
git rm original_README.md
```

- [ ] **Step 4: Verify** — `git status` shows the moves/rename staged, `original_README.md` deleted. `ls reference/` shows both files.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Reorganize: move prototype + spec to reference/, add Pages files"
```

---

### Task 2: `styles.css` — design tokens + component styles

**Files:**
- Create: `styles.css`

**Interfaces:**
- Produces: CSS classes consumed by `index.html` (Task 3) and `app.js` (Tasks 4–6). Class names below are the contract; use them exactly.

**Class contract (used by later tasks — names are fixed):**
- Layout: `.wrap` (max-width 1200 centered, padding 0 24px), `.section`, background layers `.bg-ambient`, `.bg-constellation`.
- Header/nav: `.site-header`, `.nav`, `.brand`, `.brand-dot`, `.nav-links`, `.nav-link` (+ `.is-active`), `.btn` variants below.
- Buttons: `.btn` `.btn--accent` `.btn--outline` `.btn--sm`; card link pill `.link-pill`.
- Hero: `.hero`, `.hero-blobs`, `.blob` (+ `.blob--a`/`.blob--b`), `.eyebrow`, `.hero-title`, `.hero-role`, `.hero-sub`, `.hero-cta`, `.scroll-hint`.
- Work: `.work`, `.chips`, `.chip` (+ `.is-active`), `.grid`, `.card`, `.thumb`, `.thumbwrap`, `.badge-featured`, `.status-pill`, `.status-dot`, `.card-body`, `.card-head`, `.card-title`, `.card-year`, `.card-tagline`, `.tags`, `.tag`, `.card-links`, `.empty`.
- About: `.about`, `.about-grid`, `.profile`, `.profile-mono`, `.profile-cap`.
- Skills: `.skills`, `.skills-grid`, `.skill-group`, `.skill-group-label`, `.skill-pills`, `.skill-pill`.
- Contact: `.contact`, `.contact-grid`, `.contact-card`, `.contact-label`, `.contact-value`.
- Footer/FAB: `.site-footer`, `.footer-inner`, `.to-top`.
- Modal/lightbox: `.modal-backdrop`, `.modal`, `.modal-cover`, `.modal-close`, `.modal-nav` (+ `.modal-nav--prev`/`--next`), `.modal-body`, `.modal-meta`, `.modal-title`, `.modal-tagline`, `.modal-desc`, `.gallery`, `.gallery-item`, `.modal-links`, `.lightbox`, `.lightbox-img`.

- [ ] **Step 1: `:root` tokens** — declare custom properties for every color/type/space/radius value in `reference/DESIGN-SPEC.md` §Design Tokens and §7 of the design spec. Minimum set:

```css
:root{
  --bg:#0B0D10; --surface:#14181D; --inset:#0f141a; --stripe:#12171d;
  --border:#23292F; --border-inset:#20262d; --border-hairline:#1a1f24; --border-hover:#2f4a7a;
  --text:#E6E9EC; --text-2:#c7cdd4; --text-3:#b7bec6; --muted:#8A93A0; --faint:#5b636e; --faint-2:#4a525d;
  --accent:#4F8CFF; --accent-light:#8fb6ff; --teal:#22D3A8;
  --font-display:'Space Grotesk',sans-serif; --font-ui:Inter,system-ui,-apple-system,sans-serif; --font-mono:'JetBrains Mono',monospace;
  --ease:cubic-bezier(.2,.7,.2,1);
  --stripe-bg:repeating-linear-gradient(135deg,#12171d 0px,#12171d 12px,#0f141a 12px,#0f141a 24px);
}
```

- [ ] **Step 2: Base/reset** — port the prototype `<style>` block: `html{scroll-behavior:smooth;scroll-padding-top:88px}`, `body` (bg/color/font/line-height/antialiasing), `*{box-sizing:border-box}`, `::selection`, `a`, scrollbar rules, keyframes `gridMove`/`blob`/`fadeUp`. Add `:focus-visible{outline:2px solid var(--accent);outline-offset:2px}` and a `@media (prefers-reduced-motion: reduce)` block matching the prototype (animation/transition ~0, `scroll-behavior:auto`) plus `@media (max-width:700px){.nav-links{display:none}}`.

- [ ] **Step 3: Component classes** — translate each element's inline `style="..."` from `reference/Portfolio.dc.html` into the class contract above, value-for-value, including hover/transition rules the prototype defines via `[data-*]` selectors (card lift, thumb scale 1.06, cta lift, chip/link/contact-card hovers, to-top transition). Use tokens for colors.

- [ ] **Step 4: Verify** — open `reference/Portfolio.dc.html` values side-by-side; spot-check that card/modal/hero/chip/contact colors, radii, paddings, and font sizes match exactly. No hard-coded hex where a token exists.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "Add styles.css: design tokens + component styles"
```

---

### Task 3: `index.html` — static shell

**Files:**
- Create: `index.html` (overwrites the DC copy)

**Interfaces:**
- Consumes: `styles.css` classes (Task 2).
- Produces: DOM mount points consumed by `app.js` (Tasks 4–6), with these exact ids: `#hero-name`, `#hero-role`, `#chips`, `#grid`, `#empty` (hidden by default), `#about-text`, `#skills-grid`, `#contact-grid`, `#footer-name`, `#footer-year`, `#overlay-root` (empty container for modal/lightbox). Résumé CTAs carry `data-resume` so `app.js` can set their `href`.

- [ ] **Step 1: `<head>`** — `<html lang="en">`; charset/viewport; title + meta description + og/twitter tags + favicon exactly as `reference/Portfolio.dc.html` `<helmet>`; `<meta name="theme-color" content="#0B0D10">`; Google Fonts preconnect + stylesheet link; `<link rel="stylesheet" href="styles.css">`; `<script defer src="scripts/projects.js"></script>` then `<script defer src="scripts/app.js"></script>`.

- [ ] **Step 2: Background layers + header** — `.bg-ambient` div (`aria-hidden`) with the radial-gradient background; `<canvas class="bg-constellation" data-constellation aria-hidden>`; `.site-header` with brand (dot + "Simon N. Andersen"), `.nav-links` (Work/About/Skills/Contact anchors with `data-nav` = section id), and résumé `.btn.btn--accent` with `data-resume target="_blank" rel="noopener"`.

- [ ] **Step 3: `<main id="top">` sections** — port structure from the prototype, replacing `{{ }}`/`sc-*` with static headings + empty mount containers:
  - Hero: eyebrow, `<h1 id="hero-name" class="hero-title">`, `<div class="hero-role"><span id="hero-role"></span></div>`, static sub-paragraph, CTA row (View Work / Résumé[`data-resume`] / Contact), scroll hint, `.hero-blobs`.
  - Work `#work`: reveal header (eyebrow/h2 "Selected Work"/sub-copy), `<div id="chips" class="chips">`, `<div id="grid" class="grid">`, `<div id="empty" class="empty" hidden>No projects in this category yet.</div>`.
  - About `#about`: two-column; left eyebrow/h2 "Idea to shipped, with AI in the loop."/`<p id="about-text">`; right `.profile` placeholder ("SNA" + "assets/profile.jpg").
  - Skills `#skills`: eyebrow/h2 "Stack & tools"/`<div id="skills-grid" class="skills-grid">`.
  - Contact `#contact`: centered header/`<div id="contact-grid" class="contact-grid">`.
  - Footer: `.footer-inner` with `© <span id="footer-year"></span> <span id="footer-name"></span>`, "Built with HTML, CSS & a lot of AI.", back-to-top link.
  - `<button class="to-top" data-totop aria-label="Back to top" hidden>↑</button>` and `<div id="overlay-root"></div>` before `</body>`.

- [ ] **Step 4: Verify** — open `index.html` in a browser. Static chrome renders (header, headings, footer, background glow) with no console errors. Data-driven areas are empty (expected until Task 4). No 404 for `support.js` (it's gone).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add index.html: static shell + mount points (drops DC runtime)"
```

---

### Task 4: `scripts/app.js` — data bootstrap + rendering

**Files:**
- Create: `scripts/app.js`

**Interfaces:**
- Consumes: `window.SITE`, `window.PROJECTS`; DOM ids from Task 3.
- Produces (module-internal, used by Tasks 5–6): `state` object `{cat, roleIdx, roleOpacity, modalId, lightbox, copiedEmail}`; `statusColor(status)`; `strip(url)`; `augment(project, idx)` → object with `linkList`, `hasLinks`, `galleryList`, `hasGallery`, `statusColor`, plus `id/title/...`; `orderedProjects()` → filtered+sorted augmented array; `orderedIds` (array, refreshed each grid render); `renderGrid()`, `renderChips()`, `renderAll()`; `el(tag, props, children)` DOM helper; `reduced` (boolean).

- [ ] **Step 1: Boilerplate + helpers** — IIFE. `const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches`. `el(tag, props, kids)` creating elements (sets className/textContent/attributes/dataset/event handlers). `statusColor` map (`Live`/`In Development`/`Prototype` → teal/`#F5C542`/`#A78BFA`, fallback `--muted` hex `#8A93A0`). `strip(u)` = `(u||'').replace(/^https?:\/\//,'').replace(/\/$/,'')`. `augment(p, idx)` builds link list in order `[github, demo, playStore, appStore, video, caseStudy]` with labels `GitHub/Live Demo/Play Store/App Store/Video/Case Study`, gallery list, status color — port from `DCLogic._augment`.

- [ ] **Step 2: `state` + `renderAll()`** — module-scope `state`. `renderAll()` populates static-from-data slots: `#hero-name` ← `SITE.name`; `#hero-role` ← current role; `#about-text` ← `SITE.about`; `#footer-name` ← `SITE.name`; `#footer-year` ← `new Date().getFullYear()`; every `[data-resume]` href ← `SITE.contact.resume || '#'`; then calls `renderChips()`, `renderGrid()`, `renderSkills()`, `renderContact()`.

- [ ] **Step 3: `renderChips()` / `renderGrid()`** — categories = `['All', ...unique p.category]`; build `.chip` buttons, active when `state.cat===label`, click sets `state.cat` and re-renders chips + grid. `orderedProjects()` filters by `cat`, sorts `featured-first then year desc`, maps `augment`. `renderGrid()` clears `#grid`, sets `orderedIds`, appends a `.card` per project (thumb with layered `background-image` over `--stripe-bg`, featured badge, status pill+dot, body: title+year row, tagline, tags, link pills with `stopPropagation`), toggles `#empty` `hidden` when list empty. Card is `role=button tabindex=0`; wire open handler in Task 5 (leave `data-id` now).

- [ ] **Step 4: `renderSkills()` / `renderContact()`** — skills: one `.skill-group` per `SITE.skills` group (label + `.skill-pill` per item). Contact: build only non-empty of email/github/linkedin/resume; email card `href="mailto:"+email`, display email, suffix `⧉`, `target=_self`; others external with suffix `↗`, `target=_blank`; email card copy handler wired in Task 6 (leave `data-email` now).

- [ ] **Step 5: Bootstrap** — `renderAll()` on script load (data is guaranteed present via ordered `defer`). No `_loadData` retry loop.

- [ ] **Step 6: Verify** — reload `index.html`. Placeholder content renders: name, rotating-role text (static for now), about, 5 sample cards sorted featured-first, filter chips (All/Mobile App/Web App/Data), skills groups, contact cards, footer year/name. Résumé buttons point to `assets/resume.pdf`. No console errors.

- [ ] **Step 7: Commit**

```bash
git add scripts/app.js
git commit -m "app.js: render hero, grid, chips, skills, contact from data"
```

---

### Task 5: `scripts/app.js` — filter, modal, lightbox, keyboard

**Files:**
- Modify: `scripts/app.js`

**Interfaces:**
- Consumes: `augment`, `orderedIds`, `state`, `#overlay-root` (Task 4/3).
- Produces: `openProject(id)`, `closeModal()`, `navModal(dir)`, `openLightbox(src)`, `closeLightbox()`, `renderOverlay()` (rebuilds `#overlay-root` contents from `state.modalId`/`state.lightbox`).

- [ ] **Step 1: Card open wiring** — in `renderGrid()`, attach `click` → `openProject(id)` and `keydown` Enter/Space (preventDefault) → `openProject(id)`; link pills `stopPropagation`.

- [ ] **Step 2: `renderOverlay()`** — clears `#overlay-root`; if `state.modalId`, build `.modal-backdrop` (click-outside → close) + `.modal` (`role=dialog aria-modal=true`) from the augmented modal project: cover, close ×, prev/next (only if `orderedIds.length>1`), meta row (category/status+dot/year), title, tagline, description, tags, gallery (`.gallery-item` zoom-in → `openLightbox`), link CTAs. If `state.lightbox`, append `.lightbox` (click/zoom-out → close) with `.lightbox-img`. Set `document.body.style.overflow` = modal-open ? `hidden` : `''`.

- [ ] **Step 3: open/close/nav** — `openProject` sets `modalId`, remembers `document.activeElement` as `lastFocus`, calls `renderOverlay()`, focuses the modal dialog. `closeModal` clears `modalId`, `renderOverlay()`, restores `lastFocus?.focus()`. `navModal(dir)` moves `modalId` along `orderedIds` with wraparound. `openLightbox/closeLightbox` set/clear `state.lightbox` + `renderOverlay()`.

- [ ] **Step 4: Keyboard** — `document.addEventListener('keydown')`: Escape → close lightbox first else modal; if modal open and no lightbox, ArrowLeft → `navModal(-1)`, ArrowRight → `navModal(1)` — port from `DCLogic._onKeyDown`.

- [ ] **Step 5: Verify** — click a card → modal opens, body scroll locks, focus moves to dialog. ×/backdrop/Esc close and restore focus. Arrow keys + prev/next cycle projects (wrap). Filter to "Data" (1 item) → arrows/prev-next hidden. Filter to a category with a gallery project (esk8-tracker under "Mobile App") → gallery thumbs open lightbox; Esc closes lightbox before modal. Filter empty category (none by default) — verify empty-state by temporarily selecting; grid shows message. No console errors.

- [ ] **Step 6: Commit**

```bash
git add scripts/app.js
git commit -m "app.js: project modal, lightbox, filter, keyboard nav"
```

---

### Task 6: `scripts/app.js` — ambient interactions & reduced-motion

**Files:**
- Modify: `scripts/app.js`

**Interfaces:**
- Consumes: `reduced`, `state`, DOM (`[data-constellation]`, `[data-reveal]`, `[data-nav]`, `[data-totop]`, `[data-email]`).

- [ ] **Step 1: Role rotation** — `setInterval(2800)`: if `SITE.roles.length<2` return; if `reduced` advance `roleIdx` instantly + update `#hero-role`; else set role span opacity 0, after 380ms advance `roleIdx`, update text, opacity 1. Port from `DCLogic._startRoles`.

- [ ] **Step 2: Scroll reveal** — if `!reduced`: IntersectionObserver (threshold 0.12, `rootMargin 0px 0px -6% 0px`) on `[data-reveal]`; init `opacity:0; translateY(22px); transition .6s var(--ease)`; on intersect set `transitionDelay = min(index,8)*65ms`, opacity 1, transform none, unobserve. Add `data-reveal`/`data-reveal-index` to the reveal targets (assign in render for grid cards + skill groups; static reveal blocks get `data-reveal` in `index.html` Task 3 — add there). Under `reduced`, elements stay fully visible (no observer).

- [ ] **Step 3: Active nav** — IntersectionObserver on `#work/#about/#skills/#contact`, `rootMargin -45% 0px -50% 0px`; intersecting section → matching `[data-nav]` gets `.is-active`. Port from `DCLogic._setupNav`.

- [ ] **Step 4: Back-to-top** — `scroll` (passive): toggle `.to-top` visible when `scrollY>600` (remove `hidden`, opacity/transform via class); click → `scrollTo({top:0, behavior: reduced?'auto':'smooth'})`.

- [ ] **Step 5: Constellation** — if `!reduced`: port `DCLogic._setupParallax` exactly (DPR≤2, particle count `min(140, round(w*h/15000))`, ±0.28 velocity, edge bounce, 170px cursor pull 0.55/frame, 130px links `rgba(79,140,255,(1-d/130)*.22)`, dots r1.5/`rgba(110,140,190,.5)` → near r2.4/`rgba(143,182,255,.9)`, rebuild on resize, rAF loop). Skip entirely under `reduced`.

- [ ] **Step 6: Email copy** — `[data-email]` click: `preventDefault`; `navigator.clipboard.writeText(email)` then set `copiedEmail`, flip label to "Email — copied ✓" for 1800ms then revert; fallback to plain behavior if clipboard missing. Port from `DCLogic._copyEmail`.

- [ ] **Step 7: Verify** — roles rotate every ~2.8s with crossfade. Scroll: sections reveal with stagger; active nav link highlights per section. Constellation animates and reacts to cursor; back-to-top appears past 600px and scrolls up. Email card copies + shows "copied ✓" ~1.8s. Toggle OS reduced-motion → constellation off, roles swap instantly, no reveal animation, instant scroll. No console errors.

- [ ] **Step 8: Commit**

```bash
git add scripts/app.js
git commit -m "app.js: constellation, reveal, active nav, FAB, email copy, reduced-motion"
```

---

### Task 7: README rewrite + full verification pass

**Files:**
- Create: `README.md` (root, fresh owner-facing guide)

**Interfaces:**
- Consumes: the finished site.

- [ ] **Step 1: Write root `README.md`** — owner-facing, accurate to the vanilla build. Sections: what it is; **how to add a project** (edit `scripts/projects.js` only); edit name/bio/skills/contact; project field table; assets to supply (`resume.pdf`, `profile.jpg`, `assets/projects/<id>/cover.png`); deploy to GitHub Pages (Option A user site / Option B project site) — deploy file list is `index.html`, `styles.css`, `scripts/projects.js`, `scripts/app.js`, `.nojekyll`, `assets/…` (**no `support.js`**); note the design reference lives in `reference/`. Base on `reference/DESIGN-SPEC.md` §Files and the old owner guide, corrected.

- [ ] **Step 2: Full verification walkthrough** — run the site (use the `run` skill / open in browser). Walk the entire §8 verification checklist from the design spec: render, roles, filter + empty-state, modal open/close/prev-next/keys, gallery→lightbox + Esc order, email copy, back-to-top, responsive (<700px nav collapse + grid reflow), reduced-motion, no console errors, missing images → stripes. Fix any fidelity gap found against `reference/Portfolio.dc.html`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add owner-facing README (edit + GitHub Pages deploy guide)"
```

- [ ] **Step 4: Final sanity** — `git status` clean; `git log --oneline` shows the task commits; repo root contains `index.html`, `styles.css`, `scripts/{projects.js,app.js}`, `.nojekyll`, `.gitattributes`, `README.md`, `reference/`, `assets/`.

---

## Self-Review

**Spec coverage:**
- Stack/vanilla/zero-build → Tasks 2–4 (no deps, defer scripts). ✓
- One-data-file model → Task 4 renders everything from `SITE`/`PROJECTS`; Task 7 README. ✓
- File layout & disposition (moves/deletes) → Task 1. ✓
- Rendering (helpers, chips, sort, links, gallery, empty-state) → Task 4/5. ✓
- All interactions (roles, reveal, nav, constellation, FAB, modal, lightbox, email copy) → Tasks 5–6. ✓
- Reduced-motion branches → Tasks 2 (CSS) + 6 (JS). ✓
- A11y upgrades (lang, theme-color, focus-visible, modal focus) → Tasks 2/3/5. ✓
- Design tokens → Task 2. ✓
- Verification → Tasks 4/5/6 per-task + Task 7 full pass. ✓
- GitHub Pages readiness (`.nojekyll`, relative paths, README) → Tasks 1/3/7. ✓

**Placeholder scan:** No TBD/TODO; references to prototype/spec are to in-repo authoritative sources with exact values, not deferrals. ✓

**Type/name consistency:** DOM ids (`#hero-name`, `#hero-role`, `#chips`, `#grid`, `#empty`, `#about-text`, `#skills-grid`, `#contact-grid`, `#footer-name`, `#footer-year`, `#overlay-root`) and function names (`augment`, `orderedIds`, `renderGrid`, `openProject`, `renderOverlay`, `openLightbox`, `statusColor`, `strip`) are consistent across Tasks 3–6. Class contract fixed in Task 2 and reused. ✓
