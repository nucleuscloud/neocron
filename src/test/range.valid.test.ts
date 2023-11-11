import { arrayToStringPart, stringToArrayPart } from "../lib/part";
import { units } from "../lib/units";

const validRanges = [
  {
    unit: units[4],
    input: "0-4",
    arr: [0, 1, 2, 3, 4],
    output: "0-4",
  },
  {
    unit: units[0],
    input: "1,2,3",
    arr: [1, 2, 3],
    output: "1-3",
  },
  {
    unit: units[4],
    input: "1,3,2,6,5,0,4",
    arr: [0, 1, 2, 3, 4, 5, 6],
    output: "*",
  },
  {
    unit: units[2],
    input: "1,2,5-10",
    arr: [1, 2, 5, 6, 7, 8, 9, 10],
    output: "1-2,5-10",
  },
  {
    unit: units[4],
    input: "*",
    arr: [0, 1, 2, 3, 4, 5, 6],
    output: "*",
  },
  {
    unit: units[2],
    input: "5",
    arr: [5],
    output: "5",
  },
  {
    unit: units[1],
    input: "1-10/5",
    arr: [1, 6],
    output: "1,6",
  },
  {
    unit: units[0],
    input: "5-30/5",
    arr: [5, 10, 15, 20, 25, 30],
    output: "5-30/5",
  },
  {
    unit: units[0],
    input: "5,10,15,20,25,30",
    arr: [5, 10, 15, 20, 25, 30],
    output: "5-30/5",
  },
  {
    unit: units[0],
    input: "5-20,35-45/5",
    arr: [
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 35, 40, 45,
    ],
    output: "5-20,35,40,45",
  },
  {
    unit: units[0],
    input: "5,5,6,6,7,7",
    arr: [5, 6, 7],
    output: "5-7",
  },
  {
    unit: units[4],
    input: "1-1",
    arr: [1],
    output: "1",
  },
];
describe("Should parse valid string", function () {
  validRanges.forEach(function (validRange) {
    const range = stringToArrayPart(validRange.input, validRange.unit);
    test(validRange.input + " as array", function () {
      expect(range).toEqual(validRange.arr);
    });
    test(validRange.input + " as string", function () {
      expect(
        arrayToStringPart(range, validRange.unit, {
          outputHashes: false,
          outputMonthNames: false,
          outputWeekdayNames: false,
        })
      ).toEqual(validRange.output);
    });
  });
});
