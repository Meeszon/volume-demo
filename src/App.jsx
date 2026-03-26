import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

const DAYS = [
  { id: "Monday", date: "24 Mar" },
  { id: "Tuesday", date: "25 Mar" },
  { id: "Wednesday", date: "26 Mar" },
  { id: "Thursday", date: "27 Mar" },
  { id: "Friday", date: "28 Mar" },
  { id: "Saturday", date: "29 Mar" },
  { id: "Sunday", date: "30 Mar" },
];

const initialData = {
  Monday: [],
  Tuesday: [
    {
      id: "1",
      title: "Weighted Pull Ups",
      subtitle: "4 Reps x 4 Sets",
      grade: "",
      accent: "#FF8B00",
    },
    {
      id: "2",
      title: "Lateral Raises",
      subtitle: "10 Reps x 3 Sets",
      grade: "",
      accent: "#FF8B00",
    },
  ],
  Wednesday: [],
  Thursday: [
    {
      id: "3",
      title: "General Warm Up",
      subtitle: "Cossack Squat, Leg Swings, Press Ups..",
      grade: "",
      accent: "#5CBBAE",
    },
    {
      id: "4",
      title: "Strength Intervals",
      subtitle: "5 Problems x 3 Sets",
      grade: "6C - 7A",
      accent: "#DA2128",
    },
  ],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 3v10M3 8h10"
        stroke="#9d9c99"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#787878"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c8c7c4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function ActivityCard({ task, provided, snapshot }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`activity-card${snapshot.isDragging ? " dragging" : ""}`}
      style={provided.draggableProps.style}
    >
      <div className="card-image">
        <ImagePlaceholderIcon />
      </div>
      <div className="card-separator" style={{ backgroundColor: task.accent }} />
      <div className="card-text">
        <span className="card-title">{task.title}</span>
        <span className="card-subtitle">{task.subtitle}</span>
        {task.grade && <span className="card-grade">{task.grade}</span>}
      </div>
      <div className="card-menu">
        <CheckCircleIcon />
      </div>
    </div>
  );
}

export default function App() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const newColumns = { ...columns };
    const sourceTasks = [...newColumns[sourceCol]];
    const destTasks =
      sourceCol === destCol ? sourceTasks : [...newColumns[destCol]];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    newColumns[sourceCol] = sourceTasks;
    newColumns[destCol] = destTasks;
    setColumns(newColumns);
  };

  return (
    <div className="board-outer">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-scroll">
          <div className="board-inner">
            {DAYS.map((day) => (
              <div key={day.id} className="kanban-column">
                <div className="column-header">
                  <div className="column-day-name">{day.id}</div>
                  <div className="column-date">{day.date}</div>
                </div>
                <button className="add-activity-btn">
                  <PlusIcon />
                  <span className="add-activity-label">Add Activity</span>
                </button>
                <Droppable droppableId={day.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`card-list${snapshot.isDraggingOver ? " drag-over" : ""}`}
                    >
                      {columns[day.id].map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ActivityCard
                              task={task}
                              provided={provided}
                              snapshot={snapshot}
                            />
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
    </div>
  );
}
