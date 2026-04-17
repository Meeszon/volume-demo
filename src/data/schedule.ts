import type { Day, Columns } from "../types";

export const DAYS: Day[] = [
  { id: "Monday", date: "24 Mar" },
  { id: "Tuesday", date: "25 Mar" },
  { id: "Wednesday", date: "26 Mar" },
  { id: "Thursday", date: "27 Mar" },
  { id: "Friday", date: "28 Mar" },
  { id: "Saturday", date: "29 Mar" },
  { id: "Sunday", date: "30 Mar" },
];

export const initialData: Columns = {
  Monday: [],
  Tuesday: [
    { id: "1", title: "Weighted Pull Ups", subtitle: "4 Reps x 4 Sets", grade: "", accent: "#FF8B00" },
    { id: "2", title: "Lateral Raises", subtitle: "10 Reps x 3 Sets", grade: "", accent: "#FF8B00" },
  ],
  Wednesday: [],
  Thursday: [
    {
      id: "3",
      title: "General Warm Up",
      subtitle: "Cossack Squat, Leg Swings, Press Ups..",
      grade: "",
      accent: "#5CBBAE",
    },
    { id: "4", title: "Strength Intervals", subtitle: "5 Problems x 3 Sets", grade: "6C - 7A", accent: "#DA2128" },
  ],
  Friday: [],
  Saturday: [],
  Sunday: [],
};
