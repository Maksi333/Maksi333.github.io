# Portfolio Rebuild — Design Spec

**Date:** 2026-07-08
**Owner:** Simon Nørgaard Andersen
**Goal:** Turn the Claude-design handoff (a proprietary "Design Component" prototype) into a production-ready, zero-build static portfolio website, deployable to GitHub Pages, that Simon can use when applying for jobs.

---

## 1. Background & problem

The handoff bundle contains a pixel-accurate design authored in a proprietary **Design Component** format: `Portfolio.dc.html` and its deploy copy `index.html` use `<x-dc>`, `<sc-for>`/`<sc-if>`, `{{ }}` bindings, and a `DCLogic` class, all driven by a `./support.js` runtime.

**That runtime is not in the bundle and must not be ported.** As delivered, `index.html` 404s on `./support.js` and renders nothing — the site cannot run or deploy. The stale `original_README.md` still lists `support.js` as a required deploy file.

The real task, per the handoff `README.md`, is to **recreate the design in a production environment** while preserving the defining architectural rule: **all owner-editable content lives in one file** (`scripts/projects.js`), and adding a project or editing bio/contact never touches layout or styling.

## 2. Decisions (locked with owner)

| Decision | Choice | Rationale |
|---|---|---|
| Stack | **Vanilla HTML/CSS/JS**, zero build | Most reliable "just works" choice for a static one-pager; deploys to GitHub Pages as-is; no toolchain to rot; matches the handoff's zero-build intent. |
| Content | **Keep placeholders** | Owner does the content pass later by editing `scripts/projects.js`. Build is identical regardless of data. |
| Deploy/VCS | **git init + GitHub Pages-ready** | `git init` on `main` (done), `.nojekyll`, relative paths, rewritten README. Owner creates the GitHub repo and pushes. |
| Port style | **Clean production rebuild (Approach B)** | Same pixel output as the prototype, but design tokens as CSS custom properties and semantic classes — maintainable, reads like production code. |

**Rejected:** literal inline-style port (unmaintainable wall of inline styles); modular/build-step/ES-modules/tests (over-engineered — YAGNI for a static one-pager).

## 3. Architecture

Everything renders from `scripts/projects.js` — two globals, unchanged content model:
- `window.SITE`: `{ name, roles[], about, skills[{group, items[]}], contact{email, github, linkedin, resume} }`
- `window.PROJECTS`: `[{ id, title, tagline, category, tags[], description, thumbnail, gallery[], status, year, featured, links{playStore, appStore, github, demo, video, caseStudy} }]`

`scripts/projects.js` (globals) and `scripts/app.js` load in order with `defer`, so `SITE`/`PROJECTS` are guaranteed present when `app.js` runs — the prototype's `_loadData` retry loop is dropped as unnecessary.

### 3.1 Final file layout

```
Resume/
├─ index.html          NEW  standalone site shell (no support.js)
├─ styles.css          NEW  :root design tokens + component classes
├─ scripts/
│  ├─ projects.js      KEPT the ONE file the owner edits (SITE + PROJECTS)
│  └─ app.js           NEW  renders from data + all interactions
├─ assets/             kept: favicon.svg, og-image.png
│                      owner supplies later: resume.pdf, profile.jpg,
│                      projects/<id>/cover.png (+gallery) — degrade to stripes
├─ .nojekyll           NEW  GitHub Pages serves files untouched
├─ .gitattributes      NEW  normalize line endings (text=auto, lf)
├─ README.md           REWRITTEN accurate edit + deploy guide (no support.js)
├─ reference/
│  ├─ Portfolio.dc.html  MOVED original prototype (needs proprietary runtime;
│  │                          kept for provenance, not deployed)
│  └─ DESIGN-SPEC.md     MOVED the handoff README — pixel-accurate design spec
└─ docs/superpowers/specs/2026-07-08-portfolio-rebuild-design.md   this file
```

### 3.2 File disposition (moves & deletes)
- `index.html` → **replaced** by the new vanilla site.
- `Portfolio.dc.html` → **moved** to `reference/` (provenance; non-functional without the runtime).
- `README.md` (handoff spec) → **moved** to `reference/DESIGN-SPEC.md`; a fresh owner-facing `README.md` is written at root.
- `original_README.md` → useful parts folded into the new `README.md`, then **deleted** (stale; references `support.js`). *Owner-approved.*

## 4. Rendering (`app.js`, single deferred classic script)

Organized in clear sections:
1. **Helpers** — `statusColor(status)` (Live `#22D3A8`, In Development `#F5C542`, Prototype `#A78BFA`, fallback `#8A93A0`), URL `strip()`, and `augment(project, idx)` (build ordered link list, gallery handlers, status color, open/keydown handlers).
2. **Render functions** — hero (name, rotating role, sub-copy, résumé hrefs), About text, filter chips (from unique categories, "All" first), project grid, skills groups, contact cards, footer (name + current year).
3. **Light state** — `cat` (default "All"), `roleIdx`, `roleOpacity`, `modalId`, `lightbox`, `copiedEmail`. Targeted re-renders: grid re-renders on filter change; modal & lightbox build-on-open / remove-on-close.
4. **Derived-per-render logic (ported faithfully):** chips from unique `category` values; filter by `cat`; sort **featured-first, then newest `year` first**; only non-empty `links` render buttons (order: github, demo, playStore, appStore, video, caseStudy); a non-empty `gallery` shows gallery + lightbox; ordered id list drives modal prev/next; empty filter → "No projects in this category yet."

## 5. Interactions (ported 1:1 from the `DCLogic` class)

- **Rotating hero roles:** 2800ms interval, opacity→0, 380ms wait, advance index + opacity→1. Reduced-motion: instant swap.
- **Scroll reveal:** IntersectionObserver, threshold 0.12, `rootMargin 0 0 -6% 0`; start `opacity:0; translateY(22px)` → visible; `data-reveal-index` staggers `min(i,8)*65ms`. Disabled under reduced-motion.
- **Active nav:** IntersectionObserver on the four sections, `rootMargin -45% 0 -50% 0`; active link gets `#E6E9EC` + `rgba(79,140,255,.12)`.
- **Constellation canvas:** fixed, `z-index:-1`, DPR≤2. Particle count `min(140, round(w*h/15000))`, velocity ±0.28/frame, edge bounce; links < 130px `rgba(79,140,255,(1-d/130)*0.22)`; dots r1.5 `rgba(110,140,190,.5)`; cursor pull within 170px (~0.55/frame) → brighten r2.4 `rgba(143,182,255,.9)`. Rebuild on resize. Skipped entirely under reduced-motion.
- **Ambient color layer:** fixed radial-glow div behind the canvas (teal top-right, blue top-left, blue bottom-center) — static.
- **Hero-local blobs:** two blurred radial divs animated via `blob` keyframes (16s / 20s).
- **Back-to-top FAB:** appears when `scrollY > 600`; smooth-scroll to top (auto under reduced-motion).
- **Project modal:** open on card click / Enter / Space; backdrop + × close; prev/next arrows (only if >1 in filter) + ArrowLeft/ArrowRight, wrapping; body scroll lock while open.
- **Lightbox:** gallery image → fixed overlay above modal; click / Esc closes (Esc closes lightbox first, then modal).
- **Email copy:** contact email card copies via `navigator.clipboard.writeText`, label flips to "Email — copied ✓" for 1800ms, reverts; falls back to `mailto:` if clipboard unavailable.

## 6. Reduced motion & accessibility

- Global `@media (prefers-reduced-motion: reduce)` forces animation/transition ~0 and disables smooth scroll; JS branches on the media query for role rotation, reveal, constellation, and scroll behavior.
- Faithful a11y kept: cards `role="button"` + `tabindex="0"` + Enter/Space; modal `role="dialog" aria-modal="true"`; aria-labels on icon buttons; background layers `aria-hidden`.
- **Three additive production upgrades over the prototype (no visual-spec impact):**
  1. `<html lang="en">`
  2. `<meta name="theme-color" content="#0B0D10">`
  3. `:focus-visible` outlines for keyboard nav + basic modal focus management (focus the dialog on open, restore focus to the triggering card on close).

## 7. Design tokens (source of truth for fidelity)

Encoded as CSS custom properties in `:root`. Key values:
- **Background** `#0B0D10`; **surface** `#14181D`; **inset** `#0f141a`; **stripe dark** `#12171d`.
- **Borders** `#23292F` (primary), `#20262d` (inset), `#1a1f24` (header/footer), `#2f4a7a` (hover).
- **Text** `#E6E9EC` / `#c7cdd4` / `#b7bec6` / `#8A93A0` / `#5b636e` / `#4a525d`.
- **Accent** `#4F8CFF`; accent-light `#8fb6ff`; secondary/glow teal `#22D3A8`.
- **Type:** Space Grotesk (display), Inter (body/UI), JetBrains Mono (mono/eyebrows) — Google Fonts.
- **Layout:** max-width 1200px (hero 1000, contact 880), padding 0 24px, section padding 96px, scroll-padding-top 88px.
- **Radii:** pills 999px, cards 14–16px, modal 20px, buttons/chips 9–12px, tag pills 7px.
- **Motion:** easing `cubic-bezier(.2,.7,.2,1)`; reveal .6s; hovers .18–.22s; role 2800ms/380ms.

(Full spec preserved in `reference/DESIGN-SPEC.md`.)

## 8. Verification

No test framework (YAGNI for a static portfolio). Verify by running the site in a browser and checking against the spec:
- Renders with placeholder data; hero role rotation; filter chips filter the grid; empty-state message appears for an empty category.
- Card → modal open/close, prev/next (click + arrow keys, wrapping), gallery → lightbox, Esc order.
- Email card copy-to-clipboard + label flip.
- Back-to-top appears past 600px and scrolls up.
- Responsive: <700px nav collapses; grid reflows (`minmax(320px,1fr)`).
- Reduced-motion: constellation off, roles swap instantly, no reveal animation.
- No console errors; missing images fall back to striped placeholders.

## 9. Out of scope

- Real content (owner supplies via `scripts/projects.js` later).
- Real assets: `resume.pdf`, `profile.jpg`, per-project images.
- Actually creating/pushing the GitHub repo (owner does this; assistant can guide or run via `!` with approval).
- Any framework, build step, bundler, or automated tests.
