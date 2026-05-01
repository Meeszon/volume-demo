import { useState } from "react";
import { motion } from "framer-motion";
import type { Activity } from "../../types";
import type { LogData } from "../../hooks/useActivityLog";
import { ACTIVITY_TYPE_CONFIG } from "../../data/activityTypeConfig";
import { XIcon, TrashIcon } from "../../components/icons";
import styles from "./ActivityDetailPanel.module.css";

interface ActivityDetailPanelProps {
  activity: Activity;
  isLogged: boolean;
  logData: LogData | null;
  onClose: () => void;
  onDelete: (activityId: string) => void;
  onSaveLog: (activityId: string, data: LogData) => void;
}

type PanelMode = "editable" | "readonly";

function initForm(logData: LogData | null): Record<string, string> {
  if (!logData) return {};
  return Object.fromEntries(
    Object.entries(logData).map(([k, v]) => [k, String(v ?? "")])
  );
}

export function ActivityDetailPanel({
  activity,
  isLogged,
  logData,
  onClose,
  onDelete,
  onSaveLog,
}: ActivityDetailPanelProps) {
  const [mode, setMode] = useState<PanelMode>(isLogged ? "readonly" : "editable");
  const [formData, setFormData] = useState<Record<string, string>>(() => initForm(logData));
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const setField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const isReadOnly = mode === "readonly";

  function handleLog() {
    onSaveLog(activity.id, formData);
    setMode("readonly");
  }

  function handleDelete() {
    onDelete(activity.id);
    onClose();
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <motion.div
        className={styles.panel}
        initial={{ x: 380 }}
        animate={{ x: 0 }}
        exit={{ x: 380 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <div className={styles.panelAccent} style={{ backgroundColor: activity.accent }} />
            <div>
              <div className={styles.panelTitle}>{activity.title}</div>
              <div className={styles.panelType}>{ACTIVITY_TYPE_CONFIG[activity.type].summaryLabel}</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            <XIcon />
          </button>
        </div>

        <div className={styles.panelBody}>
          {activity.type === "climbing" && (
            <ClimbingForm
              intentNodeId={activity.intentNodeId ?? null}
              formData={formData}
              setField={setField}
              readOnly={isReadOnly}
            />
          )}
          {activity.type === "conditioning" && (
            <ConditioningForm
              formData={formData}
              setField={setField}
              readOnly={isReadOnly}
            />
          )}
          {activity.type === "mobility" && (
            <MobilityForm
              formData={formData}
              setField={setField}
              readOnly={isReadOnly}
            />
          )}
          {activity.type === "warmup" && (
            <WarmupForm
              formData={formData}
              setField={setField}
              readOnly={isReadOnly}
            />
          )}
        </div>

        <div className={styles.panelFooter}>
          <div className={styles.primaryAction}>
            {isReadOnly ? (
              <button className={styles.editBtn} onClick={() => setMode("editable")}>
                Edit
              </button>
            ) : (
              <button className={styles.logBtn} onClick={handleLog}>
                Log Session
              </button>
            )}
          </div>

          <div className={styles.deleteAction}>
            {confirmingDelete ? (
              <>
                <button className={styles.deleteConfirmBtn} onClick={handleDelete}>
                  Delete
                </button>
                <button
                  className={styles.deleteCancelBtn}
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className={styles.deleteBtn}
                onClick={() => setConfirmingDelete(true)}
              >
                <TrashIcon />
                Delete activity
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Per-type forms ── */

interface FormProps {
  formData: Record<string, string>;
  setField: (key: string, value: string) => void;
  readOnly: boolean;
}

function ClimbingForm({
  intentNodeId,
  formData,
  setField,
  readOnly,
}: FormProps & { intentNodeId: string | null }) {
  const intensities = ["Easy", "Moderate", "Hard"] as const;

  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>Perceived Intensity</div>
        <div className={styles.intensityRow}>
          {intensities.map((opt) => (
            <button
              key={opt}
              className={`${styles.intensityBtn}${
                formData.intensity === opt.toLowerCase() ? ` ${styles.intensityBtnActive}` : ""
              }`}
              onClick={() => !readOnly && setField("intensity", opt.toLowerCase())}
              disabled={readOnly}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {intentNodeId && (
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Intent</div>
          <div className={styles.intentDisplay}>{intentNodeId}</div>
        </div>
      )}

      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>Notes</div>
        <textarea
          className={styles.textarea}
          value={formData.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "" : "How did it go?"}
          rows={4}
        />
      </div>
    </div>
  );
}

function ConditioningForm({ formData, setField, readOnly }: FormProps) {
  return (
    <div className={styles.form}>
      <div className={styles.numericRow}>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Sets</div>
          <input
            className={styles.numberInput}
            type="number"
            min={0}
            value={formData.sets ?? ""}
            onChange={(e) => setField("sets", e.target.value)}
            readOnly={readOnly}
            placeholder="0"
          />
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Reps</div>
          <input
            className={styles.numberInput}
            type="number"
            min={0}
            value={formData.reps ?? ""}
            onChange={(e) => setField("reps", e.target.value)}
            readOnly={readOnly}
            placeholder="0"
          />
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Weight</div>
          <div className={styles.inputWithUnit}>
            <input
              className={`${styles.numberInput} ${styles.weightInput}`}
              type="number"
              min={0}
              value={formData.weight ?? ""}
              onChange={(e) => setField("weight", e.target.value)}
              readOnly={readOnly}
              placeholder="0"
            />
            <span className={styles.unitLabel}>kg</span>
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>Notes</div>
        <textarea
          className={styles.textarea}
          value={formData.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "" : "Any observations?"}
          rows={4}
        />
      </div>
    </div>
  );
}

function MobilityForm({ formData, setField, readOnly }: FormProps) {
  return (
    <div className={styles.form}>
      <div className={styles.numericRow}>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Sets</div>
          <input
            className={styles.numberInput}
            type="number"
            min={0}
            value={formData.sets ?? ""}
            onChange={(e) => setField("sets", e.target.value)}
            readOnly={readOnly}
            placeholder="0"
          />
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Duration / set</div>
          <div className={styles.inputWithUnit}>
            <input
              className={`${styles.numberInput} ${styles.durationInput}`}
              type="number"
              min={0}
              value={formData.duration ?? ""}
              onChange={(e) => setField("duration", e.target.value)}
              readOnly={readOnly}
              placeholder="0"
            />
            <span className={styles.unitLabel}>s</span>
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>Notes</div>
        <textarea
          className={styles.textarea}
          value={formData.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "" : "Any observations?"}
          rows={4}
        />
      </div>
    </div>
  );
}

function WarmupForm({ formData, setField, readOnly }: FormProps) {
  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>Notes</div>
        <textarea
          className={styles.textarea}
          value={formData.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          readOnly={readOnly}
          placeholder={readOnly ? "" : "Anything to note?"}
          rows={5}
        />
      </div>
    </div>
  );
}
