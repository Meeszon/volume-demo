import type { Activity } from "../types";

export const ACTIVITIES: Activity[] = [
  {
    id: "act-board-climbing",
    title: "Board Climbing",
    subtitle: "10 problems · full rest between",
    accent: "#d4a853",
    goalTags: [
      { nodeId: "board-climbing", nodeLabel: "Board Climbing" },
      { nodeId: "core-compression", nodeLabel: "Core Compression" },
    ],
  },
  {
    id: "act-hangboard-repeaters",
    title: "Hangboard Repeaters",
    subtitle: "7s on / 3s off × 6 reps · 2 sets",
    accent: "#c0392b",
    goalTags: [
      { nodeId: "hangboard", nodeLabel: "Hangboard" },
      { nodeId: "crimps", nodeLabel: "Crimps" },
    ],
  },
  {
    id: "act-campus-training",
    title: "Campus Training",
    subtitle: "Laddering & double dynos · 3 sets",
    accent: "#e67e22",
    goalTags: [
      { nodeId: "campus-strength", nodeLabel: "Campus Training" },
      { nodeId: "dead-points", nodeLabel: "Dead Points" },
    ],
  },
  {
    id: "act-arc-training",
    title: "ARC Training",
    subtitle: "30 min continuous climbing · steady pace",
    accent: "#27ae60",
    goalTags: [
      { nodeId: "arc-training", nodeLabel: "ARC Training" },
    ],
  },
  {
    id: "act-four-by-fours",
    title: "4×4 Circuits",
    subtitle: "4 problems × 4 sets · 4 min rest between sets",
    accent: "#8e44ad",
    goalTags: [
      { nodeId: "four-by-fours", nodeLabel: "4x4s" },
      { nodeId: "arc-training", nodeLabel: "ARC Training" },
    ],
  },
  {
    id: "act-weighted-pullups",
    title: "Weighted Pull-ups",
    subtitle: "3–5 reps × 4 sets · slow eccentric",
    accent: "#2980b9",
    goalTags: [
      { nodeId: "weighted-pullups", nodeLabel: "Weighted Pull-ups" },
      { nodeId: "one-arm-progressions", nodeLabel: "One-arm Progressions" },
    ],
  },
  {
    id: "act-hollow-body",
    title: "Hollow Body & Tension",
    subtitle: "20–30s holds · 3 sets · full tension",
    accent: "#16a085",
    goalTags: [
      { nodeId: "core-compression", nodeLabel: "Core Compression" },
    ],
  },
  {
    id: "act-toe-hook-session",
    title: "Toe Hook Session",
    subtitle: "5 problems requiring toe hooks · 3× each",
    accent: "#d35400",
    goalTags: [
      { nodeId: "toe-hooks", nodeLabel: "Toe Hooks" },
      { nodeId: "heel-hooks", nodeLabel: "Heel Hooks" },
    ],
  },
  {
    id: "act-drop-knee-drills",
    title: "Drop Knee Drills",
    subtitle: "Traverses + 5 targeted problems",
    accent: "#7f8c8d",
    goalTags: [
      { nodeId: "drop-knee", nodeLabel: "Drop Knee" },
      { nodeId: "hip-rotation-ov", nodeLabel: "Hip Rotation" },
    ],
  },
  {
    id: "act-slab-traverses",
    title: "Slab Traverses",
    subtitle: "Footwork focus · 5 laps · no rushing",
    accent: "#bdc3c7",
    goalTags: [
      { nodeId: "smearing", nodeLabel: "Smearing" },
      { nodeId: "trust-feet", nodeLabel: "Trusting Feet" },
    ],
  },
  {
    id: "act-sloper-pinch-session",
    title: "Sloper & Pinch Session",
    subtitle: "Alternate grip type every other problem",
    accent: "#f39c12",
    goalTags: [
      { nodeId: "slopers", nodeLabel: "Slopers" },
      { nodeId: "pinches", nodeLabel: "Pinches" },
    ],
  },
  {
    id: "act-dyno-dead-point",
    title: "Dyno & Dead Point Work",
    subtitle: "Progressive distance dynos · 5 attempts per target",
    accent: "#e74c3c",
    goalTags: [
      { nodeId: "dynos", nodeLabel: "Dynos" },
      { nodeId: "dead-points", nodeLabel: "Dead Points" },
    ],
  },
];
