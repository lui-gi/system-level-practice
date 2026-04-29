# Final Exam Site Restructure — Design

**Date:** 2026-04-29
**Goal:** Reorganize the site so it can serve as study material for the upcoming final exam by replacing the current two-section home page with four content-area sections plus lecture slides, and migrating existing practice resources under a new "Exam 2 Content" section.

---

## Goals

- Home page presents four content areas as primary entry points: Exam 1 Content, Exam 2 Content, New Content, Concept Visualizations.
- Lecture slides remain accessible from the home page as an additional card.
- Existing 14 chapter HTML files (Exam 2 material) move under the Exam 2 section without filename changes.
- The three new sections (Exam 1, New Content, Concept Visualizations) are scaffolded as empty placeholders with clean empty states; their files will be added later.
- Display names in resource lists strip the `.html` extension. Files on disk keep their `.html` extension.
- Adding a new section in the future is a one-place change (add a folder, add a row to the section config).

## Non-goals

- No filename changes on disk.
- No redirects from old `/practice/*` URLs.
- No decision on the file format used by Concept Visualizations — that section's folder is empty for now and the format will be decided when the first visualization is built.
- No changes to the lecture slides feature (routes, folder, code unchanged).
- No changes to `/api/health` or `/api/slides`.

---

## Architecture

### Section configuration (single source of truth)

Four content sections are defined by a frontend constant `SECTIONS` (file: `client/src/lib/sections.ts`):

```ts
export const SECTIONS = [
  { id: "exam1",          title: "Exam 1 Content" },
  { id: "exam2",          title: "Exam 2 Content" },
  { id: "new",            title: "New Content" },
  { id: "visualizations", title: "Concept Visualizations" },
] as const;
```

The backend keeps a parallel allowlist of valid section ids (`["exam1", "exam2", "new", "visualizations"]`) used for validation. These two lists must stay in sync; in practice both are short enough that a code review catches drift.

### Disk layout

```
resources/
  exam1/                  # empty
  exam2/                  # all 14 existing .html files moved here
    ch03_io_formatted.html
    ch04_expressions.html
    ch05_selection.html
    ch06_loops.html
    ch08_arrays.html
    ch09_functions.html
    ch11_pointer_assignment.html
    ch11_pointer_basics.html
    ch11_pointers_as_args.html
    ch12_2d_arrays_pointers.html
    ch12_array_as_pointer.html
    ch12_pointer_arithmetic.html
    ch12_star_increment.html
    ch13_char_pointers_strings.html
  new/                    # empty
  visualizations/         # empty
```

Lecture slides folder (`slides/`) is untouched.

### URL routes

Replaces existing `/practice` routes. Slides routes unchanged.

| URL | Component | Behavior |
|---|---|---|
| `/` | `HomePage` | 5 cards: 4 sections + Slides |
| `/exam1` | `SectionPage` | List `resources/exam1/` |
| `/exam1/:id` | `SectionPage` | Iframe of the file |
| `/exam2` | `SectionPage` | List `resources/exam2/` |
| `/exam2/:id` | `SectionPage` | Iframe of the file |
| `/new` | `SectionPage` | List `resources/new/` |
| `/new/:id` | `SectionPage` | Iframe of the file |
| `/visualizations` | `SectionPage` | List `resources/visualizations/` |
| `/visualizations/:id` | `SectionPage` | Iframe of the file |
| `/slides`, `/slides/:filename` | `SlidesPage` | unchanged |

The four section URLs are wired in `App.tsx` by mapping over `SECTIONS` to generate `<Route>` elements — adding a new section later means adding one row to `SECTIONS` and one folder under `resources/`.

The existing `/practice` and `/practice/:id` routes are removed entirely. Old bookmarks 404.

### Backend API

File rename: `server/src/routes/resources.ts` → `server/src/routes/sections.ts`. Mount in `netlify/functions/api.ts` updates from `/api/resources` to `/api/sections`. The old `/api/resources` endpoints are removed.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/api/sections/:section` | Validate `:section` against allowlist (404 otherwise). List `.html` files in `resources/:section/`. Return `{ resources: [{ id, filename }] }`. Empty folder returns `{ resources: [] }`. |
| `GET` | `/api/sections/:section/:id/raw` | Validate `:section` against allowlist. Serve `resources/:section/:id.html` as `text/html`. 404 if missing. |

**Path-traversal protection:** beyond the allowlist on `:section`, the backend resolves the target path with `path.join(RESOURCES_DIR, section, `${id}.html`)` and verifies the resolved path remains inside `resources/<section>/` before reading. This blocks `id` values like `../../../etc/passwd`.

### Frontend components

- `HomePage.tsx` — render 5 cards from `SECTIONS` plus a static slides card. Single grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) — 5 cards flow naturally across rows. Drop the existing `highlight` treatment (no longer meaningful with 4 equal sections). Slides card uses the same card style as the others. Hero copy unchanged.
- `SectionPage.tsx` — renamed from `PracticePage.tsx`. Reads `:section` and `:id` from the URL. Looks up the section title in `SECTIONS`. Fetches `/api/sections/:section`. List view shows `r.id` instead of `r.filename` (the `.html` strip). Detail view loads `/api/sections/:section/:id/raw` in an iframe. Back link reads "← Back to {section title}".
- `Navbar.tsx` — replaces the single "Practice" link with five flat links: Exam 1, Exam 2, New, Visualizations, Slides. Active styling unchanged.
- `Layout.tsx` — unchanged.

### Empty state

When a section's folder has no `.html` files, the list view renders a simple message:

> "No resources here yet."

The current `PracticePage` already has an empty-state branch — it stays, with retuned copy. No "Coming soon" cards or special layouts.

---

## Data flow

User clicks home page card → React Router navigates to `/exam2` → `SectionPage` mounts, reads `:section = "exam2"`, looks up title, calls `GET /api/sections/exam2` → backend lists `resources/exam2/*.html` → frontend renders list → user clicks list item → navigates to `/exam2/ch03_io_formatted` → `SectionPage` re-renders in detail mode → iframe loads `/api/sections/exam2/ch03_io_formatted/raw`.

Identical flow for the other three sections; empty sections short-circuit at the list step with the empty-state message.

---

## Error handling

- **Invalid section in URL** (e.g., `/foo`): React Router has no matching route → renders nothing or shows a default 404 (matches current behavior for unknown URLs — no new 404 page added).
- **Invalid section in API call**: backend returns 404. Frontend already has `setError("Failed to load resources.")` — works as-is.
- **Missing file in raw endpoint**: backend returns 404; iframe shows the 404 body. Acceptable for this app.
- **Path-traversal attempt**: backend rejects with 404 after path-resolution check.
- **Empty folder**: not an error — returns `{ resources: [] }` and frontend renders the empty state.

---

## Migration steps (high level — implementation plan covers details)

1. Create `resources/exam1/`, `resources/exam2/`, `resources/new/`, `resources/visualizations/`.
2. Move all 14 existing `.html` files from `resources/` into `resources/exam2/`.
3. Add `client/src/lib/sections.ts` exporting `SECTIONS`.
4. Rename `server/src/routes/resources.ts` → `sections.ts`. Rewrite endpoints to take `:section`. Add allowlist + path-traversal check.
5. Update `netlify/functions/api.ts` to mount the new router.
6. Rename `client/src/pages/PracticePage.tsx` → `SectionPage.tsx`. Parameterize on section. Update fetch URLs. Strip `.html` from list display. Update title and back link from `SECTIONS`.
7. Update `App.tsx` routes (remove `/practice/*`, generate section routes from `SECTIONS`).
8. Update `Navbar.tsx` (5 flat links).
9. Update `HomePage.tsx` (5-card grid, drop highlight).

---

## Testing

Manual verification (no automated tests in this repo):

- Home page shows 5 cards. Each navigates to the correct URL.
- `/exam2` lists 14 files. Each filename appears without `.html`. Clicking opens iframe correctly.
- `/exam1`, `/new`, `/visualizations` show the empty-state message.
- Navbar links highlight correctly on the relevant section.
- `/slides` and `/slides/:filename` still work unchanged.
- Visit `/practice` directly → 404 (or no match), confirming old routes are gone.
- API: `curl /api/sections/exam2` returns 14 resources; `curl /api/sections/exam1` returns empty list; `curl /api/sections/foo` returns 404.

---

## Open items

- Concept Visualizations file format is undecided. The folder is empty after this change; the decision is deferred until the first visualization is built.
