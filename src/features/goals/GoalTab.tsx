import { useState } from "react";
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import { isLeaf } from "../../utils/tree";
import { useGoals } from "../../contexts/GoalsContext";
import { ChevronExpandIcon } from "../../components/icons";
import type { Goal, TreeNode, TreeBranch } from "../../types";
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
        <span>{node.label}</span>
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
