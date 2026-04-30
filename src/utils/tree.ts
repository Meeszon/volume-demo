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
