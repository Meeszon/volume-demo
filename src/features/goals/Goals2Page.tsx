import { useState } from "react";
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import type { TreeNode, TreeBranch, TreeLeaf, SelectedSkillV2 } from "../../types";
import { useSetToggle } from "../../hooks/useSetToggle";
import { ChevronExpandIcon, ChevronSmallIcon } from "../../components/icons";
import styles from "./Goals2Page.module.css";

/* ── Helpers ── */

function isLeaf(node: TreeNode): node is TreeLeaf {
  return !("children" in node);
}

function collectSelected(
  nodes: TreeNode[],
  selectedIds: Set<string>,
  path: string[] = []
): SelectedSkillV2[] {
  const results: SelectedSkillV2[] = [];
  for (const node of nodes) {
    const currentPath = [...path, node.label];
    if (isLeaf(node)) {
      if (selectedIds.has(node.id)) {
        results.push({ ...node, ancestorPath: path });
      }
    } else {
      results.push(...collectSelected((node as TreeBranch).children, selectedIds, currentPath));
    }
  }
  return results;
}

/* ── Tree node component ── */

interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  selectedSkills: Set<string>;
  expandedNodes: Set<string>;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
}

function TreeNodeComponent({
  node,
  depth,
  selectedSkills,
  expandedNodes,
  onToggleExpand,
  onToggleSelect,
}: TreeNodeProps) {
  const leaf = isLeaf(node);
  const expanded = expandedNodes.has(node.id);
  const selected = selectedSkills.has(node.id);

  const rowClass = [
    styles.treeRow,
    leaf ? null : styles.treeBranch,
    leaf && selected ? styles.treeLeafSelected : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${styles.treeNode}${depth === 0 ? ` ${styles.treeRootNode}` : ""}`}>
      <div
        className={rowClass}
        style={{ paddingLeft: depth === 0 ? 20 : 14 }}
        onClick={() => (leaf ? onToggleSelect(node.id) : onToggleExpand(node.id))}
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
                selectedSkills={selectedSkills}
                expandedNodes={expandedNodes}
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

/* ── Goal card ── */

interface GoalCardProps {
  skill: SelectedSkillV2;
  onRemove: (id: string) => void;
}

function GoalCard({ skill, onRemove }: GoalCardProps) {
  const [showExercises, setShowExercises] = useState(false);

  return (
    <div className={styles.goalCard}>
      <div className={styles.goalCardHeader}>
        <div className={styles.goalCardMeta}>
          {skill.ancestorPath.length > 0 && (
            <span className={styles.goalPath}>{skill.ancestorPath.join(" → ")}</span>
          )}
          <span className={styles.goalName}>{skill.label}</span>
        </div>
        <button className={styles.removeBtn} onClick={() => onRemove(skill.id)}>
          ×
        </button>
      </div>
      <button className={styles.exercisesToggle} onClick={() => setShowExercises((v) => !v)}>
        {showExercises ? "Hide" : "Show"} suggested exercises
        <ChevronSmallIcon open={showExercises} />
      </button>
      {showExercises && (
        <div className={styles.exercisesList}>
          {skill.exercises.map((ex) => (
            <div key={ex.name} className={styles.exerciseItem}>
              <span className={styles.exerciseName}>{ex.name}</span>
              <span className={styles.exerciseDetail}>{ex.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ── */

export function Goals2Page() {
  const selected = useSetToggle();
  const expanded = useSetToggle(SKILL_TREE_V2.map((r) => r.id));

  const selectedSkillObjects = collectSelected(SKILL_TREE_V2, selected.set);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Goals 2</span>
      </header>

      <div className={styles.layout}>
        <div className={styles.treePanel}>
          {SKILL_TREE_V2.map((root) => (
            <TreeNodeComponent
              key={root.id}
              node={root}
              depth={0}
              selectedSkills={selected.set}
              expandedNodes={expanded.set}
              onToggleExpand={expanded.toggle}
              onToggleSelect={selected.toggle}
            />
          ))}
        </div>

        <div className={styles.detailPanel}>
          {selectedSkillObjects.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="8" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
                <circle cx="12" cy="4.5" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
                <circle cx="12" cy="11.5" r="1.5" stroke="#dcdcdc" strokeWidth="1.2" />
                <path d="M5.5 8L10.5 4.5" stroke="#dcdcdc" strokeWidth="1.2" strokeLinecap="round" />
                <path
                  d="M5.5 8L10.5 11.5"
                  stroke="#dcdcdc"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Pick a skill to focus on</span>
              <span className={styles.emptySub}>
                Drill into the tree and select a specific technique
              </span>
            </div>
          ) : (
            <div className={styles.detailInner}>
              <div className={styles.myGoalsTitle}>My Goals</div>
              <div className={styles.myGoalsSub}>
                {selectedSkillObjects.length > 4
                  ? "Consider narrowing — depth beats breadth"
                  : "Your current technique focus"}
              </div>
              <div className={styles.cardList}>
                {selectedSkillObjects.map((skill) => (
                  <GoalCard key={skill.id} skill={skill} onRemove={selected.remove} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
