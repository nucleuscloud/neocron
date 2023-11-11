import { dedup, flatten, parseNumber, range, sort } from '../lib/utils';

const dedupArrray = [
  {
    input: [],
    output: [],
  },
  {
    input: [0, 0, 0],
    output: [0],
  },
  {
    input: [1, 1, 1, 2, 3, 4, 5, 6],
    output: [1, 2, 3, 4, 5, 6],
  },
  {
    input: [500, -1, 33, -1, 0, 0, 1, 1, -1],
    output: [500, -1, 33, 0, 1],
  },
];
describe('Should de-dup arrays', function () {
  dedupArrray.forEach(function (array) {
    test(`[${array.input}]`, function () {
      expect(dedup(array.input)).toEqual(array.output);
    });
  });
});

const flattenArrays = [
  {
    input: [],
    flattened: [],
  },
  {
    input: [[1], [2]],
    flattened: [1, 2],
  },
  {
    input: [
      [1, 5],
      [2, 6],
    ],
    flattened: [1, 5, 2, 6],
  },
];
describe('Should flatten arrays', function () {
  flattenArrays.forEach(function (array) {
    test(`[${array.input}]`, function () {
      expect(flatten(array.input)).toEqual(array.flattened);
    });
  });
});

describe('parseNumber', function () {
  [
    { input: 0.0, output: 0 },
    { input: 0, output: 0 },
    { input: '0', output: 0 },
    { input: 123, output: 123 },
    { input: '123', output: 123 },
    { input: '   123   ', output: 123 },
    { input: '0123   ', output: 123 },
    { input: '  000123  ', output: 123 },
  ].forEach(({ input, output }) => {
    test(`should parse '${input}'`, function () {
      expect(parseNumber(input)).toEqual(output);
    });
  });
  [
    '',
    ' ',
    '+123',
    '-123',
    '1.2',
    '1,2',
    '12e5',
    '12e-5',
    '0xAB',
    'foo',
    ' f00 ',
    'Infinity',
    '+Infinity',
    '-Infinity',
    null,
    undefined,
    true,
    false,
    10.1,
    0.1,
    Infinity,
    NaN,
    {},
  ].forEach((input) => {
    test(`should not parse '${input}'`, function () {
      expect(parseNumber(input)).toEqual(undefined);
    });
  });
});

const ranges = [
  {
    start: 5,
    end: 3,
    output: [],
  },
  {
    start: 0,
    end: 0,
    output: [0],
  },
  {
    start: 3,
    end: 5,
    output: [3, 4, 5],
  },
];
describe('Should create range arrays', function () {
  ranges.forEach(function (r) {
    test(`${r.start} to ${r.end}`, function () {
      expect(range(r.start, r.end)).toEqual(r.output);
    });
  });
});

const sortArrays = [
  {
    input: [],
    sorted: [],
  },
  {
    input: [0, 1],
    sorted: [0, 1],
  },
  {
    input: [1, 0],
    sorted: [0, 1],
  },
  {
    input: [1, 0, 1],
    sorted: [0, 1, 1],
  },
  {
    input: [5, 4, 3, 2, 1],
    sorted: [1, 2, 3, 4, 5],
  },
  {
    input: [42, 9, 17, 54, 602, -3, 54, 999, -11],
    sorted: [-11, -3, 9, 17, 42, 54, 54, 602, 999],
  },
];
describe('Should sort arrays', function () {
  sortArrays.forEach(function (array) {
    test(`[${array.input}]`, function () {
      expect(sort(array.input)).toEqual(array.sorted);
    });
  });
});
