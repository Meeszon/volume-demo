import type { ActivityCategory, ActivityTemplate } from "../types";

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  // Conditioning
  { name: "Weighted Pull Ups", category: "conditioning" },
  { name: "Shoulder Press", category: "conditioning" },
  { name: "Bench Press", category: "conditioning" },
  { name: "Deadlift", category: "conditioning" },
  { name: "Seated Shoulder Rotation", category: "conditioning" },

  // Mobility
  {
    name: "Ankle Flexibility",
    category: "mobility",
    exercises: ["Calf Stretch", "Donkey Calf Raise", "Fishermans - Passive"],
  },
  { name: "Pancake Stretch", category: "mobility" },
  { name: "Revolver Stretch", category: "mobility" },
  { name: "Cossack Squats", category: "mobility" },
  { name: "Pigeon Pose", category: "mobility" },

  // Warm Up
  {
    name: "General Warm Up",
    category: "warmup",
    exercises: [
      "Leg Swings",
      "Scapular Push Ups",
      "Cossack Squats",
      "Face Pulls",
      "Split Squats",
    ],
  },
];

export function getTemplatesByCategory(
  category: ActivityCategory,
): ActivityTemplate[] {
  return ACTIVITY_TEMPLATES.filter((t) => t.category === category);
}
