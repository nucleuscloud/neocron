import { ReactElement } from 'react';
import { stringToArray } from '../lib/part';
import { CronState, Unit, ValuePayload } from '../types';
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
  const {
    unit,
    index,
    setValue,
    resetSelectedValues,
    setResetSelectedValues,
    state,
  } = props;

  return (
    <MultiSelect
      options={unit}
      onChange={(e) => {
        setValue({ index, values: e.map(Number) });
      }}
      index={index}
      state={state}
      unitValues={stringToArray(state.expression)[index]}
      resetSelectedValues={resetSelectedValues}
      setResetSelectedValues={setResetSelectedValues}
    />
  );
}
