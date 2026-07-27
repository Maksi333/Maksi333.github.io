/* ============================================================================
 *  privacy.js — THE ONLY FILE YOU EDIT TO LIST AN APP ON /privacy/
 *  ----------------------------------------------------------------------------
 *  One object per published app. The picker grid at /privacy/ is built from
 *  this array; the policy pages themselves are hand-written HTML.
 *
 *  Adding an app takes three steps:
 *    1. Append a block below.
 *    2. Drop a square logo at  assets/apps/<id>/logo.svg
 *    3. Copy  privacy/puffy/index.html  to  privacy/<id>/index.html  and
 *       rewrite the policy text for that app.
 *
 *  `id` does all the wiring — it is both the logo folder and the URL, so
 *  id: "puffy" means assets/apps/puffy/logo.svg and /privacy/puffy/.
 * ========================================================================== */

window.PRIVACY_APPS = [
  {
    id: "puffy",
    name: "Puffy — Nicotine Stop",
    tagline:
      "Quit nicotine pouches with a live counter, savings goals, and a craving " +
      "SOS. Collects nothing — everything stays on your phone.",
    platform: "Android",
    updated: "27 July 2026",
  },

  // ➜ Add the next app by copying the block above and editing the fields.
];
