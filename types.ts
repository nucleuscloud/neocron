export type CronState = {
  expression: string;
  array: number[][];
  error: string;
  prev: string;
  next: string;
};

export type ValuePayload = {
  index: number;
  values: number[];
};

export type Unit = {
  name: "minute" | "hour" | "date" | "month" | "weekday";
  min: number;
  max: number;
  alt?: ReadonlyArray<string>;
};

export type Options = {
  outputHashes: boolean;
  outputWeekdayNames: boolean;
  outputMonthNames: boolean;
};

export type Error = "" | "invalid";
