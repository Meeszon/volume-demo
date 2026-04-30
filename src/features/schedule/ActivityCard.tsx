import { useState } from "react";
import type { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import type { Activity } from "../../types";
import { CheckCircleIcon, TrashIcon } from "../../components/icons";
import styles from "./schedule.module.css";

interface ActivityCardProps {
  task: Activity;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  dayId: string;
  onDelete: (dayId: string, activityId: string) => void;
}

export function ActivityCard({ task, provided, snapshot, dayId, onDelete }: ActivityCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`${styles.activityCard}${snapshot.isDragging ? ` ${styles.dragging}` : ""}`}
      style={provided.draggableProps.style}
    >
      <div className={styles.cardSeparator} style={{ backgroundColor: task.accent }} />
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>{task.title}</span>
        <span className={styles.cardSubtitle}>{task.subtitle}</span>
        {task.grade && <span className={styles.cardGrade}>{task.grade}</span>}
      </div>
      <div className={styles.cardMenu}>
        {confirming ? (
          <div className={styles.confirmDelete}>
            <button
              className={styles.confirmBtn}
              aria-label="Confirm delete"
              onClick={() => onDelete(dayId, task.id)}
            >
              Delete
            </button>
            <button
              className={styles.cancelBtn}
              aria-label="Cancel delete"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className={styles.deleteBtn}
            aria-label="Delete activity"
            onClick={() => setConfirming(true)}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
}
