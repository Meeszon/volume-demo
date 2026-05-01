import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActivityLog } from "./useActivityLog";

beforeEach(() => {
  localStorage.clear();
});

describe("useActivityLog", () => {
  it("isLogged returns false for an activity that has never been logged", () => {
    const { result } = renderHook(() => useActivityLog());
    expect(result.current.isLogged("a1")).toBe(false);
  });

  it("isLogged returns true after saveLog is called for that ID", () => {
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.saveLog("a1", { intensity: "hard" });
    });
    expect(result.current.isLogged("a1")).toBe(true);
  });

  it("getLog returns null for an activity that has never been logged", () => {
    const { result } = renderHook(() => useActivityLog());
    expect(result.current.getLog("a1")).toBeNull();
  });

  it("getLog returns the exact data that was saved", () => {
    const { result } = renderHook(() => useActivityLog());
    const data = { intensity: "moderate", notes: "felt good" };
    act(() => {
      result.current.saveLog("a1", data);
    });
    expect(result.current.getLog("a1")).toEqual(data);
  });

  it("clearLog removes the entry and isLogged returns false again", () => {
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.saveLog("a1", { intensity: "easy" });
    });
    act(() => {
      result.current.clearLog("a1");
    });
    expect(result.current.isLogged("a1")).toBe(false);
    expect(result.current.getLog("a1")).toBeNull();
  });

  it("data for one activity ID does not affect another", () => {
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.saveLog("a1", { sets: 3 });
    });
    expect(result.current.isLogged("a2")).toBe(false);
    expect(result.current.getLog("a2")).toBeNull();
  });

  it("saveLog persists data to localStorage", () => {
    const { result } = renderHook(() => useActivityLog());
    act(() => {
      result.current.saveLog("a1", { notes: "test" });
    });
    const { result: result2 } = renderHook(() => useActivityLog());
    expect(result2.current.isLogged("a1")).toBe(true);
    expect(result2.current.getLog("a1")).toEqual({ notes: "test" });
  });
});
