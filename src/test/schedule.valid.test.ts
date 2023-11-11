import { stringToArray } from '../lib/part';
import { getSchedule } from '../lib/schedule';

const schedules = [
  {
    schedule: '* * * * *',
    now: '2013-02-08T09:32:00.000Z',
    prev: '2013-02-08T04:31:00.000-05:00',
    next: '2013-02-08T04:32:00.000-05:00',
    timezone: 'America/New_York',
  },
  {
    schedule: '* * * * *',
    now: '2013-02-08T09:32:15.000+00:00',
    prev: '2013-02-08T04:32:00.000-05:00',
    next: '2013-02-08T04:33:00.000-05:00',
    timezone: 'America/New_York',
  },
  {
    schedule: '*/5 * * * *',
    now: '2013-02-08T09:32:15.000Z',
    prev: '2013-02-08T18:30:00.000+09:00',
    next: '2013-02-08T18:35:00.000+09:00',
    timezone: 'Asia/Tokyo',
  },
  {
    schedule: '30 1 * * *',
    now: '2013-02-08T19:32:15.000Z',
    prev: '2013-02-09T01:30:00.000+09:00',
    next: '2013-02-10T01:30:00.000+09:00',
    timezone: 'Asia/Tokyo',
  },
  {
    schedule: '30 1 1 * *',
    now: '2013-02-08T09:32:00.000Z',
    prev: '2013-02-01T01:30:00.000Z',
    next: '2013-03-01T01:30:00.000Z',
    timezone: 'utc',
  },
  {
    schedule: '30 1 * 1 *',
    now: '2013-02-08T09:32:00.000Z',
    prev: '2013-01-31T01:30:00.000Z',
    next: '2014-01-01T01:30:00.000Z',
    timezone: 'utc',
  },
  {
    schedule: '30 1 1 1 *',
    now: '2013-02-08T09:32:00.000Z',
    prev: '2013-01-01T01:30:00.000Z',
    next: '2014-01-01T01:30:00.000Z',
    timezone: 'utc',
  },
  {
    schedule: '30 1 * * 5',
    now: '2013-02-15T09:32:00.000Z',
    prev: '2013-02-15T01:30:00.000Z',
    next: '2013-02-22T01:30:00.000Z',
    timezone: 'utc',
  },
  {
    schedule: '* 6 * * 1-1',
    now: '2013-02-15T09:32:15.000Z',
    prev: '2013-02-11T06:59:00.000Z',
    next: '2013-02-18T06:00:00.000Z',
    timezone: 'utc',
  },
];
describe('Should output execution time for valid schedule', function () {
  schedules.forEach(function (s) {
    const parts = stringToArray(s.schedule);
    const schedule = getSchedule(parts, s.now, s.timezone);
    test(`should find next schedule for ${s.schedule} in ${s.timezone}`, function () {
      expect(schedule.next().toJSON()).toEqual(s.next);
      schedule.reset();
    });
    test(`should find prev schedule for ${s.schedule} in ${s.timezone}`, function () {
      expect(schedule.prev().toJSON()).toEqual(s.prev);
    });
  });
});

describe('Should output execution time for valid schedule twice', function () {
  const expression = '*/5 * * * *';
  const parts = stringToArray(expression);
  const schedule = getSchedule(parts, '2013-02-08T09:32:15.000Z', 'utc');
  test(`should find schedule for '${expression}'`, function () {
    expect(schedule.next().toJSON()).toEqual('2013-02-08T09:35:00.000Z');
    expect(schedule.next().toJSON()).toEqual('2013-02-08T09:40:00.000Z');
  });
});
