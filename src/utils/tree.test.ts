import { describe, it, expect } from "vitest";
import { isLeaf, getAncestorIds, getTopLevelAreas, nodeMatchesSearch, getAutoExpandIds } from "./tree";
import type { TreeNode, TreeLeaf, TreeBranch } from "../types";

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
