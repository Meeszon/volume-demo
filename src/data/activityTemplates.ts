import type { ActivityCategory, ActivityTemplate } from "../types";

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  // Conditioning — single exercises, reps-based
  { name: "Weighted Pull Ups", category: "conditioning", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
  { name: "Shoulder Press", category: "conditioning", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
  { name: "Bench Press", category: "conditioning", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
  { name: "Deadlift", category: "conditioning", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
  { name: "Seated Shoulder Rotation", category: "conditioning", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },

  // Mobility — Ankle Flexibility is a block; others are single exercises
  {
    name: "Ankle Flexibility",
    category: "mobility",
    kind: "block",
    exercises: [
      { name: "Calf Stretch", unit: "seconds", defaultSets: 3, defaultValue: 30, defaultRest: 60 },
      { name: "Donkey Calf Raise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
      { name: "Fishermans - Passive", unit: "seconds", defaultSets: 3, defaultValue: 30, defaultRest: 60 },
    ],
  },
  { name: "Pancake Stretch", category: "mobility", kind: "exercise", unit: "seconds", defaultSets: 3, defaultValue: 30, defaultRest: 60 },
  { name: "Revolver Stretch", category: "mobility", kind: "exercise", unit: "seconds", defaultSets: 3, defaultValue: 30, defaultRest: 60 },
  { name: "Cossack Squats", category: "mobility", kind: "exercise", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
  { name: "Pigeon Pose", category: "mobility", kind: "exercise", unit: "seconds", defaultSets: 3, defaultValue: 30, defaultRest: 60 },

  // Warm Up — single block with 5 exercises
  {
    name: "General Warm Up",
    category: "warmup",
    kind: "block",
    exercises: [
      { name: "Leg Swings", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
      { name: "Scapular Push Ups", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
      { name: "Cossack Squats", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
      { name: "Face Pulls", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
      { name: "Split Squats", unit: "reps", defaultSets: 3, defaultValue: 10, defaultRest: 60 },
    ],
  },
];

export function getTemplatesByCategory(
  category: ActivityCategory,
): ActivityTemplate[] {
  return ACTIVITY_TEMPLATES.filter((t) => t.category === category);
}
