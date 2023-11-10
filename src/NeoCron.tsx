'use client';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useState } from 'react';
import CronExpression from './components/CronExpression';
import ScheduleExplainer from './components/ScheduleExplainer';
import ScheduleSelectors from './components/ScheduleSelectors';
import './globals.css';
import { arrayToString, stringToArray } from './lib/part';
import { Schedule, getSchedule } from './lib/schedule';
import { CronState, ValuePayload } from './types';

const defaultCronString = '* * * * *';

interface Props {
  setCronString?: (val: string) => void; //updates the cron string itself
  disableInput?: boolean; //disable the input and only have drop down selectors
  disableSelectors?: boolean; //disable the selectors and only have the input
  disableExplainerText?: boolean; //disables the schedule explainer text
  selectorText?: string; //the text in front of the first selector; can be empty
}

export default function NeoCron(props: Props): ReactElement {
  const {
    setCronString = () => {},
    disableInput = false,
    disableSelectors = false,
    disableExplainerText = false,
    selectorText = 'Run every',
  } = props;

  const updateSchedule = (state: CronState): CronState => {
    const newSchedule = getSchedule(state.array);
    setSchedule(newSchedule);
    return {
      ...state,
      next: newSchedule.next().toLocaleString(DateTime.DATETIME_FULL),
    };
  };

  const getInitialState = (): CronState => {
    return updateSchedule({
      expression: defaultCronString,
      array: stringToArray(defaultCronString),
      error: '',
      next: '',
    });
  };

  const [schedule, setSchedule] = useState<Schedule>(
    new Schedule(stringToArray(defaultCronString))
  );
  const [cronState, setCronState] = useState<CronState>(getInitialState);
  const [resetSelectedValues, setResetSelectedValues] =
    useState<boolean>(false);

  const setExpression = (expression: string) => {
    let newState: CronState = { ...cronState, expression, error: '' };
    try {
      newState.array = stringToArray(expression);
      newState = updateSchedule(newState);
    } catch (e: any) {
      newState.error = e.message;
    }
    setCronState(newState);
  };

  const constructCronState = (payload: ValuePayload) => {
    const newArray = [...cronState.array];
    newArray[payload.index] = payload.values;
    let newState: CronState = { ...cronState, array: newArray, error: '' };
    try {
      newState.expression = arrayToString(newState.array);
      newState = updateSchedule(newState);
    } catch (e: any) {
      newState.error = e.message;
    }

    if (newState.expression !== cronState.expression) {
      setCronState(newState);
    }
  };

  useEffect(() => {
    if (setCronString) {
      setCronString(cronState.expression);
    }
  }, [cronState.expression]);

  const setError = (error: string) => {
    setCronState({ ...cronState, error: error });
  };

  const resetSchedule = () => {
    schedule.reset();
    const initSchedule = getInitialState();
    setCronState(initSchedule);
    setResetSelectedValues(true);
  };

  return (
    <div className="neocron-container">
      {!disableInput && (
        <CronExpression cronState={cronState} setExpression={setExpression} />
      )}
      {disableInput ||
        (disableSelectors ? null : (
          <div className="flex-container">
            <div className="divider-line"></div>
            <span className="gray-text">or</span>
            <div className="divider-line"></div>
          </div>
        ))}
      {!disableSelectors && (
        <ScheduleSelectors
          constructCronState={constructCronState}
          resetSchedule={resetSchedule}
          cronState={cronState}
          resetSelectedValues={resetSelectedValues}
          setResetSelectedValues={setResetSelectedValues}
          setError={setError}
          selectorText={selectorText}
        />
      )}
      <ScheduleExplainer
        state={cronState}
        disableExplainerText={disableExplainerText}
      />
    </div>
  );
}
