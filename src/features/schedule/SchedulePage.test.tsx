import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockUseWeekActivities = vi.hoisted(() => vi.fn());

vi.mock("../../hooks/useWeekActivities", () => ({
  useWeekActivities: mockUseWeekActivities,
}));

vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Droppable: ({ children }: { children: (p: unknown, s: unknown) => React.ReactNode }) =>
    children(
      { innerRef: vi.fn(), droppableProps: {}, placeholder: null },
      { isDraggingOver: false },
    ),
  Draggable: ({ children }: { children: (p: unknown, s: unknown) => React.ReactNode }) =>
    children(
      { innerRef: vi.fn(), draggableProps: { style: {} }, dragHandleProps: null },
      { isDragging: false },
    ),
}));

import { SchedulePage } from "./SchedulePage";
import type { Columns } from "../../types";

const EMPTY_COLUMNS: Columns = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

describe("SchedulePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows 'Rest Day' for every day when all columns are empty", () => {
    mockUseWeekActivities.mockReturnValue({
      columns: EMPTY_COLUMNS,
      loading: false,
      error: null,
      addActivity: vi.fn(),
      deleteActivity: vi.fn(),
      handleDragEnd: vi.fn(),
    });

    render(<SchedulePage />);

    const restDays = screen.getAllByText("Rest Day");
    expect(restDays).toHaveLength(7);
  });

  it("does not show 'Rest Day' for a day that has activities", () => {
    const columns: Columns = {
      ...EMPTY_COLUMNS,
      Monday: [{ id: "a1", title: "Pull Ups", subtitle: "Conditioning", accent: "#FF8B00" }],
    };

    mockUseWeekActivities.mockReturnValue({
      columns,
      loading: false,
      error: null,
      addActivity: vi.fn(),
      deleteActivity: vi.fn(),
      handleDragEnd: vi.fn(),
    });

    render(<SchedulePage />);

    const restDays = screen.getAllByText("Rest Day");
    expect(restDays).toHaveLength(6);
  });

  it("does not show 'Rest Day' while loading", () => {
    mockUseWeekActivities.mockReturnValue({
      columns: EMPTY_COLUMNS,
      loading: true,
      error: null,
      addActivity: vi.fn(),
      deleteActivity: vi.fn(),
      handleDragEnd: vi.fn(),
    });

    render(<SchedulePage />);

    expect(screen.queryByText("Rest Day")).toBeNull();
  });
});
