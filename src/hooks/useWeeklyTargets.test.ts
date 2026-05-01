import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWeeklyTargets } from "./useWeeklyTargets";

beforeEach(() => {
  localStorage.clear();
});

describe("useWeeklyTargets", () => {
  it("returns correct defaults on first load", () => {
    const { result } = renderHook(() => useWeeklyTargets());
    expect(result.current.targets.climbing).toBe(3);
    expect(result.current.targets.conditioning).toBe(2);
    expect(result.current.targets.mobility).toBe(2);
    expect(result.current.targets.warmup).toBe(0);
  });

  it("setTarget updates the value in state", () => {
    const { result } = renderHook(() => useWeeklyTargets());
    act(() => {
      result.current.setTarget("climbing", 5);
    });
    expect(result.current.targets.climbing).toBe(5);
  });

  it("setTarget persists the value to localStorage", () => {
    const { result } = renderHook(() => useWeeklyTargets());
    act(() => {
      result.current.setTarget("conditioning", 4);
    });
    const { result: result2 } = renderHook(() => useWeeklyTargets());
    expect(result2.current.targets.conditioning).toBe(4);
  });

  it("persisted values are restored correctly on re-mount", () => {
    const { result } = renderHook(() => useWeeklyTargets());
    act(() => {
      result.current.setTarget("mobility", 3);
    });
    const { result: result2 } = renderHook(() => useWeeklyTargets());
    expect(result2.current.targets.mobility).toBe(3);
  });

  it("updating one type does not affect the others", () => {
    const { result } = renderHook(() => useWeeklyTargets());
    act(() => {
      result.current.setTarget("climbing", 6);
    });
    expect(result.current.targets.conditioning).toBe(2);
    expect(result.current.targets.mobility).toBe(2);
    expect(result.current.targets.warmup).toBe(0);
  });
});
