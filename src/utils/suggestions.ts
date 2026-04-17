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
