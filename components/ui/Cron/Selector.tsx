import { ReactElement } from "react";
import { CronState, Unit, ValuePayload } from "@/types";
import MultiSelect from "./MultiSelect";

interface Props {
  index: number;
  unit: Unit;
  setValue: (val: ValuePayload) => void;
  state: CronState;
}

export default function Selector(props: Props): ReactElement {
  const { unit, index, setValue, state } = props;

  return (
    <MultiSelect
      options={unit}
      state={state}
      onChange={(e) => {
        setValue({ index, values: e.map(Number) });
      }}
      index={index}
    />
  );
}
