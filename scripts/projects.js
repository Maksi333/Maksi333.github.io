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
    "AI App Builder",
    "Data Scientist",
    "Indie Maker",
  ],

  // Short paragraph shown in the About section. Rewrite freely.
  about:
    "I'm a software developer and data scientist (Datamatiker) who builds real, " +
    "shippable products with AI as a co-pilot — mobile apps, websites, tools and " +
    "everything in between. I like local-first software that respects your data, " +
    "clean interfaces, and moving fast from idea to working prototype.",

  // Grouped tech tags. Add/remove groups and tags however you like.
  skills: [
    { group: "Languages", items: ["C#", "JavaScript", "Swift", "SQL"] },
    { group: "Mobile",    items: ["Android", ".NET MAUI", "SwiftUI", "Local-first"] },
    { group: "AI",        items: ["Claude", "Codex", "LLM tooling", "AI-assisted dev", "Prompting"] },
    { group: "Data",      items: ["Data science", "Analytics", "Data modelling"] },
    { group: "Tools",     items: ["Git", "GitHub Pages", "VS Code", "Figma"] },
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
  // ── Puffy — the published Android app (icon reused from /privacy/) ─────
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
    status: "Live",
    year: 2026,
    featured: true,
    // ➜ TODO: swap in the real Play Store URL once the listing is public.
    links: { playStore: "https://play.google.com/store/apps/details?id=your.app.id", appStore: "", github: "", demo: "", video: "", caseStudy: "" },
  },

  // ── Seed 1 ────────────────────────────────────────────────────────────
  {
    id: "esk8-tracker",
    title: "Ride Tracker",
    tagline: "Local-first GPS ride tracking for electric skateboards",
    category: "Mobile App",
    tags: ["Android", "Kotlin", "GPS", "Local-first"],
    description:
      "A production-grade Android app for logging esk8 rides with GPS tracking, " +
      "a velocity-ramp color system, and fully offline local storage — no account, " +
      "no cloud. Built for riders who want their data to stay on their device.",
    thumbnail: "assets/projects/esk8-tracker/cover.png",
    gallery: [
      "assets/projects/esk8-tracker/1.png",
      "assets/projects/esk8-tracker/2.png",
    ],
    status: "In Development",
    year: 2025,
    featured: true,
    // ➜ Replace these with your real URLs. Any blank ("") link hides its button.
    links: { playStore: "https://play.google.com/store/apps/details?id=your.app.id", appStore: "", github: "https://github.com/your-username/esk8-tracker", demo: "", video: "", caseStudy: "" },
  },

  // ── Seed 2 ────────────────────────────────────────────────────────────
  {
    id: "calisthenics-app",
    title: "Calisthenics Trainer",
    tagline: "Bodyweight workouts, skill trees, and achievements — all offline",
    category: "Mobile App",
    tags: ["Mobile", "TypeScript", "Fitness", "Local-first"],
    description:
      "A calisthenics training app with custom workout plans, AMRAP/EMOM/Tabata " +
      "modes, a skill-progression tree, and a 53-achievement system. Local-first, " +
      "no login required.",
    thumbnail: "assets/projects/calisthenics-app/cover.png",
    gallery: [],
    status: "In Development",
    year: 2025,
    featured: true,
    links: { playStore: "", appStore: "", github: "https://github.com/your-username/calisthenics-trainer", demo: "", video: "", caseStudy: "" },
  },

  /* ========================================================================
   *  SAMPLE CARDS BELOW — here to show the grid full and to demo the
   *  category filter. Replace or delete them as you add real projects.
   * ====================================================================== */

  {
    id: "portfolio-site",
    title: "This Portfolio",
    tagline: "The data-driven site you're looking at right now",
    category: "Web App",
    tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    description:
      "A static, animated portfolio deployed on GitHub Pages. Every project is a " +
      "single object in one data file — adding a new one never touches the layout " +
      "or styling. Fully responsive, keyboard-accessible, and reduced-motion aware.",
    thumbnail: "assets/projects/portfolio-site/cover.png",
    gallery: [],
    status: "Live",
    year: 2025,
    featured: false,
    links: { playStore: "", appStore: "", github: "", demo: "", video: "", caseStudy: "" },
  },

  {
    id: "ride-insights",
    title: "Ride Insights",
    tagline: "Turn raw GPS logs into charts, streaks, and personal records",
    category: "Data",
    tags: ["Python", "Pandas", "Analytics"],
    description:
      "A sample data project: a notebook-to-dashboard pipeline that parses exported " +
      "ride logs and surfaces distance, speed, and elevation trends over time.",
    thumbnail: "assets/projects/ride-insights/cover.png",
    gallery: [],
    status: "Prototype",
    year: 2024,
    featured: false,
    links: { playStore: "", appStore: "", github: "", demo: "", video: "", caseStudy: "" },
  },

  {
    id: "habit-garden",
    title: "Habit Garden",
    tagline: "A calm habit tracker where consistency grows a little garden",
    category: "Web App",
    tags: ["TypeScript", "PWA", "Local-first"],
    description:
      "A sample web app concept: a lightweight, offline-first habit tracker with a " +
      "playful growth visualisation to reward daily streaks.",
    thumbnail: "assets/projects/habit-garden/cover.png",
    gallery: [],
    status: "Prototype",
    year: 2024,
    featured: false,
    links: { playStore: "", appStore: "", github: "", demo: "", video: "", caseStudy: "" },
  },

  // ➜ Add new projects by copying a block above and editing the fields.
];
