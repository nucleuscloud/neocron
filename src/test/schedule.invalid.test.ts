import { stringToArray } from "../lib/part";
import { getSchedule } from "../lib/schedule";

const schedules = [
  {
    string: "* * 30 2 *",
    error: "Unable to find execution time for schedule",
  },
];
describe("Should throw", function () {
  schedules.forEach(function (schedule) {
    test("on invalid schedule " + schedule.string, function () {
      const parts = stringToArray(schedule.string);
      expect(() => getSchedule(parts).next()).toThrow(schedule.error);
    });
  });

  test("on invalid date", function () {
    const parts = stringToArray("* * * * *");
    expect(() => getSchedule(parts, NaN as any)).toThrow(
      "Invalid reference date provided"
    );
  });

  test("on invalid timezone", function () {
    const parts = stringToArray("* * * * *");
    expect(() => getSchedule(parts, new Date(), "Invalid/Invalid")).toThrow(
      "Invalid timezone provided"
    );
  });
});
