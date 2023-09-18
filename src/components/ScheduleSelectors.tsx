import { ReactElement, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getUnits } from '../lib/units';
import { CronState, ScheduleSelectorObject, ValuePayload } from '../types';
import Selector from './Selector';
import { Button } from './ui/button';

interface Props {
  setValue: (val: ValuePayload) => void;
  resetSchedule: () => void;
  state: CronState;
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
}

const scheduleSelector: ScheduleSelectorObject[] = [
  { name: 'year', prefix: 'on' },
  { name: 'month', prefix: 'on' },
  { name: 'weekday', prefix: 'on' },
  { name: 'day', prefix: 'and' },
  { name: 'hour', prefix: 'at' },
  { name: 'minute', prefix: ':' },
];

export default function ScheduleSelectors(props: Props): ReactElement {
  const {
    setValue,
    resetSchedule,
    state,
    resetSelectedValues,
    setResetSelectedValues,
  } = props;
  const [selectedsSchedule, setSelectedSchedule] = useState<string>('year');
  const units = getUnits();

  const handleSelectors = () => {
    const index = scheduleSelector.findIndex(
      (ind) => ind.name == selectedsSchedule
    );
    return scheduleSelector.slice(index + 1).map((opt) => {
      //add 1 to the index so only the selectors after the selected value are returned
      const unit = units.find((unit) => unit.name === opt.name);

      if (!unit) {
        return null;
      }

      return (
        <div key={opt.name} className="flex flex-row items-center space-x-3">
          <div className="pt-4 text-sm">{opt.prefix}</div>
          <div>
            <Selector
              unit={unit}
              index={units.findIndex((unit) => unit.name === opt.name)}
              setValue={setValue}
              state={state}
              resetSelectedValues={resetSelectedValues}
              setResetSelectedValues={setResetSelectedValues}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full items-start lg:items-end space-x-3">
      <div className="flex flex-row items-center space-x-3">
        <div className="whitespace-nowrap text-sm lg:p-0 pl-3">Run every</div>
        <Select onValueChange={(opt: string) => setSelectedSchedule(opt)}>
          <SelectTrigger>
            <SelectValue placeholder={selectedsSchedule} />
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
      <div>
        <Button onClick={resetSchedule} variant="destructive">
          Reset
        </Button>
      </div>
    </div>
  );
}
