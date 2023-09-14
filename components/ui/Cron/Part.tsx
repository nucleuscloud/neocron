import { ReactElement, useState } from "react";
import { Range } from "@/lib/utils";
import { CronState, Unit, ValuePayload } from "@/types";
import MultiSelect from "./MultiSelect";

interface Props {
  // id: string;
  // min: number;
  // max: number;
  index: number;
  unit: Unit;
  state: CronState;
  setValue: (val: ValuePayload) => void;
}

export default function Part(props: Props): ReactElement {
  const { unit, state, index, setValue } = props;
  const options = Range(unit.min, unit.max);

  return (
    <div className="mx-10 flex flex-col lg:flex-row">
      <div>
        <strong>{unit.name}</strong>
      </div>
      <div>
        <MultiSelect options={unit} />
        {/* <select
          id={id}
          className="form-control"
          multiple={true}
          value={state.array[index]?.map(String)}
          size={60}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.options)
              .filter((o) => o.selected)
              .map((o) => Number(o.value));
            setValue({ index, values: selectedValues });
          }}
        >
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}
