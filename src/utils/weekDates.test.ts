import { describe, it, expect } from "vitest";
import { getMonday, getWeekDays, shiftWeek, formatWeekLabel, isCurrentWeek } from "./weekDates";

describe("getMonday", () => {
  it("returns the same day when given a Monday", () => {
    const monday = new Date(2026, 3, 27); // Mon 27 Apr 2026
    const result = getMonday(monday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(27);
  });

  it("returns the previous Monday when given a Wednesday", () => {
    const wed = new Date(2026, 3, 29); // Wed 29 Apr 2026
    const result = getMonday(wed);
    expect(result.getDate()).toBe(27);
  });

  it("returns the previous Monday when given a Sunday", () => {
    const sun = new Date(2026, 4, 3); // Sun 3 May 2026
    const result = getMonday(sun);
    expect(result.getDate()).toBe(27);
    expect(result.getMonth()).toBe(3); // April
  });

  it("returns the previous Monday when given a Saturday", () => {
    const sat = new Date(2026, 4, 2); // Sat 2 May 2026
    const result = getMonday(sat);
    expect(result.getDate()).toBe(27);
    expect(result.getMonth()).toBe(3);
  });

  it("zeroes out the time component", () => {
    const d = new Date(2026, 3, 29, 15, 30, 45);
    const result = getMonday(d);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("does not mutate the input date", () => {
    const d = new Date(2026, 3, 29);
    const original = d.getTime();
    getMonday(d);
    expect(d.getTime()).toBe(original);
  });

  it("handles month boundaries (Friday in a week that starts in previous month)", () => {
    const fri = new Date(2026, 4, 1); // Fri 1 May 2026
    const result = getMonday(fri);
    expect(result.getMonth()).toBe(3); // April
    expect(result.getDate()).toBe(27);
  });
});

describe("getWeekDays", () => {
  it("returns 7 days starting from the given Monday", () => {
    const monday = new Date(2026, 3, 27);
    const days = getWeekDays(monday);
    expect(days).toHaveLength(7);
  });

  it("uses correct day names", () => {
    const monday = new Date(2026, 3, 27);
    const days = getWeekDays(monday);
    expect(days.map((d) => d.id)).toEqual([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ]);
  });

  it("formats dates correctly", () => {
    const monday = new Date(2026, 3, 27);
    const days = getWeekDays(monday);
    expect(days[0].date).toBe("27 Apr");
    expect(days[6].date).toBe("3 May");
  });

  it("handles week spanning month boundary", () => {
    const monday = new Date(2026, 3, 27);
    const days = getWeekDays(monday);
    expect(days[3].date).toBe("30 Apr");
    expect(days[4].date).toBe("1 May");
  });
});

describe("shiftWeek", () => {
  it("advances by 7 days when direction is 1", () => {
    const monday = new Date(2026, 3, 27);
    const next = shiftWeek(monday, 1);
    expect(next.getDate()).toBe(4);
    expect(next.getMonth()).toBe(4); // May
  });

  it("goes back by 7 days when direction is -1", () => {
    const monday = new Date(2026, 3, 27);
    const prev = shiftWeek(monday, -1);
    expect(prev.getDate()).toBe(20);
    expect(prev.getMonth()).toBe(3); // April
  });

  it("does not mutate the input date", () => {
    const monday = new Date(2026, 3, 27);
    const original = monday.getTime();
    shiftWeek(monday, 1);
    expect(monday.getTime()).toBe(original);
  });
});

describe("formatWeekLabel", () => {
  it("returns 'This week' when the monday is the current week", () => {
    const today = new Date(2026, 3, 29); // Wed 29 Apr
    const monday = new Date(2026, 3, 27); // Mon 27 Apr
    expect(formatWeekLabel(monday, today)).toBe("This week");
  });

  it("returns a date range for a different week", () => {
    const today = new Date(2026, 3, 29);
    const monday = new Date(2026, 4, 4); // Mon 4 May
    const label = formatWeekLabel(monday, today);
    expect(label).toBe("4 May – 10 May");
  });

  it("returns a date range spanning months", () => {
    const today = new Date(2026, 4, 10);
    const monday = new Date(2026, 3, 27);
    const label = formatWeekLabel(monday, today);
    expect(label).toBe("27 Apr – 3 May");
  });
});

describe("isCurrentWeek", () => {
  it("returns true when the monday matches the current week", () => {
    const today = new Date(2026, 3, 30); // Thu 30 Apr
    const monday = new Date(2026, 3, 27);
    expect(isCurrentWeek(monday, today)).toBe(true);
  });

  it("returns false for a different week", () => {
    const today = new Date(2026, 3, 30);
    const monday = new Date(2026, 4, 4);
    expect(isCurrentWeek(monday, today)).toBe(false);
  });

  it("returns true when today is the Monday itself", () => {
    const today = new Date(2026, 3, 27);
    const monday = new Date(2026, 3, 27);
    expect(isCurrentWeek(monday, today)).toBe(true);
  });

  it("returns true when today is Sunday of that week", () => {
    const today = new Date(2026, 4, 3); // Sun 3 May
    const monday = new Date(2026, 3, 27);
    expect(isCurrentWeek(monday, today)).toBe(true);
  });
});
