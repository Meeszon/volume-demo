# Volume

A training planning app. WIP/demo.

## What it is

Volume is a React app for planning and tracking training weeks. The core view is a draggable kanban board laid out by day of the week, where each card represents a workout or activity. Navigation includes a Schedule view, Activities, and two iterations of a Goals page (both currently in active design exploration).

## Stack

- React 19 + Vite
- `@hello-pangea/dnd` for drag-and-drop
- Plain CSS (no framework)

## Running locally

```bash
npm install
npm run dev
```

## Current state

- Kanban board with drag-and-drop across days — works
- Click-to-drag board scrolling — works
- Sidebar navigation — works
- Goals page — design iteration in progress (Goals 2 is the latest direction)
- Activities page — placeholder
- No persistence yet (state resets on reload)
