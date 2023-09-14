import { ReactElement } from "react";
import { Alert, AlertDescription, AlertTitle } from "../alert";
import { TerminalIcon } from "lucide-react";
import { ClockIcon } from "@radix-ui/react-icons";

export default function Info(): ReactElement {
  return (
    <div className="text-sm">
      NeoCron is a modern way to allow a user to set a cron schedule. Either
      type in a cron expression or pick the values in the <code>select</code>s
      to get an expression.
    </div>
  );
}
