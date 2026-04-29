# Final Exam Site Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the home page into 4 main content sections (Exam 1, Exam 2, New, Visualizations) plus a Slides card, migrate existing practice resources under `resources/exam2/`, and strip `.html` from displayed names.

**Architecture:** Single `SECTIONS` config drives the home page cards, navbar links, and routes. A single parameterized `SectionPage` component handles all four sections. Backend exposes a section-aware `/api/sections/:section` endpoint with allowlist + path-traversal protection. Existing slides feature is untouched.

**Tech Stack:** React 19, react-router 7, Vite, Tailwind 4, lucide-react (icons), Express + tsx (backend), serverless-http on Netlify Functions for production.

**Note on testing:** This repo has no test framework. Each task ends with a manual verification command (TypeScript build, lint, curl, dev-server check) plus expected output. Trust but verify — if a verification step fails, stop and diagnose before moving on.

**Reference spec:** `docs/superpowers/specs/2026-04-29-final-exam-restructure-design.md`

---

## File Structure

**Created:**
- `client/src/lib/sections.ts` — single source of truth for section ids, titles, descriptions, and icons
- `client/src/pages/SectionPage.tsx` — parameterized page replacing PracticePage
- `server/src/routes/sections.ts` — replaces resources.ts; section-aware endpoints
- `resources/exam1/` (empty), `resources/exam2/` (filled), `resources/new/` (empty), `resources/visualizations/` (empty)

**Modified:**
- `client/src/App.tsx` — replace `/practice` routes with section routes generated from `SECTIONS`
- `client/src/components/Navbar.tsx` — five flat links (4 sections + Slides)
- `client/src/pages/HomePage.tsx` — render 5 cards from `SECTIONS` + a slides card
- `server/src/index.ts` — mount `/api/sections` instead of `/api/resources`
- `netlify/functions/api.ts` — same mount change

**Deleted:**
- `client/src/pages/PracticePage.tsx` — replaced by SectionPage
- `server/src/routes/resources.ts` — replaced by sections.ts

**Moved:**
- All 14 `.html` files from `resources/` → `resources/exam2/`

---

## Task 1: Migrate disk layout

**Files:**
- Create: `resources/exam1/`, `resources/exam2/`, `resources/new/`, `resources/visualizations/`
- Move: all `resources/*.html` → `resources/exam2/`

- [ ] **Step 1: Create the four section subfolders**

```bash
mkdir -p resources/exam1 resources/exam2 resources/new resources/visualizations
```

- [ ] **Step 2: Move existing `.html` files into `resources/exam2/`**

```bash
git mv resources/ch03_io_formatted.html resources/exam2/
git mv resources/ch04_expressions.html resources/exam2/
git mv resources/ch05_selection.html resources/exam2/
git mv resources/ch06_loops.html resources/exam2/
git mv resources/ch08_arrays.html resources/exam2/
git mv resources/ch09_functions.html resources/exam2/
git mv resources/ch11_pointer_assignment.html resources/exam2/
git mv resources/ch11_pointer_basics.html resources/exam2/
git mv resources/ch11_pointers_as_args.html resources/exam2/
git mv resources/ch12_2d_arrays_pointers.html resources/exam2/
git mv resources/ch12_array_as_pointer.html resources/exam2/
git mv resources/ch12_pointer_arithmetic.html resources/exam2/
git mv resources/ch12_star_increment.html resources/exam2/
git mv resources/ch13_char_pointers_strings.html resources/exam2/
```

- [ ] **Step 3: Add `.gitkeep` to the three empty folders so git tracks them**

```bash
touch resources/exam1/.gitkeep resources/new/.gitkeep resources/visualizations/.gitkeep
```

- [ ] **Step 4: Verify the layout**

Run: `ls resources/ && echo --- && ls resources/exam2/`

Expected: top-level shows only the four subfolders; `resources/exam2/` shows all 14 `.html` files.

- [ ] **Step 5: Commit**

```bash
git add resources/
git commit -m "refactor: move practice resources into resources/exam2/ and scaffold section subfolders"
```

---

## Task 2: Add the SECTIONS config

**Files:**
- Create: `client/src/lib/sections.ts`

- [ ] **Step 1: Create the config file**

```ts
// client/src/lib/sections.ts
import { ScrollText, FileText, Sparkles, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Section = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const SECTIONS: Section[] = [
  {
    id: "exam1",
    title: "Exam 1 Content",
    description: "Practice material from Exam 1 chapters. Review topics covered in the first exam.",
    icon: ScrollText,
  },
  {
    id: "exam2",
    title: "Exam 2 Content",
    description: "Practice material from Exam 2 chapters. Review topics covered in the second exam.",
    icon: FileText,
  },
  {
    id: "new",
    title: "New Content",
    description: "Material covered after Exam 2. Review topics for the upcoming final.",
    icon: Sparkles,
  },
  {
    id: "visualizations",
    title: "Concept Visualizations",
    description: "Interactive visualizations to build intuition for tricky concepts.",
    icon: Eye,
  },
];

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build --workspace=client`

Expected: build succeeds with no type errors. (The new file isn't imported anywhere yet, so this only checks the file itself parses cleanly.)

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/sections.ts
git commit -m "feat: add SECTIONS config as single source of truth"
```

---

## Task 3: Replace backend resources router with sections router

**Files:**
- Create: `server/src/routes/sections.ts`
- Delete: `server/src/routes/resources.ts`
- Modify: `server/src/index.ts`
- Modify: `netlify/functions/api.ts`

- [ ] **Step 1: Create `server/src/routes/sections.ts`**

```ts
// server/src/routes/sections.ts
import { Router } from "express";
import { readdir, readFile } from "fs/promises";
import { join, basename, extname, resolve } from "path";

export const sectionsRouter = Router();

const RESOURCES_DIR = join(process.cwd(), "resources");
const ALLOWED_SECTIONS = ["exam1", "exam2", "new", "visualizations"];

function isValidSection(section: string): boolean {
  return ALLOWED_SECTIONS.includes(section);
}

// Resolve a path safely inside resources/<section>/, returning null if it would escape.
function safeResolve(section: string, filename: string): string | null {
  const sectionDir = resolve(RESOURCES_DIR, section);
  const target = resolve(sectionDir, filename);
  if (!target.startsWith(sectionDir + "/") && target !== sectionDir) {
    return null;
  }
  return target;
}

// GET /api/sections/:section — list .html files in resources/<section>/
sectionsRouter.get("/:section", async (req, res) => {
  const { section } = req.params;
  if (!isValidSection(section)) {
    return res.status(404).json({ error: "Section not found" });
  }
  try {
    const files = await readdir(join(RESOURCES_DIR, section));
    const htmlFiles = files
      .filter((f) => extname(f) === ".html")
      .map((f) => ({ id: basename(f, ".html"), filename: f }));
    res.json({ resources: htmlFiles });
  } catch {
    res.json({ resources: [] });
  }
});

// GET /api/sections/:section/:id/raw — serve the HTML file for iframe rendering
sectionsRouter.get("/:section/:id/raw", async (req, res) => {
  const { section, id } = req.params;
  if (!isValidSection(section)) {
    return res.status(404).send("Section not found");
  }
  const filePath = safeResolve(section, `${id}.html`);
  if (!filePath) {
    return res.status(404).send("Resource not found");
  }
  try {
    const html = await readFile(filePath, "utf-8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch {
    res.status(404).send("Resource not found");
  }
});
```

- [ ] **Step 2: Update `server/src/index.ts` to mount the new router**

Replace the import and mount lines.

```ts
// server/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { sectionsRouter } from "./routes/sections.js";
import { slidesRouter } from "./routes/slides.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/sections", sectionsRouter);
app.use("/api/slides", slidesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- [ ] **Step 3: Update `netlify/functions/api.ts` to mount the new router**

```ts
// netlify/functions/api.ts
import serverless from "serverless-http";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "../../server/src/routes/health.js";
import { sectionsRouter } from "../../server/src/routes/sections.js";
import { slidesRouter } from "../../server/src/routes/slides.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/sections", sectionsRouter);
app.use("/api/slides", slidesRouter);

export const handler = serverless(app, {
  binary: ["application/pdf"],
});
```

- [ ] **Step 4: Delete the old resources router**

```bash
git rm server/src/routes/resources.ts
```

- [ ] **Step 5: Verify build succeeds**

Run: `npm run build`

Expected: both client and server build without errors. (No references to `resourcesRouter` should remain.)

- [ ] **Step 6: Verify the API works against the running server**

Open one terminal: `npm run dev` (leave running)

In a second terminal:

```bash
curl -s http://localhost:3001/api/sections/exam2 | head -c 400
```

Expected: JSON like `{"resources":[{"id":"ch03_io_formatted","filename":"ch03_io_formatted.html"}, ... ]}` — 14 entries.

```bash
curl -s http://localhost:3001/api/sections/exam1
```

Expected: `{"resources":[]}`

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/sections/foo
```

Expected: `404`

```bash
curl -s http://localhost:3001/api/sections/exam2/ch03_io_formatted/raw | head -c 100
```

Expected: HTML content starting with `<!DOCTYPE html>` or similar.

```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3001/api/sections/exam2/..%2F..%2Fpackage/raw"
```

Expected: `404` (path-traversal blocked).

Stop the dev server before continuing.

- [ ] **Step 7: Commit**

```bash
git add server/src/routes/sections.ts server/src/index.ts netlify/functions/api.ts server/src/routes/resources.ts
git commit -m "feat: replace resources API with section-aware /api/sections endpoints"
```

---

## Task 4: Replace PracticePage with parameterized SectionPage

**Files:**
- Create: `client/src/pages/SectionPage.tsx`
- Delete: `client/src/pages/PracticePage.tsx`

- [ ] **Step 1: Create `client/src/pages/SectionPage.tsx`**

```tsx
// client/src/pages/SectionPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { getSection } from "@/lib/sections";

type ResourceMeta = { id: string; filename: string };

export default function SectionPage() {
  const { section, id } = useParams<{ section: string; id: string }>();
  const [resources, setResources] = useState<ResourceMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sectionMeta = section ? getSection(section) : undefined;
  const sectionTitle = sectionMeta?.title ?? "Resources";

  useEffect(() => {
    if (section && !id) {
      fetch(`/api/sections/${section}`)
        .then((r) => r.json())
        .then((data) => setResources(data.resources ?? []))
        .catch(() => setError("Failed to load resources."));
    }
  }, [section, id]);

  if (!section || !sectionMeta) {
    return (
      <main className="mx-auto max-w-4xl px-8 py-16">
        <p className="text-sm text-destructive">Unknown section.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-16">
      {!id ? (
        <>
          <h1 className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
            {sectionTitle}
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Select a resource to begin.
          </p>

          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {resources.length === 0 && !error ? (
            <p className="text-sm text-muted-foreground">
              No resources here yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {resources.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/${section}/${r.id}`}
                    className="group flex items-center justify-between py-3 transition-colors hover:text-primary"
                  >
                    <span className="font-mono text-sm text-foreground group-hover:text-primary">
                      {r.id}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <Link
              to={`/${section}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to {sectionTitle}
            </Link>
            <a
              href={`/api/sections/${section}/${id}/raw`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open in new tab ↗
            </a>
          </div>
          <h1 className="mb-6 font-mono text-2xl font-semibold text-foreground">
            {id}
          </h1>
          <iframe
            src={`/api/sections/${section}/${id}/raw`}
            className="w-full rounded border border-border"
            style={{ height: "80vh" }}
            title={id}
          />
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript still compiles**

Run: `npm run build --workspace=client`

Expected: build succeeds. `PracticePage.tsx` still exists and is still imported by `App.tsx`, so nothing is broken. `SectionPage.tsx` exists but isn't routed yet — Task 5 wires it up.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/SectionPage.tsx
git commit -m "feat: add parameterized SectionPage component"
```

---

## Task 5: Update App.tsx routes and delete PracticePage

**Files:**
- Modify: `client/src/App.tsx`
- Delete: `client/src/pages/PracticePage.tsx`

- [ ] **Step 1: Replace the routes**

```tsx
// client/src/App.tsx
import { Routes, Route } from "react-router";
import Layout from "./components/Layout.tsx";
import HomePage from "./pages/HomePage.tsx";
import SectionPage from "./pages/SectionPage.tsx";
import SlidesPage from "./pages/SlidesPage.tsx";
import { SECTIONS } from "./lib/sections.ts";

export default function App() {
  const sectionRoutes = SECTIONS.flatMap((s) => [
    <Route key={`${s.id}-list`} path={`/${s.id}`} element={<SectionPage />} />,
    <Route key={`${s.id}-detail`} path={`/${s.id}/:id`} element={<SectionPage />} />,
  ]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {sectionRoutes}
        <Route path="/slides" element={<SlidesPage />} />
        <Route path="/slides/:filename" element={<SlidesPage />} />
      </Routes>
    </Layout>
  );
}
```

`flatMap` returns a flat array of `<Route>` elements. React renders arrays as siblings; each Route has its own `key`. No fragment needed.

- [ ] **Step 2: Delete the old PracticePage**

```bash
git rm client/src/pages/PracticePage.tsx
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run build --workspace=client`

Expected: build succeeds. PracticePage is gone, SectionPage is wired up.

- [ ] **Step 4: Verify lint passes**

Run: `npm run lint --workspace=client`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/App.tsx client/src/pages/PracticePage.tsx
git commit -m "feat: route /:section and /:section/:id through SectionPage; remove PracticePage"
```

---

## Task 6: Update Navbar with five flat links

**Files:**
- Modify: `client/src/components/Navbar.tsx`

- [ ] **Step 1: Replace the nav links**

```tsx
// client/src/components/Navbar.tsx
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { SECTIONS } from "@/lib/sections";

const navLinks = [
  ...SECTIONS.map((s) => ({ to: `/${s.id}`, label: s.title.replace(" Content", "") })),
  { to: "/slides", label: "Slides" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-8">
        <Link
          to="/"
          className="text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
        >
          SysLevel Practice
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "text-sm transition-colors",
                pathname.startsWith(to)
                  ? "font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

The `.replace(" Content", "")` shortens "Exam 1 Content" → "Exam 1" etc. for the navbar (full titles in cards, short titles in nav). "Concept Visualizations" stays as-is — there's no "Content" suffix to strip, so it'll need to fit. If it doesn't fit visually, the `gap-6` between links can be reduced in a follow-up; don't change it preemptively.

- [ ] **Step 2: Verify build**

Run: `npm run build --workspace=client`

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/Navbar.tsx
git commit -m "feat: replace single Practice nav link with five flat section links"
```

---

## Task 7: Update HomePage with five-card grid

**Files:**
- Modify: `client/src/pages/HomePage.tsx`

- [ ] **Step 1: Replace the page**

```tsx
// client/src/pages/HomePage.tsx
import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { SECTIONS } from "@/lib/sections";

const slidesCard = {
  to: "/slides",
  icon: BookOpen,
  title: "Lecture Slides",
  description:
    "Browse PDF slide decks from class. Cross-reference topics while working through practice problems.",
};

export default function HomePage() {
  const cards = [
    ...SECTIONS.map((s) => ({
      to: `/${s.id}`,
      icon: s.icon,
      title: s.title,
      description: s.description,
    })),
    slidesCard,
  ];

  return (
    <div className="mx-auto max-w-4xl px-8 py-20">
      {/* Hero */}
      <section className="mb-20">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          CSC 3320 · System Level Programming
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground">
          SysLevel Practice
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Practice resources for CSC 3320. Includes lecture slides for easy cross-referencing.
        </p>
      </section>

      {/* Section cards */}
      <section>
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Sections
        </p>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-4 rounded border border-border p-6 transition-colors hover:bg-accent"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-primary" />
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-foreground">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Attribution */}
      <div className="mt-10 flex flex-col items-start gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          made by:
        </p>
        <pre
          className="font-mono text-xs text-muted-foreground"
          style={{ animation: "spinY 6s linear infinite", display: "inline-block" }}
        >{` _       _       _
| |_   _(_) __ _(_)
| | | | | |/ _\` | |
| | |_| | | (_| | |
|_|\\__,_|_|\\__, |_|
           |___/   `}</pre>
      </div>
    </div>
  );
}
```

Key changes vs. the current file:
- Cards are built by mapping `SECTIONS` and appending the slides card.
- Grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — accommodates 5 cards across breakpoints.
- The `highlight` prop and its conditional class blocks are gone — all cards share one style.

- [ ] **Step 2: Verify build**

Run: `npm run build --workspace=client`

Expected: build succeeds.

- [ ] **Step 3: Verify lint**

Run: `npm run lint --workspace=client`

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/HomePage.tsx
git commit -m "feat: render home page as five-card grid driven by SECTIONS"
```

---

## Task 8: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the full dev environment**

Run: `npm run dev`

Wait for both the server (`Server running on http://localhost:3001`) and client (`Local: http://localhost:5173`) to come up.

- [ ] **Step 2: Verify the home page**

Open `http://localhost:5173/` in a browser.

Expected:
- Five cards visible: Exam 1 Content, Exam 2 Content, New Content, Concept Visualizations, Lecture Slides.
- All five cards share the same style (no highlighted card).
- Each card has an icon and the description from SECTIONS.

- [ ] **Step 3: Verify Exam 2 list view**

Click the "Exam 2 Content" card.

Expected:
- URL is `/exam2`.
- Page title reads "Exam 2 Content".
- 14 list items, each shown as `chXX_…` (no `.html` suffix).

- [ ] **Step 4: Verify Exam 2 detail view**

Click any item, e.g. `ch03_io_formatted`.

Expected:
- URL is `/exam2/ch03_io_formatted`.
- Iframe renders the quiz HTML.
- Back link reads "← Back to Exam 2 Content".
- "Open in new tab ↗" link works and opens the raw HTML.

- [ ] **Step 5: Verify empty sections**

Visit `/exam1`, `/new`, `/visualizations` (via home page cards or navbar).

Expected: each shows the page title from SECTIONS and the message "No resources here yet."

- [ ] **Step 6: Verify navbar**

Expected:
- Five links visible: Exam 1, Exam 2, New, Visualizations, Slides.
- The active link is highlighted (primary color, medium weight) when on the matching page.
- Clicking each navigates correctly.

- [ ] **Step 7: Verify slides untouched**

Click "Slides" in the navbar (or the Slides card on home).

Expected: existing slides page works exactly as before.

- [ ] **Step 8: Verify old `/practice` URLs are gone**

Visit `http://localhost:5173/practice` and `http://localhost:5173/practice/ch03_io_formatted`.

Expected: blank page or React Router default (no matching route). This is acceptable — the spec calls for no redirects.

- [ ] **Step 9: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

- [ ] **Step 10: No commit needed**

Verification only. If any step failed, return to the relevant task and fix.

---

## Self-review notes

- **Spec coverage check:** every requirement in `docs/superpowers/specs/2026-04-29-final-exam-restructure-design.md` is mapped to a task above (sections, URLs, backend API + path-traversal, SectionPage parameterization, navbar, home page grid, empty state, `.html` strip via `r.id`, slides untouched, no `/practice` redirects).
- **Type consistency:** the SECTIONS shape and `getSection()` helper from Task 2 are referenced consistently in Tasks 4, 5, 6, 7. The backend allowlist mirrors the four ids.
- **No placeholders:** every code step contains complete code; every verification step has an exact command and expected output.
- **Open from spec:** Concept Visualizations file format is intentionally deferred — Task 1 only scaffolds the empty folder.
