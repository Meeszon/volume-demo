import type { ActivityType } from "../types";
import { ACTIVITY_TYPE_CONFIG, ACTIVITY_TYPES } from "../data/activityTypeConfig";

export interface SummaryEntry {
  type: ActivityType;
  count: number;
  target: number;
  colour: string;
}

export function getWeekSummary(
  activities: Array<{ type: ActivityType }>,
  targets: Record<ActivityType, number>
): SummaryEntry[] {
  return ACTIVITY_TYPES.filter((type) => targets[type] > 0).map((type) => ({
    type,
    count: activities.filter((a) => a.type === type).length,
    target: targets[type],
    colour: ACTIVITY_TYPE_CONFIG[type].color,
  }));
}
