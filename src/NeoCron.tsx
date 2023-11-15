'use client';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useState } from 'react';
import CronExpression from './components/CronExpression';
import ScheduleExplainer from './components/ScheduleExplainer';
import ScheduleSelectors from './components/ScheduleSelectors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import './globals.css';
import { arrayToString, stringToArray } from './lib/part';
import { Schedule, getSchedule } from './lib/schedule';
import { CronState, ValuePayload } from './types';

const baseCron = '* * * * *';

interface Props {
  cronString: string;
  defaultCronString?: string;
  setCronString?: (val: string) => void; //updates the cron string itself
  disableInput?: boolean; //disable the input and only have drop down selectors
  disableSelectors?: boolean; //disable the selectors and only have the input
  disableExplainerText?: boolean; //disables the schedule explainer text
  selectorText?: string; //the text in front of the first selector; can be empty
}

export default function NeoCron(props: Props): ReactElement {
  const {
    cronString,
    defaultCronString,
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
    const cs =
      cronString !== defaultCronString
        ? cronString ?? baseCron
        : defaultCronString;
    return updateSchedule({
      expression: cs,
      array: stringToArray(cs),
      error: '',
      next: '',
    });
  };

  const [schedule, setSchedule] = useState<Schedule>(
    new Schedule(stringToArray(defaultCronString ?? baseCron))
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
    setCronState(
      updateSchedule({
        expression: defaultCronString ?? baseCron,
        array: stringToArray(defaultCronString ?? baseCron),
        error: '',
        next: '',
      })
    );
    setResetSelectedValues(true);
  };

  return (
    <div>
      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Schedule Builder</TabsTrigger>
          <TabsTrigger value="string">Cron String</TabsTrigger>
        </TabsList>
        <TabsContent value="builder">
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
        </TabsContent>
        <TabsContent value="string">
          {!disableInput && (
            <CronExpression
              cronState={cronState}
              setExpression={setExpression}
            />
          )}
        </TabsContent>
      </Tabs>
      <div className="pt-4">
        <ScheduleExplainer
          state={cronState}
          disableExplainerText={disableExplainerText}
        />
      </div>
    </div>
  );
}
