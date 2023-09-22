import { ClockIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ReactElement } from 'react';
import { CronState } from '../types';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
  state: CronState;
  disableExplainerText?: boolean;
}

export default function ScheduleExplainer(props: Props): ReactElement {
  const { state, disableExplainerText } = props;
  if (state.error !== '') {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon />
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  } else {
    return (
      <div>
        {!disableExplainerText && (
          <Alert className="success-alert">
            <AlertDescription>
              <div className="flex-container-col">
                <div className="flex-container-row">
                  <ClockIcon />
                  <div>Next run scheduled for: {state.next}</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }
}
