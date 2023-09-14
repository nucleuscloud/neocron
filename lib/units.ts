import { Unit } from "@/types";

//the default unit definitions for each of the cron time selections

export const units: ReadonlyArray<Unit> = Object.freeze([
  {
    name: "minute",
    min: 0,
    max: 59,
  },
  {
    name: "hour",
    min: 0,
    max: 23,
  },
  {
    name: "day",
    min: 1,
    max: 31,
  },
  {
    name: "month",
    min: 1,
    max: 12,
    alt: [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ],
  },
  {
    name: "weekday",
    min: 0,
    max: 6,
    alt: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  },
]);

/**
 * Returns a readonly array of cron units.
 * These specify the minimum and maximum values
 * for each part of a cron expression, as well as
 * the unit name and any alternative respresentations
 * for the values of that unit.
 *
 * @returns The `units` array
 */
export function getUnits() {
  return units;
}
