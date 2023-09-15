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
    console.log("state in cr", state.array);
  };

  return (
    <div className="flex flex-col space-y-6">
      <CronExpression state={state} setExpression={setExpression} />
      <ScheduleSelectors
        setValue={setValue}
        resetSchedule={resetSchedule}
        state={state}
      />
      <ScheduleExplainer state={state} />
    </div>
  );
}

//TODO: fix the selected values showing on the chips when the schedule is reset
// and the ranges for when multiple values are selected in teh same selector

//TODO: fix the height of the commands to be taller, maybe even double column it for the longer values like minutes and dates

//TODO: fix the way that the error gets set

//TODO: when clicking on the select everythign shifts right, fix that

//TODO: align everything so that it looks nicely, probaby align at the bottom
