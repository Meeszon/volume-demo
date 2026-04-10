import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";
import GoalsPage from "./GoalsPage.jsx";
import Goals2Page from "./Goals2Page.jsx";

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

/* ── Nav icons ── */

function ScheduleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#787878" strokeWidth="1.2" />
      <path d="M5 2v2M11 2v2" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2 6.5h12" stroke="#787878" strokeWidth="1.2" />
    </svg>
  );
}

function ActivitiesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="6.5" width="3" height="3" rx="0.75" stroke="#787878" strokeWidth="1.2" />
      <rect x="12" y="6.5" width="3" height="3" rx="0.75" stroke="#787878" strokeWidth="1.2" />
      <path d="M4 8h2.5M9.5 8H12" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="6.5" y="5.5" width="3" height="5" rx="0.75" stroke="#787878" strokeWidth="1.2" />
    </svg>
  );
}

function GoalsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#787878" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.5" stroke="#787878" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1" fill="#787878" />
    </svg>
  );
}

function Goals2Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="1.5" stroke="#787878" strokeWidth="1.2" />
      <circle cx="12" cy="4.5" r="1.5" stroke="#787878" strokeWidth="1.2" />
      <circle cx="12" cy="11.5" r="1.5" stroke="#787878" strokeWidth="1.2" />
      <path d="M5.5 8L10.5 4.5" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 8L10.5 11.5" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5l3-3" stroke="#9d9c99" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M7.5 9L4.5 6l3-3" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 9L7.5 6l-3-3" stroke="#787878" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Card icons ── */

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="#9d9c99" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#787878" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8c7c4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

/* ── Activity card ── */

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

/* ── App ── */

export default function App() {
  const [columns, setColumns] = useState(initialData);
  const [activeNav, setActiveNav] = useState("Schedule");

  const boardRef = useRef(null);
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

  const onBoardMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".activity-card, button, [role='button']")) return;
    const board = boardRef.current;
    scrollDrag.current = { active: true, startX: e.clientX, scrollLeft: board.scrollLeft };
    board.style.cursor = "grabbing";
    board.style.userSelect = "none";
  };

  const onBoardMouseMove = (e) => {
    if (!scrollDrag.current.active) return;
    const dx = e.clientX - scrollDrag.current.startX;
    boardRef.current.scrollLeft = scrollDrag.current.scrollLeft - dx;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

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

  const navItems = [
    { label: "Schedule", icon: <ScheduleIcon /> },
    { label: "Activities", icon: <ActivitiesIcon /> },
    { label: "Goals", icon: <GoalsIcon /> },
    { label: "Goals 2", icon: <Goals2Icon /> },
  ];

  return (
    <div className="page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-title">Volume</span>
          <ChevronDownIcon />
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ label, icon }) => (
            <div
              key={label}
              role="button"
              tabIndex={0}
              className={`nav-item${activeNav === label ? " active" : ""}`}
              onClick={() => setActiveNav(label)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveNav(label); }}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main card */}
      <div className="main-card">
        <div className="main-header">
          {activeNav === "Schedule" && (
            <div className="week-picker">
              <button className="week-picker-btn"><ChevronLeftIcon /></button>
              <div className="week-picker-divider" />
              <span className="week-picker-label">This week</span>
              <div className="week-picker-divider" />
              <button className="week-picker-btn"><ChevronRightIcon /></button>
            </div>
          )}
          {activeNav === "Activities" && (
            <span className="main-header-title">Activities</span>
          )}
          {activeNav === "Goals" && (
            <span className="main-header-title">Goals</span>
          )}
          {activeNav === "Goals 2" && (
            <span className="main-header-title">Goals 2</span>
          )}
        </div>

        {/* Kanban board */}
        {activeNav === "Schedule" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              className="board-scroll"
              ref={boardRef}
              onMouseDown={onBoardMouseDown}
              onMouseMove={onBoardMouseMove}
            >
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
        )}

        {activeNav === "Goals" && <GoalsPage />}
        {activeNav === "Goals 2" && <Goals2Page />}
      </div>
    </div>
  );
}
