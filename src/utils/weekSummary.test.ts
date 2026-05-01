import { describe, it, expect } from "vitest";
import { getWeekSummary } from "./weekSummary";
import type { ActivityType } from "../types";

const defaultTargets: Record<ActivityType, number> = {
  climbing: 3,
  conditioning: 2,
  mobility: 2,
  warmup: 0,
};

describe("getWeekSummary", () => {
  it("returns one entry per type where target > 0", () => {
    const result = getWeekSummary([], defaultTargets);
    const types = result.map((e) => e.type);
    expect(types).toEqual(["climbing", "conditioning", "mobility"]);
  });

  it("excludes types with target === 0", () => {
    const result = getWeekSummary([], defaultTargets);
    expect(result.find((e) => e.type === "warmup")).toBeUndefined();
  });

  it("counts activities by type correctly", () => {
    const activities = [
      { type: "climbing" as ActivityType },
      { type: "climbing" as ActivityType },
      { type: "conditioning" as ActivityType },
    ];
    const result = getWeekSummary(activities, defaultTargets);
    expect(result.find((e) => e.type === "climbing")?.count).toBe(2);
    expect(result.find((e) => e.type === "conditioning")?.count).toBe(1);
    expect(result.find((e) => e.type === "mobility")?.count).toBe(0);
  });

  it("returns count 0 for all types when activities array is empty", () => {
    const result = getWeekSummary([], defaultTargets);
    result.forEach((entry) => expect(entry.count).toBe(0));
  });

  it("handles count exceeding target without capping in the data", () => {
    const activities = Array.from({ length: 5 }, () => ({
      type: "climbing" as ActivityType,
    }));
    const result = getWeekSummary(activities, defaultTargets);
    expect(result.find((e) => e.type === "climbing")?.count).toBe(5);
  });

  it("includes warmup when target > 0", () => {
    const targets = { ...defaultTargets, warmup: 1 };
    const result = getWeekSummary([], targets);
    expect(result.find((e) => e.type === "warmup")).toBeDefined();
  });

  it("includes correct colour per type", () => {
    const result = getWeekSummary([], defaultTargets);
    expect(result.find((e) => e.type === "climbing")?.colour).toBe("#F5A623");
    expect(result.find((e) => e.type === "conditioning")?.colour).toBe("#4DACF7");
    expect(result.find((e) => e.type === "mobility")?.colour).toBe("#EF4E8B");
  });

  it("includes the correct target value in each entry", () => {
    const result = getWeekSummary([], defaultTargets);
    expect(result.find((e) => e.type === "climbing")?.target).toBe(3);
    expect(result.find((e) => e.type === "conditioning")?.target).toBe(2);
  });
});
