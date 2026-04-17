import { useState } from "react";

/**
 * Manages a Set<string> with toggle and remove helpers.
 * Used by both Goals pages for expand/select state.
 */
export function useSetToggle(initial?: Iterable<string>) {
  const [set, setSet] = useState<Set<string>>(() => new Set(initial));

  const toggle = (id: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const remove = (id: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return { set, toggle, remove };
}
