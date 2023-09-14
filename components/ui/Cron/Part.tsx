import { ReactElement, useState } from "react";
import { Range } from "@/lib/utils";
import { CronState, ValuePayload } from "@/types";

interface Props {
  id: string;
  min: number;
  max: number;
  index: number;
  state: CronState;
  setValue: (val: ValuePayload) => void;
}

export default function Part(props: Props): ReactElement {
  const { id, min, max, index, state, setValue } = props;
  const options = Range(min, max);

  return (
    <div className="mx-10 flex flex-col lg:flex-row">
      <div>
        <strong>{id}</strong>
      </div>
      <div>
        <select
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
        </select>
      </div>
    </div>
  );
}
