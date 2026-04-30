# Skill Tree Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Goals page with a video-game-style Skill Tree page where users explore bouldering skills organised into 5 categories, read training content, and set active goals that connect to the kanban schedule.

**Architecture:** New `src/features/skillTree/` feature folder replaces `src/features/goals/`. Five category buttons sit at the top; clicking one expands its subtree via framer-motion animations. A `SkillDetailPanel` slides up for selected leaf nodes. Goal state flows through the unchanged `GoalsContext` (one line patched to seed `selectedNodeIds` so the suggestion algorithm continues to work). Old goals files and old skill tree data files are deleted.

**Tech Stack:** React 19, TypeScript, CSS Modules, framer-motion (to be installed), Vitest

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/data/skillTree.ts` | All 5 categories + sub-branches + leaf skills with exercises |
| Modify | `src/types/index.ts` | Add `description?: string` to `TreeLeaf` |
| Modify | `src/utils/tree.ts` | Add `nodeMatchesSearch` + `getAutoExpandIds` |
| Modify | `src/utils/tree.test.ts` | Tests for the two new utilities |
| Modify | `src/data/activities.ts` | Retag `core-compression`→`core`, `hip-rotation-ov`→`hip-rotation` |
| Modify | `src/contexts/GoalsContext.tsx` | Seed `selectedNodeIds: [areaId]` in `addGoal` |
| Create | `src/features/skillTree/GoalsDashboard.tsx` | Active-goal badge strip |
| Create | `src/features/skillTree/TreeView.tsx` | Recursive branch/leaf renderer |
| Create | `src/features/skillTree/TreeView.module.css` | Tree node styles + connecting lines |
| Create | `src/features/skillTree/SkillDetailPanel.tsx` | Skill detail window |
| Create | `src/features/skillTree/SkillDetailPanel.module.css` | Detail panel styles |
| Create | `src/features/skillTree/SkillTreePage.tsx` | Page root — owns all local state |
| Create | `src/features/skillTree/SkillTreePage.module.css` | Page layout + category buttons |
| Modify | `src/app/App.tsx` | Swap `GoalsPage` import for `SkillTreePage` |
| Modify | `src/components/Sidebar/Sidebar.tsx` | Label "Goals" → "Skill Tree" |
| Delete | `src/features/goals/GoalsPage.tsx` + `.module.css` | Replaced |
| Delete | `src/features/goals/GoalTab.tsx` + `.module.css` | Replaced |
| Delete | `src/features/goals/AddGoalModal.tsx` + `.module.css` | Replaced |
| Delete | `src/data/skillTreeV1.ts` | Retired |
| Delete | `src/data/skillTreeV2.ts` | Retired |

---

## Task 1: Install framer-motion

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install the package**

```bash
npm install framer-motion
```

Expected output includes `added N packages` with no errors.

- [ ] **Step 2: Verify import works**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors (framer-motion ships its own types).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install framer-motion"
```

---

## Task 2: Extend TreeLeaf type with description field

**Files:**
- Modify: `src/types/index.ts:9` (TreeLeaf interface)
- Modify: `src/utils/tree.test.ts` (add one type-coverage test)

- [ ] **Step 1: Write the failing type-coverage test**

In `src/utils/tree.test.ts`, add after the existing imports:

```typescript
import type { TreeLeaf } from "../types";
```

Then add this describe block at the end of the file:

```typescript
describe("TreeLeaf description field", () => {
  it("accepts optional description", () => {
    const leaf: TreeLeaf = { id: "x", label: "X", description: "Test desc", exercises: [] };
    expect(leaf.description).toBe("Test desc");
  });
  it("description is optional", () => {
    const leaf: TreeLeaf = { id: "y", label: "Y", exercises: [] };
    expect(leaf.description).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/utils/tree.test.ts
```

Expected: FAIL — TypeScript error: `description` does not exist on `TreeLeaf`.

- [ ] **Step 3: Add description to TreeLeaf in types/index.ts**

Current `TreeLeaf` (line 28–32):
```typescript
export interface TreeLeaf {
  id: string;
  label: string;
  exercises: Exercise[];
}
```

Replace with:
```typescript
export interface TreeLeaf {
  id: string;
  label: string;
  description?: string;
  exercises: Exercise[];
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/tree.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/utils/tree.test.ts
git commit -m "feat: add optional description field to TreeLeaf type"
```

---

## Task 3: Create src/data/skillTree.ts

**Files:**
- Create: `src/data/skillTree.ts`

- [ ] **Step 1: Create the file with full content**

Create `src/data/skillTree.ts`:

```typescript
import type { TreeNode } from "../types";

export const CATEGORY_COLORS: Record<string, string> = {
  "hold-types": "#e67e22",
  "wall-angles": "#3498db",
  "moves-technique": "#e74c3c",
  "physical-conditioning": "#27ae60",
  "mental-tactics": "#9b59b6",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "hold-types": "✊",
  "wall-angles": "🧗",
  "moves-technique": "⚡",
  "physical-conditioning": "💪",
  "mental-tactics": "🎯",
};

export const SKILL_TREE: TreeNode[] = [
  {
    id: "hold-types",
    label: "Hold Types",
    children: [
      {
        id: "slopers",
        label: "Slopers",
        description: "Master friction-dependent holds by controlling wrist position and shoulder alignment over the hold.",
        exercises: [
          { name: "Sloper Hangboard", detail: "20mm sloper · 7s on / 3s off × 6 reps · 2 sets" },
          { name: "Wrist Position Drills", detail: "Keep wrist low and shoulder over hold · 10 controlled moves" },
          { name: "Sloper Problems", detail: "Select 5 problems with sloper cruxes · 3 attempts each" },
          { name: "Open-hand Capacity", detail: "Avoid full crimp — build open-hand strength on moderate holds" },
        ],
      },
      {
        id: "crimps",
        label: "Crimps",
        description: "Build the specific finger strength and grip discipline that technical crimpy sequences demand.",
        exercises: [
          { name: "Half-crimp Hangs", detail: "20mm edge · 10s on / 3min off · 5 sets" },
          { name: "Open-to-Half Transition", detail: "Alternate grip positions on same holds · 6 reps × 3 sets" },
          { name: "Max Recruitment Hangs", detail: "Added weight · 6–10s · 3 sets — builds raw crimp power" },
          { name: "Limit Crimp Problems", detail: "Climb at or above your crimp grade ceiling · 45 min" },
        ],
      },
      {
        id: "pinches",
        label: "Pinches",
        description: "Develop thumb opposition and lateral finger force for compression-style and pinch-heavy sequences.",
        exercises: [
          { name: "Pinch Block Holds", detail: "10s holds · 4 sets — builds lateral finger strength" },
          { name: "Pinch Repeaters", detail: "7s on / 3s off × 6 reps · 2 sets · vary grip width" },
          { name: "Pinch-specific Problems", detail: "Select problems with pinch sequences · 3× each" },
          { name: "Thumb Opposition Drills", detail: "Focus on pressing thumb against fingers on each pinch hold" },
        ],
      },
      {
        id: "pockets",
        label: "Pockets",
        description: "Train precise pocket placement and build tendon resilience for technical pocket sequences.",
        exercises: [
          { name: "2-finger Pocket Hangs", detail: "7s on / 3s off × 4 reps per finger pair · 2 sets each" },
          { name: "Pocket Problems", detail: "Find or set problems requiring pocket holds · 5 problems × 3 attempts" },
          { name: "Pocket Transitions", detail: "Move between pocket positions on the wall · 10 moves × 3 sets" },
          { name: "Tendon Warm-up", detail: "Gentle pocket hangs at 40% effort before harder pocket sessions" },
        ],
      },
    ],
  },
  {
    id: "wall-angles",
    label: "Wall Angles",
    children: [
      {
        id: "slab",
        label: "Slab",
        children: [
          {
            id: "smearing",
            label: "Smearing",
            description: "Learn to generate and trust friction contact across the full sole of the shoe on low-angle walls.",
            exercises: [
              { name: "Foothold-free Traverses", detail: "Traverse on 5–10° wall with feet smearing only · 5 laps" },
              { name: "Weight-the-foot Drills", detail: "Stand on a smear hold for 3s before moving · 10 moves" },
              { name: "Eyes-closed Smearing", detail: "Climb easy slab with eyes closed — feel the friction change" },
              { name: "Steeper Smear Progression", detail: "Increase wall angle each session while maintaining technique" },
            ],
          },
          {
            id: "edging",
            label: "Edging",
            description: "Develop precise footwork using the inside and outside edges of the shoe on small footholds.",
            exercises: [
              { name: "Small Edge Problems", detail: "Find or set problems using tiny footholds only · 8 problems" },
              { name: "Silent Feet Drills", detail: "Climb any slab route placing feet without sound" },
              { name: "Dot Drills", detail: "Hit marked spots on the wall with your toes exactly · 10 routes" },
              { name: "Edge Alternating", detail: "Deliberately alternate inside and outside edge on each foothold" },
            ],
          },
          {
            id: "trust-feet",
            label: "Trusting Feet",
            description: "Build the confidence to commit weight onto friction smears and small holds without hesitation.",
            exercises: [
              { name: "Commitment Routes", detail: "Climb routes where the only option is trusting friction — no hesitation" },
              { name: "Eyes-on-Feet Rule", detail: "Always look at your foot placement before weighting it · 10 routes" },
              { name: "Lead Slab Practice", detail: "Lead (not top-rope) slab routes — commitment becomes non-negotiable" },
              { name: "Progressive Angle", detail: "Increase wall angle 5° each session until near-vertical" },
            ],
          },
        ],
      },
      {
        id: "vertical",
        label: "Vertical",
        description: "Establish efficient movement economy on vertical walls through straight-arm climbing and hip positioning.",
        exercises: [
          { name: "Straight-arm Climbing", detail: "Climb any vertical route keeping arms as straight as possible · 10 routes" },
          { name: "Hip-in Technique", detail: "Bring hip toward wall on every foothold · 15 moves × 3 sets" },
          { name: "Vertical Mileage", detail: "60 min climbing on 0–5° walls — build base movement economy" },
          { name: "Flag & Balance Circuits", detail: "Choose 5 problems · climb each using flags on every move" },
        ],
      },
      {
        id: "overhang",
        label: "Overhang",
        description: "Maintain body tension and efficient hip positioning on walls beyond vertical.",
        exercises: [
          { name: "Heel Hook Activation", detail: "On a 45° wall, weight the heel and pull actively · 3 sets of 5 moves" },
          { name: "Hip Rotation Drills", detail: "Exaggerate hip drop into wall on each overhang move · 10 reps" },
          { name: "Overhang Mileage", detail: "30 min continuous climbing on 30–45° — focus on body tension" },
          { name: "Drop Knee Traverses", detail: "Sustained drop-knee on traversing wall · 3 laps" },
        ],
      },
      {
        id: "cave",
        label: "Cave",
        description: "Develop the core tension and body positioning required for severely overhanging cave sections.",
        exercises: [
          { name: "Core Tension Holds", detail: "On 60°+ wall, hold hollow-body position between each move · 5 problems" },
          { name: "Kneebar Practice", detail: "Find kneebar rests on cave sections · use them for full recovery" },
          { name: "Campus Cave Moves", detail: "Move hands without feet on 60°+ board · 3 sets of 5 moves" },
          { name: "Cave Problem Sets", detail: "Select 4 cave-specific problems · 3 attempts each with full rest" },
        ],
      },
    ],
  },
  {
    id: "moves-technique",
    label: "Moves & Technique",
    children: [
      {
        id: "dynos",
        label: "Dynos",
        children: [
          {
            id: "dyno-coordination",
            label: "Coordination",
            description: "Train the timing precision to catch holds at the exact apex of momentum — the dead point.",
            exercises: [
              { name: "Dead Point Ladder", detail: "Catch target holds at the moment of zero momentum · 3 sets of 6 reps" },
              { name: "Slow Press into Dead Point", detail: "From static, press slowly into target — catch at apex · 10 reps" },
              { name: "Timing Drills", detail: "Film your attempts · review for apex timing accuracy" },
              { name: "Dead Point on Crimps", detail: "Practice dead pointing to crimp holds specifically · 8 reps × 3 sets" },
            ],
          },
          {
            id: "dyno-paddle",
            label: "Paddle",
            description: "Build the explosive power and body projection to complete full dynamic moves between distant holds.",
            exercises: [
              { name: "Progressive Distance Dynos", detail: "Jugs on campus board · increase distance each set · 5 attempts per rung" },
              { name: "Lunge to Pinch", detail: "Lunge to small pinch, stick it · 8 reps" },
              { name: "Dyno Problems", detail: "Select 5 problems requiring full dynos · 3 attempts each" },
              { name: "Moon Board Catch Training", detail: "Random target holds · 3 sets of 5 · focus on clean catch" },
            ],
          },
        ],
      },
      {
        id: "heel-hooks",
        label: "Heel Hooks",
        description: "Learn to actively pull with the heel to maintain high feet and generate upward momentum on steep terrain.",
        exercises: [
          { name: "Heel Hook Activation", detail: "On a 45° wall, weight the heel and pull actively · 3 sets of 5 moves" },
          { name: "Seated Leg Curls (Eccentric)", detail: "3 kg · slow 4s lowering · 12 reps × 3 sets" },
          { name: "Heel Scum Practice", detail: "Find problems with heel scum on the overhang · 4 problems × 3 sets" },
          { name: "Hip Mobility Combo", detail: "Pigeon pose 2 min each side, then practice placing heels on high holds" },
        ],
      },
      {
        id: "toe-hooks",
        label: "Toe Hooks",
        description: "Use the top of the toe to pull against holds and maintain body position on overhanging terrain.",
        exercises: [
          { name: "Toe Hook Holds", detail: "On a 45° board, actively pull with the toe on designated holds · 5 sets of 3 moves" },
          { name: "Hamstring Activation", detail: "Lying leg curls · 15 reps × 3 sets to build toe hook pulling power" },
          { name: "Overhang Traverses", detail: "Traverse steep wall using only toe hooks to progress · 3 laps" },
          { name: "Problem Selection", detail: "Choose 5 problems requiring toe hooks · complete each 3×" },
        ],
      },
      {
        id: "drop-knee",
        label: "Drop Knee",
        description: "Master the drop knee to rotate the hip into the wall, extending reach and reducing arm strain on overhangs.",
        exercises: [
          { name: "Drop Knee Traverses", detail: "Sustained drop-knee on traversing wall · 3 laps" },
          { name: "Hip Flexibility", detail: "Cossack Squat 3×8 each side · daily warm-up" },
          { name: "Drop Knee Problem Set", detail: "5 problems requiring drop knee · complete 3× each" },
          { name: "90/90 Hip Stretch", detail: "2 min each side before climbing sessions" },
        ],
      },
      {
        id: "hip-rotation",
        label: "Hip Rotation",
        description: "Use shoulder-in and twist-lock movements to maximise reach and reduce energy expenditure on steep walls.",
        exercises: [
          { name: "Hip-to-wall Drills", detail: "On overhang: get hip flush to wall before moving · 10 moves × 3 sets" },
          { name: "Twist Lock Practice", detail: "Shoulder-in climbing on 30–45° overhang · 20 min" },
          { name: "Flag Technique Circuits", detail: "Inside/outside flag on 5 set problems · 3 rounds" },
          { name: "Slow-motion Repeats", detail: "3× slower on a familiar problem — notice hip position at each move" },
        ],
      },
      {
        id: "flagging",
        label: "Flagging",
        description: "Use the non-active foot as a counterbalance to maintain centre of gravity over the standing foot.",
        exercises: [
          { name: "Inside Flag Traverses", detail: "Traverse vertical wall using only inside flags · 3 laps" },
          { name: "Outside Flag Drills", detail: "Choose 5 problems · solve each using outside flag on every move" },
          { name: "Flag Identification", detail: "Before each move, decide: inside, outside, or cross-through flag" },
          { name: "Balance Problems", detail: "Set problems requiring balance-flag combinations · 3 attempts each" },
        ],
      },
      {
        id: "dead-points",
        label: "Dead Points",
        description: "Catch holds precisely at the apex of upward momentum to minimise grip force required.",
        exercises: [
          { name: "Dead Point Ladder", detail: "Catch target holds at the moment of zero momentum · 3 sets of 6 reps" },
          { name: "Slow Press into Dead Point", detail: "From static, press slowly into target — catch at apex · 10 reps" },
          { name: "Video Analysis", detail: "Film your attempts · review for apex timing accuracy" },
          { name: "Dead Point on Crimps", detail: "Practice dead pointing to crimp holds specifically · 8 reps × 3 sets" },
        ],
      },
    ],
  },
  {
    id: "physical-conditioning",
    label: "Physical & Conditioning",
    children: [
      {
        id: "finger-strength",
        label: "Finger Strength",
        children: [
          {
            id: "hangboard",
            label: "Hangboard",
            description: "Systematically overload the finger flexors using a hangboard to build grip strength across all hold types.",
            exercises: [
              { name: "Hangboard Repeaters", detail: "7s on / 3s off × 6 reps · 2 sets per grip type" },
              { name: "Max Recruitment Hangs", detail: "Added weight · 6–10s · full rest between · 3 sets" },
              { name: "Minimum Edge", detail: "Find smallest edge you can hang 10s · shrink over weeks" },
            ],
          },
          {
            id: "campus-strength",
            label: "Campus Training",
            description: "Build explosive contact strength and dynamic pulling power using campus board laddering and dynos.",
            exercises: [
              { name: "1-5 Ladder", detail: "Campus rung 1 then rung 5 with one hand · 3 sets each arm" },
              { name: "Double Dynos", detail: "Both hands move together up the board · 5 reps × 3 sets" },
              { name: "Laddering", detail: "Consecutive rung movements · 3 sets of max rungs" },
            ],
          },
        ],
      },
      {
        id: "pull-strength",
        label: "Pull Strength",
        children: [
          {
            id: "weighted-pullups",
            label: "Weighted Pull-ups",
            description: "Add load to pull-ups to build the raw pulling strength that translates directly to hard moves.",
            exercises: [
              { name: "Max Weight Sets", detail: "3–5 reps × 4 sets · slow 4s eccentric · 3 min rest between sets" },
              { name: "Lock-off Training", detail: "Hold at 90°, 120°, 150° · 5–8s each · 3 rounds" },
              { name: "Typewriter Pull-ups", detail: "3–5 reps · emphasises unilateral pulling strength" },
            ],
          },
          {
            id: "one-arm-progressions",
            label: "One-arm Progressions",
            description: "Progress toward one-arm pulling using assisted hangs, negatives, and lock-offs.",
            exercises: [
              { name: "Assisted One-arm Hangs", detail: "Finger assist on opposite arm · 10s · 3 sets each arm" },
              { name: "One-arm Negatives", detail: "5s eccentric · 3 reps each arm · 3 sets" },
              { name: "One-arm Lock-off", detail: "Hold at 90° with one arm · 5s · 3 sets each arm" },
            ],
          },
        ],
      },
      {
        id: "core",
        label: "Core",
        description: "Build the full-body tension required to maintain body position on steep terrain and through powerful sequences.",
        exercises: [
          { name: "Compression Problems", detail: "Select problems using compression technique · 5 problems × 3 attempts" },
          { name: "Hollow Body Holds", detail: "20–30s · 3 sets · maintain full body tension throughout" },
          { name: "Hanging Knee Raises", detail: "Slow, controlled · 10 reps × 3 sets" },
          { name: "Front Lever Progressions", detail: "Tuck → advanced tuck → straddle · 5–8s holds · 3 sets" },
        ],
      },
      {
        id: "power-endurance",
        label: "Power Endurance",
        children: [
          {
            id: "four-by-fours",
            label: "4x4s",
            description: "Train the ability to sustain hard moves under fatigue using structured 4×4 circuit formats.",
            exercises: [
              { name: "Classic 4×4", detail: "4 problems × 4 sets · 1 min rest between problems, 4 min between sets" },
              { name: "Pyramid 4×4", detail: "Easy → hard → easy sequence · 4 problems · 3 sets" },
              { name: "Linked Sequences", detail: "Connect 4 moderate problems without rest · 3 rounds" },
            ],
          },
          {
            id: "arc-training",
            label: "ARC Training",
            description: "Build aerobic capacity and capillary density in the forearms through sustained low-intensity climbing.",
            exercises: [
              { name: "Continuous Easy Climbing", detail: "20–40 min non-stop on auto-belay · pump but never fail" },
              { name: "ARC Traversing", detail: "30 min on gentle overhang — maintain steady pace" },
              { name: "Easy Mileage Sessions", detail: "Flash/onsight only · 90 min sessions · 2× per week" },
            ],
          },
        ],
      },
      {
        id: "board-climbing",
        label: "Board Climbing",
        description: "Use system boards (Moonboard, Kilter, etc.) to develop strength, technique, and problem-solving under load.",
        exercises: [
          { name: "Systematic Board Sessions", detail: "Grade 2 below max · 10 problems per session · full rest between" },
          { name: "Benchmark Problems", detail: "Set 3 problems at current grade, repeat until automatic" },
          { name: "Max Effort Problems", detail: "3 hard attempts per problem · full rest · 5 problems" },
          { name: "Limit Bouldering", detail: "45 min on problems just above your grade ceiling" },
        ],
      },
    ],
  },
  {
    id: "mental-tactics",
    label: "Mental & Tactics",
    children: [
      {
        id: "route-reading",
        label: "Route Reading",
        description: "Develop the ability to visualise and plan an efficient sequence before touching the wall.",
        exercises: [
          { name: "Pre-climb Visualisation", detail: "Stand below the problem for 90s · visualise every move before touching the wall" },
          { name: "Beta Comparison", detail: "After climbing, watch 2 other climbers' beta · note differences" },
          { name: "Blind Sequence", detail: "Describe every move of a familiar problem from memory · check accuracy" },
          { name: "Move Prediction", detail: "For each new problem, predict the sequence before attempting · track accuracy rate" },
        ],
      },
      {
        id: "fear-management",
        label: "Fear Management",
        description: "Build a systematic approach to managing the fear of falling so it stops blocking performance.",
        exercises: [
          { name: "Controlled Falls Practice", detail: "Practice safe falling from low heights · 5 falls per session until automatic" },
          { name: "Breathing Reset", detail: "Box breathing before hard attempts · 4s in, 4s hold, 4s out" },
          { name: "Progressive Exposure", detail: "Systematically climb slightly higher each session · log your high point" },
          { name: "Commitment Moves", detail: "Choose one move per session that scares you · commit fully · repeat 3×" },
        ],
      },
      {
        id: "competition-mindset",
        label: "Competition Mindset",
        description: "Train the focus, pacing, and decision-making skills that separate performance in pressure situations.",
        exercises: [
          { name: "Timed Attempts", detail: "Set a 5-minute timer per problem — creates competition pressure" },
          { name: "Flash or Leave", detail: "Attempt each problem exactly once · forces full commitment" },
          { name: "Recovery Between Attempts", detail: "Practice active recovery: shake out, breathe, reset — 3 min max" },
          { name: "Mock Comp Simulation", detail: "Pick 5 problems · one attempt each · score yourself honestly" },
        ],
      },
    ],
  },
];
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/skillTree.ts
git commit -m "feat: add skillTree data with 5 categories and all leaf skills"
```

---

## Task 4: Add tree search utilities + tests

**Files:**
- Modify: `src/utils/tree.ts`
- Modify: `src/utils/tree.test.ts`

- [ ] **Step 1: Write failing tests**

Add to the end of `src/utils/tree.test.ts`:

```typescript
import { nodeMatchesSearch, getAutoExpandIds } from "./tree";
import type { TreeBranch } from "../types";

describe("nodeMatchesSearch", () => {
  it("returns true for a leaf whose label matches (case-insensitive)", () => {
    const leaf: TreeLeaf = { id: "slopers", label: "Slopers", exercises: [] };
    expect(nodeMatchesSearch(leaf, "SLOPE")).toBe(true);
  });
  it("returns false for a leaf with no matching label", () => {
    const leaf: TreeLeaf = { id: "slopers", label: "Slopers", exercises: [] };
    expect(nodeMatchesSearch(leaf, "crimp")).toBe(false);
  });
  it("returns true for a branch where a descendant leaf matches", () => {
    const branch: TreeBranch = {
      id: "hold-types",
      label: "Hold Types",
      children: [{ id: "slopers", label: "Slopers", exercises: [] }],
    };
    expect(nodeMatchesSearch(branch, "slope")).toBe(true);
  });
  it("returns false for a branch where no descendant matches", () => {
    const branch: TreeBranch = {
      id: "hold-types",
      label: "Hold Types",
      children: [{ id: "slopers", label: "Slopers", exercises: [] }],
    };
    expect(nodeMatchesSearch(branch, "cave")).toBe(false);
  });
  it("returns true when the branch label itself matches", () => {
    const branch: TreeBranch = {
      id: "hold-types",
      label: "Hold Types",
      children: [{ id: "slopers", label: "Slopers", exercises: [] }],
    };
    expect(nodeMatchesSearch(branch, "hold")).toBe(true);
  });
});

const SEARCH_TREE: TreeNode[] = [
  {
    id: "hold-types",
    label: "Hold Types",
    children: [
      { id: "slopers", label: "Slopers", exercises: [] },
      { id: "crimps", label: "Crimps", exercises: [] },
    ],
  },
  {
    id: "wall-angles",
    label: "Wall Angles",
    children: [
      {
        id: "slab",
        label: "Slab",
        children: [{ id: "smearing", label: "Smearing", exercises: [] }],
      },
    ],
  },
];

describe("getAutoExpandIds", () => {
  it("returns empty set for empty query", () => {
    expect(getAutoExpandIds(SEARCH_TREE, "").size).toBe(0);
  });
  it("returns branch ID whose child leaf matches", () => {
    const ids = getAutoExpandIds(SEARCH_TREE, "slope");
    expect(ids.has("hold-types")).toBe(true);
  });
  it("does not include leaf IDs in the result", () => {
    const ids = getAutoExpandIds(SEARCH_TREE, "slope");
    expect(ids.has("slopers")).toBe(false);
  });
  it("includes branch when branch label itself matches", () => {
    const ids = getAutoExpandIds(SEARCH_TREE, "hold");
    expect(ids.has("hold-types")).toBe(true);
  });
  it("expands deeply nested branches when a deep leaf matches", () => {
    const ids = getAutoExpandIds(SEARCH_TREE, "smear");
    expect(ids.has("wall-angles")).toBe(true);
    expect(ids.has("slab")).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/utils/tree.test.ts
```

Expected: FAIL — `nodeMatchesSearch` and `getAutoExpandIds` are not defined.

- [ ] **Step 3: Implement the two functions in tree.ts**

Add to the end of `src/utils/tree.ts`:

```typescript
export function nodeMatchesSearch(node: TreeNode, query: string): boolean {
  const q = query.toLowerCase();
  if (node.label.toLowerCase().includes(q)) return true;
  if (isLeaf(node)) return false;
  return (node as TreeBranch).children.some((child) => nodeMatchesSearch(child, q));
}

export function getAutoExpandIds(nodes: TreeNode[], query: string): Set<string> {
  if (!query.trim()) return new Set();
  const ids = new Set<string>();
  function collect(node: TreeNode): boolean {
    if (isLeaf(node)) return node.label.toLowerCase().includes(query.toLowerCase());
    const selfMatch = node.label.toLowerCase().includes(query.toLowerCase());
    const anyChildMatch = (node as TreeBranch).children.some((child) => collect(child));
    if (selfMatch || anyChildMatch) ids.add(node.id);
    return selfMatch || anyChildMatch;
  }
  nodes.forEach((n) => collect(n));
  return ids;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/utils/tree.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/tree.ts src/utils/tree.test.ts
git commit -m "feat: add nodeMatchesSearch and getAutoExpandIds tree utilities"
```

---

## Task 5: Update activities.ts to retag retired node IDs

**Files:**
- Modify: `src/data/activities.ts`

Two node IDs used in activity goal tags no longer exist in the new skill tree:
- `"core-compression"` → replaced by `"core"`
- `"hip-rotation-ov"` → replaced by `"hip-rotation"`

- [ ] **Step 1: Update the two retired tags**

In `src/data/activities.ts`:

Replace all occurrences of `nodeId: "core-compression"` with `nodeId: "core"` and update the accompanying `nodeLabel` accordingly. There are two occurrences (`act-board-climbing` and `act-hollow-body`).

Replace the occurrence of `nodeId: "hip-rotation-ov"` (in `act-drop-knee-drills`) with `nodeId: "hip-rotation"`.

The updated file should be:

```typescript
import type { Activity } from "../types";

export const ACTIVITIES: Activity[] = [
  {
    id: "act-board-climbing",
    title: "Board Climbing",
    subtitle: "10 problems · full rest between",
    accent: "#d4a853",
    goalTags: [
      { nodeId: "board-climbing", nodeLabel: "Board Climbing" },
      { nodeId: "core", nodeLabel: "Core" },
    ],
  },
  {
    id: "act-hangboard-repeaters",
    title: "Hangboard Repeaters",
    subtitle: "7s on / 3s off × 6 reps · 2 sets",
    accent: "#c0392b",
    goalTags: [
      { nodeId: "hangboard", nodeLabel: "Hangboard" },
      { nodeId: "crimps", nodeLabel: "Crimps" },
    ],
  },
  {
    id: "act-campus-training",
    title: "Campus Training",
    subtitle: "Laddering & double dynos · 3 sets",
    accent: "#e67e22",
    goalTags: [
      { nodeId: "campus-strength", nodeLabel: "Campus Training" },
      { nodeId: "dead-points", nodeLabel: "Dead Points" },
    ],
  },
  {
    id: "act-arc-training",
    title: "ARC Training",
    subtitle: "30 min continuous climbing · steady pace",
    accent: "#27ae60",
    goalTags: [
      { nodeId: "arc-training", nodeLabel: "ARC Training" },
    ],
  },
  {
    id: "act-four-by-fours",
    title: "4×4 Circuits",
    subtitle: "4 problems × 4 sets · 4 min rest between sets",
    accent: "#8e44ad",
    goalTags: [
      { nodeId: "four-by-fours", nodeLabel: "4x4s" },
      { nodeId: "arc-training", nodeLabel: "ARC Training" },
    ],
  },
  {
    id: "act-weighted-pullups",
    title: "Weighted Pull-ups",
    subtitle: "3–5 reps × 4 sets · slow eccentric",
    accent: "#2980b9",
    goalTags: [
      { nodeId: "weighted-pullups", nodeLabel: "Weighted Pull-ups" },
      { nodeId: "one-arm-progressions", nodeLabel: "One-arm Progressions" },
    ],
  },
  {
    id: "act-hollow-body",
    title: "Hollow Body & Tension",
    subtitle: "20–30s holds · 3 sets · full tension",
    accent: "#16a085",
    goalTags: [
      { nodeId: "core", nodeLabel: "Core" },
    ],
  },
  {
    id: "act-toe-hook-session",
    title: "Toe Hook Session",
    subtitle: "5 problems requiring toe hooks · 3× each",
    accent: "#d35400",
    goalTags: [
      { nodeId: "toe-hooks", nodeLabel: "Toe Hooks" },
      { nodeId: "heel-hooks", nodeLabel: "Heel Hooks" },
    ],
  },
  {
    id: "act-drop-knee-drills",
    title: "Drop Knee Drills",
    subtitle: "Traverses + 5 targeted problems",
    accent: "#7f8c8d",
    goalTags: [
      { nodeId: "drop-knee", nodeLabel: "Drop Knee" },
      { nodeId: "hip-rotation", nodeLabel: "Hip Rotation" },
    ],
  },
  {
    id: "act-slab-traverses",
    title: "Slab Traverses",
    subtitle: "Footwork focus · 5 laps · no rushing",
    accent: "#bdc3c7",
    goalTags: [
      { nodeId: "smearing", nodeLabel: "Smearing" },
      { nodeId: "trust-feet", nodeLabel: "Trusting Feet" },
    ],
  },
  {
    id: "act-sloper-pinch-session",
    title: "Sloper & Pinch Session",
    subtitle: "Alternate grip type every other problem",
    accent: "#f39c12",
    goalTags: [
      { nodeId: "slopers", nodeLabel: "Slopers" },
      { nodeId: "pinches", nodeLabel: "Pinches" },
    ],
  },
  {
    id: "act-dyno-dead-point",
    title: "Dyno & Dead Point Work",
    subtitle: "Progressive distance dynos · 5 attempts per target",
    accent: "#e74c3c",
    goalTags: [
      { nodeId: "dynos", nodeLabel: "Dynos" },
      { nodeId: "dead-points", nodeLabel: "Dead Points" },
    ],
  },
];
```

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/activities.ts
git commit -m "fix: retag retired nodeIds in activities (core-compression→core, hip-rotation-ov→hip-rotation)"
```

---

## Task 6: Patch GoalsContext to seed selectedNodeIds

**Files:**
- Modify: `src/contexts/GoalsContext.tsx:17-24`

**Why this patch is needed:** `getSuggestedActivities` builds match paths from `goal.selectedNodeIds`. With the new skill-as-goal model, `addGoal` is called with the leaf's ID. Without seeding, `selectedNodeIds` is `[]` and no activities are ever suggested.

- [ ] **Step 1: Update addGoal to seed selectedNodeIds**

In `src/contexts/GoalsContext.tsx`, change the `addGoal` function from:

```typescript
const addGoal = (areaId: string, areaLabel: string) => {
  if (goals.length >= 3) return;
  if (goals.some((g) => g.areaId === areaId)) return;
  const isFirst = goals.length === 0;
  setGoals((prev) => [
    ...prev,
    { id: areaId, areaId, areaLabel, isPrimary: isFirst, selectedNodeIds: [] },
  ]);
};
```

To:

```typescript
const addGoal = (areaId: string, areaLabel: string) => {
  if (goals.length >= 3) return;
  if (goals.some((g) => g.areaId === areaId)) return;
  const isFirst = goals.length === 0;
  setGoals((prev) => [
    ...prev,
    { id: areaId, areaId, areaLabel, isPrimary: isFirst, selectedNodeIds: [areaId] },
  ]);
};
```

- [ ] **Step 2: Run all tests to verify nothing breaks**

```bash
npx vitest run
```

Expected: all tests PASS (existing suggestions tests use manually constructed Goal objects and are unaffected).

- [ ] **Step 3: Commit**

```bash
git add src/contexts/GoalsContext.tsx
git commit -m "fix: seed selectedNodeIds with areaId in addGoal so suggestions work for skill goals"
```

---

## Task 7: Create GoalsDashboard component

**Files:**
- Create: `src/features/skillTree/GoalsDashboard.tsx`

The dashboard reads from `GoalsContext` and renders animated goal badges. No props needed — it connects to context directly.

- [ ] **Step 1: Create the component**

Create `src/features/skillTree/GoalsDashboard.tsx`:

```typescript
import { AnimatePresence, motion } from "framer-motion";
import { useGoals } from "../../contexts/GoalsContext";
import styles from "./SkillTreePage.module.css";

export function GoalsDashboard() {
  const { goals, removeGoal } = useGoals();

  return (
    <div className={styles.dashboard}>
      <span className={styles.dashboardLabel}>Active Goals</span>
      <div className={styles.badgeList}>
        <AnimatePresence>
          {goals.map((g) => (
            <motion.div
              key={g.id}
              className={styles.badge}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              layout
            >
              <span className={styles.badgeLabel}>{g.areaLabel}</span>
              <button
                className={styles.badgeRemove}
                onClick={() => removeGoal(g.id)}
                aria-label={`Remove ${g.areaLabel} goal`}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {goals.length === 0 && (
          <span className={styles.noGoals}>No active goals — explore the tree below</span>
        )}
      </div>
    </div>
  );
}
```

Note: `GoalsDashboard` uses CSS classes from `SkillTreePage.module.css` (dashboard, badgeList, badge, etc.) which will be created in Task 10.

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors (CSS module types are inferred; the module will resolve once created).

- [ ] **Step 3: Commit**

```bash
git add src/features/skillTree/GoalsDashboard.tsx
git commit -m "feat: add GoalsDashboard component with animated goal badges"
```

---

## Task 8: Create TreeView component and CSS

**Files:**
- Create: `src/features/skillTree/TreeView.tsx`
- Create: `src/features/skillTree/TreeView.module.css`

`TreeView` is a recursive component that renders a list of `TreeNode[]`. Branch nodes toggle open/closed with a slide-down animation. Leaf nodes trigger the detail panel. Connecting lines are drawn with CSS pseudo-elements on the list structure.

- [ ] **Step 1: Create TreeView.tsx**

Create `src/features/skillTree/TreeView.tsx`:

```typescript
import { AnimatePresence, motion } from "framer-motion";
import { isLeaf, nodeMatchesSearch } from "../../utils/tree";
import type { TreeNode } from "../../types";
import styles from "./TreeView.module.css";

interface TreeViewProps {
  nodes: TreeNode[];
  expandedIds: Set<string>;
  selectedLeafId: string | null;
  onBranchToggle: (id: string) => void;
  onLeafSelect: (id: string) => void;
  searchQuery: string;
  autoExpandIds: Set<string>;
  categoryColor: string;
  depth?: number;
}

export function TreeView({
  nodes,
  expandedIds,
  selectedLeafId,
  onBranchToggle,
  onLeafSelect,
  searchQuery,
  autoExpandIds,
  categoryColor,
  depth = 0,
}: TreeViewProps) {
  const visibleNodes = searchQuery.trim()
    ? nodes.filter((n) => nodeMatchesSearch(n, searchQuery))
    : nodes;

  if (visibleNodes.length === 0) return null;

  return (
    <ul
      className={`${styles.list} ${depth > 0 ? styles.childList : ""}`}
      style={{ "--cat-color": categoryColor } as React.CSSProperties}
    >
      {visibleNodes.map((node) => {
        if (isLeaf(node)) {
          const isSelected = node.id === selectedLeafId;
          return (
            <li key={node.id} className={`${styles.item} ${depth > 0 ? styles.itemChild : ""}`}>
              <button
                className={`${styles.leaf} ${isSelected ? styles.leafSelected : ""}`}
                onClick={() => onLeafSelect(node.id)}
              >
                {node.label}
              </button>
            </li>
          );
        }

        const isExpanded = searchQuery.trim()
          ? autoExpandIds.has(node.id)
          : expandedIds.has(node.id);

        return (
          <li key={node.id} className={`${styles.item} ${depth > 0 ? styles.itemChild : ""}`}>
            <button
              className={`${styles.branch} ${isExpanded ? styles.branchOpen : ""}`}
              onClick={() => onBranchToggle(node.id)}
            >
              <span
                className={styles.chevron}
                style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                ›
              </span>
              {node.label}
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className={styles.childWrap}
                >
                  <TreeView
                    nodes={node.children}
                    expandedIds={expandedIds}
                    selectedLeafId={selectedLeafId}
                    onBranchToggle={onBranchToggle}
                    onLeafSelect={onLeafSelect}
                    searchQuery={searchQuery}
                    autoExpandIds={autoExpandIds}
                    categoryColor={categoryColor}
                    depth={depth + 1}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Create TreeView.module.css**

Create `src/features/skillTree/TreeView.module.css`:

```css
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.childList {
  padding-left: 16px;
  margin-top: 2px;
  position: relative;
}

.childList::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 4px;
  bottom: 12px;
  width: 1px;
  background: var(--cat-color, #ccc);
  opacity: 0.3;
}

.item {
  margin-bottom: 2px;
}

.itemChild {
  position: relative;
}

.itemChild::before {
  content: "";
  position: absolute;
  left: -9px;
  top: 14px;
  width: 9px;
  height: 1px;
  background: var(--cat-color, #ccc);
  opacity: 0.3;
}

.branch {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px 6px 8px;
  background: none;
  border: 1px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #413f39;
  text-align: left;
  transition: background 0.12s, border-color 0.12s;
}

.branch:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
}

.branchOpen {
  background: color-mix(in srgb, var(--cat-color, #999) 8%, transparent);
  border-color: color-mix(in srgb, var(--cat-color, #999) 25%, transparent);
}

.chevron {
  font-size: 14px;
  color: var(--cat-color, #999);
  transition: transform 0.18s ease;
  line-height: 1;
  flex-shrink: 0;
}

.leaf {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px 5px 8px;
  background: none;
  border: 1px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  color: #5a5854;
  text-align: left;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}

.leaf:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
  color: #413f39;
}

.leafSelected {
  background: color-mix(in srgb, var(--cat-color, #e67e22) 12%, transparent);
  border-color: color-mix(in srgb, var(--cat-color, #e67e22) 40%, transparent);
  color: #1f1e1c;
  font-weight: 500;
}

.childWrap {
  overflow: hidden;
}
```

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/skillTree/TreeView.tsx src/features/skillTree/TreeView.module.css
git commit -m "feat: add recursive TreeView component with animated expand/collapse"
```

---

## Task 9: Create SkillDetailPanel component and CSS

**Files:**
- Create: `src/features/skillTree/SkillDetailPanel.tsx`
- Create: `src/features/skillTree/SkillDetailPanel.module.css`

The detail panel slides up when a leaf is selected. It shows the skill name, theory description, a YouTube embed placeholder, the exercises list, and the "Set as Current Goal" button.

- [ ] **Step 1: Create SkillDetailPanel.tsx**

Create `src/features/skillTree/SkillDetailPanel.tsx`:

```typescript
import { motion } from "framer-motion";
import { useGoals } from "../../contexts/GoalsContext";
import type { TreeLeaf } from "../../types";
import styles from "./SkillDetailPanel.module.css";

interface SkillDetailPanelProps {
  leaf: TreeLeaf;
  categoryColor: string;
  onClose: () => void;
}

export function SkillDetailPanel({ leaf, categoryColor, onClose }: SkillDetailPanelProps) {
  const { goals, addGoal } = useGoals();
  const isGoal = goals.some((g) => g.areaId === leaf.id);
  const isFull = goals.length >= 3;

  const goalButtonLabel = isGoal ? "✓ Active Goal" : isFull ? "Goals Full (max 3)" : "Set as Current Goal";
  const goalButtonDisabled = isGoal || isFull;

  return (
    <motion.div
      className={styles.panel}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ "--panel-color": categoryColor } as React.CSSProperties}
    >
      <div className={styles.panelHeader}>
        <h2 className={styles.title}>Mastering {leaf.label}</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close detail panel">×</button>
      </div>

      {leaf.description && (
        <p className={styles.theory}>{leaf.description}</p>
      )}

      <div className={styles.videoPlaceholder}>
        <span className={styles.videoIcon}>▶</span>
        <span className={styles.videoText}>Tutorial Video</span>
        <span className={styles.videoSub}>YouTube embed · coming soon</span>
      </div>

      <div className={styles.drillsSection}>
        <h3 className={styles.drillsHeading}>Training Drills</h3>
        <ul className={styles.drillsList}>
          {leaf.exercises.map((ex) => (
            <li key={ex.name} className={styles.drillItem}>
              <span className={styles.drillName}>{ex.name}</span>
              <span className={styles.drillDetail}>{ex.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panelFooter}>
        <button
          className={`${styles.goalBtn} ${isGoal ? styles.goalBtnActive : ""}`}
          disabled={goalButtonDisabled}
          onClick={() => addGoal(leaf.id, leaf.label)}
        >
          {goalButtonLabel}
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create SkillDetailPanel.module.css**

Create `src/features/skillTree/SkillDetailPanel.module.css`:

```css
.panel {
  border-top: 1px solid #e4e4e4;
  padding: 16px 20px;
  background: #fff;
  flex-shrink: 0;
}

.panelHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1e1c;
  margin: 0;
  line-height: 1.3;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 18px;
  color: #9d9c99;
  cursor: pointer;
  padding: 0 0 0 8px;
  line-height: 1;
  flex-shrink: 0;
}

.closeBtn:hover {
  color: #413f39;
}

.theory {
  font-size: 13px;
  color: #5a5854;
  line-height: 1.55;
  margin: 0 0 12px;
}

.videoPlaceholder {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f5f5;
  border: 1px dashed #d4d4d4;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 14px;
}

.videoIcon {
  font-size: 18px;
  color: var(--panel-color, #e67e22);
  flex-shrink: 0;
}

.videoText {
  font-size: 13px;
  font-weight: 500;
  color: #413f39;
}

.videoSub {
  font-size: 12px;
  color: #9d9c99;
  margin-left: auto;
}

.drillsSection {
  margin-bottom: 14px;
}

.drillsHeading {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9d9c99;
  margin: 0 0 8px;
}

.drillsList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.drillItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: #fafafa;
  border: 1px solid #ebebeb;
  border-radius: 5px;
}

.drillName {
  font-size: 13px;
  font-weight: 500;
  color: #1f1e1c;
}

.drillDetail {
  font-size: 12px;
  color: #787878;
  line-height: 1.4;
}

.panelFooter {
  display: flex;
  justify-content: flex-end;
}

.goalBtn {
  padding: 8px 18px;
  background: var(--panel-color, #e67e22);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.goalBtn:hover:not(:disabled) {
  opacity: 0.88;
}

.goalBtn:disabled {
  opacity: 0.5;
  cursor: default;
}

.goalBtnActive {
  background: #27ae60;
}
```

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/skillTree/SkillDetailPanel.tsx src/features/skillTree/SkillDetailPanel.module.css
git commit -m "feat: add SkillDetailPanel with exercises, theory, and goal-setting button"
```

---

## Task 10: Create SkillTreePage and CSS

**Files:**
- Create: `src/features/skillTree/SkillTreePage.tsx`
- Create: `src/features/skillTree/SkillTreePage.module.css`

`SkillTreePage` is the page root. It owns all local state, renders the category buttons row, wires `TreeView` for the active category's subtree, and mounts `SkillDetailPanel` when a leaf is selected.

- [ ] **Step 1: Create SkillTreePage.tsx**

Create `src/features/skillTree/SkillTreePage.tsx`:

```typescript
import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SKILL_TREE, CATEGORY_COLORS, CATEGORY_ICONS } from "../../data/skillTree";
import { isLeaf, getAutoExpandIds } from "../../utils/tree";
import type { TreeBranch, TreeLeaf } from "../../types";
import { GoalsDashboard } from "./GoalsDashboard";
import { TreeView } from "./TreeView";
import { SkillDetailPanel } from "./SkillDetailPanel";
import styles from "./SkillTreePage.module.css";

export function SkillTreePage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedLeafId, setSelectedLeafId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const autoExpandIds = useMemo(
    () => getAutoExpandIds(SKILL_TREE, searchQuery),
    [searchQuery]
  );

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(null);
      setSelectedLeafId(null);
    } else {
      setActiveCategoryId(categoryId);
      setExpandedIds(new Set());
      setSelectedLeafId(null);
    }
  };

  const handleBranchToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleLeafSelect = (id: string) => {
    setSelectedLeafId((prev) => (prev === id ? null : id));
  };

  const activeCategory = SKILL_TREE.find(
    (n) => n.id === activeCategoryId && !isLeaf(n)
  ) as TreeBranch | undefined;

  const selectedLeaf = useMemo((): TreeLeaf | null => {
    if (!selectedLeafId) return null;
    function findLeaf(nodes: typeof SKILL_TREE): TreeLeaf | null {
      for (const node of nodes) {
        if (node.id === selectedLeafId && isLeaf(node)) return node;
        if (!isLeaf(node)) {
          const found = findLeaf(node.children);
          if (found) return found;
        }
      }
      return null;
    }
    return findLeaf(SKILL_TREE);
  }, [selectedLeafId]);

  const displayedCategory = searchQuery.trim()
    ? null
    : activeCategory;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Skill Tree</span>
        <input
          className={styles.search}
          type="search"
          placeholder="Search skills…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim()) setActiveCategoryId(null);
          }}
        />
      </header>

      <GoalsDashboard />

      <div className={styles.treeArea}>
        {!searchQuery.trim() && (
          <div className={styles.categoryRow}>
            {SKILL_TREE.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              const color = CATEGORY_COLORS[cat.id] ?? "#787878";
              return (
                <button
                  key={cat.id}
                  className={`${styles.catBtn} ${isActive ? styles.catBtnActive : ""}`}
                  style={{ "--cat-color": color } as React.CSSProperties}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className={styles.catIcon}>{CATEGORY_ICONS[cat.id]}</span>
                  <span className={styles.catLabel}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.treePanel}>
          {searchQuery.trim() ? (
            <TreeView
              nodes={SKILL_TREE}
              expandedIds={expandedIds}
              selectedLeafId={selectedLeafId}
              onBranchToggle={handleBranchToggle}
              onLeafSelect={handleLeafSelect}
              searchQuery={searchQuery}
              autoExpandIds={autoExpandIds}
              categoryColor="#787878"
            />
          ) : displayedCategory ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                <TreeView
                  nodes={displayedCategory.children}
                  expandedIds={expandedIds}
                  selectedLeafId={selectedLeafId}
                  onBranchToggle={handleBranchToggle}
                  onLeafSelect={handleLeafSelect}
                  searchQuery=""
                  autoExpandIds={new Set()}
                  categoryColor={CATEGORY_COLORS[activeCategoryId!] ?? "#787878"}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className={styles.emptyPrompt}>Select a category above to explore skills</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedLeaf && (
          <SkillDetailPanel
            leaf={selectedLeaf}
            categoryColor={
              activeCategoryId ? (CATEGORY_COLORS[activeCategoryId] ?? "#787878") : "#787878"
            }
            onClose={() => setSelectedLeafId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create SkillTreePage.module.css**

Create `src/features/skillTree/SkillTreePage.module.css`:

```css
/* ── Page layout ── */

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── Header ── */

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 48px;
  border-bottom: 1px solid #e4e4e4;
  flex-shrink: 0;
}

.headerTitle {
  font-size: 14px;
  font-weight: 600;
  color: #413f39;
  letter-spacing: 0.02em;
}

.search {
  width: 200px;
  padding: 5px 10px;
  font-size: 13px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  background: #f5f5f5;
  color: #413f39;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}

.search:focus {
  border-color: #bbb;
  background: #fff;
}

/* ── Goals Dashboard ── */

.dashboard {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-bottom: 1px solid #e4e4e4;
  flex-shrink: 0;
  min-height: 44px;
}

.dashboardLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9d9c99;
  flex-shrink: 0;
}

.badgeList {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px 3px 10px;
  background: #f0f0f0;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  font-size: 12px;
}

.badgeLabel {
  color: #413f39;
  font-weight: 500;
}

.badgeRemove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #9d9c99;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
}

.badgeRemove:hover {
  color: #413f39;
}

.noGoals {
  font-size: 12px;
  color: #bbb;
  font-style: italic;
}

/* ── Tree area ── */

.treeArea {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Category row ── */

.categoryRow {
  display: flex;
  gap: 8px;
  padding: 14px 20px 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.catBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 14px;
  background: #fafafa;
  border: 1.5px solid #e4e4e4;
  border-radius: 8px;
  cursor: pointer;
  min-width: 100px;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
}

.catBtn:hover {
  border-color: var(--cat-color, #ccc);
  background: color-mix(in srgb, var(--cat-color, #ccc) 6%, #fff);
}

.catBtnActive {
  border-color: var(--cat-color, #ccc);
  background: color-mix(in srgb, var(--cat-color, #ccc) 10%, #fff);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--cat-color, #ccc) 20%, transparent);
}

.catIcon {
  font-size: 20px;
  line-height: 1;
}

.catLabel {
  font-size: 11px;
  font-weight: 600;
  color: #413f39;
  text-align: center;
  line-height: 1.2;
}

/* ── Tree panel (scrollable) ── */

.treePanel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 20px 12px;
}

.emptyPrompt {
  font-size: 13px;
  color: #bbb;
  text-align: center;
  margin-top: 32px;
  font-style: italic;
}
```

- [ ] **Step 3: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/skillTree/SkillTreePage.tsx src/features/skillTree/SkillTreePage.module.css
git commit -m "feat: add SkillTreePage with category row, recursive tree, and detail panel"
```

---

## Task 11: Update App.tsx and Sidebar

**Files:**
- Modify: `src/app/App.tsx`
- Modify: `src/components/Sidebar/Sidebar.tsx`

- [ ] **Step 1: Swap GoalsPage for SkillTreePage in App.tsx**

In `src/app/App.tsx`, change:

```typescript
import { GoalsPage } from "../features/goals/GoalsPage";
```

To:

```typescript
import { SkillTreePage } from "../features/skillTree/SkillTreePage";
```

And change the route:

```typescript
<Route path="/goals" element={<GoalsPage />} />
```

To:

```typescript
<Route path="/goals" element={<SkillTreePage />} />
```

- [ ] **Step 2: Update sidebar label in Sidebar.tsx**

In `src/components/Sidebar/Sidebar.tsx`, change:

```typescript
{ to: "/goals", label: "Goals", icon: <GoalsIcon /> },
```

To:

```typescript
{ to: "/goals", label: "Skill Tree", icon: <GoalsIcon /> },
```

- [ ] **Step 3: Run all tests and typecheck**

```bash
npx vitest run && npx tsc --noEmit
```

Expected: all tests PASS, no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/App.tsx src/components/Sidebar/Sidebar.tsx
git commit -m "feat: wire SkillTreePage into app router, update sidebar label to Skill Tree"
```

---

## Task 12: Delete old files and final verification

**Files:**
- Delete: `src/features/goals/GoalsPage.tsx`
- Delete: `src/features/goals/GoalsPage.module.css`
- Delete: `src/features/goals/GoalTab.tsx`
- Delete: `src/features/goals/GoalTab.module.css`
- Delete: `src/features/goals/AddGoalModal.tsx`
- Delete: `src/features/goals/AddGoalModal.module.css`
- Delete: `src/data/skillTreeV1.ts`
- Delete: `src/data/skillTreeV2.ts`

- [ ] **Step 1: Delete the retired files**

```bash
git rm src/features/goals/GoalsPage.tsx \
       src/features/goals/GoalsPage.module.css \
       src/features/goals/GoalTab.tsx \
       src/features/goals/GoalTab.module.css \
       src/features/goals/AddGoalModal.tsx \
       src/features/goals/AddGoalModal.module.css \
       src/data/skillTreeV1.ts \
       src/data/skillTreeV2.ts
```

- [ ] **Step 2: Run full typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors. If any file was still importing from the deleted paths, the error will point you to the exact line to fix.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete retired goals components and old skillTree data files"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task(s) |
|---|---|
| 5 categories as icon buttons | Task 10 (SkillTreePage categoryRow) |
| Clicking category branches downward with connecting lines | Task 8 (TreeView + CSS pseudo-elements) |
| Up to 3 levels of depth | Task 8 (recursive TreeView, depth prop) |
| Search bar | Task 10 (search input + filtering) |
| Active goals dashboard with badges | Task 7 (GoalsDashboard) |
| Detail panel: title, theory, video placeholder, drills | Task 9 (SkillDetailPanel) |
| "Set as Current Goal" button | Task 9 (SkillDetailPanel) |
| Goal appears in dashboard after setting | Task 7 + GoalsContext (existing) |
| Remove goal from dashboard | Task 7 (× button → removeGoal) |
| Goals connect to suggestion algorithm | Task 6 (GoalsContext seed fix) |
| Slide/pop animations | Tasks 8, 9, 10 (framer-motion) |
| Sidebar label = "Skill Tree" | Task 11 |
| Old files deleted | Task 12 |
| activities.ts retagged | Task 5 |

**Placeholder scan:** None found.

**Type consistency:** `TreeLeaf`, `TreeBranch`, `TreeNode` used consistently across all tasks. `CATEGORY_COLORS` and `CATEGORY_ICONS` imported from `skillTree.ts` in SkillTreePage. `GoalsDashboard` reads CSS classes from `SkillTreePage.module.css` — both created in the same task sequence (Task 7 before Task 10; the CSS module reference will resolve once Task 10 runs, typecheck still passes because CSS module types are inferred as `Record<string, string>`).
