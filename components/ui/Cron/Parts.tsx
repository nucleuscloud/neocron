import { ReactElement } from "react";
import Part from "./Part";
import { getUnits } from "@/lib/units";
import { CronState, ValuePayload } from "@/types";

interface Props {
  state: CronState;
  setValue: (val: ValuePayload) => void;
}

export default function Parts(props: Props): ReactElement {
  const { setValue, state } = props;
  return (
    <div style={{ display: "flex" }}>
      {getUnits().map((unit, index) => (
        <Part
          unit={unit}
          key={unit.name}
          // key={unit.name}
          // id={unit.name}
          index={index}
          // min={unit.min}
          // max={unit.max}
          state={state}
          setValue={setValue}
        />
      ))}
    </div>
  );
}
