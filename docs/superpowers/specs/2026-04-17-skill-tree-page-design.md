# Skill Tree Page — Design Spec
**Date:** 2026-04-17  
**Branch:** feature/goals  
**Status:** Approved

---

## Overview

Replace the existing Goals page with a new "Skill Tree" page — a video-game-style interactive skill browser where users explore climbing skills, read training content, and set active goals that connect to the kanban schedule system.

---

## What Gets Deleted

| File | Reason |
|---|---|
| `src/features/goals/GoalsPage.tsx` + `.module.css` | Replaced by SkillTreePage |
| `src/features/goals/GoalTab.tsx` + `.module.css` | Replaced by SkillDetailPanel |
| `src/features/goals/AddGoalModal.tsx` + `.module.css` | Goal selection now inline in tree |
| `src/data/skillTreeV1.ts` | Retired |
| `src/data/skillTreeV2.ts` | Retired |

`GoalsContext.tsx` is **kept unchanged** — the new page calls the same `addGoal` / `removeGoal` API.

---

## Data

### `src/data/skillTree.ts`

Uses the existing recursive `TreeNode` type (`TreeBranch | TreeLeaf` from `src/types/index.ts`). Supports **up to 3 levels of depth** — branches expand to show sub-branches, and only leaf nodes (those with `exercises`) open the detail panel.

**5 top-level categories:**

| Category | Example structure |
|---|---|
| Hold Types | Slopers, Crimps, Pinches, Pockets (leaves) |
| Wall Angles | Slab, Vertical, Overhang, Cave (leaves) |
| Moves & Technique | Dynos → [Coordination, Paddle] (3-level); Heel Hooks, Toe Hooks, Drop Knee, Flagging (leaves) |
| Physical & Conditioning | Finger Strength, Pull Strength, Core, Power Endurance (leaves) |
| Mental & Tactics | Route Reading, Fear Management, Competition Mindset (leaves) |

Leaf IDs reuse existing IDs where they overlap with skillTreeV2 (e.g. `"slopers"`, `"crimps"`) so activity goal tags stay valid. Any activities tagged with retired IDs get retagged to new equivalents in `src/data/activities.ts`.

---

## Feature Folder

`src/features/skillTree/`

```
SkillTreePage.tsx         # page root, owns all local state
SkillTreePage.module.css
GoalsDashboard.tsx        # badge strip showing active goals
TreeView.tsx              # recursive tree renderer
TreeView.module.css
SkillDetailPanel.tsx      # detail window for selected leaf
SkillDetailPanel.module.css
```

---

## State (SkillTreePage)

| State | Type | Purpose |
|---|---|---|
| `expandedIds` | `Set<string>` | Which branch/category nodes are currently open |
| `selectedLeafId` | `string \| null` | Which leaf is showing in the detail panel |
| `searchQuery` | `string` | Filters visible nodes across all categories |

`expandedIds` is toggled on click: clicking an open branch closes it (and its descendants stop rendering). Clicking a `TreeLeaf` sets `selectedLeafId`.

Goal state comes from `useGoals()` — no additional goal state lives in this page.

---

## Components

### GoalsDashboard
- Reads `goals` from `useGoals()`
- Renders a badge per goal showing `goal.areaLabel`
- Each badge has an × button calling `removeGoal(goal.id)`
- Animated: badges slide/pop in using `framer-motion` `AnimatePresence`

### TreeView (recursive)
- Accepts a `TreeNode[]` and the current `expandedIds` / `selectedLeafId`
- For each `TreeBranch`: renders a clickable node that toggles its ID in `expandedIds`, then recursively renders its children with an animated slide-down when open
- For each `TreeLeaf`: renders a clickable node that sets `selectedLeafId`
- Connecting lines between parent and child nodes rendered via CSS (absolute-positioned pseudo-elements or inline SVG)

### SkillDetailPanel
- Shows when `selectedLeafId` is set
- Content: skill title, theory paragraph, YouTube embed placeholder, drills list
- "Set as Current Goal" button calls `addGoal(leaf.id, leaf.label)`
- Button shows "Already a Goal" (disabled) if `goals.some(g => g.areaId === leaf.id)`
- Button shows "Goals Full" (disabled) if `goals.length >= 3`
- Animates in from below using `framer-motion`

### Search
- Filters: a node is visible if its label matches OR any descendant's label matches
- When a search term is active, all matching branches auto-expand

---

## Animation

Install `framer-motion`. Usage:
- `AnimatePresence` + `motion.div` with `initial/animate/exit` for branch children expanding
- `motion.div` for detail panel sliding up
- `motion.div` with `layout` for goal badges entering/leaving the dashboard

---

## Route & Navigation

- Route stays `/goals`
- `App.tsx`: swap `<GoalsPage>` import for `<SkillTreePage>`
- Sidebar: label changes from "Goals" to "Skill Tree" (icon can stay the same or update)

---

## Goals ↔ Schedule Connection

`addGoal(leaf.id, leaf.label)` stores a `Goal` with `areaId = leaf.id`. The suggestion algorithm in `src/utils/suggestions.ts` matches `activity.goalTags[].nodeId` against goal IDs — this continues to work as long as activity tags reference valid new skill IDs.

No changes needed to `GoalsContext.tsx` or `suggestions.ts`.
