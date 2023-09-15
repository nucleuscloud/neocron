import { ReactElement } from "react";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import { ClockIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CronState } from "@/types";

interface Props {
  state: CronState;
}

export default function ScheduleExplainer(props: Props): ReactElement {
  const { state } = props;
  if (state.error !== "") {
    return (
      <div>
        <Alert variant="destructive">
          <ExclamationTriangleIcon />

          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      </div>
    );
  } else {
    return (
      <div>
        <Alert className="bg-green-100 border border-green-500">
          <AlertDescription>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <ClockIcon />
                </div>
                <div>Next run scheduled for: {state.next}</div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
