import { ReactElement } from 'react';
import { CronState, Unit, ValuePayload } from '@/src/types';
import MultiSelect from './MultiSelect';

interface Props {
  index: number;
  unit: Unit;
  setValue: (val: ValuePayload) => void;
  state: CronState;
  resetSelectedValues: boolean;
  setResetSelectedValues: (val: boolean) => void;
}

export default function Selector(props: Props): ReactElement {
  const { unit, index, setValue, resetSelectedValues, setResetSelectedValues } =
    props;

  return (
    <MultiSelect
      options={unit}
      onChange={(e) => {
        setValue({ index, values: e.map(Number) });
      }}
      resetSelectedValues={resetSelectedValues}
      setResetSelectedValues={setResetSelectedValues}
    />
  );
}
