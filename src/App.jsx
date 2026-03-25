import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

// Fake database for the demo
const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Warmup: Traverse (15m)" },
    "task-2": { id: "task-2", content: "Project: Blue 6B+" },
    "task-3": { id: "task-3", content: "Campus Board (Max hangs)" },
    "task-4": { id: "task-4", content: "Rest & Stretching" },
  },
  columns: {
    "col-1": { id: "col-1", title: "Monday", taskIds: ["task-1", "task-2"] },
    "col-2": { id: "col-2", title: "Tuesday", taskIds: ["task-3"] },
    "col-3": { id: "col-3", title: "Wednesday", taskIds: ["task-4"] },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

function App() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the exact same spot
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = data.columns[source.droppableId];
    const finishColumn = data.columns[destination.droppableId];

    // Moving within the SAME column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
      return;
    }

    // Moving from ONE column to ANOTHER
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...startColumn, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, taskIds: finishTaskIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <div className="app-container">
      <h1>My Bouldering Schedule</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div key={column.id} className="column">
                <h3>{column.title}</h3>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`task-list ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`card ${snapshot.isDragging ? "dragging" : ""}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
