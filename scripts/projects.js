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
    "professional experience shipping C# and .NET, from database and API to the " +
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
    title: "Puffy",
    tagline: "Quit snus or cigarettes with a live counter, savings goals and a craving SOS",
    category: "Mobile App",
    tags: ["Android", ".NET MAUI", "C#", "Local-first"],
    description:
      "An Android app for quitting nicotine, whether that means snus pouches or " +
      "cigarettes. You pick your habit when you set it up and the app rewords itself " +
      "around it, from “pouches skipped” to “cigarettes not smoked”. A live counter " +
      "tracks time clean, units avoided and money saved, and those savings fund goals " +
      "you set for yourself. Cravings get their own SOS screen with breathing, " +
      "distraction games and your own reasons for quitting, and a slip only resets the " +
      "current streak, never the money or the badges. Everything runs offline with no " +
      "account, no server and no analytics.",
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
      "An Android app for logging electric skateboard rides. It records the route over " +
      "GPS and paints it on a velocity colour ramp, blue while you cruise through to red " +
      "at top speed, then saves distance, speed and elevation into a history you can " +
      "browse ride by ride. A garage holds your boards, lifetime stats and achievements " +
      "build up as you ride, and a foreground service keeps recording with the screen " +
      "off. Every number comes from real rides, stored on the phone with no account and " +
      "no cloud.",
    logo: "assets/apps/esk8-tracker/logo.svg",
    logoGlow: "rgba(46, 124, 246, .20)",
    thumbnail: "",
    gallery: [],
    status: "In Development",
    year: 2026,
    featured: true,
    links: { github: "https://github.com/Maksi333/Esk8_Tracker", apk: "assets/apk/esk8-tracker-v1.0.apk", playStore: "", appStore: "", demo: "", video: "", caseStudy: "" },
  },

  // ── Cali ─────────────────────────────────────────────
  {
    id: "cali",
    title: "Cali",
    tagline: "Bodyweight workouts, skill trees and achievements, all offline",
    category: "Mobile App",
    tags: ["Android", ".NET MAUI", "C#", "Fitness", "Local-first"],
    description:
      "A calisthenics app for training on nothing but your own bodyweight. Build your " +
      "own plans or start from the ones that ship with it, run them in AMRAP, EMOM or " +
      "Tabata modes, and log the reps you actually did rather than the ones you planned. " +
      "It tracks volume and personal records, unlocks harder movements through a skill " +
      "tree, and hands out 53 achievements along the way. The screen stays awake mid " +
      "workout and a beep marks the end of every rest. No login, no server, and the " +
      "training history stays on the phone.",
    logo: "assets/apps/cali/logo.svg",
    logoGlow: "rgba(255, 107, 26, .20)",
    thumbnail: "",
    gallery: [],
    status: "In Development",
    year: 2026,
    featured: true,
    links: { github: "https://github.com/Maksi333/Cali", apk: "assets/apk/cali-v1.0.apk", playStore: "", appStore: "", demo: "", video: "", caseStudy: "" },
  },

  // ➜ Add new projects by copying a block above and editing the fields.
];
