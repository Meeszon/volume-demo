import type { ActivityType } from "../types";

export interface ActivityTypeConfig {
  color: string;
  pickerLabel: string;
  summaryLabel: string;
}

export const ACTIVITY_TYPE_CONFIG: Record<ActivityType, ActivityTypeConfig> = {
  climbing:     { color: "#F5A623", pickerLabel: "Climbing Session", summaryLabel: "Climbing"     },
  conditioning: { color: "#4DACF7", pickerLabel: "Conditioning",     summaryLabel: "Conditioning" },
  mobility:     { color: "#EF4E8B", pickerLabel: "Mobility",         summaryLabel: "Mobility"     },
  warmup:       { color: "#7C4DFF", pickerLabel: "Warm Up",          summaryLabel: "Warmup"       },
};

export const ACTIVITY_TYPES: ActivityType[] = [
  "climbing",
  "conditioning",
  "mobility",
  "warmup",
];
