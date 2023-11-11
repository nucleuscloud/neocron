import { stringToArray } from "../lib/part";

const invalidCron = [
  {
    string: undefined as any,
    error: "Invalid cron expression",
  },
  {
    string: null as any,
    error: "Invalid cron expression",
  },
  {
    string: NaN as any,
    error: "Invalid cron expression",
  },
  {
    string: "",
    error: "Invalid cron string format",
  },
  {
    string: "0",
    error: "Invalid cron string format",
  },
  {
    string: "0 0 0 0 0",
    error: 'Value "0" out of range for day',
  },
  {
    string: "0 0 0 1 0",
    error: 'Value "0" out of range for day',
  },
  {
    string: "0 0 1 0 0",
    error: 'Value "0" out of range for month',
  },
  {
    string: "/ / / / /",
    error: 'Invalid value "/" for minute',
  },
  {
    string: "60 5 5 5 5",
    error: 'Value "60" out of range for minute',
  },
  {
    string: "/5 5 5 5 5",
    error: 'Invalid value "/5" for minute',
  },
  {
    string: "10-5/5 5 5 5 5",
    error: 'Max range is less than min range in "10-5" for minute',
  },
  {
    string: "* * 0 * *",
    error: 'Value "0" out of range for day',
  },
  {
    string: "* * * 0 *",
    error: 'Value "0" out of range for month',
  },
  {
    string: "0/5/5 * * 0 *",
    error: 'Invalid value "0/5/5" for minute',
  },
  {
    string: "5/a * * * *",
    error: 'Invalid interval step value "a" for minute',
  },
  {
    string: "5/ * * * *",
    error: 'Invalid interval step value "" for minute',
  },
];

describe("Should throw on invalid cron string", function () {
  invalidCron.forEach(function (invalid) {
    test(`${invalid.string}`, function () {
      expect(() => stringToArray(invalid.string)).toThrow(invalid.error);
    });
  });
});
