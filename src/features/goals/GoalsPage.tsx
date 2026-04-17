import { useState } from "react";
import { useGoals } from "../../contexts/GoalsContext";
import { GoalTab } from "./GoalTab";
import { AddGoalModal } from "./AddGoalModal";
import styles from "./GoalsPage.module.css";

export function GoalsPage() {
  const { goals, removeGoal, setPrimary } = useGoals();
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeId =
    activeGoalId && goals.some((g) => g.id === activeGoalId)
      ? activeGoalId
      : (goals[0]?.id ?? null);

  const activeGoal = goals.find((g) => g.id === activeId) ?? null;

  const handleGoalAdded = (goalId: string) => {
    setActiveGoalId(goalId);
    setShowAddModal(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Goals</span>
      </header>

      <div className={styles.tabBar}>
        {goals.map((goal) => (
          <button
            key={goal.id}
            className={`${styles.tab}${goal.id === activeId ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setActiveGoalId(goal.id)}
          >
            <span
              className={styles.tabStar}
              title={goal.isPrimary ? "Primary goal" : "Set as primary"}
              onClick={(e) => {
                e.stopPropagation();
                setPrimary(goal.id);
              }}
            >
              {goal.isPrimary ? "★" : "☆"}
            </span>
            {goal.areaLabel}
            <span
              className={styles.tabRemove}
              onClick={(e) => {
                e.stopPropagation();
                removeGoal(goal.id);
              }}
            >
              ×
            </span>
          </button>
        ))}
        {goals.length < 3 && (
          <button
            className={`${styles.tab} ${styles.tabAdd}`}
            onClick={() => setShowAddModal(true)}
          >
            + Add goal
          </button>
        )}
      </div>

      <div className={styles.tabContent}>
        {activeGoal ? (
          <GoalTab goal={activeGoal} />
        ) : (
          <div className={styles.emptyState}>
            <span>No goals yet</span>
            <span className={styles.emptySub}>
              Add a goal to start planning your training
            </span>
            <button
              className={styles.emptyAddBtn}
              onClick={() => setShowAddModal(true)}
            >
              + Add your first goal
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleGoalAdded}
        />
      )}
    </div>
  );
}
