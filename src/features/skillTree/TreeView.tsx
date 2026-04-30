import { AnimatePresence, motion } from "framer-motion";
import { isLeaf, nodeMatchesSearch } from "../../utils/tree";
import type { TreeBranch, TreeNode } from "../../types";
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
            <li
              key={node.id}
              className={`${styles.item} ${depth > 0 ? styles.itemChild : ""}`}
            >
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
          <li
            key={node.id}
            className={`${styles.item} ${depth > 0 ? styles.itemChild : ""}`}
          >
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
                    nodes={(node as TreeBranch).children}
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
