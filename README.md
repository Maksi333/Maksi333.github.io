# Simon Nørgaard Andersen — Portfolio

A fast, animated, data-driven personal portfolio. Plain HTML/CSS/JavaScript — **no build step, no framework, no dependencies.** Deploys to GitHub Pages exactly as-is.

**You add projects by editing one file — never the layout.**

---

## ✏️ How to add a new project

1. (Optional) Drop your images into `assets/projects/<your-project-id>/` — at least `cover.png`. Screenshots for the detail view go in the same folder.
2. Open **`scripts/projects.js`**.
3. Copy an existing `{ … }` block inside the `window.PROJECTS` array, paste it in, and edit the fields.
4. Leave any link blank (`""`) to hide that button. Set `featured: true` to surface it near the top.
5. Commit and push — GitHub Pages redeploys automatically.

That's the whole workflow. No HTML, CSS, or layout edits, ever.

### Editing your name / bio / skills / contact

All of that also lives in `scripts/projects.js`, in the **`window.SITE`** object at the top:
`name`, `roles` (the rotating hero text), `about`, `skills` (grouped tags), and `contact` (email, GitHub, LinkedIn, résumé — leave any blank to hide it).

> ℹ️ The starter file ships with **placeholder** contact links (`simon@example.com`, `your-username`, …) and a few sample projects. Replace them with your real details before sharing the site.

### Project fields

| Field | Notes |
|---|---|
| `id` | Unique slug; also the asset folder name. |
| `title`, `tagline`, `description` | Card + detail-view copy. |
| `category` | Drives the filter chips (chips are built automatically). |
| `tags` | Small mono pills on the card. |
| `thumbnail` | `assets/projects/<id>/cover.png`. Missing images fall back to a striped placeholder. |
| `logo` | Optional. A square app icon (e.g. `assets/apps/<id>/logo.svg`) shown centred on a glow instead of the `thumbnail` — the same look as the app cards on `/privacy/`. |
| `logoGlow` | Optional tint for that glow, e.g. `"rgba(20, 179, 107, .20)"`. Defaults to the site's blue accent. |
| `gallery` | Optional array of image paths, shown in the detail view (each opens a lightbox). |
| `status` | `Live` / `In Development` / `Prototype` — colored status dot. |
| `year`, `featured` | Sort order: featured first, then newest year first. |
| `links` | `github`, `demo`, `playStore`, `appStore`, `video`, `caseStudy`. Blank = hidden. |

---

## 🔒 App privacy policies

Every published app gets its own page at a stable URL you can paste straight into the Google Play Console:

```
/privacy/          ← the app picker
/privacy/puffy/    ← https://maksi333.github.io/privacy/puffy/
```

The picker grid is data-driven like the project grid, but **each policy page is plain static HTML** — no JavaScript renders any of the text. A Play reviewer, a crawler, or a browser with JS switched off sees the whole document. Keep it that way.

### Adding an app

1. Append a block to `window.PRIVACY_APPS` in **`scripts/privacy.js`** (`id`, `name`, `tagline`, `platform`, `updated`).
2. Drop a square logo at `assets/apps/<id>/logo.svg`.
3. Copy `privacy/puffy/index.html` to `privacy/<id>/index.html` and rewrite the policy text.
4. Add one line to the `<noscript>` list in `privacy/index.html` so the page still works without JS.

`id` does all the wiring — it is both the logo folder and the URL, so `id: "puffy"` means `assets/apps/puffy/logo.svg` and `/privacy/puffy/`.

### Keeping a policy honest

The Puffy policy was written from what the app's code actually does — storage, permissions, notifications, export, backup. If the app's behaviour changes, update the policy **before** that version ships and bump the effective date at the top of the page. A policy that no longer matches the app is worse than no policy.

---

## 🚀 Deploying to GitHub Pages

These files at the deploy root are the whole site:

```
index.html                ← the page
styles.css                ← design tokens + styles
scripts/projects.js       ← YOU EDIT THIS (your content)
scripts/app.js            ← rendering + interactions (no need to edit)
scripts/privacy.js        ← YOU EDIT THIS (apps listed at /privacy/)
scripts/privacy-grid.js   ← renders the privacy picker (no need to edit)
privacy/                  ← the privacy pages, one folder per app
.nojekyll                 ← lets GitHub serve every file untouched
assets/…                  ← your images, résumé PDF, og-image, favicon
```

**Option A — user site (nicest URL):**
1. Create a repo named exactly `<your-username>.github.io`.
2. Push these files to the default branch (root).
3. Visit `https://<your-username>.github.io`.

**Option B — project site (any repo name):**
1. Push these files to any repo.
2. Repo → **Settings → Pages** → *Deploy from a branch* → your branch, `/ (root)`.
3. Visit `https://<your-username>.github.io/<repo-name>`.

All asset paths are **relative**, so both schemes work. There is no build step and no toolchain to maintain — the browser runs the files directly.

> First push? From this folder: `git remote add origin <your-repo-url>` then `git push -u origin main`.

---

## 🖼️ Assets to supply

- `assets/projects/<id>/cover.png` (+ gallery images) per project
- `assets/resume.pdf` — linked by the Résumé buttons
- `assets/og-image.png` — social/link-preview image (already included; regenerate if you like)
- `assets/profile.jpg` — optional About photo (a monogram placeholder shows until then)

Until you add them, the site shows tidy placeholders in the right aspect ratios, so the layout never breaks.

---

## 🎨 What's built in

- Rotating hero roles, an interactive constellation background, scroll-reveal, card hover, filter chips, smooth-scroll nav with active highlighting, and a project detail modal with prev/next + keyboard nav (Esc / backdrop to close) and an image lightbox.
- Click your email in Contact to **copy it to the clipboard**.
- Fully responsive and **`prefers-reduced-motion`** aware — motion is disabled for users who ask for it.
- Keyboard accessible (cards open with Enter/Space; modal traps and restores focus).
- Dark theme, accent `#4F8CFF`. Space Grotesk + Inter + JetBrains Mono.

---

## 🔧 Editing the design itself

- **Content** (projects, bio, contact): `scripts/projects.js` — the only file you normally touch.
- **Styling** (colors, spacing, type): `styles.css` — design tokens live in `:root` at the top.
- **Behavior** (animations, modal, filtering): `scripts/app.js`.

The original design prototype and the full design spec are preserved in **`reference/`** for provenance (`Portfolio.dc.html`, `DESIGN-SPEC.md`). They are not part of the deployed site.
