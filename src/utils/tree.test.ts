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
