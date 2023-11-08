import { ReactElement } from 'react';
import { CronState } from '../types';
import { Input } from './ui/input';

interface Props {
  state: CronState;
  setExpression: (val: string) => void;
}

export default function CronExpression(props: Props): ReactElement {
  const { state, setExpression } = props;
  return (
    <div>
      <Input
        type="text"
        id="expression"
        className="cron-input"
        onChange={(e) => setExpression(e.target.value)}
        value={state.expression}
      />
    </div>
  );
}
