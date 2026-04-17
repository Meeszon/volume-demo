import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import { getTopLevelAreas } from "../../utils/tree";
import { useGoals } from "../../contexts/GoalsContext";
import styles from "./AddGoalModal.module.css";

interface AddGoalModalProps {
  onClose: () => void;
  onAdded: (goalId: string) => void;
}

export function AddGoalModal({ onClose, onAdded }: AddGoalModalProps) {
  const { goals, addGoal } = useGoals();
  const areas = getTopLevelAreas(SKILL_TREE_V2);
  const activeAreaIds = new Set(goals.map((g) => g.areaId));

  const handleSelect = (areaId: string, areaLabel: string) => {
    if (activeAreaIds.has(areaId)) return;
    addGoal(areaId, areaLabel);
    onAdded(areaId);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Add a goal</span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <p className={styles.modalSub}>
          Choose a focus area. You can have up to 3 active goals.
        </p>
        <div className={styles.areaGrid}>
          {areas.map((area) => {
            const active = activeAreaIds.has(area.id);
            return (
              <button
                key={area.id}
                className={`${styles.areaCard}${active ? ` ${styles.areaCardActive}` : ""}`}
                onClick={() => handleSelect(area.id, area.label)}
                disabled={active}
              >
                {area.label}
                {active && (
                  <span className={styles.areaActiveBadge}>Active</span>
                )}
              </button>
            );
          })}
        </div>
        <div className={styles.modalFooter}>{goals.length}/3 goals active</div>
      </div>
    </div>
  );
}
