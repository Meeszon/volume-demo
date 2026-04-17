import type { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import type { Activity } from "../../types";
import { ImagePlaceholderIcon, CheckCircleIcon } from "../../components/icons";
import styles from "./schedule.module.css";

interface ActivityCardProps {
  task: Activity;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

export function ActivityCard({ task, provided, snapshot }: ActivityCardProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`${styles.activityCard}${snapshot.isDragging ? ` ${styles.dragging}` : ""}`}
      style={provided.draggableProps.style}
    >
      <div className={styles.cardImage}>
        <ImagePlaceholderIcon />
      </div>
      <div className={styles.cardSeparator} style={{ backgroundColor: task.accent }} />
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>{task.title}</span>
        <span className={styles.cardSubtitle}>{task.subtitle}</span>
        {task.grade && <span className={styles.cardGrade}>{task.grade}</span>}
      </div>
      <div className={styles.cardMenu}>
        <CheckCircleIcon />
      </div>
    </div>
  );
}
