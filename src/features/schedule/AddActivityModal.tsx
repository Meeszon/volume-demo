import { useState } from "react";
import { getTemplatesByCategory } from "../../data/activityTemplates";
import type { ActivityType, ActivityCategory } from "../../types";
import styles from "./AddActivityModal.module.css";

interface AddActivityModalProps {
  dayLabel: string;
  onClose: () => void;
  onAdd: (type: ActivityType, title: string) => void;
}

const CATEGORIES: Array<{ type: ActivityType; label: string }> = [
  { type: "climbing", label: "Climbing Session" },
  { type: "conditioning", label: "Conditioning" },
  { type: "mobility", label: "Mobility" },
  { type: "warmup", label: "Warm Up" },
];

const TYPE_COLORS: Record<ActivityType, string> = {
  climbing: "#DA2128",
  conditioning: "#FF8B00",
  mobility: "#8B5CF6",
  warmup: "#5CBBAE",
};

export function AddActivityModal({
  dayLabel,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ActivityType | null>(null);
  const [customText, setCustomText] = useState("");

  const handleSelectCategory = (type: ActivityType) => {
    setSelectedCategory(type);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setCustomText("");
  };

  const handleAdd = (type: ActivityType, title: string) => {
    onAdd(type, title);
    onClose();
  };

  const handleCustomSubmit = () => {
    const trimmed = customText.trim();
    if (!trimmed || !selectedCategory) return;
    handleAdd(selectedCategory, trimmed);
  };

  const renderCategoryPicker = () => (
    <div className={styles.categoryGrid}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.type}
          className={styles.categoryBtn}
          style={{ borderColor: TYPE_COLORS[cat.type] }}
          onClick={() => handleSelectCategory(cat.type)}
        >
          <span
            className={styles.categoryDot}
            style={{ backgroundColor: TYPE_COLORS[cat.type] }}
          />
          {cat.label}
        </button>
      ))}
    </div>
  );

  const renderTemplateList = (category: ActivityCategory) => {
    const templates = getTemplatesByCategory(category);
    return (
      <div className={styles.activityList}>
        {templates.map((t) => (
          <button
            key={t.name}
            className={styles.templateItem}
            onClick={() => handleAdd(category, t.name)}
          >
            <span
              className={styles.activityAccent}
              style={{ backgroundColor: TYPE_COLORS[category] }}
            />
            <div className={styles.templateText}>
              <span className={styles.activityTitle}>{t.name}</span>
              {t.exercises && (
                <span className={styles.exerciseList}>
                  {t.exercises.join(", ")}
                </span>
              )}
            </div>
          </button>
        ))}
        <div className={styles.customRow}>
          <input
            className={styles.customInput}
            type="text"
            placeholder="Custom activity name"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCustomSubmit();
            }}
          />
          <button className={styles.customAddBtn} onClick={handleCustomSubmit}>
            Add
          </button>
        </div>
      </div>
    );
  };

  const renderWarmup = () => {
    const templates = getTemplatesByCategory("warmup");
    return (
      <div className={styles.activityList}>
        {templates.map((t) => (
          <button
            key={t.name}
            className={styles.templateItem}
            onClick={() => handleAdd("warmup", t.name)}
          >
            <span
              className={styles.activityAccent}
              style={{ backgroundColor: TYPE_COLORS.warmup }}
            />
            <div className={styles.templateText}>
              <span className={styles.activityTitle}>{t.name}</span>
              {t.exercises && (
                <span className={styles.exerciseList}>
                  {t.exercises.join(", ")}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderClimbing = () => (
    <div className={styles.placeholder}>
      <p className={styles.placeholderText}>
        Climbing session form coming soon.
      </p>
    </div>
  );

  const renderStep2 = () => {
    switch (selectedCategory) {
      case "conditioning":
      case "mobility":
        return renderTemplateList(selectedCategory);
      case "warmup":
        return renderWarmup();
      case "climbing":
        return renderClimbing();
      default:
        return null;
    }
  };

  const stepLabel = selectedCategory
    ? CATEGORIES.find((c) => c.type === selectedCategory)?.label
    : null;

  return (
    <div className={styles.overlay} data-testid="modal-overlay" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {selectedCategory ? (
            <button className={styles.backBtn} onClick={handleBack}>
              ← Back
            </button>
          ) : null}
          <span className={styles.modalTitle}>
            {selectedCategory
              ? `${stepLabel} — ${dayLabel}`
              : `Add Activity — ${dayLabel}`}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {selectedCategory ? renderStep2() : renderCategoryPicker()}
      </div>
    </div>
  );
}
