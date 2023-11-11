import { arrayToString, stringToArray } from "../lib/part";
import { getSchedule } from "../lib/schedule";

describe("Should throw on undefined param", () => {
  test("on arrayToString", () => {
    expect(() => arrayToString(undefined as any)).toThrow("Invalid cron array");
  });

  test("on stringToArray", () => {
    expect(() => stringToArray(undefined as any)).toThrow(
      "Invalid cron expression"
    );
  });

  test("on getSchedule", () => {
    expect(() => getSchedule(undefined as any)).toThrow("Invalid cron array");
  });
});
