import { arrayToString, stringToArray } from "../lib/part";

describe("output strings", function () {
  test("Should output weekdays as strings", function () {
    const parts = stringToArray("* * * 1-3 1-5");
    expect(arrayToString(parts, { outputWeekdayNames: true })).toEqual(
      "* * * 1-3 Mon-Fri"
    );
  });
  test("Should not output weekdays in step", function () {
    const parts = stringToArray("* * * 1-3 */2");
    expect(arrayToString(parts, { outputWeekdayNames: true })).toEqual(
      "* * * 1-3 */2"
    );
  });
  test("Should output month names as strings 1", function () {
    const parts = stringToArray("* * * 1-3 1-5");
    expect(arrayToString(parts, { outputMonthNames: true })).toEqual(
      "* * * Jan-Mar 1-5"
    );
  });
  test("Should output month names as strings 2", function () {
    const parts = stringToArray("* * * 5-10 1-5");
    expect(arrayToString(parts, { outputMonthNames: true })).toEqual(
      "* * * May-Oct 1-5"
    );
  });
  test("Should not output month names in step", function () {
    const parts = stringToArray("* * * */2 1-5");
    expect(arrayToString(parts, { outputMonthNames: true })).toEqual(
      "* * * */2 1-5"
    );
  });
  test("Should output correct string when min and max range values are the same", function () {
    const parts = stringToArray("* * * * 1-1");
    expect(arrayToString(parts, { outputWeekdayNames: true })).toEqual(
      "* * * * Mon"
    );
  });
});
