import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { DAYS, initialData } from "../../data/schedule";
import type { Activity, Columns } from "../../types";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "../../components/icons";
import { ActivityCard } from "./ActivityCard";
import { AddActivityModal } from "./AddActivityModal";
import styles from "./schedule.module.css";

export function SchedulePage() {
  const [columns, setColumns] = useState<Columns>(initialData);
  const [modalDayId, setModalDayId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const scrollDrag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const onWindowMouseUp = () => {
      if (!scrollDrag.current.active) return;
      scrollDrag.current.active = false;
      if (boardRef.current) {
        boardRef.current.style.cursor = "";
        boardRef.current.style.userSelect = "";
      }
    };
    window.addEventListener("mouseup", onWindowMouseUp);
    return () => window.removeEventListener("mouseup", onWindowMouseUp);
  }, []);

  const onBoardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".activity-card, button, [role='button']")) return;
    const board = boardRef.current;
    if (!board) return;
    scrollDrag.current = { active: true, startX: e.clientX, scrollLeft: board.scrollLeft };
    board.style.cursor = "grabbing";
    board.style.userSelect = "none";
  };

  const onBoardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollDrag.current.active || !boardRef.current) return;
    const dx = e.clientX - scrollDrag.current.startX;
    boardRef.current.scrollLeft = scrollDrag.current.scrollLeft - dx;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const newColumns = { ...columns };
    const sourceTasks = [...newColumns[sourceCol]];
    const destTasks = sourceCol === destCol ? sourceTasks : [...newColumns[destCol]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    newColumns[sourceCol] = sourceTasks;
    newColumns[destCol] = destTasks;
    setColumns(newColumns);
  };

  const handleAddActivity = (dayId: string, activity: Activity) => {
    setColumns((prev) => ({
      ...prev,
      [dayId]: [
        ...prev[dayId],
        { ...activity, id: `${activity.id}-${Date.now()}` },
      ],
    }));
  };

  const modalDay = modalDayId ? DAYS.find((d) => d.id === modalDayId) : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.weekPicker}>
          <button className={styles.weekPickerBtn}>
            <ChevronLeftIcon />
          </button>
          <div className={styles.weekPickerDivider} />
          <span className={styles.weekPickerLabel}>This week</span>
          <div className={styles.weekPickerDivider} />
          <button className={styles.weekPickerBtn}>
            <ChevronRightIcon />
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={styles.boardScroll}
          ref={boardRef}
          onMouseDown={onBoardMouseDown}
          onMouseMove={onBoardMouseMove}
        >
          <div className={styles.boardInner}>
            {DAYS.map((day) => (
              <div key={day.id} className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnDayName}>{day.id}</div>
                  <div className={styles.columnDate}>{day.date}</div>
                </div>
                <button className={styles.addActivityBtn} onClick={() => setModalDayId(day.id)}>
                  <PlusIcon />
                  <span className={styles.addActivityLabel}>Add Activity</span>
                </button>
                <Droppable droppableId={day.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${styles.cardList}${snapshot.isDraggingOver ? ` ${styles.cardListDragOver}` : ""}`}
                    >
                      {columns[day.id].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <ActivityCard task={task} provided={provided} snapshot={snapshot} />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
      {modalDay && (
        <AddActivityModal
          dayLabel={`${modalDay.id} ${modalDay.date}`}
          onClose={() => setModalDayId(null)}
          onAdd={(activity) => handleAddActivity(modalDay.id, activity)}
        />
      )}
    </div>
  );
}
