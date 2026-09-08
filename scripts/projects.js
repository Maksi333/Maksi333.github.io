/* ============================================================================
 *  projects.js — THE ONLY FILE YOU NEED TO EDIT
 *  ----------------------------------------------------------------------------
 *  Everything on the site reads from the two objects below:
 *    • window.SITE     — your name, roles, bio, skills, contact links
 *    • window.PROJECTS — one object per project (add a project = append a block)
 *  You never have to touch the HTML, CSS, or layout code. Just edit here,
 *  commit, and push — GitHub Pages redeploys automatically.
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  1) SITE — hero identity, about, skills, and contact links
 * ------------------------------------------------------------------------- */
window.SITE = {
  name: "Simon Nørgaard Andersen",

  // The first role shows immediately; the rest rotate in the hero.
  roles: [
    "Software Developer",
    "Full Stack Developer",
    ".NET Developer",
    "AI App Builder",
    "Data Scientist",
    "Indie Maker",
  ],

  // Short paragraph shown in the About section. Rewrite freely.
  about:
    "I'm a software developer with an AP Degree in Computer Science (Datamatiker) and " +
    "professional experience shipping C# and .NET — from database and API to the " +
    "interface people actually use. I also hold an AP Degree in Financial Management " +
    "(Finansøkonom) and spent a few years at Nordea, so I understand the business " +
    "behind the code. On the side I build apps and websites with AI as a co-pilot: " +
    "local-first software that respects your data, clean interfaces, and a short path " +
    "from idea to shipped.",

  // Grouped tech tags. Add/remove groups and tags however you like.
  skills: [
    { group: "Languages", items: ["C#", "JavaScript", "Swift", "Java", "SQL"] },
    { group: "Backend",   items: [".NET / .NET Core", "ASP.NET MVC", "Entity Framework", "REST APIs", "SQL databases"] },
    { group: "Frontend",  items: ["Blazor", "Razor", "HTML", "CSS", "JavaScript"] },
    { group: "Mobile",    items: ["Android", ".NET MAUI", "Flutter / Dart", "SwiftUI", "Local-first"] },
    { group: "AI",        items: ["Claude", "Codex", "LLM tooling", "AI-assisted dev", "Prompting"] },
    { group: "Data",      items: ["Data science", "Analytics", "Data modelling"] },
    { group: "Ways of working", items: ["Scrum", "Git & Git-flow", "Code review", "Extreme Programming"] },
    { group: "Tools",     items: ["Visual Studio", "VS Code", "Unity", "GitHub Pages", "Figma"] },
  ],

  // Contact links. Leave any value as "" to hide that item.
  contact: {
    email:    "Simon_n_andersen@live.dk",
    github:   "https://github.com/Maksi333",
    linkedin: "https://www.linkedin.com/in/simonnandersen",
    resume:   "assets/resume.pdf",
  },
};

/* ---------------------------------------------------------------------------
 *  2) PROJECTS — the centerpiece grid
 *  Rules the site applies automatically:
 *    • Filter chips are built from the unique `category` values (+ "All").
 *    • Order: featured first, then newest `year` first.
 *    • A card only shows the link buttons whose URL is non-empty.
 *    • Clicking a card opens a detail view using `description` + `gallery`.
 *    • A card shows a wide screenshot (`thumbnail`) — unless you give it a
 *      square app icon via `logo`, which is centred on a glow instead, exactly
 *      like the app cards on /privacy/. `logoGlow` tints that glow (optional).
 *  To add a project: copy a { … } block, paste it in, edit the fields.
 * ------------------------------------------------------------------------- */
window.PROJECTS = [
  // ── Puffy ────────────────────────────────────────────
  {
    id: "puffy",
    title: "Puffy — Nicotine Stop",
    tagline: "Quit nicotine pouches with a live counter, savings goals, and a craving SOS",
    category: "Mobile App",
    tags: ["Android", ".NET MAUI", "C#", "Local-first"],
    description:
      "An Android app for quitting nicotine pouches: a live counter of time, pouches " +
      "avoided and money saved, savings goals you can attach a photo to, and a craving " +
      "SOS for the moments that matter. Progress is rewarded with XP, levels, badges and " +
      "streaks, and home-screen widgets keep the numbers in view. Fully offline — no " +
      "account, no server, no analytics: every entry stays in the app's private storage " +
      "on the phone, with CSV export and a one-tap reset.",
    // Square app icon — centred on the card instead of a stretched screenshot.
    logo: "assets/apps/puffy/logo.svg",
    logoGlow: "rgba(20, 179, 107, .20)",
    thumbnail: "",
    gallery: [],
    status: "In Development",
    year: 2026,
    featured: true,
    links: { github: "https://github.com/Maksi333/Nicotine_Stop", apk: "assets/apk/puffy-v1.0.apk", playStore: "", appStore: "", demo: "", video: "", caseStudy: "" },
  },

  // ── Ride Tracker ────────────────────────────────────
  {
    id: "esk8-tracker",
    title: "Ride Tracker",
    tagline: "Local-first GPS ride tracking for electric skateboards",
    category: "Mobile App",
    tags: ["Android", ".NET MAUI", "C#", "GPS", "Local-first"],
    description:
      "An Android app for logging esk8 rides with live GPS tracking, a velocity-ramp " +
      "colour system that paints the route by speed, and per-ride stats you can export. " +
      "Everything is stored locally on the phone — no account, no cloud — for riders " +
      "who want their data to stay on their own device.",
    logo: "assets/apps/esk8-tracker/logo.svg",
    logoGlow: "rgba(46, 124, 246, .20)",
    thumbnail: "",
    gallery: [],
    status: "In Development",
    year: 2026,
    featured: true,
    links: { apk: "assets/apk/esk8-tracker-v1.0.apk", github: "", playStore: "", appStore: "", demo: "", video: "", caseStudy: "" },
  },

  // ── Cali ─────────────────────────────────────────────
  {
    id: "cali",
    title: "Cali",
    tagline: "Bodyweight workouts, skill trees, and achievements — all offline",
    category: "Mobile App",
    tags: ["Android", ".NET MAUI", "C#", "Fitness", "Local-first"],
    description:
      "A calisthenics training app with custom workout plans, AMRAP/EMOM/Tabata modes, " +
      "a skill-progression tree that unlocks harder movements as you earn them, and a " +
      "53-achievement system. Local-first and offline: no login, no server, and your " +
      "training history never leaves the phone.",
    logo: "assets/apps/cali/logo.svg",
    logoGlow: "rgba(255, 107, 26, .20)",
    thumbnail: "",
    gallery: [],
    status: "In Development",
    year: 2026,
    featured: true,
    links: { apk: "assets/apk/cali-v1.0.apk", github: "", playStore: "", appStore: "", demo: "", video: "", caseStudy: "" },
  },

  // ➜ Add new projects by copying a block above and editing the fields.
];
