import { useState, useEffect, useMemo, useCallback } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import type { Activity, ActivityType, Columns, DbActivity } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchActivities,
  insertActivity,
  deleteActivity as deleteActivityApi,
  updateActivityOrders,
  moveActivity,
} from "../data/activitiesApi";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TYPE_ACCENTS: Record<ActivityType, string> = {
  climbing: "#F5A623",
  conditioning: "#4DACF7",
  mobility: "#EF4E8B",
  warmup: "#7C4DFF",
};

function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayIdToISODate(dayId: string, weekMonday: Date): string {
  const dayIndex = DAY_NAMES.indexOf(dayId);
  const date = new Date(weekMonday);
  date.setDate(weekMonday.getDate() + dayIndex);
  return formatISODate(date);
}

function dbActivityToUi(dbAct: DbActivity): Activity {
  let subtitle = dbAct.type.charAt(0).toUpperCase() + dbAct.type.slice(1);
  if (dbAct.type === "climbing" && dbAct.duration_minutes) {
    subtitle = `${dbAct.duration_minutes} min`;
  }
  return {
    id: dbAct.id,
    title: dbAct.title,
    subtitle,
    accent: TYPE_ACCENTS[dbAct.type],
  };
}

function groupActivitiesByDay(
  activities: DbActivity[],
  weekMonday: Date,
): Columns {
  const columns: Columns = {};
  for (const name of DAY_NAMES) {
    columns[name] = [];
  }

  const sorted = [...activities].sort((a, b) => a.order - b.order);
  const mondayTime = weekMonday.getTime();
  for (const act of sorted) {
    const actDate = new Date(act.scheduled_date + "T00:00:00");
    const dayDiff = Math.round(
      (actDate.getTime() - mondayTime) / (1000 * 60 * 60 * 24),
    );
    if (dayDiff >= 0 && dayDiff < 7) {
      columns[DAY_NAMES[dayDiff]].push(dbActivityToUi(act));
    }
  }

  return columns;
}

export function useWeekActivities(weekMonday: Date) {
  const { session } = useAuth();
  const [dbActivities, setDbActivities] = useState<DbActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startDate = formatISODate(weekMonday);
  const endDate = formatISODate(
    new Date(
      weekMonday.getFullYear(),
      weekMonday.getMonth(),
      weekMonday.getDate() + 6,
    ),
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchActivities(startDate, endDate)
      .then((data) => {
        if (!cancelled) {
          setDbActivities(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [startDate, endDate]);

  const columns = useMemo(
    () => groupActivitiesByDay(dbActivities, weekMonday),
    [dbActivities, weekMonday],
  );

  const addActivity = useCallback(
    async (dayId: string, type: ActivityType, title: string, intentNodeId?: string, durationMinutes?: number) => {
      const userId = session?.user?.id;
      if (!userId) return;

      const scheduledDate = dayIdToISODate(dayId, weekMonday);
      const dayActs = dbActivities.filter(
        (a) => a.scheduled_date === scheduledDate,
      );
      const order = dayActs.length;

      const tempId = `temp-${Date.now()}`;
      const optimistic: DbActivity = {
        id: tempId,
        user_id: userId,
        scheduled_date: scheduledDate,
        type,
        title,
        intent_node_id: intentNodeId ?? null,
        duration_minutes: durationMinutes ?? null,
        order,
        created_at: new Date().toISOString(),
      };

      setDbActivities((prev) => [...prev, optimistic]);

      try {
        const persisted = await insertActivity({
          user_id: userId,
          scheduled_date: scheduledDate,
          type,
          title,
          intent_node_id: intentNodeId ?? null,
          duration_minutes: durationMinutes ?? null,
          order,
        });
        setDbActivities((prev) =>
          prev.map((a) => (a.id === tempId ? persisted : a)),
        );
      } catch (err) {
        setDbActivities((prev) => prev.filter((a) => a.id !== tempId));
        setError(err instanceof Error ? err.message : "Failed to add activity");
      }
    },
    [session, weekMonday, dbActivities],
  );

  const removeActivity = useCallback(
    async (_dayId: string, activityId: string) => {
      const prev = dbActivities;
      setDbActivities((current) =>
        current.filter((a) => a.id !== activityId),
      );

      try {
        await deleteActivityApi(activityId);
      } catch (err) {
        setDbActivities(prev);
        setError(
          err instanceof Error ? err.message : "Failed to delete activity",
        );
      }
    },
    [dbActivities],
  );

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      const sourceDay = source.droppableId;
      const destDay = destination.droppableId;
      const movedActivityId = columns[sourceDay][source.index].id;
      const prev = dbActivities;
      const sameDay = sourceDay === destDay;
      const sourceDateStr = dayIdToISODate(sourceDay, weekMonday);
      const destDateStr = sameDay
        ? sourceDateStr
        : dayIdToISODate(destDay, weekMonday);

      const sourceDayActs = dbActivities
        .filter((a) => a.scheduled_date === sourceDateStr)
        .sort((a, b) => a.order - b.order);

      const movedIdx = sourceDayActs.findIndex(
        (a) => a.id === movedActivityId,
      );
      const [movedAct] = sourceDayActs.splice(movedIdx, 1);

      let destDayActs: DbActivity[];
      if (sameDay) {
        destDayActs = sourceDayActs;
      } else {
        destDayActs = dbActivities
          .filter((a) => a.scheduled_date === destDateStr)
          .sort((a, b) => a.order - b.order);
      }

      const movedWithNewDate = { ...movedAct, scheduled_date: destDateStr };
      destDayActs.splice(destination.index, 0, movedWithNewDate);

      const updatedById = new Map<string, DbActivity>();
      sourceDayActs.forEach((a, i) =>
        updatedById.set(a.id, { ...a, order: i }),
      );
      if (!sameDay) {
        destDayActs.forEach((a, i) =>
          updatedById.set(a.id, { ...a, order: i }),
        );
      }

      setDbActivities(
        dbActivities.map((a) => updatedById.get(a.id) ?? a),
      );

      try {
        if (sameDay) {
          await updateActivityOrders(
            destDayActs.map((a, i) => ({ id: a.id, order: i })),
          );
        } else {
          await moveActivity(
            movedActivityId,
            destDateStr,
            destination.index,
          );
          const orderUpdates = [
            ...sourceDayActs.map((a, i) => ({ id: a.id, order: i })),
            ...destDayActs
              .map((a, i) => ({ id: a.id, order: i }))
              .filter((u) => u.id !== movedActivityId),
          ];
          if (orderUpdates.length > 0) {
            await updateActivityOrders(orderUpdates);
          }
        }
      } catch {
        setDbActivities(prev);
        setError("Failed to move activity");
      }
    },
    [columns, dbActivities, weekMonday],
  );

  return {
    columns,
    loading,
    error,
    addActivity,
    deleteActivity: removeActivity,
    handleDragEnd,
  };
}
