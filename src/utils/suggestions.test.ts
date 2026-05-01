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
    type: "climbing",
    title: "Exact match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "leaf-a1", nodeLabel: "Leaf A1" }],
  },
  {
    id: "act-ancestor",
    type: "climbing",
    title: "Ancestor match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "branch-a", nodeLabel: "Branch A" }],
  },
  {
    id: "act-no-match",
    type: "climbing",
    title: "No match",
    subtitle: "",
    accent: "#fff",
    goalTags: [{ nodeId: "leaf-b1", nodeLabel: "Leaf B1" }],
  },
  {
    id: "act-no-tags",
    type: "climbing",
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
      type: "climbing",
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
