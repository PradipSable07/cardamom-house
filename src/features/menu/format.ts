import type { NextOpening } from "./hours";
import type { Weekday } from "./types";

// English copy, so English number conventions: €11.50 rather than pt-PT's 11,50 €.
const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export function formatPrice(amount: number): string {
  return eur.format(amount);
}

/** 480 → "08:00" (24-hour, as Lisbon writes it). */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatWeekday(day: Weekday): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/** "today from 08:00" · "tomorrow, Tuesday, from 08:00" · "on Thursday from 09:00" */
export function describeNextOpening(next: NextOpening): string {
  const time = formatTime(next.opensAt);
  if (next.daysAway === 0) return `today from ${time}`;
  if (next.daysAway === 1) return `tomorrow, ${formatWeekday(next.day)}, from ${time}`;
  return `on ${formatWeekday(next.day)} from ${time}`;
}

/** "+351 21 123 4567" → "tel:+351211234567" */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** "@cardamomhouse" → "https://www.instagram.com/cardamomhouse/" */
export function toInstagramUrl(handle: string): string {
  return `https://www.instagram.com/${encodeURIComponent(handle.replace(/^@/, ""))}/`;
}

export function toMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
