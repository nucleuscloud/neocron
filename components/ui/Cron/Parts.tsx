import { ReactElement, useState } from "react";
import Part from "./Part";
import { getUnits } from "@/lib/units";
import { CronState, ValuePayload } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  state: CronState;
  setValue: (val: ValuePayload) => void;
}

let workflowOptions = [
  { name: "year", prefix: "on" },
  { name: "month", prefix: "on" },
  { name: "weekday", prefix: "on" },
  { name: "day", prefix: "and" },
  { name: "hour", prefix: "at" },
  { name: "minute", prefix: ":" },
];

export default function Parts(props: Props): ReactElement {
  const { setValue, state } = props;
  const [start, setStart] = useState<string>("");
  const units = getUnits();

  const handleWorkflow = () => {
    const index = workflowOptions.findIndex((ind) => ind.name == start);
    return workflowOptions.slice(index + 1).map((opt) => {
      //add 1 to the index so only the selectors after the selected value are returned
      const unit = units.find((unit) => unit.name === opt.name);

      if (!unit) {
        return null;
      }

      return (
        <div key={opt.name} className="flex flex-row">
          <div>{opt.prefix}</div>
          <div>
            <Part
              unit={unit}
              index={units.findIndex((unit) => unit.name === opt.name)}
              state={state}
              setValue={setValue}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-row items-center w-full">
      <div className="flex flex-row space-x-2 items-center">
        <div>I want to run this job every</div>
        <Select onValueChange={(opt: string) => setStart(opt)}>
          <SelectTrigger>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {workflowOptions.map((opt) => (
                <SelectItem value={opt.name} key={opt.name}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {handleWorkflow()}
      {/* <div>
        {getUnits().map((unit, index) => (
          <Part
            unit={unit}
            key={unit.name}
            index={index}
            state={state}
            setValue={setValue}
          />
        ))}
      </div> */}
    </div>
  );
}
