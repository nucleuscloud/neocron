import { ReactElement, useState } from "react";
import Selector from "./Selector";
import { getUnits } from "@/lib/units";
import { CronState, ScheduleSelectorObject, ValuePayload } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  setValue: (val: ValuePayload) => void;
}

const scheduleSelector: ScheduleSelectorObject[] = [
  { name: "year", prefix: "on" },
  { name: "month", prefix: "on" },
  { name: "weekday", prefix: "on" },
  { name: "day", prefix: "and" },
  { name: "hour", prefix: "at" },
  { name: "minute", prefix: ":" },
];

export default function ScheduleSelectors(props: Props): ReactElement {
  const { setValue } = props;
  const [schedule, setSchedule] = useState<string>("year");
  const units = getUnits();

  const handleSelectors = () => {
    const index = scheduleSelector.findIndex((ind) => ind.name == schedule);
    return scheduleSelector.slice(index + 1).map((opt) => {
      //add 1 to the index so only the selectors after the selected value are returned
      const unit = units.find((unit) => unit.name === opt.name);

      if (!unit) {
        return null;
      }

      return (
        <div
          key={opt.name}
          className="flex flex-row items-center space-x-2 p-2"
        >
          <div>{opt.prefix}</div>
          <div>
            <Selector
              unit={unit}
              index={units.findIndex((unit) => unit.name === opt.name)}
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
        <div>Run this job every</div>
        <Select onValueChange={(opt: string) => setSchedule(opt)}>
          <SelectTrigger>
            <SelectValue placeholder={schedule} />
          </SelectTrigger>
          <SelectContent>
            {scheduleSelector.map((opt) => (
              <SelectItem value={opt.name} key={opt.name}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {handleSelectors()}
    </div>
  );
}
