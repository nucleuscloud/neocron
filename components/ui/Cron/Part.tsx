import { ReactElement, useState } from "react";
import { CronState, Unit, ValuePayload } from "@/types";
import MultiSelect from "./MultiSelect";

interface Props {
  index: number;
  unit: Unit;
  state: CronState;
  setValue: (val: ValuePayload) => void;
}

export default function Part(props: Props): ReactElement {
  const { unit, state, index, setValue } = props;

  return (
    <div className="mx-10 flex flex-col lg:flex-row">
      <div>
        <strong>{unit.name}</strong>
      </div>
      <div>
        <MultiSelect
          options={unit}
          onChange={(e) => {
            setValue({ index, values: e.map(Number) });
          }}
        />
      </div>
    </div>
  );
}
