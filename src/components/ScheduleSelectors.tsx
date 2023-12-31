import { ReactElement, useState } from 'react';
import { getUnits } from '../lib/units';
import { CronState, ScheduleSelectorObject, ValuePayload } from '../types';
import MultiSelect from './MultiSelect';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Props {
  constructCronState: (val: ValuePayload) => void;
  resetSchedule: () => void;
  cronState: CronState;
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
  setError: (val: string) => void;
  selectorText?: string;
}

const scheduleSelector: ScheduleSelectorObject[] = [
  { name: 'year', prefix: 'on' },
  { name: 'weekday', prefix: 'on' },
  { name: 'month', prefix: 'on' },
  { name: 'day', prefix: 'and' },
  { name: 'hour', prefix: 'at' },
  { name: 'minute', prefix: ':' },
];

export default function ScheduleSelectors(props: Props): ReactElement {
  const {
    constructCronState,
    resetSchedule,
    cronState,
    resetSelectedValues,
    setResetSelectedValues,
    setError,
    selectorText,
  } = props;
  const [selectedSchedule, setSelectedSchedule] = useState<string>('year');
  const units = getUnits();

  const handleSelectors = () => {
    const index = scheduleSelector.findIndex(
      (ind) => ind.name == selectedSchedule
    );
    return scheduleSelector.slice(index + 1).map((opt) => {
      //add 1 to the index so only the selectors after the selected value are returned
      const unit = units.find((unit) => unit.name === opt.name);

      if (!unit) {
        return null;
      }

      return (
        <div key={opt.name} className="flex-container-row">
          <div className="prefix-text">{opt.prefix}</div>
          <MultiSelect
            options={unit}
            constructCronState={constructCronState}
            setError={setError}
            cronState={cronState}
            resetSelectedValues={resetSelectedValues}
            setResetSelectedValues={setResetSelectedValues}
          />
        </div>
      );
    });
  };

  return (
    <div className="selector-container">
      <div className="flex-container-row">
        <div className="selector-text">{selectorText}</div>
        <Select onValueChange={(opt: string) => setSelectedSchedule(opt)}>
          <SelectTrigger>
            <SelectValue placeholder={selectedSchedule} />
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
        <Button type="button" onClick={resetSchedule} variant="destructive">
          Reset
        </Button>
      </div>
    </div>
  );
}
