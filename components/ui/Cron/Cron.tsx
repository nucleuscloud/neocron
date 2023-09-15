"use client";
import { ReactElement, useState } from "react";
import CronExpression from "./CronExpression";
import ScheduleSelectors from "./ScheduleSelectors";
import { DateTime } from "luxon";
import ScheduleExplainer from "./Schedule";
import { arrayToString, stringToArray } from "@/lib/part";
import { Schedule, getSchedule } from "@/lib/schedule";
import { CronState, ValuePayload } from "@/types";

export default function Cron(): ReactElement {
  const updateSchedule = (state: CronState): CronState => {
    const newSchedule = getSchedule(state.array);
    setSchedule(newSchedule);
    return {
      ...state,
      next: newSchedule.next().toLocaleString(DateTime.DATETIME_FULL),
    };
  };

  const getInitialState = (): CronState => {
    const expression = "* * * * *";
    const array = stringToArray(expression);
    return updateSchedule({
      expression,
      array,
      error: "",
      next: "",
    });
  };

  const [schedule, setSchedule] = useState<Schedule>(
    new Schedule(stringToArray("* * * * *"))
  );
  const [state, setState] = useState<CronState>(getInitialState);
  const [resetSelectedValues, setResetSelectedValues] =
    useState<boolean>(false);

  const setExpression = (expression: string) => {
    let newState: CronState = { ...state, expression, error: "" };
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

    let newState: CronState = { ...state, array: newArray, error: "" };
    try {
      newState.expression = arrayToString(newState.array);
      newState = updateSchedule(newState);
    } catch (e: any) {
      newState.error = e.message;
    }
    setState(newState);
  };

  const resetSchedule = () => {
    schedule.reset;
    setState(getInitialState());
    setResetSelectedValues(true);
  };

  return (
    <div className="flex flex-col space-y-6">
      <CronExpression state={state} setExpression={setExpression} />
      <ScheduleSelectors
        setValue={setValue}
        resetSchedule={resetSchedule}
        state={state}
        resetSelectedValues={resetSelectedValues}
        setResetSelectedValues={setResetSelectedValues}
      />
      <ScheduleExplainer state={state} />
    </div>
  );
}

//TODO: fix the ranges for when multiple values are selected in teh same selector

//TODO: maybe even double column it for the longer values like minutes and dates

//TODO: fix the way that the error gets set

//TODO-stretch: update the selectors when someone manually enters in a cron expression

//TODO: update responsiveness
