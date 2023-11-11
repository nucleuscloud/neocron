import { arrayToString } from "../lib/part";

const invalidCron = [
  {
    array: [],
    error: "Invalid cron array",
  },
  {
    array: [[], [], [], [], []],
    error: "Empty interval value for minute",
  },
  {
    array: [0, [], [], [], []] as number[][],
    error: "Invalid cron array",
  },
  {
    array: [["a"], [1], [1], [1], [1]] as number[][],
    error: 'Invalid value "a" for minute',
  },
  {
    array: [["12e5"], [1], [1], [1], [1]] as number[][],
    error: 'Invalid value "12e5" for minute',
  },
  {
    array: [[0], [0], [0], [0], [0]],
    error: 'Value "0" out of range for day',
  },
  {
    array: [[1.5], [1], [1], [1], [1]],
    error: 'Invalid value "1.5" for minute',
  },
  {
    array: [[-2], [1], [1], [1], [1]],
    error: 'Value "-2" out of range for minute',
  },
];

describe("Should throw on invalid cron array", function () {
  invalidCron.forEach(function (invalid) {
    test(invalid.array.toString(), function () {
      expect(() => arrayToString(invalid.array)).toThrow(invalid.error);
    });
  });
});
