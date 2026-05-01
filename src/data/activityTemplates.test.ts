import { describe, it, expect } from "vitest";
import {
  ACTIVITY_TEMPLATES,
  getTemplatesByCategory,
} from "./activityTemplates";

describe("ACTIVITY_TEMPLATES", () => {
  it("every template has a name, category, and a kind of block or exercise", () => {
    for (const t of ACTIVITY_TEMPLATES) {
      expect(t.name).toBeTruthy();
      expect(["conditioning", "mobility", "warmup"]).toContain(t.category);
      expect(["block", "exercise"]).toContain(t.kind);
    }
  });

  it("contains all 5 conditioning templates", () => {
    const conditioning = ACTIVITY_TEMPLATES.filter(
      (t) => t.category === "conditioning",
    );
    const names = conditioning.map((t) => t.name);
    expect(names).toEqual([
      "Weighted Pull Ups",
      "Shoulder Press",
      "Bench Press",
      "Deadlift",
      "Seated Shoulder Rotation",
    ]);
  });

  it("contains all 5 mobility templates", () => {
    const mobility = ACTIVITY_TEMPLATES.filter(
      (t) => t.category === "mobility",
    );
    const names = mobility.map((t) => t.name);
    expect(names).toEqual([
      "Ankle Flexibility",
      "Pancake Stretch",
      "Revolver Stretch",
      "Cossack Squats",
      "Pigeon Pose",
    ]);
  });

  it("Ankle Flexibility is a block with 3 TemplateExercise objects in order", () => {
    const ankle = ACTIVITY_TEMPLATES.find(
      (t) => t.name === "Ankle Flexibility",
    )!;
    expect(ankle.kind).toBe("block");
    if (ankle.kind === "block") {
      expect(ankle.exercises.map((e) => e.name)).toEqual([
        "Calf Stretch",
        "Donkey Calf Raise",
        "Fishermans - Passive",
      ]);
      expect(ankle.exercises[0]).toMatchObject({ unit: "seconds", defaultSets: 3 });
      expect(ankle.exercises[1]).toMatchObject({ unit: "reps", defaultSets: 3 });
    }
  });

  it("General Warm Up is a block with 5 TemplateExercise objects in order", () => {
    const warmup = ACTIVITY_TEMPLATES.find(
      (t) => t.name === "General Warm Up",
    )!;
    expect(warmup.kind).toBe("block");
    if (warmup.kind === "block") {
      expect(warmup.exercises.map((e) => e.name)).toEqual([
        "Leg Swings",
        "Scapular Push Ups",
        "Cossack Squats",
        "Face Pulls",
        "Split Squats",
      ]);
    }
  });

  it("conditioning templates are exercises with reps unit and default values", () => {
    const conditioning = ACTIVITY_TEMPLATES.filter(
      (t) => t.category === "conditioning",
    );
    for (const t of conditioning) {
      expect(t.kind).toBe("exercise");
      if (t.kind === "exercise") {
        expect(t.unit).toBe("reps");
        expect(t.defaultSets).toBe(3);
        expect(t.defaultValue).toBe(10);
        expect(t.defaultRest).toBe(60);
      }
    }
  });
});

describe("getTemplatesByCategory", () => {
  it("returns only templates matching the given category", () => {
    const result = getTemplatesByCategory("conditioning");
    expect(result.length).toBe(5);
    for (const t of result) {
      expect(t.category).toBe("conditioning");
    }
  });

  it("returns mobility templates", () => {
    const result = getTemplatesByCategory("mobility");
    expect(result.length).toBe(5);
    for (const t of result) {
      expect(t.category).toBe("mobility");
    }
  });

  it("returns warmup templates", () => {
    const result = getTemplatesByCategory("warmup");
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("General Warm Up");
  });

  it("returns a new array (not a reference to the source)", () => {
    const a = getTemplatesByCategory("conditioning");
    const b = getTemplatesByCategory("conditioning");
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
