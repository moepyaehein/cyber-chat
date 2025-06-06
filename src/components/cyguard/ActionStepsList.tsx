import { ClipboardCheck, LockKeyhole } from "lucide-react";
import type { FC } from "react";

interface ActionStepsListProps {
  steps: string[];
}

const ActionStepsList: FC<ActionStepsListProps> = ({ steps }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-secondary/30 rounded-md shadow">
      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-primary" />
        Recommended Actions:
      </h4>
      <ol className="list-decimal list-inside space-y-1.5 text-sm">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-2">
            <LockKeyhole className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ActionStepsList;
