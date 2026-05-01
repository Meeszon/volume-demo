import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActivityCard } from "./ActivityCard";
import type { Activity } from "../../types";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

const task: Activity = {
  id: "a1",
  type: "conditioning",
  title: "Pull Ups",
  subtitle: "Conditioning",
  accent: "#FF8B00",
};

const provided = {
  innerRef: vi.fn(),
  draggableProps: { style: {} },
  dragHandleProps: null,
} as unknown as DraggableProvided;

const snapshot = { isDragging: false } as DraggableStateSnapshot;

describe("ActivityCard", () => {
  it("renders activity title and subtitle", () => {
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={vi.fn()}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    expect(screen.getByText("Pull Ups")).toBeTruthy();
    expect(screen.getByText("Conditioning")).toBeTruthy();
  });

  it("shows a delete button", () => {
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={vi.fn()}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    expect(screen.getByRole("button", { name: /delete/i })).toBeTruthy();
  });

  it("shows confirmation step when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={vi.fn()}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.getByRole("button", { name: /confirm/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeTruthy();
  });

  it("calls onDelete with dayId and activity id when confirmed", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={onDelete}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(onDelete).toHaveBeenCalledWith("a1");
  });

  it("does not call onDelete when cancel is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={onDelete}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("returns to normal state after cancelling", async () => {
    const user = userEvent.setup();
    render(
      <ActivityCard
        task={task}
        provided={provided}
        snapshot={snapshot}
        onDelete={vi.fn()}
        onOpenPanel={vi.fn()}
        isLogged={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByRole("button", { name: /delete/i })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /confirm/i })).toBeNull();
  });
});
