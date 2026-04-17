import { motion } from "framer-motion";
import { useGoals } from "../../contexts/GoalsContext";
import type { TreeLeaf } from "../../types";
import styles from "./SkillDetailPanel.module.css";

interface SkillDetailPanelProps {
  leaf: TreeLeaf;
  categoryColor: string;
  onClose: () => void;
}

export function SkillDetailPanel({ leaf, categoryColor, onClose }: SkillDetailPanelProps) {
  const { goals, addGoal } = useGoals();
  const isGoal = goals.some((g) => g.areaId === leaf.id);
  const isFull = goals.length >= 3;

  const goalButtonLabel = isGoal
    ? "✓ Active Goal"
    : isFull
      ? "Goals Full (max 3)"
      : "Set as Current Goal";

  return (
    <motion.div
      className={styles.panel}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 24, opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ "--panel-color": categoryColor } as React.CSSProperties}
    >
      <div className={styles.panelHeader}>
        <h2 className={styles.title}>Mastering {leaf.label}</h2>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close detail panel">
          ×
        </button>
      </div>

      {leaf.description && <p className={styles.theory}>{leaf.description}</p>}

      <div className={styles.videoPlaceholder}>
        <span className={styles.videoIcon}>▶</span>
        <span className={styles.videoText}>Tutorial Video</span>
        <span className={styles.videoSub}>YouTube embed · coming soon</span>
      </div>

      <div className={styles.drillsSection}>
        <h3 className={styles.drillsHeading}>Training Drills</h3>
        <ul className={styles.drillsList}>
          {leaf.exercises.map((ex) => (
            <li key={ex.name} className={styles.drillItem}>
              <span className={styles.drillName}>{ex.name}</span>
              <span className={styles.drillDetail}>{ex.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panelFooter}>
        <button
          className={`${styles.goalBtn} ${isGoal ? styles.goalBtnActive : ""}`}
          disabled={isGoal || isFull}
          onClick={() => addGoal(leaf.id, leaf.label)}
        >
          {goalButtonLabel}
        </button>
      </div>
    </motion.div>
  );
}
