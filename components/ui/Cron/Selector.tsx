import { ReactElement } from "react";
import { CronState, Unit, ValuePayload } from "@/types";
import MultiSelect from "./MultiSelect";

interface Props {
  index: number;
  unit: Unit;
  setValue: (val: ValuePayload) => void;
}

export default function Selector(props: Props): ReactElement {
  const { unit, index, setValue } = props;

  return (
    <div className="flex flex-col lg:flex-row items-center">
      <MultiSelect
        options={unit}
        onChange={(e) => {
          setValue({ index, values: e.map(Number) });
        }}
      />
    </div>
  );
}
