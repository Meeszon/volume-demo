import { describe, it, expect } from "vitest";
import { computeSubtitle } from "./computeSubtitle";

describe("computeSubtitle", () => {
  it("climbing without focus returns duration only", () => {
    expect(computeSubtitle("climbing", null, null, 90)).toBe("90 min");
  });

  it("climbing with focus returns duration and focus", () => {
    expect(computeSubtitle("climbing", null, "Endurance", 90)).toBe("90 min · Focus: Endurance");
  });

  it("block returns exercise names joined by ·", () => {
    const details = {
      kind: "block" as const,
      exercises: [
        { name: "Calf Stretch", sets: 3, value: 30, unit: "seconds" as const, rest: 60 },
        { name: "Donkey Calf Raise", sets: 3, value: 10, unit: "reps" as const, rest: 60 },
        { name: "Fishermans - Passive", sets: 3, value: 30, unit: "seconds" as const, rest: 60 },
      ],
    };
    expect(computeSubtitle("mobility", details, null, null)).toBe(
      "Calf Stretch · Donkey Calf Raise · Fishermans - Passive",
    );
  });

  it("exercise with reps unit returns sets × value", () => {
    const details = {
      kind: "exercise" as const,
      sets: 3,
      value: 8,
      unit: "reps" as const,
      rest: 60,
    };
    expect(computeSubtitle("conditioning", details, null, null)).toBe("3 × 8");
  });

  it("exercise with seconds unit returns sets × values", () => {
    const details = {
      kind: "exercise" as const,
      sets: 3,
      value: 30,
      unit: "seconds" as const,
      rest: 60,
    };
    expect(computeSubtitle("conditioning", details, null, null)).toBe("3 × 30s");
  });
});
