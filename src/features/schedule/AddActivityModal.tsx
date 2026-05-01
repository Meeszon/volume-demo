import { useState, useMemo } from "react";
import { getTemplatesByCategory } from "../../data/activityTemplates";
import { getIntentOptions, type IntentOption } from "../../data/skillTree";
import { ACTIVITY_TYPES, ACTIVITY_TYPE_CONFIG } from "../../data/activityTypeConfig";
import type { ActivityType, ActivityCategory } from "../../types";
import styles from "./AddActivityModal.module.css";

interface AddActivityModalProps {
  dayLabel: string;
  onClose: () => void;
  onAdd: (type: ActivityType, title: string, focus?: string, durationMinutes?: number) => void;
}

export function AddActivityModal({
  dayLabel,
  onClose,
  onAdd,
}: AddActivityModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ActivityType | null>(null);
  const [customText, setCustomText] = useState("");
  const [selectedIntentId, setSelectedIntentId] = useState<string | null>(null);
  const [durationText, setDurationText] = useState("");

  const { intentOptions, groupedIntents } = useMemo(() => {
    const options = getIntentOptions();
    const grouped = new Map<string, IntentOption[]>();
    for (const opt of options) {
      const list = grouped.get(opt.categoryLabel) ?? [];
      list.push(opt);
      grouped.set(opt.categoryLabel, list);
    }
    return { intentOptions: options, groupedIntents: grouped };
  }, []);

  const handleBack = () => {
    setSelectedCategory(null);
    setCustomText("");
    setSelectedIntentId(null);
    setDurationText("");
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
      {ACTIVITY_TYPES.map((type) => (
        <button
          key={type}
          className={styles.categoryBtn}
          style={{ borderColor: ACTIVITY_TYPE_CONFIG[type].color }}
          onClick={() => setSelectedCategory(type)}
        >
          <span
            className={styles.categoryDot}
            style={{ backgroundColor: ACTIVITY_TYPE_CONFIG[type].color }}
          />
          {ACTIVITY_TYPE_CONFIG[type].pickerLabel}
        </button>
      ))}
    </div>
  );

  const renderTemplateList = (category: ActivityCategory, showCustomInput: boolean) => {
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
              style={{ backgroundColor: ACTIVITY_TYPE_CONFIG[category].color }}
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
        {showCustomInput && (
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
        )}
      </div>
    );
  };

  const handleClimbingSubmit = () => {
    if (!selectedIntentId) return;
    const duration = parseInt(durationText, 10);
    if (!(duration > 0)) return;
    const selected = intentOptions.find((o) => o.id === selectedIntentId);
    if (!selected) return;
    onAdd("climbing", selected.label, selected.id, duration);
    onClose();
  };

  const renderClimbing = () => (
    <div className={styles.climbingForm}>
      <div className={styles.intentSection}>
        <label className={styles.fieldLabel}>Intent</label>
        <div className={styles.intentList}>
          {Array.from(groupedIntents.entries()).map(([category, options]) => (
            <div key={category} className={styles.intentGroup}>
              <span className={styles.intentCategory}>{category}</span>
              <div className={styles.intentOptions}>
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    className={`${styles.intentOption}${selectedIntentId === opt.id ? ` ${styles.intentSelected}` : ""}`}
                    aria-pressed={selectedIntentId === opt.id}
                    onClick={() => setSelectedIntentId(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.durationSection}>
        <label className={styles.fieldLabel} htmlFor="climbing-duration">
          Duration (minutes)
        </label>
        <input
          id="climbing-duration"
          className={styles.durationInput}
          type="number"
          min="1"
          placeholder="e.g. 90"
          value={durationText}
          onChange={(e) => setDurationText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClimbingSubmit();
          }}
        />
      </div>
      <div className={styles.submitRow}>
        <button className={styles.submitBtn} onClick={handleClimbingSubmit}>
          Add Climbing Session
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    switch (selectedCategory) {
      case "conditioning":
      case "mobility":
        return renderTemplateList(selectedCategory, true);
      case "warmup":
        return renderTemplateList("warmup", false);
      case "climbing":
        return renderClimbing();
      default:
        return null;
    }
  };

  const stepLabel = selectedCategory
    ? ACTIVITY_TYPE_CONFIG[selectedCategory].pickerLabel
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
