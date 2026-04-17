# Goals Page — Design Spec
_Date: 2026-04-17_

## Context

Volume is a bouldering training app. The existing Goals page (two experimental variants: flat v1 and recursive tree v2) needs to become a real feature. Users need to set 1–3 active skill goals (e.g. "Overhang", "Finger Strength"), drill into a skill tree to select specific sub-skills to work on, and have those selections automatically surface relevant activities in the kanban board's "Add Activity" modal.

The key design insight is that activities (like Board Climbing) serve multiple goals simultaneously — they must be tagged to multiple skill tree nodes rather than embedded inside a single leaf.

---

## Goals Page Layout — Tab per Goal

- A tab bar across the top shows one tab per active goal (max 3) plus a "+ Add goal" tab
- The star (★) on a tab marks it as the Primary goal
- Each tab shows the full recursive skill tree for that goal area, where users expand branches and check leaf nodes (sub-skills) to work on
- A right-side summary panel lists the selected sub-skills for the active goal
- Clicking "+ Add goal" opens a modal grid of available top-level skill tree areas; areas already active are shown but disabled

---

## Kanban Add Activity Modal

- The existing "add activity" buttons on each day column open a modal
- Modal has three tabs: **Suggested** | All Activities | By Category
- Suggested tab: activities filtered by the user's selected sub-skills across all goals, sorted by match count descending (primary goal matches ranked first), each activity shows its matching goal path as a label

---

## Data Models

```ts
interface GoalTag {
  nodeId: string      // id from skillTreeV2 (branch or leaf)
  nodeLabel: string   // human label for display
}

interface Activity {
  id: string
  title: string
  subtitle: string    // e.g. "4 sets × 5 min"
  accent: string      // hex colour
  goalTags?: GoalTag[] // optional so existing kanban seed data doesn't break
}

interface Goal {
  id: string
  areaId: string        // top-level nodeId from skillTreeV2
  areaLabel: string
  isPrimary: boolean
  selectedNodeIds: string[]  // checked leaf/branch ids within this goal's tree
}
```

---

## GoalsContext API

```ts
const GoalsContext = {
  goals: Goal[],
  addGoal: (areaId: string, areaLabel: string) => void,
  removeGoal: (goalId: string) => void,
  setPrimary: (goalId: string) => void,
  toggleNode: (goalId: string, nodeId: string) => void,
}
```

State lives in `useState` (no persistence for now — demo app).

---

## Suggestion Algorithm

In `AddActivityModal`: for each activity, count how many of its `goalTags` have a `nodeId` that is an ancestor-or-match of any `selectedNodeId` across all active goals. Keep activities with count ≥ 1. Sort descending by count, with primary-goal matches ranked above secondary.

Ancestor check: walk up the `skillTreeV2` tree from a selected leaf; if any ancestor's id matches a goalTag nodeId, it's a match.

---

## Files to Create / Modify

| File | Change |
|---|---|
| `src/types/index.ts` | Add `Goal`, `GoalTag`; extend `Activity` with `goalTags` |
| `src/data/activities.ts` | **New** — seed Activity[] with goalTags (≥10 realistic climbing activities) |
| `src/contexts/GoalsContext.tsx` | **New** — `GoalsProvider` + `useGoals` hook |
| `src/features/goals/GoalsPage.tsx` | **Rewrite** — tab layout replacing current flat implementation |
| `src/features/goals/GoalTab.tsx` | **New** — recursive skill tree + selected summary for one goal |
| `src/features/goals/AddGoalModal.tsx` | **New** — modal to pick a top-level area and create a goal |
| `src/features/schedule/AddActivityModal.tsx` | **New** — Suggested / All / By Category tabs for kanban |
| `src/features/schedule/SchedulePage.tsx` | Wire "add activity" buttons to open `AddActivityModal` |
| `src/app/App.tsx` | Wrap in `GoalsProvider`; retire `/goals2` route |

---

## Out of Scope

- Load / recovery limits (separate future page)
- Custom goal names (must pick from existing top-level skill tree areas)
- Persisting goals to localStorage
- User-editable activity library (Activities page, future work)

---

## Verification

1. `npm run dev` — app loads without errors
2. Navigate to `/goals` — see tab bar with "+ Add goal"
3. Add "Overhang" goal — tab appears, skill tree renders
4. Expand "Body Tension", check "Core Strength" and "Rooting" — summary panel updates
5. Add "Finger Strength" as a second goal — second tab appears
6. Star Overhang as primary
7. Go to `/schedule`, click an "add activity" button on any day — modal opens on Suggested tab
8. Verify activities tagged to selected nodes appear, sorted by match count
9. Verify Board Climbing (tagged Finger Strength + Body Tension) appears with match count 2
10. `npm run typecheck` (if configured) — no type errors
