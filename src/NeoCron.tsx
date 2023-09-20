'use client';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useState } from 'react';
import CronExpression from './components/CronExpression';
import ScheduleExplainer from './components/Schedule';
import ScheduleSelectors from './components/ScheduleSelectors';
import { arrayToString, stringToArray } from './lib/part';
import { Schedule, getSchedule } from './lib/schedule';
import { CronState, ValuePayload } from './types';

interface Props {
  value: string; //the cron string itself
  defaultValue: string; //if you want to specify a default cron string to start with
  disableInput: boolean; //disable the input and only have drop down selectors
  disableSelectors: boolean; //disable the selectors and only have the input
  selectorText: string; //the text in front of the first selector; can be empty
  inputText: string; //the text above the input
}

export default function NeoCron(props: Props): ReactElement {
  const { value, defaultValue, selectorText, inputText } = props;
  const updateSchedule = (state: CronState): CronState => {
    const newSchedule = getSchedule(state.array);
    setSchedule(newSchedule);
    return {
      ...state,
      next: newSchedule.next().toLocaleString(DateTime.DATETIME_FULL),
    };
  };

  const getInitialState = (): CronState => {
    const expression = defaultValue ? defaultValue : '* * * * *';
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

  useEffect(() => {}, [state.expression]);

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
      <CronExpression
        state={state}
        setExpression={setExpression}
        inputText={inputText}
      />
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
        selectorText={selectorText}
      />
      <ScheduleExplainer state={state} />
    </div>
  );
}

//TODO: update props

//TODO: update responsiveness

//TODO: fix bug where if you select a value from the beignning and then unselect it it throws an erorr saying that it can't be empty but it should just go back to default all
