import { ReactElement } from 'react';
import { CronState } from '../types';
import { Input } from './ui/input';

interface Props {
  cronState: CronState;
  setExpression: (val: string) => void;
}

export default function CronExpression(props: Props): ReactElement {
  const { cronState, setExpression } = props;
  return (
    <div>
      <Input
        type="text"
        id="expression"
        className="cron-input"
        onChange={(e) => setExpression(e.target.value)}
        value={cronState.expression}
      />
    </div>
  );
}
