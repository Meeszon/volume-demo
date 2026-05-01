import { useState, useCallback } from "react";

export type LogData = Record<string, unknown>;

const STORAGE_KEY = "volume:activityLog";

function loadLog(): Record<string, LogData> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupt data
  }
  return {};
}

export function useActivityLog() {
  const [log, setLog] = useState<Record<string, LogData>>(loadLog);

  const isLogged = useCallback(
    (id: string): boolean => id in log,
    [log]
  );

  const getLog = useCallback(
    (id: string): LogData | null => log[id] ?? null,
    [log]
  );

  const saveLog = useCallback((id: string, data: LogData): void => {
    setLog((prev) => {
      const next = { ...prev, [id]: data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearLog = useCallback((id: string): void => {
    setLog((prev) => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { isLogged, getLog, saveLog, clearLog };
}
