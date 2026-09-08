# Portfolio — Project Guide

_A practical guide to how your portfolio site is built and how to keep working on it._

**Live site:** https://maksi333.github.io · **Repo:** github.com/Maksi333/Maksi333.github.io

---

## 1. The 30-second overview

This is a **static website** — plain HTML, CSS, and JavaScript. There is **no build step, no framework, and no dependencies**. The browser runs the files directly, and GitHub Pages serves them exactly as they sit in the repo.

The whole site is **data-driven from one file**: everything you'll ever want to change — your name, bio, skills, contact links, and every project — lives in **`scripts/projects.js`**. You edit that file, commit, push, and the live site updates. You never touch the layout or styling to add a project.

```
Edit scripts/projects.js  →  git commit  →  git push  →  GitHub Pages redeploys  →  live in ~1 min
```

---

## 2. The one rule to remember

> **Content lives in `scripts/projects.js`. Everything else renders from it.**

- Want to add/remove/edit a **project**? → `scripts/projects.js`
- Change your **name, roles, bio, skills, or contact links**? → `scripts/projects.js`
- Change **colors, fonts, spacing**? → `styles.css` (design tokens at the top)
- Change **behavior** (animations, the modal, filtering)? → `scripts/app.js` (rarely needed)

If you only ever open `scripts/projects.js`, you can run this site indefinitely.

---

## 3. The files, one by one

| File / folder | What it is | Do you edit it? |
|---|---|---|
| **`scripts/projects.js`** | **Your content** — the `SITE` object (identity) + the `PROJECTS` array. | ✅ **Yes — this is your file.** |
| `index.html` | The page shell: `<head>` (meta, fonts, favicon), the fixed background, header, empty section containers, footer. It has no hard-coded content — JS fills it in. | Rarely (e.g. to change the fixed sub-headings like "Selected Work"). |
| `styles.css` | All styling. Design tokens (colors, fonts) are CSS variables in `:root` at the top; component styles below. | Only to restyle the design. |
| `scripts/app.js` | The engine. Reads `SITE`/`PROJECTS` and renders the hero, grid, skills, contact, modal, lightbox, and all interactions (constellation, scroll reveal, filtering, keyboard nav). | Rarely — only to change behavior. |
| `assets/` | Images and files. Ships with `favicon.svg` and `og-image.png`. You add `resume.pdf`, `profile.jpg`, and per-project images here. | ✅ You add files here. |
| `.nojekyll` | Empty file that tells GitHub Pages to serve every file untouched. | No. |
| `.gitignore` | Keeps IDE junk (`.vs/`, `node_modules`) out of the repo. | No. |
| `.gitattributes` | Normalizes line endings across machines. | No. |
| `README.md` | Short public-facing readme (shown on the GitHub repo page). | Optional. |
| `reference/` | The original design prototype (`Portfolio.dc.html`) and the full pixel-accurate design spec (`DESIGN-SPEC.md`). Kept for reference; **not part of the live site**. | No. |
| `docs/` | This guide, plus the design spec and implementation plan under `docs/superpowers/`. | Optional. |

---

## 4. How it works (data flow)

1. `index.html` loads two scripts with `defer`, in order: **`projects.js` first, then `app.js`**.
2. `projects.js` sets two globals: `window.SITE` and `window.PROJECTS`.
3. `app.js` reads those globals and **builds the DOM**:
   - Fills the hero (name, rotating roles), about text, footer, and résumé links.
   - Builds the **filter chips** from the unique `category` values across your projects (plus "All").
   - Renders the **project cards**, sorted **featured-first, then newest year first**.
   - Renders the **skills** groups and **contact** cards.
   - Wires up interactions: clicking a card opens the **detail modal**; gallery images open a **lightbox**; the email card **copies to clipboard**; the background **constellation** and **scroll-reveal** animations run (and switch off for users who prefer reduced motion).

You don't call any of this — it just runs when the page loads.

---

## 5. ⚠️ Your fix-it checklist (placeholders to replace)

The site currently ships with **placeholder content**. Work through this before sharing the link with employers. Everything here is in `scripts/projects.js` unless noted.

- [ ] **Email** — `contact.email` is `simon@example.com`. Change to your real address (e.g. `simon_n_andersen@live.dk`, or a dedicated one).
- [ ] **GitHub link** — `contact.github` is `https://github.com/your-username` → `https://github.com/Maksi333`.
- [ ] **LinkedIn link** — `contact.linkedin` is `.../in/your-handle` → your real profile URL (or set to `""` to hide the card).
- [ ] **Résumé PDF** — add your CV as **`assets/resume.pdf`** (the Résumé buttons already point there). Until the file exists, the buttons 404.
- [ ] **About photo** — add **`assets/profile.jpg`** for the About section (a monogram placeholder shows until you do). _(Note: wiring this image into the layout is a small `index.html` tweak — see §6.7.)_
- [ ] **Sample projects** — delete the three demo entries you don't want: `portfolio-site`, `ride-insights`, `habit-garden`.
- [ ] **Real project links** — `esk8-tracker` and `calisthenics-app` have placeholder URLs (`your.app.id`, `your-username/...`). Fix or blank them.
- [ ] **Project images** — add `assets/projects/<id>/cover.png` (and gallery images) for each real project. Missing images degrade to a striped placeholder, so nothing breaks, but real screenshots look far better.
- [ ] **(Optional) Social preview image** — `assets/og-image.png` exists and works. If you want the link preview (when you paste your URL in LinkedIn/Slack) to be reliable, make the `og:image` in `index.html` an **absolute** URL: `https://maksi333.github.io/assets/og-image.png`.

---

## 6. Recipes (common tasks)

### 6.1 Add a new project
1. (Optional but recommended) Put images in `assets/projects/<your-id>/` — at least `cover.png`.
2. Open `scripts/projects.js`, copy an existing `{ … }` block inside `window.PROJECTS`, paste it, and edit the fields. A fully-annotated template:

```js
{
  id: "my-cool-app",                        // unique slug; also the image folder name
  title: "My Cool App",
  tagline: "One punchy line shown on the card",
  category: "Mobile App",                   // becomes a filter chip automatically
  tags: ["Kotlin", "Android", "AI"],        // small pills on the card
  description:
    "The longer paragraph shown in the detail popup when someone " +
    "clicks the card. Explain what it does and why it's interesting.",
  thumbnail: "assets/projects/my-cool-app/cover.png",
  gallery: [                                // optional; shown in the popup, click to enlarge
    "assets/projects/my-cool-app/1.png",
    "assets/projects/my-cool-app/2.png",
  ],
  status: "Live",                           // Live | In Development | Prototype
  year: 2026,
  featured: true,                           // featured projects sort to the top
  links: {                                  // leave any "" to hide that button
    github:    "https://github.com/Maksi333/my-cool-app",
    demo:      "",
    playStore: "",
    appStore:  "",
    video:     "",
    caseStudy: "",
  },
},
```
3. Save, commit, push. Done — no layout edits.

### 6.2 Change your name / rotating roles
In the `SITE` object:
```js
name: "Simon Nørgaard Andersen",
roles: ["Software Developer", "AI App Builder", "Data Scientist", "Indie Maker"],
```
The first role shows immediately; the rest rotate in the hero every ~2.8s.

### 6.3 Edit the About paragraph
`SITE.about` — a single string. Rewrite freely.

### 6.4 Edit skills
`SITE.skills` is a list of groups. Add/remove groups or items:
```js
skills: [
  { group: "Languages", items: ["Kotlin", "TypeScript", "Python", "SQL"] },
  { group: "Mobile",    items: ["Android", "Jetpack Compose"] },
],
```

### 6.5 Edit contact links
`SITE.contact` — set any field to `""` to hide that card. The **email card copies to the clipboard** on click (with a "copied ✓" confirmation); the others open in a new tab.

### 6.6 Add project images
Convention: `assets/projects/<id>/`. The `<id>` must match the project's `id`. Use `cover.png` for the card/popup cover; name gallery images anything and list them in `gallery`.

### 6.7 Add your About photo (small layout tweak)
The About panel currently shows an "SNA" monogram placeholder. To use a real photo, add `assets/profile.jpg`, then in `index.html` find the `.profile` block and replace the placeholder `<div>` with:
```html
<img src="assets/profile.jpg" alt="Simon Nørgaard Andersen"
     style="width:100%;height:100%;object-fit:cover;">
```
(If you'd like, I can wire this up so it auto-shows the photo when the file exists.)

### 6.8 Change the accent color or theme
Open `styles.css`. The top `:root` block defines every color as a variable. The brand accent is one line:
```css
--accent: #4F8CFF;   /* change this to re-tint the whole site */
```
Change a token once and it updates everywhere it's used.

---

## 7. Data model reference

### `SITE` (your identity)
| Field | Type | Notes |
|---|---|---|
| `name` | string | Shown in the hero H1 and footer. |
| `roles` | string[] | Rotating hero subtitles. First shows immediately. |
| `about` | string | About-section paragraph. |
| `skills` | `{group, items[]}[]` | Grouped skill pills. |
| `contact` | object | `email`, `github`, `linkedin`, `resume`. `""` hides a card. |

### A `PROJECTS` entry
| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique slug; also the `assets/projects/<id>/` folder name. |
| `title`, `tagline`, `description` | string | Card + popup copy. |
| `category` | string | Drives the filter chips (built automatically). |
| `tags` | string[] | Small pills on the card. |
| `thumbnail` | string | Path to cover image; missing → striped placeholder. |
| `gallery` | string[] | Optional; images in the popup (click to enlarge). |
| `status` | string | `Live`, `In Development`, or `Prototype` (colored dot). |
| `year` | number | Used for sorting. |
| `featured` | boolean | `true` sorts it to the top. |
| `links` | object | `github`, `demo`, `playStore`, `appStore`, `apk`, `video`, `caseStudy`. `""` hides the button. `apk` is a file in the repo (`assets/apk/…`) and renders as a download button with a ↓ instead of ↗. |

**Auto-derived behavior (you don't configure these):**
- Filter chips = `All` + every unique `category`.
- Sort order = featured first, then newest `year` first.
- Only links with a non-empty URL show a button. Button order: GitHub → Live Demo → Play Store → App Store → Video → Case Study.
- A project with a non-empty `gallery` shows the gallery + lightbox.
- Status dot colors: Live = teal, In Development = amber, Prototype = purple.

---

## 8. How it looks & behaves

**Fonts** (loaded from Google Fonts): Space Grotesk (headings), Inter (body), JetBrains Mono (labels/eyebrows).

**Key design tokens** (in `styles.css` `:root`):
- Background `#0B0D10`, card surface `#14181D`, accent `#4F8CFF`, teal glow `#22D3A8`, primary text `#E6E9EC`, muted text `#8A93A0`.

**Interactions** (all in `app.js`):
- Rotating hero roles, an interactive **constellation** canvas background (particles link up and follow your cursor), scroll-reveal fade-ins, active-section nav highlighting, a **project modal** with prev/next + arrow-key navigation, an image **lightbox**, a back-to-top button, and **email copy-to-clipboard**.
- **Accessibility & motion:** cards are keyboard-operable (Enter/Space), the modal manages focus, and everything respects **`prefers-reduced-motion`** — the constellation and animations switch off for users who ask for reduced motion.

---

## 9. Everyday workflow

```
1. Edit scripts/projects.js (or add images to assets/)
2. Preview locally           →  see §10
3. git add / commit          →  in Visual Studio, VS Code, or the terminal
4. git push                  →  pushes to Maksi333.github.io
5. Wait ~1 minute            →  GitHub Pages rebuilds; refresh the live site
```

**Preview locally** before pushing:
- **Quick server (Python):** in the project folder run `python -m http.server 8137`, then open `http://localhost:8137`. (Using `localhost` — not opening the file directly — makes the email-copy feature work.)
- **VS Code:** install the **Live Server** extension → right-click `index.html` → _Open with Live Server_ → auto-reloads on save at `localhost:5500`.
- **Don't** just double-click `index.html` for full testing — over `file://` the clipboard copy won't work (everything else does).

---

## 10. Deploy & hosting facts

- Your repo is a **GitHub user site**: it must stay named exactly **`Maksi333.github.io`** to serve at `https://maksi333.github.io`.
- Pages is set to **Deploy from a branch → `main` / (root)**. Every push to `main` triggers a rebuild (watch it in the repo's **Actions** tab).
- All paths in the site are **relative**, so it works at the root domain without changes.
- **Custom domain later (optional):** buy a domain, add a `CNAME` file (GitHub can do this from Settings → Pages → Custom domain), point DNS at GitHub. Not required.

---

## 11. Gotchas & FAQ

- **"I see 404s for images in the browser console."** Expected until you add real images — missing covers/gallery/résumé degrade to striped placeholders by design. They disappear once the files exist.
- **Script order matters.** `projects.js` must load before `app.js` (it already does in `index.html`). If you rename or reorder them, the site won't render.
- **Editing `reference/` or `docs/` does nothing to the live site** — those are documentation only.
- **Email copy needs `https` or `localhost`.** It works on your live site and local server, but not from a raw `file://` open.
- **Don't commit `.vs/`.** It's IDE state and is already git-ignored.
- **Nothing shows below the hero until you scroll.** That's the scroll-reveal animation — sections fade in as they enter the viewport.

---

## 12. Where to look

- **Full design spec** (every color, size, and interaction, pixel-accurate): `reference/DESIGN-SPEC.md`.
- **Original design prototype**: `reference/Portfolio.dc.html` (needs a proprietary runtime to render — kept for provenance only).
- **How this rebuild was designed & planned**: `docs/superpowers/specs/` and `docs/superpowers/plans/`.

---

## 13. Ideas for going further

- Swap in real project screenshots and a polished `og-image.png` — biggest visual upgrade for the least effort.
- Add a short "Now / Currently building" line to the hero or About.
- Add a downloadable one-pager or link to a blog/devlog.
- A contact form would need a third-party service (e.g. Formspree) since a static site has no backend — the mailto/copy approach avoids that entirely and is usually enough.
- Analytics (privacy-friendly options like Plausible/GoatCounter) if you want to see who's visiting.

---

_Built as a zero-dependency static site. Keep it simple, edit one file, ship often._
