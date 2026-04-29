import type { Activity } from "../types";

export const ACTIVITIES: Activity[] = [
  {
    id: "act-board-climbing",
    title: "Board Climbing",
    subtitle: "10 problems · full rest between",
    accent: "#d4a853",
    goalTags: [
      { nodeId: "board-climbing", nodeLabel: "Board Climbing" },
      { nodeId: "core", nodeLabel: "Core" },
    ],
  },
];
