" use client";
import { ReactElement, useEffect, useState } from "react";
import CronExpression from "./CronExpression";
import Info from "./Info";
import Parts from "./Parts";
import { DateTime } from "luxon";
import ScheduleExplainer from "./Schedule";
import { arrayToString, stringToArray } from "@/lib/part";
import { Schedule, getSchedule } from "@/lib/schedule";
import { CronState, Error, ValuePayload } from "@/types";

//TODO: fix the way that the error gets set

export default function Cron(): ReactElement {
  const updateSchedule = (state: CronState): CronState => {
    const schedule: Schedule = getSchedule(state.array);
    return {
      ...state,
      next: schedule.next().toLocaleString(DateTime.DATETIME_FULL),
      prev: schedule.prev().toLocaleString(DateTime.DATETIME_FULL),
    };
  };

  const getInitialState = (): CronState => {
    const expression = "*/15 0-11 1,10,20 * *";
    const array = stringToArray(expression);
    return updateSchedule({
      expression,
      array,
      error: "",
      prev: "",
      next: "",
    });
  };

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

  const [state, setState] = useState<CronState>(getInitialState);

  return (
    <div className="flex flex-col space-y-6">
      <div className="text-4xl text-gray-900 text-center">NeoCron</div>
      <Info />
      <CronExpression state={state} setExpression={setExpression} />
      <ScheduleExplainer state={state} />
      <Parts state={state} setValue={setValue} />
    </div>
  );
}