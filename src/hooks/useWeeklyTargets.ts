import { useState, useCallback } from "react";
import type { ActivityType } from "../types";

const STORAGE_KEY = "volume:weeklyTargets";

const DEFAULT_TARGETS: Record<ActivityType, number> = {
  climbing: 3,
  conditioning: 2,
  mobility: 2,
  warmup: 0,
};

function loadTargets(): Record<ActivityType, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_TARGETS, ...JSON.parse(stored) };
  } catch {
    // ignore corrupt data
  }
  return { ...DEFAULT_TARGETS };
}

export function useWeeklyTargets() {
  const [targets, setTargetsState] = useState<Record<ActivityType, number>>(loadTargets);

  const setTarget = useCallback((type: ActivityType, value: number) => {
    setTargetsState((prev) => {
      const next = { ...prev, [type]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { targets, setTarget };
}
