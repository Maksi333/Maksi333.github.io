# Handoff: Personal Portfolio Site

## Overview
A single-page, data-driven personal portfolio for **Simon Nørgaard Andersen** (Software Developer / Data Scientist). Dark, developer-focused aesthetic with an animated background, a filterable project grid, and a project detail modal. The defining architectural rule: **all owner-editable content lives in one data file** (`scripts/projects.js`) — adding a project or editing bio/contact never touches layout or styling. It's built to deploy as a static site on GitHub Pages.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look, motion, and behavior. They are **not** meant to be shipped verbatim into a framework app. The prototype is authored as a "Design Component" (a proprietary streaming-render format with a `support.js` runtime and React/Babel loaded from a CDN); that runtime is a prototyping harness, **not** a production dependency.

Your task: **recreate this design in the target codebase's environment** using its established patterns. If there is no existing codebase, the design is already a legitimate vanilla static site — but the cleanest production rebuild is a small **React (Vite) + TypeScript** app, or plain **HTML/CSS/vanilla JS** if you want zero build step (which is what the prototype effectively is once you strip the harness). Preserve the one-data-file content model regardless of framework.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, motion timings, and interactions are all specified below and present in the prototype. Recreate the UI pixel-accurately. Exact values are in the Design Tokens section.

## Screens / Views
This is a single scrolling page with a fixed header and one overlay (modal + lightbox). Max content width **1200px**, centered, `padding: 0 24px`.

### 1. Fixed Header / Nav
- **Purpose:** Persistent navigation + résumé CTA.
- **Layout:** `position: fixed; top/left/right: 0; z-index: 60`, height **64px**, flex row space-between. Background `rgba(11,13,16,.72)` with `backdrop-filter: blur(14px)`, bottom border `1px solid #1a1f24`.
- **Components:**
  - **Brand (left):** 11×11px accent square (`#4F8CFF`, `border-radius:3px`, glow `0 0 12px rgba(79,140,255,.7)`) + "Simon N. Andersen", Space Grotesk 700, 17px, letter-spacing -.02em.
  - **Nav links:** Work / About / Skills / Contact. Inter 500, 14px, color `#8A93A0`, padding `8px 13px`, radius 10px. Hover → color `#E6E9EC`. **Active** (current section) → color `#E6E9EC`, background `rgba(79,140,255,.12)`. Hidden below 700px.
  - **Résumé CTA:** filled accent button `#4F8CFF`, text `#0B0D10`, weight 600, padding `9px 16px`, radius 10px, shadow `0 6px 20px rgba(79,140,255,.28)`. Opens résumé in **new tab** (`target="_blank"`).

### 2. Hero
- **Purpose:** Identity + primary CTAs.
- **Layout:** `min-height: 100svh`, flex centered, `padding: 120px 24px 80px`, inner max-width 1000px. `overflow: hidden`.
- **Components (top→bottom), each fades up on load with staggered delay:**
  - Eyebrow: "// Portfolio", JetBrains Mono 13px, letter-spacing .28em, uppercase, color `#4F8CFF`.
  - H1 name: Space Grotesk 700, `clamp(44px, 8.5vw, 104px)`, line-height .98, letter-spacing -.03em.
  - **Rotating role line:** Space Grotesk 500, `clamp(22px,4vw,40px)`, color `#4F8CFF`. Cycles through the `roles` array every **2800ms** with a 380ms opacity crossfade. Under reduced-motion, swaps instantly.
  - Sub-paragraph: max-width 560px, `clamp(16px,2.2vw,19px)`, color `#8A93A0`.
  - CTA row: "View Work" (filled accent) + "Résumé" + "Contact" (outline: transparent bg, `1px solid #23292F`, text `#E6E9EC`). Padding `14px 26px`, radius 12px, weight 600. Hover lifts `translateY(-2px)`.
  - Scroll hint bottom-center: "Scroll ↓", JetBrains Mono 11px, letter-spacing .24em, color `#4a525d`.
- **Local background extras** (on top of the page-wide backdrop, see Interactions): two soft radial "blob" glows — blue `rgba(79,140,255,.28)` top-left and teal `rgba(34,211,168,.16)` top-right, `filter: blur(30px)`, gently animated (`blob` keyframes, 16s / 20s).

### 3. Work (Project Grid) — the centerpiece
- **Purpose:** Browse projects; filter by category; open details.
- **Layout:** section `padding: 96px 24px`. Section header (eyebrow "// Work", H2 "Selected Work" `clamp(30px,5vw,52px)`, sub-copy). **Filter chips** row (flex wrap, gap 10px). **Card grid:** `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 22px`.
- **Filter chips:** built dynamically from unique project `category` values, prefixed with "All". JetBrains Mono 13px, padding `9px 16px`, radius 999px. Inactive: transparent bg, `1px solid #23292F`, color `#8A93A0`. Active: bg `#4F8CFF`, text `#0B0D10`, border `#4F8CFF`. Clicking filters the grid.
- **Project sort order:** featured first, then newest `year` first.
- **Project card** (`#14181D`, `1px solid #23292F`, radius 16px, overflow hidden, flex column):
  - **Thumbnail:** `aspect-ratio: 16/10`. Rendered as CSS `background-image` = the project image layered over a striped fallback (`repeating-linear-gradient(135deg, #12171d 0px, #12171d 12px, #0f141a 12px, #0f141a 24px)`), so a missing image degrades silently to stripes. On hover the thumbnail wrapper scales to 1.06 (`transition .4s cubic-bezier(.2,.7,.2,1)`).
  - **Featured badge** (top-left, only if `featured`): "Featured", mono 11px uppercase, bg `rgba(79,140,255,.16)`, text `#8fb6ff`, border `rgba(79,140,255,.35)`, radius 999px, `backdrop-filter: blur(4px)`.
  - **Status pill** (top-right): colored dot + status text. bg `rgba(11,13,16,.66)`, border `#23292F`, mono 11px. Dot color by status (see tokens).
  - **Body** (padding 20px, gap 12px): title (Space Grotesk 600, 21px) + year (mono 12px, `#5b636e`) on one baseline row; tagline (`#8A93A0`, 14.5px); tag pills (mono 11.5px, bg `#0f141a`, border `#20262d`, radius 7px); and — if any links exist — a row of small link buttons (see below).
  - **Card hover:** `translateY(-6px)`, border `#2f4a7a`, shadow `0 18px 42px rgba(0,0,0,.5)` (`transition .22s`).
  - **Card is a button:** `role="button"`, `tabindex="0"`, opens the modal on click or Enter/Space.
  - **Link buttons** on card: for each non-empty entry in `links`, an outline pill (`1px solid #23292F`, text `#c7cdd4`, 13px, radius 9px) labeled by link type + "↗". Clicking a link **stops propagation** so it doesn't open the modal. Hover → text/border `#4F8CFF`, bg `rgba(79,140,255,.08)`.
- **Empty state:** if a filter yields nothing, centered mono message "No projects in this category yet."

### 4. About
- **Layout:** two-column grid `1.4fr 1fr`, gap 56px, centered.
- **Left:** eyebrow "// About", H2 "Idea to shipped, with AI in the loop." `clamp(28px,4.4vw,46px)`, then the `about` paragraph (`#b7bec6`, 17px, max-width 560px).
- **Right:** placeholder profile panel — `aspect-ratio: 4/5`, radius 18px, striped background, centered "SNA" monogram + `assets/profile.jpg` caption. Replace with a real photo.

### 5. Skills
- **Layout:** eyebrow + H2 "Stack & tools", then grid `repeat(auto-fill, minmax(240px, 1fr))`, gap 18px.
- **Skill group card** (`#14181D`, `1px solid #23292F`, radius 14px, padding 22px): group label (mono 12px, uppercase, letter-spacing .16em, `#4F8CFF`) + wrap of skill pills (14px, bg `#0f141a`, border `#20262d`, radius 9px, `#c7cdd4`).

### 6. Contact
- **Layout:** centered header (eyebrow "// Contact", H2 "Let's build something." `clamp(30px,5.4vw,60px)`, sub-copy), then grid `repeat(auto-fit, minmax(200px, 1fr))`, gap 16px, max-width 880px.
- **Contact card** (`#14181D`, `1px solid #23292F`, radius 14px, padding 22px, flex column): label (mono 11px uppercase `#4F8CFF`) + value (16px, weight 500, `#E6E9EC`). Hover → `translateY(-4px)`, border `#2f4a7a`, bg `#171c22`.
  - **Email card is special:** clicking it copies the address to clipboard (`navigator.clipboard.writeText`), and the label flips to "Email — copied ✓" for **1800ms**, then reverts. Falls back to `mailto:` behavior if clipboard is unavailable. Suffix glyph "⧉" for email, "↗" for external links.
- Cards are built only for non-empty contact fields (email, github, linkedin, resume).

### 7. Footer
- Top border `1px solid #1a1f24`, padding `32px 24px`, flex space-between. Copyright (mono 13px `#5b636e`, current year + name), "Built with HTML, CSS & a lot of AI.", and a "Back to top ↑" link.

### 8. Back-to-top FAB
- `position: fixed; bottom/right: 24px; z-index: 55`, 46×46px, radius 12px, border `#23292F`, bg `rgba(20,24,29,.9)`, blur. Hidden (opacity 0, `translateY(12px)`, pointer-events none) until `window.scrollY > 600`, then fades in. Smooth-scrolls to top.

### 9. Project Detail Modal (overlay)
- **Trigger:** clicking any card. **Backdrop:** `position: fixed; inset: 0; z-index: 100`, `rgba(4,6,8,.72)` + `blur(6px)`, scrollable, click-outside closes. Body scroll is locked while open (`document.body.style.overflow = 'hidden'`).
- **Dialog:** max-width 760px, `#14181D`, border `#23292F`, radius 20px, shadow `0 30px 80px rgba(0,0,0,.6)`. `role="dialog" aria-modal="true"`.
  - **Cover:** `aspect-ratio: 16/9`, same background-image-over-stripes technique.
  - **Close button** top-right (40×40, "×").
  - **Prev/next arrows** (only if >1 project in current filter): left/right vertically-centered 44×44 buttons ("‹" / "›"). Also driven by **ArrowLeft / ArrowRight** keys. Wraps around the ordered list.
  - **Body** (padding `28px 30px 32px`): meta row (category pill, status pill with dot, year) → title (Space Grotesk 700, 30px) → tagline (`#8A93A0`, 16px) → description (`#c7cdd4`, 16px, line-height 1.7) → tag pills → **gallery grid** (if `gallery` non-empty): `repeat(auto-fit, minmax(180px,1fr))`, each `aspect-ratio:16/10`, `cursor: zoom-in` → opens lightbox → **link buttons** (filled accent CTAs) for each non-empty link.
- **Keyboard:** Escape closes the lightbox first (if open), otherwise the modal.

### 10. Image Lightbox (overlay above modal)
- **Trigger:** clicking a gallery image. `position: fixed; inset: 0; z-index: 120`, `rgba(3,4,6,.9)` + `blur(8px)`, centered, `cursor: zoom-out`. Shows the image at `max-width/height: 100%`, radius 14px, big shadow. Click anywhere or Escape closes.

## Interactions & Behavior
- **Rotating hero roles:** interval 2800ms; set opacity→0, wait 380ms, advance index + opacity→1. Reduced-motion: instant index swap, no fade.
- **Scroll reveal:** every `[data-reveal]` element starts `opacity:0; translateY(22px)` and animates to visible via IntersectionObserver (threshold 0.12, rootMargin bottom -6%). Transition `.6s cubic-bezier(.2,.7,.2,1)`. Optional `data-reveal-index` adds a staggered `transition-delay` of `min(index,8)*65ms`. **Disabled entirely under reduced-motion** (elements just render normally).
- **Active nav highlighting:** IntersectionObserver on the four sections with `rootMargin: -45% 0px -50% 0px`; the intersecting section's nav link gets the active style.
- **Page-wide interactive background — Constellation network (canvas):** a single `position: fixed; inset: 0; z-index: -1` `<canvas>` sits behind all content, sized to the viewport (`window.innerWidth/Height`, capped at DPR 2). It renders a particle field:
  - Particle count = `min(140, round(w*h/15000))`; each has a slow random velocity (~±0.28 px/frame) and bounces off the viewport edges.
  - Every frame: for each pair of particles closer than **130px**, draw a link line `rgba(79,140,255, (1 - d/130)*0.22)`; then draw each particle as a dot (r 1.5, `rgba(110,140,190,.5)`).
  - **Cursor interaction:** particles within **170px** of the cursor are gently pulled toward it (~0.55px/frame) and brighten (dot r 2.4, `rgba(143,182,255,.9)`). The listener is on `window`, so it reacts across the whole page at any scroll position; mouse-leave parks the cursor offscreen.
  - Rebuilds the particle set on resize. **Entire effect is skipped under `prefers-reduced-motion`** (canvas simply stays empty/transparent).
- **Ambient color layer (kept, behind the canvas):** a second `position: fixed; inset: 0; z-index: -1` div with soft radial glows — teal top-right `rgba(34,211,168,.06)`, blue top-left `rgba(79,140,255,.09)`, blue bottom-center `rgba(79,140,255,.05)` — gives the dark background subtle color depth beneath the constellation. Runs page-wide so scrolling never hits flat dark.
- **Hero-local glows:** inside the hero only, two blurred radial "blob" divs (blue top-left `rgba(79,140,255,.28)`, teal top-right `rgba(34,211,168,.16)`, `filter: blur(30px)`) animate gently via the `blob` keyframes (16s / 20s).
- *(History note: earlier iterations used a CSS grid + a cursor-following spotlight; those were replaced by the constellation canvas. Do not reintroduce a separate grid layer — it caused a visible seam.)*
- **Hover states:** cards lift, thumbnails scale, buttons lift, link/contact cards shift color — all specified per-component above.
- **Résumé links** open in a new tab.
- **Reduced motion:** a global `@media (prefers-reduced-motion: reduce)` rule forces animation/transition durations to ~0 and disables smooth scroll; JS also branches on the media query for role rotation, reveal, parallax, and smooth scrolling.

## State Management
State needed (framework-agnostic):
- `site` / `projects` — loaded from the data file (`window.SITE`, `window.PROJECTS`). In a framework build, import these as a module instead of reading globals.
- `cat` — active filter category (default "All").
- `roleIdx`, `roleOpacity` — hero rotator.
- `modalId` — id of the open project, or null.
- `lightbox` — src of the enlarged gallery image, or null.
- `copiedEmail` — boolean, drives the "copied ✓" label.
- *(The constellation canvas manages its own particle array + rAF loop imperatively in a mount effect — not React state.)*
Derived per render: category list, filtered+sorted project list, ordered id list (for prev/next), the augmented modal project, and the contact list.

## Design Tokens
**Colors**
- Background base: `#0B0D10`
- Surface / card: `#14181D`; deeper inset: `#0f141a`; profile/hero stripe darks: `#12171d`
- Borders: `#23292F` (primary), `#20262d` (inset), `#1a1f24` (header/footer), `#2f4a7a` (hover)
- Text: `#E6E9EC` (primary), `#c7cdd4` (secondary), `#b7bec6` (about body), `#8A93A0` (muted), `#5b636e` / `#4a525d` (faint)
- **Accent (primary):** `#4F8CFF`; accent-light text `#8fb6ff`
- Secondary accent (glows only): teal `#22D3A8`
- Status dot colors: Live `#22D3A8`, In Development `#F5C542`, Prototype `#A78BFA`, fallback `#8A93A0`
- Selection: bg `#4F8CFF`, text `#0B0D10`

**Typography**
- Display/headings: **Space Grotesk** (400/500/600/700)
- Body/UI: **Inter** (400/500/600)
- Mono/eyebrows/meta: **JetBrains Mono** (400/500)
- (Loaded from Google Fonts in the prototype; use the codebase's font pipeline in production.)

**Spacing / layout**
- Content max-width 1200px (hero inner 1000px, contact grid 880px), horizontal padding 24px
- Section vertical padding 96px (hero 120/80); card body padding 20px; scroll-padding-top 88px

**Radii:** pills 999px; cards 14–16px; modal 20px; buttons/chips 9–12px; tag pills 7px; inputs/small 10–11px

**Shadows:** card hover `0 18px 42px rgba(0,0,0,.5)`; CTA `0 6px 20px rgba(79,140,255,.28)`; modal `0 30px 80px rgba(0,0,0,.6)`; lightbox `0 30px 90px rgba(0,0,0,.7)`

**Motion:** primary easing `cubic-bezier(.2,.7,.2,1)`; reveal .6s; hovers .18–.22s; role rotate 2800ms interval / 380ms crossfade; grid drift ≤20px; spotlight ~760px radius.

## Assets
- `assets/favicon.svg` — accent "S" mark on dark, `#4F8CFF` (generated).
- `assets/og-image.png` — 1200×630 social/link-preview card (generated: dark grid bg, accent glows, name + roles).
- `assets/resume.pdf` — **owner must supply**; linked by all Résumé buttons.
- `assets/profile.jpg` — **owner must supply**; About-section photo (placeholder monogram shown until then).
- `assets/projects/<id>/cover.png` (+ gallery images) — **owner must supply** per project; missing images fall back to a striped placeholder automatically.
- No icon library — glyphs are Unicode/HTML entities (↗ ‹ › × ↑ ↓ ⧉). Swap for the codebase's icon set if desired.

## The Data Model (preserve this)
Everything renders from two objects in `scripts/projects.js`:
- `window.SITE`: `{ name, roles[], about, skills[{group, items[]}], contact{email, github, linkedin, resume} }`
- `window.PROJECTS`: array of `{ id, title, tagline, category, tags[], description, thumbnail, gallery[], status, year, featured, links{playStore, appStore, github, demo, video, caseStudy} }`

Behaviors the code derives automatically: filter chips from unique `category` values; featured-first + newest-year sort; only non-empty `links` render buttons; a project with a non-empty `gallery` shows the gallery + lightbox. **Keep this "edit one data file, never the layout" model** in the production build (e.g. a typed `projects.ts`/JSON + a CMS later).

## Files
In this bundle:
- `Portfolio.dc.html` — the full design/prototype (template + logic). Primary reference for markup, styles, and interaction logic.
- `index.html` — deploy copy of the prototype (identical to `Portfolio.dc.html`).
- `scripts/projects.js` — the content/data file (SITE + PROJECTS). Read this to understand the data contract.
- `README.md` — the original owner-facing deploy + "how to add a project" guide.
- `assets/favicon.svg`, `assets/og-image.png` — generated assets.

> Note: `support.js` in the source project is the prototype runtime (React/Babel harness) — **do not port it**. It is intentionally excluded from this handoff.
