import { createContext, useContext, useState } from "react";
import type { Goal } from "../types";

interface GoalsContextValue {
  goals: Goal[];
  addGoal: (areaId: string, areaLabel: string) => void;
  removeGoal: (goalId: string) => void;
  setPrimary: (goalId: string) => void;
  toggleNode: (goalId: string, nodeId: string) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (areaId: string, areaLabel: string) => {
    if (goals.length >= 3) return;
    if (goals.some((g) => g.areaId === areaId)) return;
    const isFirst = goals.length === 0;
    setGoals((prev) => [
      ...prev,
      { id: areaId, areaId, areaLabel, isPrimary: isFirst, selectedNodeIds: [] },
    ]);
  };

  const removeGoal = (goalId: string) => {
    setGoals((prev) => {
      const filtered = prev.filter((g) => g.id !== goalId);
      if (filtered.length > 0 && !filtered.some((g) => g.isPrimary)) {
        return filtered.map((g, i) => ({ ...g, isPrimary: i === 0 }));
      }
      return filtered;
    });
  };

  const setPrimary = (goalId: string) => {
    setGoals((prev) => prev.map((g) => ({ ...g, isPrimary: g.id === goalId })));
  };

  const toggleNode = (goalId: string, nodeId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const ids = g.selectedNodeIds.includes(nodeId)
          ? g.selectedNodeIds.filter((id) => id !== nodeId)
          : [...g.selectedNodeIds, nodeId];
        return { ...g, selectedNodeIds: ids };
      })
    );
  };

  return (
    <GoalsContext.Provider value={{ goals, addGoal, removeGoal, setPrimary, toggleNode }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals(): GoalsContextValue {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
}
