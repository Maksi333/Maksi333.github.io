# Privacy Policy Section — Design

**Date:** 2026-07-27
**Status:** Approved

## Goal

Add a privacy-policy area to the portfolio so each published app has a stable, directly
linkable URL that can be pasted into the Google Play Console. First app: **Puffy — Nicotine
Stop**. The section reuses the existing site theme without exception.

## Decisions

| Question | Decision |
|---|---|
| Routing | Real static folders — `/privacy/` and `/privacy/puffy/` |
| Contact email | `Simon_n_andersen@live.dk` |
| App naming | "Puffy — Nicotine Stop" (no package ID in the copy) |
| Language | English only |

Play Console URL: `https://maksi333.github.io/privacy/puffy/`

## Files

```
index.html                     modified — "Privacy" button in the top bar
styles.css                     modified — .papp-* (picker) and .policy-* (document) blocks
scripts/privacy.js             new — app registry powering the picker grid
privacy/index.html             new — app picker            → /privacy/
privacy/puffy/index.html       new — the policy, static    → /privacy/puffy/
assets/apps/puffy/logo.svg     new — the Puffy logo
README.md                      modified — how to add an app
```

## Architecture

**The picker** renders from `window.PRIVACY_APPS` in `scripts/privacy.js`, matching the site's
existing "edit one data file" workflow. The data holds no paths: entries carry an `id`, and the
renderer derives `href = id + '/'` and `logo = '../assets/apps/' + id + '/logo.svg'` relative to
the picker page. A `<noscript>` block lists the same apps so the page is never blank.

**The policy page is pure static HTML.** No JavaScript participates in rendering a single word
of it. A Play reviewer, a crawler, or a browser with JS disabled all see the complete document.
This is the one hard constraint that drove the routing decision.

**The top-bar control sits outside `.nav-links`**, next to the Résumé button. `.nav-links` is
`display: none` under 700px, so a link placed inside it would vanish on phones — the privacy
policy must stay reachable everywhere. A `max-width: 460px` rule tightens both header buttons so
brand + two buttons still fit on a narrow phone.

## Visual design

Theme is inherited wholesale from `styles.css`: `--bg #0B0D10`, `--accent #4F8CFF`, `--teal
#22D3A8`, Space Grotesk / Inter / JetBrains Mono, the ambient gradient layers, the constellation
canvas, the fixed blurred header and the shared footer.

**Picker** — `// Privacy` eyebrow, "App privacy policies" H2, then the Selected Work card grid.
Each card shows the app logo centred in a 16:10 panel over a soft green radial glow (rather than
a cropped cover image), the app name, a one-line summary, a platform tag, and a mono
`Updated <date>` pill where the status pill sits on a work card. Whole card is a link.

**Policy** — centred reading column, max 72ch. Masthead pairs the logo with the app name and
"Privacy Policy". Directly below, an accent-bordered callout states the one thing that matters:
Puffy collects nothing.

The signature element is a two-column summary — **"Stored on your device"** (teal) beside
**"Never collected"** (blue) — placed above the legal text. It mirrors the app's own "I slipped"
screen, which pairs a KEEP column against a RESETS column, so the structural device is borrowed
from the product's own vernacular rather than invented as decoration.

Sections are numbered in the mono face. Numbering is justified here because a policy is a
document people cite by section, not because sequence implies order.

## Policy content

Written from what the code actually does, verified by reading the Puffy source:

- **Local-only storage** — SQLite (`AppDatabase`) plus `Preferences`, in private app storage.
- **No network** — no `HttpClient`, no analytics, ads, crash reporting, or tracking SDKs.
- **Data held** — name, quit date/time, pouches per day and per can, price, currency,
  motivations, event log (check-ins, cravings won, slips with optional trigger and note), goals
  (name, price, photo), XP/levels/badges/streaks, game scores.
- **Photos** — chosen through the system picker, copied into `AppDataDirectory`; the app never
  browses the gallery.
- **Notifications** — `Plugin.LocalNotification`, scheduled and delivered on device (daily 08:00,
  weekly Sunday 18:00, milestones).
- **CSV export** — written to cache and handed to the system share sheet; the destination is the
  user's choice, and the exported copy leaves the app's control.
- **Permissions** — `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`, and `INTERNET` /
  `ACCESS_NETWORK_STATE`, which are MAUI template defaults and unused.

Sections: who is responsible · what is stored and where · what is never collected · permissions ·
notifications · goal photos · export · device backup · deletion · children · health disclaimer ·
GDPR position · changes · contact. Effective 27 July 2026.

### Two disclosures written honestly rather than papered over

1. **`android:allowBackup="true"`** is set in the Android manifest, so Android Auto Backup can
   copy Puffy's data into the user's own Google account. That is a real data flow and the policy
   states it plainly, including how to switch it off. Setting the flag to `false` is an app-side
   change and remains the owner's decision.
2. **`INTERNET` / `ACCESS_NETWORK_STATE`** are declared but unused. The permissions table says so
   and the policy states the app makes no network connections — accurate as written.

## Logo

Puff redrawn as SVG from the exact fractional geometry in `Controls/PuffMascot.cs`
(`PuffDrawable.Draw`), so the website logo is the same avatar the app renders, not a lookalike:
mint `#BDF0D4` face, `#17322B` eyes and smile, `#FFB1A6` cheeks at 85%, and the clipped
`rgba(20,179,107,.18)` inset shade across the bottom of the face. It sits on a flat `#14B36B`
rounded tile — the app's own icon colour from `Nicotine_Stop.csproj` — sized as an app icon.
Flat, with no gradient or gloss: the mint face against the dark site supplies all the contrast
the mark needs.

## Adding the next app

1. Add a block to `window.PRIVACY_APPS` in `scripts/privacy.js`.
2. Drop a logo at `assets/apps/<id>/logo.svg`.
3. Copy `privacy/puffy/index.html` to `privacy/<id>/index.html` and rewrite the content.

Documented in `README.md`.

## Out of scope

- Adding Puffy to the Selected Work grid — the request placed it under the privacy section only.
- Changes to the Puffy app itself, including the two manifest flags noted above.
