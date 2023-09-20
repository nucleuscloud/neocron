import { ReactElement } from 'react';
import { CronState } from '../types';
import { Input } from './ui/input';

interface Props {
  state: CronState;
  setExpression: (val: string) => void;
  inputText: string;
}

export default function CronExpression(props: Props): ReactElement {
  const { state, setExpression, inputText } = props;
  return (
    <div>
      <label htmlFor="expression" className="input-label">
        {inputText ? inputText : 'Cron expression'}
      </label>
      <Input
        type="text"
        id="expression"
        onChange={(e) => setExpression(e.target.value)}
        value={state.expression}
      />
    </div>
  );
}
