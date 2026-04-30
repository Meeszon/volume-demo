import { supabase } from "../lib/supabase";
import type { DbActivity } from "../types";

export async function fetchActivities(
  startDate: string,
  endDate: string,
): Promise<DbActivity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("order");

  if (error) throw error;
  return data as DbActivity[];
}

export async function insertActivity(
  activity: Omit<DbActivity, "id" | "created_at">,
): Promise<DbActivity> {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data as DbActivity;
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateActivityOrders(
  updates: Array<{ id: string; order: number }>,
): Promise<void> {
  const results = await Promise.all(
    updates.map(({ id, order }) =>
      supabase.from("activities").update({ order }).eq("id", id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

export async function moveActivity(
  id: string,
  scheduledDate: string,
  order: number,
): Promise<void> {
  const { error } = await supabase
    .from("activities")
    .update({ scheduled_date: scheduledDate, order })
    .eq("id", id);

  if (error) throw error;
}
