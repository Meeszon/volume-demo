# Goals Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tab-per-goal Goals page where users set 1–3 skill goals, drill into a recursive skill tree to select sub-skills, and surface those selections as ranked suggestions in the kanban Add Activity modal.

**Architecture:** A new `GoalsContext` shares goal state app-wide. Pure utility functions (`tree.ts`, `suggestions.ts`) handle tree traversal and activity ranking, making them testable in isolation. All new UI components are feature-local (goals/, schedule/) with their own CSS Modules.

**Tech Stack:** React 19, TypeScript, CSS Modules, Vitest, React Router v7 (HashRouter)

---

## File Map

| File | Status | Purpose |
|---|---|---|
| `src/types/index.ts` | Modify | Add `Goal`, `GoalTag`; add `goalTags?` to `Activity`; make `grade` optional |
| `src/utils/tree.ts` | Create | `isLeaf`, `getAncestorIds`, `getTopLevelAreas` |
| `src/utils/tree.test.ts` | Create | Unit tests for tree utilities |
| `src/utils/suggestions.ts` | Create | `getSuggestedActivities` — pure ranking function |
| `src/utils/suggestions.test.ts` | Create | Unit tests for suggestion algorithm |
| `src/data/activities.ts` | Create | 12 seed activities with `goalTags` |
| `src/contexts/GoalsContext.tsx` | Create | `GoalsProvider` + `useGoals` hook |
| `src/features/goals/GoalTab.tsx` | Create | Recursive tree picker + summary panel for one goal |
| `src/features/goals/GoalTab.module.css` | Create | Styles for GoalTab |
| `src/features/goals/AddGoalModal.tsx` | Create | Modal grid to pick a top-level area |
| `src/features/goals/AddGoalModal.module.css` | Create | Styles for AddGoalModal |
| `src/features/goals/GoalsPage.tsx` | Rewrite | Tab bar layout using GoalTab + AddGoalModal |
| `src/features/goals/GoalsPage.module.css` | Rewrite | Tab bar styles (old flat layout styles removed) |
| `src/features/schedule/AddActivityModal.tsx` | Create | Suggested / All / By Category modal for kanban |
| `src/features/schedule/AddActivityModal.module.css` | Create | Styles for AddActivityModal |
| `src/features/schedule/SchedulePage.tsx` | Modify | Wire Add Activity button to open AddActivityModal |
| `src/app/App.tsx` | Modify | Add `GoalsProvider`, remove `/goals2` route |
| `src/components/Sidebar/Sidebar.tsx` | Modify | Remove "Goals 2" nav item |

---

## Task 1: Types and tree utilities

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/utils/tree.ts`
- Create: `src/utils/tree.test.ts`

- [ ] **Step 1: Write the failing tests for tree utilities**

Create `src/utils/tree.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { isLeaf, getAncestorIds, getTopLevelAreas } from "./tree";
import type { TreeNode } from "../types";

const MOCK_TREE: TreeNode[] = [
  {
    id: "root-a",
    label: "Root A",
    children: [
      {
        id: "branch-a",
        label: "Branch A",
        children: [
          { id: "leaf-a1", label: "Leaf A1", exercises: [] },
          { id: "leaf-a2", label: "Leaf A2", exercises: [] },
        ],
      },
      { id: "leaf-a3", label: "Leaf A3", exercises: [] },
    ],
  },
  {
    id: "root-b",
    label: "Root B",
    children: [
      { id: "leaf-b1", label: "Leaf B1", exercises: [] },
    ],
  },
];

describe("isLeaf", () => {
  it("returns true for a leaf node", () => {
    expect(isLeaf({ id: "x", label: "X", exercises: [] })).toBe(true);
  });
  it("returns false for a branch node", () => {
    expect(isLeaf({ id: "x", label: "X", children: [] })).toBe(false);
  });
});

describe("getAncestorIds", () => {
  it("returns [] for a direct child of root", () => {
    expect(getAncestorIds("root-a", MOCK_TREE)).toEqual([]);
  });
  it("returns [root-a] for branch-a", () => {
    expect(getAncestorIds("branch-a", MOCK_TREE)).toEqual(["root-a"]);
  });
  it("returns [root-a, branch-a] for leaf-a1", () => {
    expect(getAncestorIds("leaf-a1", MOCK_TREE)).toEqual(["root-a", "branch-a"]);
  });
  it("returns null for a nodeId not in the tree", () => {
    expect(getAncestorIds("nope", MOCK_TREE)).toBeNull();
  });
  it("returns [root-a] for leaf-a3 (direct child of root-a)", () => {
    expect(getAncestorIds("leaf-a3", MOCK_TREE)).toEqual(["root-a"]);
  });
});

describe("getTopLevelAreas", () => {
  it("returns only branch nodes at the top level", () => {
    const areas = getTopLevelAreas(MOCK_TREE);
    expect(areas).toHaveLength(2);
    expect(areas.map(a => a.id)).toEqual(["root-a", "root-b"]);
  });
  it("returns [] when tree is empty", () => {
    expect(getTopLevelAreas([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test -- --reporter=verbose 2>&1 | head -40
```

Expected: FAIL — "Cannot find module './tree'"

- [ ] **Step 3: Update `src/types/index.ts`**

Add the new types and modify `Activity`. Replace the file with:

```ts
export interface Exercise {
  name: string;
  detail: string;
}

export interface Skill {
  id: string;
  label: string;
  exercises: Exercise[];
}

export interface Category {
  id: string;
  label: string;
  color: string;
  skills: Skill[];
}

export interface SelectedSkillV1 extends Skill {
  categoryColor: string;
  categoryLabel: string;
}

// Recursive skill tree
export interface TreeBranch {
  id: string;
  label: string;
  children: TreeNode[];
}

export interface TreeLeaf {
  id: string;
  label: string;
  exercises: Exercise[];
}

export type TreeNode = TreeBranch | TreeLeaf;

export interface SelectedSkillV2 extends TreeLeaf {
  ancestorPath: string[];
}

// Goals
export interface GoalTag {
  nodeId: string;
  nodeLabel: string;
}

export interface Goal {
  id: string;
  areaId: string;
  areaLabel: string;
  isPrimary: boolean;
  selectedNodeIds: string[];
}

// Schedule / kanban
export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  grade?: string;
  accent: string;
  goalTags?: GoalTag[];
}

export interface Day {
  id: string;
  date: string;
}

export type Columns = Record<string, Activity[]>;
```

- [ ] **Step 4: Create `src/utils/tree.ts`**

```ts
import type { TreeNode, TreeBranch, TreeLeaf } from "../types";

export function isLeaf(node: TreeNode): node is TreeLeaf {
  return !("children" in node);
}

export function getAncestorIds(
  nodeId: string,
  nodes: TreeNode[],
  ancestors: string[] = []
): string[] | null {
  for (const node of nodes) {
    if (node.id === nodeId) return ancestors;
    if (!isLeaf(node)) {
      const result = getAncestorIds(nodeId, (node as TreeBranch).children, [
        ...ancestors,
        node.id,
      ]);
      if (result !== null) return result;
    }
  }
  return null;
}

export function getTopLevelAreas(tree: TreeNode[]): TreeBranch[] {
  return tree.filter((n): n is TreeBranch => !isLeaf(n));
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test -- --reporter=verbose 2>&1 | head -60
```

Expected: all `tree` tests PASS, existing `schedule` tests still PASS.

- [ ] **Step 6: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/types/index.ts src/utils/tree.ts src/utils/tree.test.ts && git commit -m "feat: add Goal/GoalTag types and tree utility functions"
```

---

## Task 2: Suggestion algorithm

**Files:**
- Create: `src/utils/suggestions.ts`
- Create: `src/utils/suggestions.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/utils/suggestions.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getSuggestedActivities } from "./suggestions";
import type { Goal, Activity, TreeNode } from "../types";

const TREE: TreeNode[] = [
  {
    id: "area-a",
    label: "Area A",
    children: [
      {
        id: "branch-a",
        label: "Branch A",
        children: [
          { id: "leaf-a1", label: "Leaf A1", exercises: [] },
          { id: "leaf-a2", label: "Leaf A2", exercises: [] },
        ],
      },
    ],
  },
  {
    id: "area-b",
    label: "Area B",
    children: [
      { id: "leaf-b1", label: "Leaf B1", exercises: [] },
    ],
  },
];

const goal: Goal = {
  id: "area-a",
  areaId: "area-a",
  areaLabel: "Area A",
  isPrimary: true,
  selectedNodeIds: ["leaf-a1"],
};

const acts: Activity[] = [
  {
    id: "act-exact",
    title: "Exact match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "leaf-a1", nodeLabel: "Leaf A1" }],
  },
  {
    id: "act-ancestor",
    title: "Ancestor match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "branch-a", nodeLabel: "Branch A" }],
  },
  {
    id: "act-no-match",
    title: "No match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "leaf-b1", nodeLabel: "Leaf B1" }],
  },
  {
    id: "act-no-tags",
    title: "No tags",
    subtitle: "",
    accent: "#fff",
  },
];

describe("getSuggestedActivities", () => {
  it("returns empty array when goals is empty", () => {
    expect(getSuggestedActivities([], acts, TREE)).toEqual([]);
  });

  it("includes exact leaf match", () => {
    const result = getSuggestedActivities([goal], acts, TREE);
    expect(result.map(a => a.id)).toContain("act-exact");
  });

  it("includes ancestor match (tag is parent branch of selected leaf)", () => {
    const result = getSuggestedActivities([goal], acts, TREE);
    expect(result.map(a => a.id)).toContain("act-ancestor");
  });

  it("excludes activities with no matching tag", () => {
    const result = getSuggestedActivities([goal], acts, TREE);
    expect(result.map(a => a.id)).not.toContain("act-no-match");
  });

  it("excludes activities with no goalTags", () => {
    const result = getSuggestedActivities([goal], acts, TREE);
    expect(result.map(a => a.id)).not.toContain("act-no-tags");
  });

  it("ranks primary-goal matches above secondary-goal-only matches", () => {
    const secondary: Goal = {
      id: "area-b",
      areaId: "area-b",
      areaLabel: "Area B",
      isPrimary: false,
      selectedNodeIds: ["leaf-b1"],
    };
    const result = getSuggestedActivities([goal, secondary], acts, TREE);
    const ids = result.map(a => a.id);
    expect(ids.indexOf("act-exact")).toBeLessThan(ids.indexOf("act-no-match"));
  });

  it("ranks higher-scoring activities first when both primary", () => {
    const multiTagAct: Activity = {
      id: "act-multi",
      title: "Multi",
      subtitle: "",
      accent: "#fff",
      goalTags: [
        { nodeId: "leaf-a1", nodeLabel: "Leaf A1" },
        { nodeId: "branch-a", nodeLabel: "Branch A" },
      ],
    };
    const result = getSuggestedActivities([goal], [acts[0], multiTagAct], TREE);
    expect(result[0].id).toBe("act-multi");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test -- --reporter=verbose 2>&1 | head -40
```

Expected: FAIL — "Cannot find module './suggestions'"

- [ ] **Step 3: Create `src/utils/suggestions.ts`**

```ts
import type { Activity, Goal, TreeNode } from "../types";
import { getAncestorIds } from "./tree";

function buildPaths(goal: Goal, tree: TreeNode[]): Set<string> {
  const paths = new Set<string>();
  for (const nodeId of goal.selectedNodeIds) {
    paths.add(nodeId);
    const ancestors = getAncestorIds(nodeId, tree) ?? [];
    for (const a of ancestors) paths.add(a);
  }
  return paths;
}

export function getSuggestedActivities(
  goals: Goal[],
  activities: Activity[],
  tree: TreeNode[]
): Activity[] {
  if (goals.length === 0) return [];

  const primaryGoal = goals.find((g) => g.isPrimary);
  const primaryPaths = primaryGoal ? buildPaths(primaryGoal, tree) : new Set<string>();

  const allPaths = new Set<string>();
  for (const goal of goals) {
    for (const id of buildPaths(goal, tree)) allPaths.add(id);
  }

  type Scored = { activity: Activity; primaryScore: number; totalScore: number };
  const scored: Scored[] = [];

  for (const activity of activities) {
    if (!activity.goalTags?.length) continue;
    const totalScore = activity.goalTags.filter((t) => allPaths.has(t.nodeId)).length;
    if (totalScore === 0) continue;
    const primaryScore = activity.goalTags.filter((t) => primaryPaths.has(t.nodeId)).length;
    scored.push({ activity, primaryScore, totalScore });
  }

  scored.sort((a, b) => {
    if (b.primaryScore !== a.primaryScore) return b.primaryScore - a.primaryScore;
    return b.totalScore - a.totalScore;
  });

  return scored.map((s) => s.activity);
}
```

- [ ] **Step 4: Run tests to verify all pass**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test -- --reporter=verbose 2>&1 | head -80
```

Expected: all `suggestions` and `tree` and `schedule` tests PASS.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/utils/suggestions.ts src/utils/suggestions.test.ts && git commit -m "feat: add suggestion algorithm with tests"
```

---

## Task 3: Activities seed data

**Files:**
- Create: `src/data/activities.ts`

- [ ] **Step 1: Create `src/data/activities.ts`**

All node IDs reference real nodes in `src/data/skillTreeV2.ts`. The `id` values are unique per activity.

```ts
import type { Activity } from "../types";

export const ACTIVITIES: Activity[] = [
  {
    id: "act-board-climbing",
    title: "Board Climbing",
    subtitle: "10 problems · full rest between",
    accent: "#d4a853",
    goalTags: [
      { nodeId: "overhang-tension", nodeLabel: "Tension" },
      { nodeId: "finger-strength-training", nodeLabel: "Finger Strength" },
    ],
  },
  {
    id: "act-hollow-body",
    title: "Hollow Body Hold",
    subtitle: "20–30s × 3 sets",
    accent: "#5b8fd4",
    goalTags: [
      { nodeId: "core-compression", nodeLabel: "Core Compression" },
      { nodeId: "overhang-tension", nodeLabel: "Tension" },
    ],
  },
  {
    id: "act-hangboard-repeaters",
    title: "Hangboard Repeaters",
    subtitle: "7s on / 3s off × 6 reps · 2 sets",
    accent: "#d45b5b",
    goalTags: [
      { nodeId: "hangboard", nodeLabel: "Hangboard" },
      { nodeId: "finger-strength-training", nodeLabel: "Finger Strength" },
    ],
  },
  {
    id: "act-4x4",
    title: "4×4 Circuit",
    subtitle: "4 problems × 4 sets",
    accent: "#5bd46a",
    goalTags: [
      { nodeId: "four-by-fours", nodeLabel: "4×4s" },
      { nodeId: "power-endurance", nodeLabel: "Power Endurance" },
    ],
  },
  {
    id: "act-drop-knee",
    title: "Drop Knee Traverses",
    subtitle: "3 laps · sustained",
    accent: "#c45bd4",
    goalTags: [
      { nodeId: "drop-knee", nodeLabel: "Drop Knee" },
      { nodeId: "overhang-hip", nodeLabel: "Hip Movement" },
    ],
  },
  {
    id: "act-toe-hooks",
    title: "Toe Hook Training",
    subtitle: "5 sets × 3 moves",
    accent: "#d48c5b",
    goalTags: [
      { nodeId: "toe-hooks", nodeLabel: "Toe Hooks" },
      { nodeId: "overhang-footwork", nodeLabel: "Footwork" },
    ],
  },
  {
    id: "act-weighted-pullups",
    title: "Weighted Pull-ups",
    subtitle: "3–5 reps × 4 sets · slow eccentric",
    accent: "#5bd4c4",
    goalTags: [
      { nodeId: "weighted-pullups", nodeLabel: "Weighted Pull-ups" },
      { nodeId: "pull-strength", nodeLabel: "Pull Strength" },
    ],
  },
  {
    id: "act-slab-traverses",
    title: "Slab Traverses",
    subtitle: "5 laps · smearing focus",
    accent: "#8ed45b",
    goalTags: [
      { nodeId: "smearing", nodeLabel: "Smearing" },
      { nodeId: "slab-footwork", nodeLabel: "Footwork" },
    ],
  },
  {
    id: "act-campus",
    title: "Campus Laddering",
    subtitle: "3 sets × max rungs",
    accent: "#d45b8e",
    goalTags: [
      { nodeId: "campus-strength", nodeLabel: "Campus Training" },
      { nodeId: "finger-strength-training", nodeLabel: "Finger Strength" },
    ],
  },
  {
    id: "act-arc",
    title: "ARC Training",
    subtitle: "20–40 min continuous",
    accent: "#5bb4d4",
    goalTags: [
      { nodeId: "arc-training", nodeLabel: "ARC Training" },
      { nodeId: "power-endurance", nodeLabel: "Power Endurance" },
    ],
  },
  {
    id: "act-crimp-hangs",
    title: "Crimp Hangboard",
    subtitle: "10s on / 3 min off × 5 sets",
    accent: "#d4c45b",
    goalTags: [
      { nodeId: "crimps", nodeLabel: "Crimps" },
      { nodeId: "pulling-holds", nodeLabel: "Pulling Holds" },
    ],
  },
  {
    id: "act-dead-points",
    title: "Dead Point Drills",
    subtitle: "3 sets × 6 reps",
    accent: "#a45bd4",
    goalTags: [
      { nodeId: "dead-points", nodeLabel: "Dead Points" },
      { nodeId: "momentum", nodeLabel: "Momentum" },
    ],
  },
];
```

- [ ] **Step 2: Run the test suite to confirm nothing broken**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test 2>&1 | tail -10
```

Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/data/activities.ts && git commit -m "feat: add activities seed data with goal tags"
```

---

## Task 4: GoalsContext

**Files:**
- Create: `src/contexts/GoalsContext.tsx`

- [ ] **Step 1: Create the `src/contexts/` directory and `GoalsContext.tsx`**

```tsx
import { createContext, useContext, useState } from "react";
import type { Goal } from "../types";

interface GoalsContextValue {
  goals: Goal[];
  addGoal: (areaId: string, areaLabel: string) => void;
  removeGoal: (goalId: string) => void;
  setPrimary: (goalId: string) => void;
  toggleNode: (goalId: string, nodeId: string) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (areaId: string, areaLabel: string) => {
    if (goals.length >= 3) return;
    if (goals.some((g) => g.areaId === areaId)) return;
    const isFirst = goals.length === 0;
    setGoals((prev) => [
      ...prev,
      { id: areaId, areaId, areaLabel, isPrimary: isFirst, selectedNodeIds: [] },
    ]);
  };

  const removeGoal = (goalId: string) => {
    setGoals((prev) => {
      const filtered = prev.filter((g) => g.id !== goalId);
      if (filtered.length > 0 && !filtered.some((g) => g.isPrimary)) {
        return filtered.map((g, i) => ({ ...g, isPrimary: i === 0 }));
      }
      return filtered;
    });
  };

  const setPrimary = (goalId: string) => {
    setGoals((prev) => prev.map((g) => ({ ...g, isPrimary: g.id === goalId })));
  };

  const toggleNode = (goalId: string, nodeId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const ids = g.selectedNodeIds.includes(nodeId)
          ? g.selectedNodeIds.filter((id) => id !== nodeId)
          : [...g.selectedNodeIds, nodeId];
        return { ...g, selectedNodeIds: ids };
      })
    );
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, removeGoal, setPrimary, toggleNode }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
}
```

- [ ] **Step 2: Run typecheck**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/contexts/GoalsContext.tsx && git commit -m "feat: add GoalsContext with add/remove/setPrimary/toggleNode"
```

---

## Task 5: GoalTab component

**Files:**
- Create: `src/features/goals/GoalTab.tsx`
- Create: `src/features/goals/GoalTab.module.css`

- [ ] **Step 1: Create `src/features/goals/GoalTab.module.css`**

```css
/* ── Layout ── */

.layout {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Tree panel ── */

.treePanel {
  flex: 1;
  border-right: 1px solid #f0f0f0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.treePanel::-webkit-scrollbar { width: 5px; }
.treePanel::-webkit-scrollbar-track { background: transparent; }
.treePanel::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 9999px;
}

/* ── Tree nodes ── */

.treeRootNode { border-bottom: 1px solid #f0f0f0; }

.treeNode {}

.treeRow {
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding-right: 20px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  color: #787878;
  transition: background-color 0.1s ease, color 0.1s ease;
}

.treeRow:hover { background-color: rgba(0, 0, 0, 0.025); }

.treeBranch {
  font-weight: 600;
  color: #413f39;
}

.treeLeafSelected {
  color: #413f39;
  background-color: #f0f0f0;
}

.treeLeafDot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: #dcdcdc;
  transition: background-color 0.1s ease;
}

.treeLeafDotOn { background-color: #413f39; }

.treeChildrenWrapper {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.2s ease;
}

.treeChildrenWrapperOpen { max-height: 2000px; }

.treeChildren {
  border-left: 1px solid #e8e8e6;
  margin-left: 25px;
}

.treeChildren > .treeNode > .treeRow { position: relative; }

.treeChildren > .treeNode > .treeRow::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 11px;
  height: 1px;
  background-color: #e8e8e6;
  transform: translateY(-50%);
}

/* ── Summary panel ── */

.summaryPanel {
  flex: 0 0 220px;
  padding: 20px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.summaryTitle {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9d9c99;
}

.summaryEmpty {
  font-size: 12px;
  color: #c4c3c0;
  line-height: 1.5;
  margin: 0;
}

.summaryList {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summaryCard {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.summaryPath {
  font-size: 10px;
  color: #b0afa9;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summaryLeaf {
  font-size: 13px;
  color: #413f39;
  font-weight: 600;
}

.summaryHint {
  font-size: 11px;
  color: #c4c3c0;
  line-height: 1.5;
  margin: 4px 0 0;
}

.summaryHint em {
  font-style: normal;
  color: #9d9c99;
}
```

- [ ] **Step 2: Create `src/features/goals/GoalTab.tsx`**

```tsx
import { useState } from "react";
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import { isLeaf } from "../../utils/tree";
import { useGoals } from "../../contexts/GoalsContext";
import type { Goal, TreeNode, TreeBranch } from "../../types";
import { ChevronExpandIcon } from "../../components/icons";
import styles from "./GoalTab.module.css";

interface TreeNodeComponentProps {
  node: TreeNode;
  depth: number;
  selectedIds: string[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

function TreeNodeComponent({
  node,
  depth,
  selectedIds,
  expandedIds,
  onToggleExpand,
  onToggleSelect,
}: TreeNodeComponentProps) {
  const leaf = isLeaf(node);
  const expanded = expandedIds.has(node.id);
  const selected = selectedIds.includes(node.id);

  const rowClass = [
    styles.treeRow,
    !leaf ? styles.treeBranch : null,
    leaf && selected ? styles.treeLeafSelected : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`${styles.treeNode}${depth === 0 ? ` ${styles.treeRootNode}` : ""}`}
    >
      <div
        className={rowClass}
        style={{ paddingLeft: depth === 0 ? 20 : 14 }}
        onClick={() =>
          leaf ? onToggleSelect(node.id) : onToggleExpand(node.id)
        }
      >
        {leaf ? (
          <span
            className={`${styles.treeLeafDot}${selected ? ` ${styles.treeLeafDotOn}` : ""}`}
          />
        ) : (
          <ChevronExpandIcon open={expanded} size={11} />
        )}
        <span className={styles.treeLabel}>{node.label}</span>
      </div>
      {!leaf && (
        <div
          className={`${styles.treeChildrenWrapper}${expanded ? ` ${styles.treeChildrenWrapperOpen}` : ""}`}
        >
          <div className={styles.treeChildren}>
            {(node as TreeBranch).children.map((child) => (
              <TreeNodeComponent
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedIds={selectedIds}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function collectSelected(
  nodes: TreeNode[],
  selectedIds: string[],
  path: string[] = []
): { id: string; label: string; path: string[] }[] {
  const results: { id: string; label: string; path: string[] }[] = [];
  for (const node of nodes) {
    if (isLeaf(node)) {
      if (selectedIds.includes(node.id)) {
        results.push({ id: node.id, label: node.label, path });
      }
    } else {
      results.push(
        ...collectSelected(
          (node as TreeBranch).children,
          selectedIds,
          [...path, node.label]
        )
      );
    }
  }
  return results;
}

interface GoalTabProps {
  goal: Goal;
}

export function GoalTab({ goal }: GoalTabProps) {
  const { toggleNode } = useGoals();

  const areaNode = SKILL_TREE_V2.find((n) => n.id === goal.areaId);
  const subTree =
    areaNode && !isLeaf(areaNode) ? (areaNode as TreeBranch).children : [];

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(subTree.map((n) => n.id))
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedLeaves = collectSelected(subTree, goal.selectedNodeIds);

  return (
    <div className={styles.layout}>
      <div className={styles.treePanel}>
        {subTree.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            depth={0}
            selectedIds={goal.selectedNodeIds}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            onToggleSelect={(id) => toggleNode(goal.id, id)}
          />
        ))}
      </div>
      <div className={styles.summaryPanel}>
        <div className={styles.summaryTitle}>
          Selected ({selectedLeaves.length})
        </div>
        {selectedLeaves.length === 0 ? (
          <p className={styles.summaryEmpty}>
            Expand the tree and check skills to work on.
          </p>
        ) : (
          <div className={styles.summaryList}>
            {selectedLeaves.map((leaf) => (
              <div key={leaf.id} className={styles.summaryCard}>
                {leaf.path.length > 0 && (
                  <span className={styles.summaryPath}>
                    {leaf.path.join(" → ")}
                  </span>
                )}
                <span className={styles.summaryLeaf}>{leaf.label}</span>
              </div>
            ))}
          </div>
        )}
        <p className={styles.summaryHint}>
          These skills appear in the <em>Suggested</em> tab when adding
          activities to your schedule.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/features/goals/GoalTab.tsx src/features/goals/GoalTab.module.css && git commit -m "feat: add GoalTab component with tree picker and summary panel"
```

---

## Task 6: AddGoalModal

**Files:**
- Create: `src/features/goals/AddGoalModal.tsx`
- Create: `src/features/goals/AddGoalModal.module.css`

- [ ] **Step 1: Create `src/features/goals/AddGoalModal.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 420px;
  max-width: 90vw;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.modalTitle {
  font-size: 15px;
  font-weight: bold;
  color: #413f39;
}

.closeBtn {
  border: none;
  background: transparent;
  font-size: 18px;
  color: #c4c3c0;
  cursor: pointer;
  padding: 0 2px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1;
}

.closeBtn:hover { color: #787878; }

.modalSub {
  font-size: 12px;
  color: #9d9c99;
  margin: 0 0 16px;
}

.areaGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.areaCard {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid #e8e8e6;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  color: #413f39;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.12s ease, background-color 0.12s ease;
}

.areaCard:hover:not(:disabled) {
  border-color: #413f39;
  background-color: #fafafa;
}

.areaCard:disabled {
  opacity: 0.5;
  cursor: default;
}

.areaCardActive {
  border-color: #413f39;
  background-color: #f8f8f7;
}

.areaActiveBadge {
  font-size: 10px;
  color: #9d9c99;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.modalFooter {
  margin-top: 14px;
  font-size: 11px;
  color: #c4c3c0;
  text-align: right;
}
```

- [ ] **Step 2: Create `src/features/goals/AddGoalModal.tsx`**

```tsx
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import { getTopLevelAreas } from "../../utils/tree";
import { useGoals } from "../../contexts/GoalsContext";
import styles from "./AddGoalModal.module.css";

interface AddGoalModalProps {
  onClose: () => void;
  onAdded: (goalId: string) => void;
}

export function AddGoalModal({ onClose, onAdded }: AddGoalModalProps) {
  const { goals, addGoal } = useGoals();
  const areas = getTopLevelAreas(SKILL_TREE_V2);
  const activeAreaIds = new Set(goals.map((g) => g.areaId));

  const handleSelect = (areaId: string, areaLabel: string) => {
    if (activeAreaIds.has(areaId)) return;
    addGoal(areaId, areaLabel);
    onAdded(areaId);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Add a goal</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <p className={styles.modalSub}>
          Choose a focus area. You can have up to 3 active goals.
        </p>
        <div className={styles.areaGrid}>
          {areas.map((area) => {
            const active = activeAreaIds.has(area.id);
            return (
              <button
                key={area.id}
                className={`${styles.areaCard}${active ? ` ${styles.areaCardActive}` : ""}`}
                onClick={() => handleSelect(area.id, area.label)}
                disabled={active}
              >
                {area.label}
                {active && (
                  <span className={styles.areaActiveBadge}>Active</span>
                )}
              </button>
            );
          })}
        </div>
        <div className={styles.modalFooter}>{goals.length}/3 goals active</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/features/goals/AddGoalModal.tsx src/features/goals/AddGoalModal.module.css && git commit -m "feat: add AddGoalModal for picking skill tree areas"
```

---

## Task 7: Rewrite GoalsPage

**Files:**
- Rewrite: `src/features/goals/GoalsPage.tsx`
- Rewrite: `src/features/goals/GoalsPage.module.css`

- [ ] **Step 1: Rewrite `src/features/goals/GoalsPage.module.css`**

Replace the entire file:

```css
/* ── Page shell ── */

.page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.header {
  height: 50px;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.headerTitle {
  font-size: 14px;
  font-weight: bold;
  color: #413f39;
}

/* ── Tab bar ── */

.tabBar {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 0 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px 9px;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  color: #787878;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color 0.12s ease;
}

.tab:hover { color: #413f39; }

.tabActive {
  color: #413f39;
  font-weight: 600;
  border-bottom-color: #413f39;
}

.tabStar {
  font-size: 13px;
  color: #c8a84b;
  cursor: pointer;
  padding: 0 1px;
}

.tabStar:hover { color: #a07830; }

.tabRemove {
  font-size: 15px;
  color: #c4c3c0;
  cursor: pointer;
  padding: 0 1px;
  line-height: 1;
  margin-left: 2px;
}

.tabRemove:hover { color: #787878; }

.tabAdd {
  color: #9d9c99;
  border: 1px dashed #dcdcdc;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-left: 4px;
  font-size: 12px;
  padding: 6px 12px 7px;
}

.tabAdd:hover {
  color: #413f39;
  border-color: #b0afa9;
}

/* ── Tab content ── */

.tabContent {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* ── Empty state ── */

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  font-size: 14px;
  color: #9d9c99;
  text-align: center;
  padding: 40px;
}

.emptySub {
  font-size: 12px;
  color: #c4c3c0;
  max-width: 220px;
  line-height: 1.5;
}

.emptyAddBtn {
  margin-top: 8px;
  padding: 8px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background: white;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  color: #413f39;
  cursor: pointer;
}

.emptyAddBtn:hover {
  border-color: #b0afa9;
  background: #fafafa;
}
```

- [ ] **Step 2: Rewrite `src/features/goals/GoalsPage.tsx`**

Replace the entire file:

```tsx
import { useState } from "react";
import { useGoals } from "../../contexts/GoalsContext";
import { GoalTab } from "./GoalTab";
import { AddGoalModal } from "./AddGoalModal";
import styles from "./GoalsPage.module.css";

export function GoalsPage() {
  const { goals, removeGoal, setPrimary } = useGoals();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeId =
    activeGoalId && goals.some((g) => g.id === activeGoalId)
      ? activeGoalId
      : (goals[0]?.id ?? null);

  const activeGoal = goals.find((g) => g.id === activeId) ?? null;

  const handleGoalAdded = (goalId: string) => {
    setActiveGoalId(goalId);
    setShowAddModal(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Goals</span>
      </header>

      <div className={styles.tabBar}>
        {goals.map((goal) => (
          <button
            key={goal.id}
            className={`${styles.tab}${goal.id === activeId ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setActiveGoalId(goal.id)}
          >
            <span
              className={styles.tabStar}
              title={goal.isPrimary ? "Primary goal" : "Set as primary"}
              onClick={(e) => {
                e.stopPropagation();
                setPrimary(goal.id);
              }}
            >
              {goal.isPrimary ? "★" : "☆"}
            </span>
            {goal.areaLabel}
            <span
              className={styles.tabRemove}
              onClick={(e) => {
                e.stopPropagation();
                removeGoal(goal.id);
              }}
            >
              ×
            </span>
          </button>
        ))}
        {goals.length < 3 && (
          <button
            className={`${styles.tab} ${styles.tabAdd}`}
            onClick={() => setShowAddModal(true)}
          >
            + Add goal
          </button>
        )}
      </div>

      <div className={styles.tabContent}>
        {activeGoal ? (
          <GoalTab goal={activeGoal} />
        ) : (
          <div className={styles.emptyState}>
            <span>No goals yet</span>
            <span className={styles.emptySub}>
              Add a goal to start planning your training
            </span>
            <button
              className={styles.emptyAddBtn}
              onClick={() => setShowAddModal(true)}
            >
              + Add your first goal
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleGoalAdded}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 4: Run the dev server and manually test the Goals page**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run dev
```

Open http://localhost:5173/#/goals (or whatever port Vite prints). Verify:
- Empty state shows "No goals yet" with Add button
- Clicking opens AddGoalModal with grid of areas
- Selecting "Overhang" creates the first tab (marked ★, primary)
- Overhang sub-tree renders (Footwork, Tension, Hip Movement branches)
- Checking a leaf (e.g. Core Compression) adds it to the summary panel
- Clicking ☆ on a second goal tab promotes it to primary (★)
- Clicking × removes the tab

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/features/goals/GoalsPage.tsx src/features/goals/GoalsPage.module.css && git commit -m "feat: rewrite GoalsPage with tab-per-goal layout"
```

---

## Task 8: AddActivityModal, SchedulePage wiring, and App cleanup

**Files:**
- Create: `src/features/schedule/AddActivityModal.tsx`
- Create: `src/features/schedule/AddActivityModal.module.css`
- Modify: `src/features/schedule/SchedulePage.tsx`
- Modify: `src/app/App.tsx`
- Modify: `src/components/Sidebar/Sidebar.tsx`

- [ ] **Step 1: Create `src/features/schedule/AddActivityModal.module.css`**

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 0;
  flex-shrink: 0;
}

.modalTitle {
  font-size: 14px;
  font-weight: bold;
  color: #413f39;
}

.closeBtn {
  border: none;
  background: transparent;
  font-size: 18px;
  color: #c4c3c0;
  cursor: pointer;
  padding: 0 2px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1;
}

.closeBtn:hover { color: #787878; }

/* ── Inner tab bar ── */

.tabBar {
  display: flex;
  gap: 0;
  padding: 10px 16px 0;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.tab {
  padding: 6px 12px 7px;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  color: #787878;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  white-space: nowrap;
}

.tab:hover { color: #413f39; }

.tabActive {
  color: #413f39;
  font-weight: 600;
  border-bottom-color: #413f39;
}

/* ── Content area ── */

.noGoalsHint {
  font-size: 12px;
  color: #9d9c99;
  padding: 12px 16px 0;
  margin: 0;
}

.activityList {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 transparent;
}

.categoryHeader {
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9d9c99;
  padding: 10px 16px 4px;
}

.activityItem {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  transition: background-color 0.1s ease;
}

.activityItem:hover { background-color: #fafafa; }

.activityAccent {
  width: 4px;
  height: 32px;
  border-radius: 2px;
  flex-shrink: 0;
}

.activityText {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.activityTitle {
  font-size: 13px;
  color: #413f39;
  font-weight: 500;
}

.activitySubtitle {
  font-size: 11px;
  color: #9d9c99;
}

.activityTagLabel {
  font-size: 10px;
  color: #b0afa9;
  flex-shrink: 0;
  text-align: right;
  max-width: 90px;
  line-height: 1.3;
}

.empty {
  font-size: 13px;
  color: #c4c3c0;
  text-align: center;
  padding: 24px 16px;
  margin: 0;
}
```

- [ ] **Step 2: Create `src/features/schedule/AddActivityModal.tsx`**

```tsx
import { useState } from "react";
import { ACTIVITIES } from "../../data/activities";
import { getSuggestedActivities } from "../../utils/suggestions";
import { useGoals } from "../../contexts/GoalsContext";
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import type { Activity } from "../../types";
import styles from "./AddActivityModal.module.css";

type TabId = "suggested" | "all" | "category";

interface AddActivityModalProps {
  dayLabel: string;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

export function AddActivityModal({
  dayLabel,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const { goals } = useGoals();
  const [activeTab, setActiveTab] = useState<TabId>("suggested");

  const suggested = getSuggestedActivities(goals, ACTIVITIES, SKILL_TREE_V2);
  const hasSelections = goals.some((g) => g.selectedNodeIds.length > 0);

  // Group activities by first goalTag for "By Category" tab
  const byCategory = ACTIVITIES.reduce<Record<string, Activity[]>>(
    (acc, act) => {
      const cat = act.goalTags?.[0]?.nodeLabel ?? "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(act);
      return acc;
    },
    {}
  );

  const handleAdd = (activity: Activity) => {
    onAdd(activity);
    onClose();
  };

  const renderActivityItem = (activity: Activity, showTag = false) => (
    <button
      key={activity.id}
      className={styles.activityItem}
      onClick={() => handleAdd(activity)}
    >
      <span
        className={styles.activityAccent}
        style={{ backgroundColor: activity.accent }}
      />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>{activity.title}</span>
        <span className={styles.activitySubtitle}>{activity.subtitle}</span>
      </div>
      {showTag && activity.goalTags && activity.goalTags.length > 0 && (
        <span className={styles.activityTagLabel}>
          {activity.goalTags.map((t) => t.nodeLabel).join(", ")}
        </span>
      )}
    </button>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            Add Activity — {dayLabel}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabBar}>
          {(["suggested", "all", "category"] as TabId[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab}${activeTab === tab ? ` ${styles.tabActive}` : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "suggested"
                ? "Suggested"
                : tab === "all"
                  ? "All Activities"
                  : "By Category"}
            </button>
          ))}
        </div>

        {activeTab === "suggested" && !hasSelections && (
          <p className={styles.noGoalsHint}>
            Select sub-skills on the Goals page to see suggestions here.
          </p>
        )}

        <div className={styles.activityList}>
          {activeTab === "suggested" && (
            <>
              {suggested.length === 0 ? (
                <p className={styles.empty}>
                  {hasSelections
                    ? "No matching activities found."
                    : "Set goals to see suggestions."}
                </p>
              ) : (
                suggested.map((a) => renderActivityItem(a, true))
              )}
            </>
          )}

          {activeTab === "all" &&
            ACTIVITIES.map((a) => renderActivityItem(a))}

          {activeTab === "category" &&
            Object.entries(byCategory).map(([cat, acts]) => (
              <div key={cat}>
                <div className={styles.categoryHeader}>{cat}</div>
                {acts.map((a) => renderActivityItem(a))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Modify `src/features/schedule/SchedulePage.tsx`**

Add modal state and wire the "Add Activity" button. Replace the file with:

```tsx
import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { DAYS, initialData } from "../../data/schedule";
import type { Activity, Columns } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "../../components/icons";
import { ActivityCard } from "./ActivityCard";
import { AddActivityModal } from "./AddActivityModal";
import styles from "./schedule.module.css";

export function SchedulePage() {
  const [columns, setColumns] = useState<Columns>(initialData);
  const [modalDayId, setModalDayId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const scrollDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const onWindowMouseUp = () => {
      if (!scrollDrag.current.active) return;
      scrollDrag.current.active = false;
      if (boardRef.current) {
        boardRef.current.style.cursor = "";
        boardRef.current.style.userSelect = "";
      }
    };
    window.addEventListener("mouseup", onWindowMouseUp);
    return () => window.removeEventListener("mouseup", onWindowMouseUp);
  }, []);

  const onBoardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".activity-card, button, [role='button']")) return;
    const board = boardRef.current;
    if (!board) return;
    scrollDrag.current = { active: true, startX: e.clientX, scrollLeft: board.scrollLeft };
    board.style.cursor = "grabbing";
    board.style.userSelect = "none";
  };

  const onBoardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollDrag.current.active || !boardRef.current) return;
    const dx = e.clientX - scrollDrag.current.startX;
    boardRef.current.scrollLeft = scrollDrag.current.scrollLeft - dx;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const newColumns = { ...columns };
    const sourceTasks = [...newColumns[sourceCol]];
    const destTasks = sourceCol === destCol ? sourceTasks : [...newColumns[destCol]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    newColumns[sourceCol] = sourceTasks;
    newColumns[destCol] = destTasks;
    setColumns(newColumns);
  };

  const handleAddActivity = (dayId: string, activity: Activity) => {
    setColumns((prev) => ({
      ...prev,
      [dayId]: [
        ...prev[dayId],
        { ...activity, id: `${activity.id}-${Date.now()}` },
      ],
    }));
  };

  const modalDay = modalDayId
    ? DAYS.find((d) => d.id === modalDayId)
    : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.weekPicker}>
          <button className={styles.weekPickerBtn}>
            <ChevronLeftIcon />
          </button>
          <div className={styles.weekPickerDivider} />
          <span className={styles.weekPickerLabel}>This week</span>
          <div className={styles.weekPickerDivider} />
          <button className={styles.weekPickerBtn}>
            <ChevronRightIcon />
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={styles.boardScroll}
          ref={boardRef}
          onMouseDown={onBoardMouseDown}
          onMouseMove={onBoardMouseMove}
        >
          <div className={styles.boardInner}>
            {DAYS.map((day) => (
              <div key={day.id} className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnDayName}>{day.id}</div>
                  <div className={styles.columnDate}>{day.date}</div>
                </div>
                <button
                  className={styles.addActivityBtn}
                  onClick={() => setModalDayId(day.id)}
                >
                  <PlusIcon />
                  <span className={styles.addActivityLabel}>Add Activity</span>
                </button>
                <Droppable droppableId={day.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.cardList}${snapshot.isDraggingOver ? ` ${styles.cardListDragOver}` : ""}`}
                    >
                      {columns[day.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <ActivityCard
                              task={task}
                              provided={provided}
                              snapshot={snapshot}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      {modalDay && (
        <AddActivityModal
          dayLabel={`${modalDay.id} ${modalDay.date}`}
          onClose={() => setModalDayId(null)}
          onAdd={(activity) => handleAddActivity(modalDay.id, activity)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Modify `src/app/App.tsx`**

Add `GoalsProvider` and remove the `/goals2` route:

```tsx
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoalsProvider } from "../contexts/GoalsContext";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { SchedulePage } from "../features/schedule/SchedulePage";
import { GoalsPage } from "../features/goals/GoalsPage";
import { ActivitiesPage } from "../features/activities/ActivitiesPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <HashRouter>
      <GoalsProvider>
        <div className={styles.page}>
          <Sidebar />
          <div className={styles.mainCard}>
            <Routes>
              <Route path="/" element={<Navigate to="/schedule" replace />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
            </Routes>
          </div>
        </div>
      </GoalsProvider>
    </HashRouter>
  );
}
```

- [ ] **Step 5: Modify `src/components/Sidebar/Sidebar.tsx`**

Remove the "Goals 2" entry from `NAV_ITEMS` and the `Goals2Icon` import:

```tsx
import { NavLink } from "react-router-dom";
import {
  ScheduleIcon,
  ActivitiesIcon,
  GoalsIcon,
  ChevronDownIcon,
} from "../icons";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/schedule", label: "Schedule", icon: <ScheduleIcon /> },
  { to: "/activities", label: "Activities", icon: <ActivitiesIcon /> },
  { to: "/goals", label: "Goals", icon: <GoalsIcon /> },
] as const;

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <span className={styles.sidebarTitle}>Volume</span>
        <ChevronDownIcon />
      </div>
      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem}${isActive ? ` ${styles.active}` : ""}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 6: Run typecheck**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 7: Run the full test suite**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm test 2>&1 | tail -15
```

Expected: all tests PASS.

- [ ] **Step 8: Run the dev server and do end-to-end verification**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run dev
```

Walk through the verification checklist from the spec:

1. App loads at http://localhost:5173/#/goals — no console errors
2. Tab bar shows "+ Add goal" only; empty state shown
3. Add "Overhang" → tab appears, star = ★ (primary), skill tree renders
4. Expand "Tension" branch → check "Core Compression" and "Board Climbing" → summary panel lists both
5. Add "Finger Strength" as second goal → second tab appears (☆ secondary)
6. Click ☆ on Finger Strength tab → it becomes ★ and Overhang becomes ☆
7. Navigate to `/schedule` → click "Add Activity" on any day column
8. Modal opens on "Suggested" tab — activities tagged to selected nodes appear
9. Board Climbing appears (tagged `overhang-tension` and `finger-strength-training`) — it should appear with 2 tag matches
10. Click an activity → it is added to the kanban column
11. Sidebar shows Schedule, Activities, Goals — no "Goals 2" item
12. Navigating to `#/goals2` redirects to not-found (no route)

Stop the dev server.

- [ ] **Step 9: Delete dead code (Goals2Page files)**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && rm src/features/goals/Goals2Page.tsx src/features/goals/Goals2Page.module.css
```

- [ ] **Step 10: Run typecheck one final time**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && npm run typecheck 2>&1
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
cd C:/Users/meesz/Documents/OL/volume/volume-demo && git add src/features/schedule/AddActivityModal.tsx src/features/schedule/AddActivityModal.module.css src/features/schedule/SchedulePage.tsx src/app/App.tsx src/components/Sidebar/Sidebar.tsx && git rm src/features/goals/Goals2Page.tsx src/features/goals/Goals2Page.module.css && git commit -m "feat: add AddActivityModal with Suggested tab, wire kanban, retire Goals2Page"
```
