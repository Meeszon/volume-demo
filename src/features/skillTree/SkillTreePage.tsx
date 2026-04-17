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
    [searchQuery],
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
    (n) => n.id === activeCategoryId && !isLeaf(n),
  ) as TreeBranch | undefined;

  const selectedLeaf = useMemo((): TreeLeaf | null => {
    if (!selectedLeafId) return null;
    function findLeaf(nodes: typeof SKILL_TREE): TreeLeaf | null {
      for (const node of nodes) {
        if (node.id === selectedLeafId && isLeaf(node)) return node as TreeLeaf;
        if (!isLeaf(node)) {
          const found = findLeaf((node as TreeBranch).children);
          if (found) return found;
        }
      }
      return null;
    }
    return findLeaf(SKILL_TREE);
  }, [selectedLeafId]);

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
          ) : activeCategory ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                <TreeView
                  nodes={activeCategory.children}
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
