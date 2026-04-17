# Volume

A training planning app for climbers. In active development — transitioning from demo to a real product.

## What it is

Volume is a React app for planning and tracking training weeks. The core view is a draggable kanban board laid out by day of the week, where each card represents a workout or activity. Navigation includes a Schedule view, Activities, and two iterations of a Goals/skill-tree page.

## Stack

- **React 19 + Vite + TypeScript**
- **React Router v7** (HashRouter for GitHub Pages compatibility)
- **CSS Modules** (scoped styles per feature, no framework)
- `@hello-pangea/dnd` for drag-and-drop
- **Vitest** for unit tests

## Project structure

```
src/
├── app/              App shell, routing
├── components/
│   ├── icons/        All shared SVG icons
│   └── Sidebar/
├── data/             Static seed data (skillTreeV1, skillTreeV2, schedule)
├── features/
│   ├── schedule/     Kanban board + ActivityCard
│   ├── goals/        Goals v1 (flat) + Goals v2 (recursive tree)
│   └── activities/   Placeholder
├── hooks/            Shared hooks (useSetToggle)
├── types/            Shared TypeScript interfaces
└── utils/            schedule.ts + tests
```

## Running locally

```bash
npm install
npm run dev
```

## Scripts

| Command            | What it does                        |
|--------------------|-------------------------------------|
| `npm run dev`      | Start dev server                    |
| `npm run build`    | Production build                    |
| `npm run typecheck`| TypeScript type check               |
| `npm run lint`     | ESLint                              |
| `npm run format`   | Prettier (formats `src/`)           |
| `npm test`         | Run unit tests (Vitest)             |

## CI/CD

GitHub Actions runs typecheck, lint, tests, and build on every push to any branch. Deployment to GitHub Pages is automatic on pushes to `master`.

## Current state

- Kanban board with drag-and-drop across days — works
- Click-to-drag board scrolling — works
- Sidebar navigation with URL routing — works
- Goals v1 (category + skill chips) — works
- Goals v2 (recursive skill tree) — works, actively being iterated
- Activities page — placeholder
- No backend yet (state resets on reload)
