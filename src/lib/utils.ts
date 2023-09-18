import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Options } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultOptions: Options = {
  outputHashes: false,
  outputMonthNames: false,
  outputWeekdayNames: false,
};

//parses a value as an interger or returns a nuber
export const parseNumber = (value: unknown) => {
  if (typeof value === 'string') {
    const str: string = value.trim();
    if (/^\d+$/.test(str)) {
      const num = Number(str);
      if (!isNaN(num) && isFinite(num)) {
        return num;
      }
    }
  } else if (typeof value === 'number') {
    if (!isNaN(value) && isFinite(value) && value === Math.floor(value)) {
      return value;
    }
  }
  return undefined;
};

// Assert that a value is a valid cron array
export const assertValidArray = (arr: unknown) => {
  if (
    arr === undefined ||
    !Array.isArray(arr) ||
    arr.length !== 5 ||
    arr.some((element) => !Array.isArray(element))
  ) {
    throw new Error('Invalid cron array');
  }
};

// Creates an array of integers from start to end, inclusive
export const range = (start: number, end: number): number[] => {
  const array = [];
  for (let i = start; i <= end; i++) {
    array.push(i);
  }
  return array;
};

//Sorts an array of numbers
export const sort = (array: number[]) => [...array].sort((a, b) => a - b);

// Flattens a 2-dimensional array
export const flatten = (arrays: number[][]) =>
  ([] as number[]).concat.apply([], arrays);

// Removes duplicate entries from an array
export const dedup = (array: number[]) => {
  const result: number[] = [];
  array.forEach((i) => {
    if (result.indexOf(i) < 0) {
      result.push(i);
    }
  });
  return result;
};
