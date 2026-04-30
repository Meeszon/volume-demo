import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { DbActivity } from "../types";

const {
  mockFetchActivities,
  mockInsertActivity,
  mockDeleteActivity,
  mockUpdateActivityOrders,
  mockMoveActivity,
} = vi.hoisted(() => ({
  mockFetchActivities: vi.fn(),
  mockInsertActivity: vi.fn(),
  mockDeleteActivity: vi.fn(),
  mockUpdateActivityOrders: vi.fn(),
  mockMoveActivity: vi.fn(),
}));

vi.mock("../data/activitiesApi", () => ({
  fetchActivities: mockFetchActivities,
  insertActivity: mockInsertActivity,
  deleteActivity: mockDeleteActivity,
  updateActivityOrders: mockUpdateActivityOrders,
  moveActivity: mockMoveActivity,
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    session: { user: { id: "test-user" } },
    loading: false,
    signOut: vi.fn(),
  }),
}));

import { useWeekActivities } from "./useWeekActivities";

const monday = new Date("2026-04-27T00:00:00");

function makeDbActivity(overrides: Partial<DbActivity> = {}): DbActivity {
  return {
    id: "a1",
    user_id: "test-user",
    scheduled_date: "2026-04-27",
    type: "conditioning",
    title: "Pull Ups",
    intent_node_id: null,
    duration_minutes: null,
    order: 0,
    created_at: "2026-04-27T00:00:00Z",
    ...overrides,
  };
}

describe("useWeekActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchActivities.mockResolvedValue([]);
    mockInsertActivity.mockResolvedValue(makeDbActivity());
    mockDeleteActivity.mockResolvedValue(undefined);
    mockUpdateActivityOrders.mockResolvedValue(undefined);
    mockMoveActivity.mockResolvedValue(undefined);
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useWeekActivities(monday));
    expect(result.current.loading).toBe(true);
  });

  it("fetches activities for the correct date range", async () => {
    mockFetchActivities.mockResolvedValue([]);

    const { result } = renderHook(() => useWeekActivities(monday));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockFetchActivities).toHaveBeenCalledWith("2026-04-27", "2026-05-03");
  });

  it("groups fetched activities by day name", async () => {
    const activities: DbActivity[] = [
      makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
      makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      makeDbActivity({ id: "a3", scheduled_date: "2026-04-29", title: "Yoga", type: "mobility", order: 0 }),
    ];
    mockFetchActivities.mockResolvedValue(activities);

    const { result } = renderHook(() => useWeekActivities(monday));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.columns.Monday).toHaveLength(2);
    expect(result.current.columns.Monday[0].title).toBe("Pull Ups");
    expect(result.current.columns.Monday[1].title).toBe("Deadlift");
    expect(result.current.columns.Wednesday).toHaveLength(1);
    expect(result.current.columns.Wednesday[0].title).toBe("Yoga");
    expect(result.current.columns.Tuesday).toHaveLength(0);
  });

  it("returns empty columns for all 7 days when no activities", async () => {
    mockFetchActivities.mockResolvedValue([]);

    const { result } = renderHook(() => useWeekActivities(monday));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (const day of days) {
      expect(result.current.columns[day]).toEqual([]);
    }
  });

  it("sets error state on fetch failure", async () => {
    mockFetchActivities.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useWeekActivities(monday));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("network error");
  });

  it("re-fetches when weekMonday changes", async () => {
    const { result, rerender } = renderHook(
      ({ mon }) => useWeekActivities(mon),
      { initialProps: { mon: monday } },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetchActivities).toHaveBeenCalledWith("2026-04-27", "2026-05-03");

    const nextMonday = new Date("2026-05-04T00:00:00");
    rerender({ mon: nextMonday });

    await waitFor(() =>
      expect(mockFetchActivities).toHaveBeenCalledWith("2026-05-04", "2026-05-10"),
    );
  });

  it("sorts activities by order field, not fetch order", async () => {
    const activities = [
      makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
    ];
    mockFetchActivities.mockResolvedValue(activities);

    const { result } = renderHook(() => useWeekActivities(monday));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.columns.Monday[0].title).toBe("Pull Ups");
    expect(result.current.columns.Monday[1].title).toBe("Deadlift");
  });

  describe("addActivity", () => {
    it("optimistically adds activity to the correct day", async () => {
      mockFetchActivities.mockResolvedValue([]);
      mockInsertActivity.mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.addActivity("Tuesday", "conditioning", "Bench Press");
      });

      expect(result.current.columns.Tuesday).toHaveLength(1);
      expect(result.current.columns.Tuesday[0].title).toBe("Bench Press");
    });

    it("persists to Supabase with correct fields", async () => {
      mockFetchActivities.mockResolvedValue([]);
      const persisted = makeDbActivity({
        id: "server-id",
        scheduled_date: "2026-04-28",
        title: "Bench Press",
      });
      mockInsertActivity.mockResolvedValue(persisted);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.addActivity("Tuesday", "conditioning", "Bench Press");
      });

      expect(mockInsertActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: "test-user",
          scheduled_date: "2026-04-28",
          type: "conditioning",
          title: "Bench Press",
          order: 0,
        }),
      );
    });

    it("rolls back optimistic add on Supabase error", async () => {
      mockFetchActivities.mockResolvedValue([]);
      mockInsertActivity.mockRejectedValue(new Error("insert failed"));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.addActivity("Tuesday", "conditioning", "Bench Press");
      });

      expect(result.current.columns.Tuesday).toHaveLength(0);
      expect(result.current.error).toBe("insert failed");
    });
  });

  describe("deleteActivity", () => {
    it("optimistically removes activity from the day", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27" }),
      ];
      mockFetchActivities.mockResolvedValue(activities);
      mockDeleteActivity.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));
      expect(result.current.columns.Monday).toHaveLength(1);

      act(() => {
        result.current.deleteActivity("Monday", "a1");
      });

      expect(result.current.columns.Monday).toHaveLength(0);
    });

    it("rolls back optimistic delete on Supabase error", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27" }),
      ];
      mockFetchActivities.mockResolvedValue(activities);
      mockDeleteActivity.mockRejectedValue(new Error("delete failed"));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.deleteActivity("Monday", "a1");
      });

      expect(result.current.columns.Monday).toHaveLength(1);
      expect(result.current.error).toBe("delete failed");
    });
  });

  describe("handleDragEnd", () => {
    it("reorders within the same day", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Monday", index: 1 },
        } as never);
      });

      expect(result.current.columns.Monday[0].title).toBe("Deadlift");
      expect(result.current.columns.Monday[1].title).toBe("Pull Ups");
      expect(mockUpdateActivityOrders).toHaveBeenCalled();
    });

    it("moves activity between days", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Wednesday", index: 0 },
        } as never);
      });

      expect(result.current.columns.Monday).toHaveLength(0);
      expect(result.current.columns.Wednesday).toHaveLength(1);
      expect(result.current.columns.Wednesday[0].title).toBe("Pull Ups");
      expect(mockMoveActivity).toHaveBeenCalledWith("a1", "2026-04-29", 0);
    });

    it("no-ops when destination is null", async () => {
      mockFetchActivities.mockResolvedValue([]);
      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: null,
        } as never);
      });

      expect(mockUpdateActivityOrders).not.toHaveBeenCalled();
      expect(mockMoveActivity).not.toHaveBeenCalled();
    });

    it("no-ops when dropped at same position", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Monday", index: 0 },
        } as never);
      });

      expect(mockUpdateActivityOrders).not.toHaveBeenCalled();
      expect(mockMoveActivity).not.toHaveBeenCalled();
    });

    it("sends correct order values for same-day reorder", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
        makeDbActivity({ id: "a3", scheduled_date: "2026-04-27", title: "Bench", order: 2 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Monday", index: 2 },
        } as never);
      });

      expect(mockUpdateActivityOrders).toHaveBeenCalledWith([
        { id: "a2", order: 0 },
        { id: "a3", order: 1 },
        { id: "a1", order: 2 },
      ]);
    });

    it("updates orders in both days on cross-day move", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
        makeDbActivity({ id: "a3", scheduled_date: "2026-04-29", title: "Yoga", type: "mobility", order: 0 }),
        makeDbActivity({ id: "a4", scheduled_date: "2026-04-29", title: "Stretch", type: "mobility", order: 1 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Wednesday", index: 1 },
        } as never);
      });

      expect(result.current.columns.Monday).toHaveLength(1);
      expect(result.current.columns.Monday[0].title).toBe("Deadlift");
      expect(result.current.columns.Wednesday).toHaveLength(3);
      expect(result.current.columns.Wednesday[0].title).toBe("Yoga");
      expect(result.current.columns.Wednesday[1].title).toBe("Pull Ups");
      expect(result.current.columns.Wednesday[2].title).toBe("Stretch");

      expect(mockMoveActivity).toHaveBeenCalledWith("a1", "2026-04-29", 1);
      expect(mockUpdateActivityOrders).toHaveBeenCalledWith([
        { id: "a2", order: 0 },
        { id: "a3", order: 0 },
        { id: "a4", order: 2 },
      ]);
    });

    it("reverts same-day reorder on API error", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);
      mockUpdateActivityOrders.mockRejectedValue(new Error("order update failed"));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Monday", index: 1 },
        } as never);
      });

      expect(result.current.columns.Monday[0].title).toBe("Pull Ups");
      expect(result.current.columns.Monday[1].title).toBe("Deadlift");
      expect(result.current.error).toBe("Failed to move activity");
    });

    it("reverts cross-day move on API error", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);
      mockMoveActivity.mockRejectedValue(new Error("move failed"));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Wednesday", index: 0 },
        } as never);
      });

      expect(result.current.columns.Monday).toHaveLength(1);
      expect(result.current.columns.Monday[0].title).toBe("Pull Ups");
      expect(result.current.columns.Wednesday).toHaveLength(0);
      expect(result.current.error).toBe("Failed to move activity");
    });

    it("updates UI optimistically before API resolves", async () => {
      const activities = [
        makeDbActivity({ id: "a1", scheduled_date: "2026-04-27", title: "Pull Ups", order: 0 }),
        makeDbActivity({ id: "a2", scheduled_date: "2026-04-27", title: "Deadlift", order: 1 }),
      ];
      mockFetchActivities.mockResolvedValue(activities);
      mockUpdateActivityOrders.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useWeekActivities(monday));
      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.handleDragEnd({
          source: { droppableId: "Monday", index: 0 },
          destination: { droppableId: "Monday", index: 1 },
        } as never);
      });

      expect(result.current.columns.Monday[0].title).toBe("Deadlift");
      expect(result.current.columns.Monday[1].title).toBe("Pull Ups");
    });
  });
});
