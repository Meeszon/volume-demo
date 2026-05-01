import { useState } from "react";
import { getTemplatesByCategory } from "../../data/activityTemplates";
import { ACTIVITY_TYPES, ACTIVITY_TYPE_CONFIG } from "../../data/activityTypeConfig";
import { FOCUS_OPTIONS } from "../../types";
import type {
  ActivityType,
  ActivityCategory,
  ActivityTemplate,
  ActivityDetails,
  FocusOption,
} from "../../types";
import styles from "./AddActivityModal.module.css";

interface AddActivityModalProps {
  dayLabel: string;
  onClose: () => void;
  onAdd: (
    type: ActivityType,
    title: string,
    focus?: FocusOption,
    durationMinutes?: number,
    details?: ActivityDetails,
  ) => void;
}

type Screen = "category" | "climbing" | "tabs" | "edit";
type Tab = "exercises" | "blocks";
type ExerciseEdit = { sets: string; value: string; rest: string };

const DURATION_PRESETS = [60, 90, 120, 150] as const;

export function AddActivityModal({ dayLabel, onClose, onAdd }: AddActivityModalProps) {
  const [screen, setScreen] = useState<Screen>("category");
  const [activeCategory, setActiveCategory] = useState<ActivityCategory | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("exercises");
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null);
  const [editExercises, setEditExercises] = useState<ExerciseEdit[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(90);
  const [selectedFocus, setSelectedFocus] = useState<FocusOption | null>(null);

  const handleSelectCategory = (type: ActivityType) => {
    if (type === "climbing") {
      setSelectedDuration(90);
      setSelectedFocus(null);
      setScreen("climbing");
    } else {
      setActiveCategory(type as ActivityCategory);
      setActiveTab("exercises");
      setScreen("tabs");
    }
  };

  const handleBack = () => {
    if (screen === "edit") {
      setScreen("tabs");
      setSelectedTemplate(null);
    } else {
      setScreen("category");
      setActiveCategory(null);
      setSelectedDuration(90);
      setSelectedFocus(null);
      setSelectedTemplate(null);
    }
  };

  const handleSelectTemplate = (template: ActivityTemplate) => {
    setSelectedTemplate(template);
    if (template.kind === "exercise") {
      setEditExercises([{
        sets: String(template.defaultSets),
        value: String(template.defaultValue),
        rest: String(template.defaultRest),
      }]);
    } else {
      setEditExercises(
        template.exercises.map((e) => ({
          sets: String(e.defaultSets),
          value: String(e.defaultValue),
          rest: String(e.defaultRest),
        })),
      );
    }
    setScreen("edit");
  };

  const handleClimbingSubmit = () => {
    onAdd("climbing", "Climbing Session", selectedFocus ?? undefined, selectedDuration);
    onClose();
  };

  const handleEditConfirm = () => {
    if (!selectedTemplate || !activeCategory) return;

    const parseVal = (s: string) => parseInt(s, 10) || 0;

    let details: ActivityDetails;
    if (selectedTemplate.kind === "exercise") {
      const [ex] = editExercises;
      details = {
        kind: "exercise",
        sets: parseVal(ex.sets),
        value: parseVal(ex.value),
        unit: selectedTemplate.unit,
        rest: parseVal(ex.rest),
      };
    } else {
      details = {
        kind: "block",
        exercises: selectedTemplate.exercises.map((e, i) => ({
          name: e.name,
          sets: parseVal(editExercises[i].sets),
          value: parseVal(editExercises[i].value),
          unit: e.unit,
          rest: parseVal(editExercises[i].rest),
        })),
      };
    }

    onAdd(activeCategory, selectedTemplate.name, undefined, undefined, details);
    onClose();
  };

  const updateExercise = (i: number, field: keyof ExerciseEdit, raw: string) => {
    setEditExercises((prev) =>
      prev.map((ex, idx) => (idx === i ? { ...ex, [field]: raw } : ex)),
    );
  };

  const renderCategoryPicker = () => (
    <div className={styles.categoryGrid}>
      {ACTIVITY_TYPES.map((type) => (
        <button
          key={type}
          className={styles.categoryBtn}
          style={{ borderColor: ACTIVITY_TYPE_CONFIG[type].color }}
          onClick={() => handleSelectCategory(type)}
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

  const renderClimbing = () => (
    <div className={styles.climbingForm}>
      <div className={styles.formSection}>
        <label className={styles.fieldLabel}>Duration</label>
        <div className={styles.presetRow}>
          {DURATION_PRESETS.map((d) => (
            <button
              key={d}
              className={`${styles.presetBtn}${selectedDuration === d ? ` ${styles.presetSelected}` : ""}`}
              aria-pressed={selectedDuration === d}
              onClick={() => setSelectedDuration(d)}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.fieldLabel}>Focus (optional)</label>
        <div className={styles.focusRow}>
          {FOCUS_OPTIONS.map((f) => (
            <button
              key={f}
              className={`${styles.focusBtn}${selectedFocus === f ? ` ${styles.focusSelected}` : ""}`}
              aria-pressed={selectedFocus === f}
              onClick={() => setSelectedFocus((prev) => (prev === f ? null : f))}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.submitRow}>
        <button className={styles.submitBtn} onClick={handleClimbingSubmit}>
          Add Climbing Session
        </button>
      </div>
    </div>
  );

  const renderTabs = () => {
    if (!activeCategory) return null;
    const templates = getTemplatesByCategory(activeCategory);
    const color = ACTIVITY_TYPE_CONFIG[activeCategory].color;
    const list = activeTab === "exercises"
      ? templates.filter((t) => t.kind === "exercise")
      : templates.filter((t) => t.kind === "block");

    return (
      <div className={styles.tabsContainer}>
        <div className={styles.tabBar} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "exercises"}
            className={`${styles.tab}${activeTab === "exercises" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setActiveTab("exercises")}
          >
            Exercises
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "blocks"}
            className={`${styles.tab}${activeTab === "blocks" ? ` ${styles.tabActive}` : ""}`}
            onClick={() => setActiveTab("blocks")}
          >
            Blocks
          </button>
        </div>

        <div className={styles.activityList}>
          {list.map((t) => (
            <button
              key={t.name}
              className={styles.templateItem}
              onClick={() => handleSelectTemplate(t)}
            >
              <span
                className={styles.activityAccent}
                style={{ backgroundColor: color }}
              />
              <div className={styles.templateText}>
                <span className={styles.activityTitle}>{t.name}</span>
                {t.kind === "block" && (
                  <span className={styles.exerciseList}>
                    {t.exercises.map((e) => e.name).join(", ")}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderEdit = () => {
    if (!selectedTemplate || !activeCategory) return null;

    const exerciseNames =
      selectedTemplate.kind === "exercise"
        ? [selectedTemplate.name]
        : selectedTemplate.exercises.map((e) => e.name);
    const exerciseUnits =
      selectedTemplate.kind === "exercise"
        ? [selectedTemplate.unit]
        : selectedTemplate.exercises.map((e) => e.unit);

    return (
      <div className={styles.editScreen}>
        {selectedTemplate.kind === "block" && (
          <div className={styles.editBlockName}>{selectedTemplate.name}</div>
        )}
        <div className={styles.activityList}>
          {exerciseNames.map((name, i) => {
            const unit = exerciseUnits[i];
            const valueLabelText =
              unit === "reps" ? `Reps for ${name}` : `Seconds for ${name}`;
            return (
              <div
                key={name}
                className={styles.editExerciseRow}
                data-testid={`exercise-row-${name}`}
              >
                <span className={styles.editExerciseName}>{name}</span>
                <div className={styles.editFields}>
                  <div className={styles.editField}>
                    <span className={styles.editFieldLabel}>Sets</span>
                    <input
                      aria-label={`Sets for ${name}`}
                      type="number"
                      min="1"
                      className={styles.editInput}
                      value={editExercises[i]?.sets ?? ""}
                      onChange={(e) => updateExercise(i, "sets", e.target.value)}
                    />
                  </div>
                  <div className={styles.editField}>
                    <span className={styles.editFieldLabel}>
                      {unit === "reps" ? "Reps" : "Seconds"}
                    </span>
                    <input
                      aria-label={valueLabelText}
                      type="number"
                      min="1"
                      className={styles.editInput}
                      value={editExercises[i]?.value ?? ""}
                      onChange={(e) => updateExercise(i, "value", e.target.value)}
                    />
                    <span className={styles.unitLabel}>{unit}</span>
                  </div>
                  <div className={styles.editField}>
                    <span className={styles.editFieldLabel}>Rest (s)</span>
                    <input
                      aria-label={`Rest for ${name}`}
                      type="number"
                      min="0"
                      className={styles.editInput}
                      value={editExercises[i]?.rest ?? ""}
                      onChange={(e) => updateExercise(i, "rest", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.submitRow}>
          <button className={styles.submitBtn} onClick={handleEditConfirm}>
            Add Activity
          </button>
        </div>
      </div>
    );
  };

  const stepLabel =
    activeCategory
      ? ACTIVITY_TYPE_CONFIG[activeCategory].pickerLabel
      : screen === "climbing"
      ? ACTIVITY_TYPE_CONFIG.climbing.pickerLabel
      : null;

  return (
    <div className={styles.overlay} data-testid="modal-overlay" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {screen !== "category" && (
            <button className={styles.backBtn} onClick={handleBack}>
              ← Back
            </button>
          )}
          <span className={styles.modalTitle}>
            {stepLabel
              ? `${stepLabel} — ${dayLabel}`
              : `Add Activity — ${dayLabel}`}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {screen === "category" && renderCategoryPicker()}
        {screen === "climbing" && renderClimbing()}
        {screen === "tabs" && renderTabs()}
        {screen === "edit" && renderEdit()}
      </div>
    </div>
  );
}
