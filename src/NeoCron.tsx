'use client';
import { DateTime } from 'luxon';
import { ReactElement, useState } from 'react';
import CronExpression from './components/CronExpression';
import ScheduleExplainer from './components/Schedule';
import ScheduleSelectors from './components/ScheduleSelectors';
import { arrayToString, stringToArray } from './lib/part';
import { Schedule, getSchedule } from './lib/schedule';
import { CronState, ValuePayload } from './types';

// interface Props {
//   cronString: string; //the cron string itself
//   isValid: boolean; //true is the string is valid
//   defaultCronString: string; //if you want to specify a default cron string to start with
// }

export default function NeoCron(): ReactElement {
  // const { cronString, isValid, defaultCronString } = props;
  const updateSchedule = (state: CronState): CronState => {
    const newSchedule = getSchedule(state.array);
    setSchedule(newSchedule);
    return {
      ...state,
      next: newSchedule.next().toLocaleString(DateTime.DATETIME_FULL),
    };
  };

  const getInitialState = (): CronState => {
    const expression = '* * * * *';
    const array = stringToArray(expression);
    return updateSchedule({
      expression,
      array,
      error: '',
      next: '',
    });
  };

  const [schedule, setSchedule] = useState<Schedule>(
    new Schedule(stringToArray('* * * * *'))
  );
  const [state, setState] = useState<CronState>(getInitialState);
  const [resetSelectedValues, setResetSelectedValues] =
    useState<boolean>(false);

  const setExpression = (expression: string) => {
    let newState: CronState = { ...state, expression, error: '' };
    try {
      newState.array = stringToArray(expression);
      newState = updateSchedule(newState);
    } catch (e: any) {
      newState.error = e.message;
    }
    setState(newState);
  };

  const setValue = (payload: ValuePayload) => {
    const newArray = [...state.array];
    newArray[payload.index] = payload.values;

    let newState: CronState = { ...state, array: newArray, error: '' };
    try {
      newState.expression = arrayToString(newState.array);
      newState = updateSchedule(newState);
    } catch (e: any) {
      newState.error = e.message;
    }
    setState(newState);
  };

  const setError = (error: string) => {
    setState({ ...state, error: error });
  };

  const resetSchedule = () => {
    schedule.reset;
    setState(getInitialState());
    setResetSelectedValues(true);
  };

  return (
    <div className="flex flex-col space-y-6">
      <CronExpression state={state} setExpression={setExpression} />
      <div className="flex items-center space-x-3">
        <div className="flex-1 bg-gray-300 h-[1px]"></div>
        <span className="text-gray-600 text-sm bg-white px-3">or</span>
        <div className="flex-1 bg-gray-300 h-[1px]"></div>
      </div>
      <ScheduleSelectors
        setValue={setValue}
        resetSchedule={resetSchedule}
        state={state}
        resetSelectedValues={resetSelectedValues}
        setResetSelectedValues={setResetSelectedValues}
        setError={setError}
      />
      <ScheduleExplainer state={state} />
    </div>
  );
}

//TODO: update responsiveness

//TODO: fix bug where if you select a value from the beignning and then unselect it it throws an erorr saying that it can't be empty but it should just go back to default all

//implement easy and advanced mode

/*
switch c {
	case "@yearly" =  "0 0 1 1 *"
	case "@monthly" = "0 0 1 * *"
	case "@weekly" = "0 0 * * 0"
	case "@daily", "@midnight" =  "0 0 * * *"
	case "@hourly" = "0 * * * *"

*/
