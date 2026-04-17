import { useState } from "react";
import { ACTIVITIES } from "../../data/activities";
import { getSuggestedActivities } from "../../utils/suggestions";
import { useGoals } from "../../contexts/GoalsContext";
import { SKILL_TREE_V2 } from "../../data/skillTreeV2";
import type { Activity } from "../../types";
import styles from "./AddActivityModal.module.css";

type TabId = "suggested" | "all" | "category";

interface AddActivityModalProps {
  dayLabel: string;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

export function AddActivityModal({
  dayLabel,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const { goals } = useGoals();
  const [activeTab, setActiveTab] = useState<TabId>("suggested");

  const suggested = getSuggestedActivities(goals, ACTIVITIES, SKILL_TREE_V2);
  const hasSelections = goals.some((g) => g.selectedNodeIds.length > 0);

  const byCategory = ACTIVITIES.reduce<Record<string, Activity[]>>(
    (acc, act) => {
      const cat = act.goalTags?.[0]?.nodeLabel ?? "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(act);
      return acc;
    },
    {}
  );

  const handleAdd = (activity: Activity) => {
    onAdd(activity);
    onClose();
  };

  const renderActivityItem = (activity: Activity, showTag = false) => (
    <button
      key={activity.id}
      className={styles.activityItem}
      onClick={() => handleAdd(activity)}
    >
      <span
        className={styles.activityAccent}
        style={{ backgroundColor: activity.accent }}
      />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>{activity.title}</span>
        <span className={styles.activitySubtitle}>{activity.subtitle}</span>
      </div>
      {showTag && activity.goalTags && activity.goalTags.length > 0 && (
        <span className={styles.activityTagLabel}>
          {activity.goalTags.map((t) => t.nodeLabel).join(", ")}
        </span>
      )}
    </button>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            Add Activity — {dayLabel}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabBar}>
          {(["suggested", "all", "category"] as TabId[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab}${activeTab === tab ? ` ${styles.tabActive}` : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "suggested"
                ? "Suggested"
                : tab === "all"
                  ? "All Activities"
                  : "By Category"}
            </button>
          ))}
        </div>

        {activeTab === "suggested" && !hasSelections && (
          <p className={styles.noGoalsHint}>
            Select sub-skills on the Goals page to see suggestions here.
          </p>
        )}

        <div className={styles.activityList}>
          {activeTab === "suggested" && (
            <>
              {hasSelections && suggested.length === 0 ? (
                <p className={styles.empty}>No matching activities found.</p>
              ) : hasSelections ? (
                suggested.map((a) => renderActivityItem(a, true))
              ) : null}
            </>
          )}

          {activeTab === "all" &&
            ACTIVITIES.map((a) => renderActivityItem(a))}

          {activeTab === "category" &&
            Object.entries(byCategory).map(([cat, acts]) => (
              <div key={cat}>
                <div className={styles.categoryHeader}>{cat}</div>
                {acts.map((a) => renderActivityItem(a))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
