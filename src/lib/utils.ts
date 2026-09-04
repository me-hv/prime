import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfWeek, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatReadableDate(dateString?: string | Date): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "EEEE, MMMM d, yyyy");
}

export function formatShortDate(dateString?: string | Date): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "MMM d");
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "GOOD MORNING";
  } else if (hour >= 12 && hour < 17) {
    return "GOOD AFTERNOON";
  } else if (hour >= 17 && hour < 22) {
    return "GOOD EVENING";
  } else {
    return "LATE NIGHT FOCUS";
  }
}

export function getCurrentWeekDates(): string[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
  return Array.from({ length: 7 }).map((_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  );
}
