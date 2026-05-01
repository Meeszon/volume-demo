import { useState, useRef, useEffect } from "react";
import type { ActivityType } from "../../types";
import { ACTIVITY_TYPES, ACTIVITY_TYPE_CONFIG } from "../../data/activityTypeConfig";
import type { SummaryEntry } from "../../utils/weekSummary";
import { SettingsIcon } from "../../components/icons";
import styles from "./LoadSummaryBar.module.css";

interface LoadSummaryBarProps {
  summary: SummaryEntry[];
  targets: Record<ActivityType, number>;
  onSetTarget: (type: ActivityType, value: number) => void;
}

export function LoadSummaryBar({ summary, targets, onSetTarget }: LoadSummaryBarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const cogRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popoverOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        cogRef.current &&
        !cogRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  return (
    <div className={styles.bar}>
      <div className={styles.entries}>
        {summary.length === 0 ? (
          <span className={styles.emptyHint}>Set targets via the cog to track your weekly load.</span>
        ) : (
          summary.map((entry) => (
            <div key={entry.type} className={styles.entry}>
              <span className={styles.entryLabel} style={{ color: entry.colour }}>
                {ACTIVITY_TYPE_CONFIG[entry.type].summaryLabel}
              </span>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min((entry.count / entry.target) * 100, 100)}%`,
                    backgroundColor: entry.colour,
                  }}
                />
              </div>
              <span className={styles.entryCount}>
                {entry.count}/{entry.target}
              </span>
            </div>
          ))
        )}
      </div>

      <div className={styles.cogWrap}>
        <button
          ref={cogRef}
          className={styles.cogBtn}
          onClick={() => setPopoverOpen((v) => !v)}
          aria-label="Weekly targets settings"
        >
          <SettingsIcon />
        </button>

        {popoverOpen && (
          <div ref={popoverRef} className={styles.popover}>
            <div className={styles.popoverTitle}>Weekly Targets</div>
            {ACTIVITY_TYPES.map((type) => (
              <label key={type} className={styles.popoverRow}>
                <span className={styles.popoverLabel}>{ACTIVITY_TYPE_CONFIG[type].summaryLabel}</span>
                <input
                  className={styles.popoverInput}
                  type="number"
                  min={0}
                  max={99}
                  value={targets[type]}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0) onSetTarget(type, v);
                  }}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
