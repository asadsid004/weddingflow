import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function convertTo24Hour(time12: string): string {
  const [time, period] = time12.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  const hours24 = period === "PM" && hours !== 12 ? hours + 12 : hours;
  return `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}