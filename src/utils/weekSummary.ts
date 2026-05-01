import type { ActivityType } from "../types";

export interface SummaryEntry {
  type: ActivityType;
  count: number;
  target: number;
  colour: string;
}

const TYPE_COLOURS: Record<ActivityType, string> = {
  climbing: "#F5A623",
  conditioning: "#4DACF7",
  mobility: "#EF4E8B",
  warmup: "#7C4DFF",
};

const ACTIVITY_TYPES: ActivityType[] = [
  "climbing",
  "conditioning",
  "mobility",
  "warmup",
];

export function getWeekSummary(
  activities: Array<{ type: ActivityType }>,
  targets: Record<ActivityType, number>
): SummaryEntry[] {
  return ACTIVITY_TYPES.filter((type) => targets[type] > 0).map((type) => ({
    type,
    count: activities.filter((a) => a.type === type).length,
    target: targets[type],
    colour: TYPE_COLOURS[type],
  }));
}
