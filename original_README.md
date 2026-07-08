# Simon Nørgaard Andersen — Portfolio

A fast, animated, data-driven personal portfolio. Static site, deploys to GitHub Pages as-is. **You add projects by editing one file — never the layout.**

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

### Project fields

| Field | Notes |
|---|---|
| `id` | Unique slug; also the asset folder name. |
| `title`, `tagline`, `description` | Card + detail-view copy. |
| `category` | Drives the filter chips (chips are built automatically). |
| `tags` | Small mono pills on the card. |
| `thumbnail` | `assets/projects/<id>/cover.png`. Missing images fall back to a striped placeholder. |
| `gallery` | Optional array of image paths, shown in the detail view. |
| `status` | `Live` / `In Development` / `Prototype` — colored status dot. |
| `year`, `featured` | Sort order: featured first, then newest year first. |
| `links` | `github`, `demo`, `playStore`, `appStore`, `video`, `caseStudy`. Blank = hidden. |

---

## 🚀 Deploying to GitHub Pages

You need these files at the deploy root (they're already here):

```
index.html          ← the site
support.js          ← runtime (do not edit)
scripts/projects.js ← YOU EDIT THIS
.nojekyll           ← lets GitHub serve every file untouched
assets/…            ← your images, résumé PDF, og-image
```

**Option A — user site (nicest URL):**
1. Create a repo named exactly `<your-username>.github.io`.
2. Push these files to the default branch (root).
3. Visit `https://<your-username>.github.io`.

**Option B — project site (any repo name):**
1. Push these files to any repo.
2. Repo → **Settings → Pages** → *Deploy from a branch* → your branch, `/ (root)`.
3. Visit `https://<your-username>.github.io/<repo-name>`.

All asset paths are **relative**, so both schemes work. React and the runtime load from a CDN at page load — no build step, no toolchain to maintain.

---

## 🖼️ Assets to supply

- `assets/projects/<id>/cover.png` (+ gallery images) per project
- `assets/resume.pdf` — linked by the Résumé buttons
- `assets/og-image.png` — social/link-preview image (recruiters sharing your link)
- `assets/profile.jpg` — optional About photo

Until you add them, the site shows tidy placeholders in the right aspect ratios, so the layout never breaks.

---

## 🎨 What's built in

- Rotating hero roles, animated grid background, scroll-reveal, card hover, filter animation, smooth-scroll nav with active highlighting, and a project detail modal (Esc / backdrop to close).
- Fully responsive and **`prefers-reduced-motion`** aware — motion is disabled for users who ask for it.
- Dark theme, accent `#4F8CFF`. Space Grotesk + Inter + JetBrains Mono.

---

## 🔧 Editing the design itself

The design lives in `Portfolio.dc.html`; `index.html` is a copy of it used as the deploy entry point. If you change the design, re-copy `Portfolio.dc.html` over `index.html`. For day-to-day project updates you never need to touch either — just `scripts/projects.js`.
