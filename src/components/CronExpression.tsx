import React, { ReactElement } from 'react';
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
      <label htmlFor="expression">Cron expression</label>
      <Input
        type="text"
        id="expression"
        className="border-2 border-gray-900"
        onChange={(e) => setExpression(e.target.value)}
        value={state.expression}
      />
    </div>
  );
}
