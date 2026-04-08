import { parseISO } from "date-fns";

// Meal period values matching the Prisma enum — defined locally so this file
// can be imported from both server and client components.
export const MealPeriod = {
  BREAKFAST: "BREAKFAST",
  LUNCH: "LUNCH",
  DINNER: "DINNER",
} as const;

export type MealPeriodType = (typeof MealPeriod)[keyof typeof MealPeriod];

export function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TJ-${code}`;
}

export function getMealPeriod(time: string): MealPeriodType {
  const [hours] = time.split(":").map(Number);
  if (hours < 12) return MealPeriod.BREAKFAST;
  if (hours < 18) return MealPeriod.LUNCH;
  return MealPeriod.DINNER;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return d.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getDayOfWeek(date: Date | string): number {
  const d = typeof date === "string" ? parseISO(date) : date;
  // Convert JS day (0=Sun) to our schema (0=Mon)
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export const MEAL_PERIOD_LABELS: Record<string, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
};
