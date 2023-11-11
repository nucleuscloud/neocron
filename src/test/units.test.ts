import { getUnits } from "../lib/units";

describe("getUnits", function () {
  test("should returns units", function () {
    expect(getUnits().map((unit) => unit.name)).toEqual([
      "minute",
      "hour",
      "day",
      "month",
      "weekday",
    ]);
  });
});
