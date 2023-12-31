import { Options, Unit } from '../types';
import { units } from './units';
import {
  assertValidArray,
  dedup,
  defaultOptions,
  flatten,
  parseNumber,
  range,
  sort,
} from './utils';

export function arrayToString(arr: number[][], options?: Partial<Options>) {
  assertValidArray(arr);
  const parts = arr.map((part, idx) =>
    arrayToStringPart(part, units[idx], { ...defaultOptions, ...options })
  );
  return parts.join(' ');
}

/**
 * Converts an array of numbers to a part of a cron string
 *
 * @param arr An array of numbers to convert
 * @param unit The unit for the part
 * @param options The formatting options to use
 * @return The part of a cron string
 */
export const arrayToStringPart = (
  arr: number[],
  unit: Unit,
  options: Options
) => {
  const values = sort(
    dedup(
      fixSunday(
        arr.map((value) => {
          const parsedValue = parseNumber(value);
          if (parsedValue === undefined) {
            throw getError(`Invalid value "${value}"`, unit);
          }
          return parsedValue;
        }),
        unit
      )
    )
  );
  if (!values.length) {
    throw getError('Empty interval value', unit);
  }
  assertInRange(values, unit);
  return toString(values, unit, options);
};

export function stringToArray(str: string) {
  if (typeof str !== 'string') {
    throw new Error(
      'Invalid cron expression, make sure you have spaces in between each expression'
    );
  }
  const parts = str.replace(/\s+/g, ' ').trim().split(' ');
  if (parts.length !== 5) {
    throw new Error('Invalid cron string format');
  } else {
    return parts.map((str, idx) => stringToArrayPart(str, units[idx]));
  }
}

/**
 * Converts a part of a cron string to an array of numbers
 *
 * @param str The part of a cron string to convert
 * @param unit The unit for the part
 * @return An array of numbers
 */
export const stringToArrayPart = (str: string, unit: Unit) => {
  const values = sort(
    dedup(
      fixSunday(
        flatten(
          replaceAlternatives(str, unit)
            .split(',')
            .map((value: string) => {
              const valueParts = value.split('/');
              if (valueParts.length > 2) {
                throw getError(`Invalid value "${str}"`, unit);
              }
              let parsedValues: number[];
              const left = valueParts[0];
              const right = valueParts[1];
              if (left === '*') {
                parsedValues = range(unit.min, unit.max);
              } else {
                parsedValues = parseRange(left, str, unit);
              }
              const step = parseStep(right, unit);
              return applyInterval(parsedValues, step);
            })
        ),
        unit
      )
    )
  );
  assertInRange(values, unit);
  return values;
};

/**
 * Returns the range as an array of ranges
 * defined as arrays of positive integers
 *
 * @param values An array of numbers
 * @return The range as a multi-dimentional array
 */
const toRanges = (values: number[]) => {
  const retval: number[][] = [];
  let startPart: number | undefined = undefined;
  values.forEach(function (value, index, self) {
    if (value !== self[index + 1] - 1) {
      if (startPart !== undefined) {
        retval.push([startPart, value]);
        startPart = undefined;
      } else {
        retval.push([value]);
      }
    } else if (startPart === undefined) {
      startPart = value;
    }
  });
  return retval;
};

/**
 * Converts an array of numbers to a part of a cron string
 *
 * @param values An array of numbers
 * @param unit The unit for the part
 * @param options The formatting options to use
 * @return The part of a cron string
 */
const toString = (values: number[], unit: Unit, options: Options) => {
  let retval = '';
  if (isFull(values, unit)) {
    if (options.outputHashes) {
      retval = 'H';
    } else {
      retval = '*';
    }
  } else {
    const step = getStep(values);
    if (step && isInterval(values, step)) {
      if (isFullInterval(values, unit, step)) {
        if (options.outputHashes) {
          retval = `H/${step}`;
        } else {
          retval = `*/${step}`;
        }
      } else {
        const min = values[0];
        const max = values[values.length - 1];
        const range =
          formatValue(min, unit, options) +
          '-' +
          formatValue(max, unit, options);
        if (options.outputHashes) {
          retval = `H(${range})/${step}`;
        } else {
          retval = `${range}/${step}`;
        }
      }
    } else {
      retval = toRanges(values)
        .map((range) => {
          if (range.length === 1) {
            return formatValue(range[0], unit, options);
          } else {
            return (
              formatValue(range[0], unit, options) +
              '-' +
              formatValue(range[1], unit, options)
            );
          }
        })
        .join(',');
    }
  }
  return retval;
};

/**
 * Formats weekday and month names as string
 * when the relevant options are set
 *
 * @param value The value to format
 * @param unit The unit for the part
 * @param options The formatting options to use
 * @return The formatted string or number
 */
const formatValue = (value: number, unit: Unit, options: Options) => {
  if (
    (options.outputWeekdayNames && unit.name === 'weekday') ||
    (options.outputMonthNames && unit.name === 'month')
  ) {
    if (unit.alt) {
      return unit.alt[value - unit.min];
    }
  }
  return value;
};

/**
 * Creates an `Error`, appends the unit name to the message
 *
 * @param error The error message
 * @param unit The unit for the part
 * @return The `Error`
 */
export const getError = (error: string, unit: Unit) =>
  new Error(`${error} for ${unit.name}`);

/**
 * Parses a range string
 *
 * @param rangeString The range string
 * @param context The operation context string
 * @param unit The unit for the part
 * @return The resulting array
 */
const parseRange = (rangeString: string, context: string, unit: Unit) => {
  const subparts = rangeString.split('-');
  if (subparts.length === 1) {
    const value = parseNumber(subparts[0]);
    if (value === undefined) {
      throw getError(`Invalid value "${context}"`, unit);
    }
    return [value];
  } else if (subparts.length === 2) {
    const minValue = parseNumber(subparts[0]);
    const maxValue = parseNumber(subparts[1]);
    if (minValue === undefined || maxValue === undefined) {
      throw getError(`Invalid value "${context}"`, unit);
    }
    if (maxValue < minValue) {
      throw getError(
        `Max range is less than min range in "${rangeString}"`,
        unit
      );
    }
    return range(minValue, maxValue);
  } else {
    throw getError(`Invalid value "${rangeString}"`, unit);
  }
};

/**
 * Parses the step from a part string
 *
 * @param step The step string
 * @param unit The unit for the part
 * @return The step value
 */
const parseStep = (step: string, unit: Unit) => {
  if (step !== undefined) {
    const parsedStep = parseNumber(step);
    if (parsedStep === undefined) {
      throw getError(`Invalid interval step value "${step}"`, unit);
    }
    return parsedStep;
  }
  return 0;
};

/**
 * Applies an interval step to a collection of values
 *
 * @param values An array of numbers
 * @param step The step value
 * @return The resulting array
 */
const applyInterval = (values: number[], step: number) => {
  if (step) {
    const minVal = values[0];
    values = values.filter(
      (value) => value % step === minVal % step || value === minVal
    );
  }
  return values;
};

/**
 * Replace all `7` with `0` as Sunday can be represented by both
 *
 * @param values An array of numbers
 * @param unit The unit for the part
 * @return The resulting array
 */
const fixSunday = (values: number[], unit: Unit) => {
  if (unit.name === 'weekday') {
    values = values.map((value) => {
      if (value === 7) {
        return 0;
      }
      return value;
    });
  }
  return values;
};

/**
 * Replaces the alternative representations of numbers in a string
 *
 * @param str The string to process
 * @param unit The unit for the part
 * @return The resulting string
 */
const replaceAlternatives = (str: string, unit: Unit) => {
  if (unit.alt) {
    str = str.toUpperCase();
    for (let i = 0; i < unit.alt.length; i++) {
      str = str.replace(unit.alt[i], String(i + unit.min));
    }
  }
  return str;
};

/**
 * Asserts that all `values` are in range for `unit`
 *
 * @param values The values to test
 * @param unit The unit for the part
 */
const assertInRange = (values: number[], unit: Unit) => {
  const first = values[0];
  const last = values[values.length - 1];
  if (first < unit.min) {
    throw getError(`Value "${first}" out of range`, unit);
  } else if (last > unit.max) {
    throw getError(`Value "${last}" out of range`, unit);
  }
};

/**
 * Returns `true` if the range can be represented as an interval
 *
 * @param values An array of numbers
 * @param step The difference between numbers in the interval
 * @return `true` or `false`
 */
const isInterval = (values: number[], step: number) => {
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    const value = values[i];
    if (value - prev !== step) {
      return false;
    }
  }
  return true;
};

/**
 * Returns `true` if the range contains all the interval values
 *
 * @param values An array of numbers
 * @param unit The unit for the part
 * @param step The difference between numbers in the interval
 * @return `true` or `false`
 */
const isFullInterval = (values: number[], unit: Unit, step: number) => {
  const min = values[0];
  const max = values[values.length - 1];
  const haveAllValues = values.length === (max - min) / step + 1;
  if (min === unit.min && max + step > unit.max && haveAllValues) {
    return true;
  }
  return false;
};

/**
 * Returns the difference between first and second elements in the range
 *
 * @param values An array of numbers
 * @return The size of the step
 */
const getStep = (values: number[]) => {
  if (values.length > 2) {
    const step = values[1] - values[0];
    if (step > 1) {
      return step;
    }
  }
  return 0;
};

/**
 * Returns true if range has all the values of the unit
 *
 * @param values An array of numbers
 * @param unit The unit for the part
 * @return `true` or `false`
 */
export const isFull = (values: number[], unit: Unit) => {
  return values.length === unit.max - unit.min + 1;
};

/**
 * Returns a ranged value from an array of numbers if it can
 * iterates through values until it reaches a gap or end of array and then pushes that into the return array
 * @param values An array of numbers
 * @return array of numbers
 */

export const createRanges = (values: number[]): string[] => {
  const aggregated: string[] = [];

  let startRange: number | null = null;

  for (let i = 0; i < values.length; i++) {
    if (startRange == null) {
      startRange = values[i];
    }

    if (i == values.length - 1 || values[i + 1] !== values[i] + 1) {
      if (startRange === values[i]) {
        aggregated.push(startRange.toString());
      } else {
        aggregated.push(`${startRange}-${values[i]}`);
      }
      startRange = null;
    }
  }

  return aggregated;
};
