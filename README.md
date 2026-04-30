# Bouldering Training Planner

A web app for planning bouldering training with intent. Combines a weekly planner with a skill tree that helps you choose what to focus on during open climbing sessions.

## Concept

Most climbing sessions drift. You go to the gym, climb whatever looks fun, and train nothing in particular. This app adds light structure: a weekly plan where each open climbing block has a clear _intent_ (e.g. "focus on foot placement," "try every coordination problem"). The skill tree is the vocabulary for picking those intents.

**It is:** a planning tool with a learning library attached.
**It is not:** a session tracker, a coach, or an analytics platform.

## Three pieces

1. **Weekly planner.** Kanban with one column per day. Drop blocks (warmup, climbing, strength, mobility) into days. Check them off as you go. Fresh empty week every Sunday; past weeks remain accessible.
2. **Skill tree.** Radial visualization of climbing skills (technique, strength, mobility, tactics, etc.). Click a node for description, drills, and videos. Star nodes as goals or use them as intent for a climbing block.
3. **Block templates.** Reusable blocks (your standard warmup, your usual lifts).

## Data model (core types)

```ts
type Block = {
  id: string;
  name: string;
  durationMinutes: number;
  type: "climbing" | "strength" | "mobility" | "other";
  done: boolean;
  intent?: { skillNodeId: string; note?: string }; // climbing only
  strength?: { sets: number; reps: number; weightKg?: number };
  notes?: string;
};

type Week = { id: string; days: Day[] }; // ISO week, length 7
type Day = { date: string; blocks: Block[] };

type SkillNode = {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  drills: string[];
  videoUrls: string[];
  tags: string[];
  isGoal: boolean;
};
```

## Stack

React 19 + Vite 8 + TypeScript 6, React Router 7 (HashRouter), CSS Modules, framer-motion, @hello-pangea/dnd, lucide-react, Vitest. Frontend-only for now; persistence is localStorage.

## Design principles

- The weekly planner is the core feature. Other features should make planning better, not compete with it.
- Suggest focus, do not prescribe climbs.
- Keep stats minimal: block counts and rough hours, nothing more.
- The skill tree exists to name what you want to work on, not to program training for you.

## Roadmap

1. Planner MVP (blocks, templates, week navigator, localStorage)
2. Skill tree (radial viz, ~30 to 50 nodes, search, "use as intent")
3. Goals and per-week summaries
4. Backend and auth
