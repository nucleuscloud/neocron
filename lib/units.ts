import { Unit } from "@/types";

//the default unit definitions for each of the cron time selections
export const units: Unit[] = [
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  {
    name: "weekday",
    min: 0,
    max: 6,
    alt: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
];

//turns the min and max in the option into an array with all of the values
//between min and max inclusive of the min and max so we can render them in the multi-select

export const spreadOption = (option: Unit) => {
  let spreadArr: string[] = [];
  for (var i = option.min; i <= option.max; i++) {
    spreadArr.push(String(i));
  }
  return spreadArr;
};

//Returns a readonly version of the unit array
export function getUnits() {
  return units;
}
