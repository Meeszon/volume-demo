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
