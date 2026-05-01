import type { ActivityDetails, ActivityType, FocusOption } from "../types";

export function computeSubtitle(
  type: ActivityType,
  details: ActivityDetails | null | undefined,
  focus: FocusOption | null | undefined,
  durationMinutes: number | null | undefined,
): string {
  if (type === "climbing") {
    const base = `${durationMinutes ?? 0} min`;
    return focus ? `${base} · Focus: ${focus}` : base;
  }

  if (details?.kind === "block") {
    return details.exercises.map((e) => e.name).join(" · ");
  }

  if (details?.kind === "exercise") {
    const { sets, value, unit } = details;
    return unit === "seconds" ? `${sets} × ${value}s` : `${sets} × ${value}`;
  }

  return "";
}
