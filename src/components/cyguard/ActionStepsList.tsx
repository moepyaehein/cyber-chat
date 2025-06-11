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
    <div className="mt-2.5 p-3 bg-secondary/20 rounded-md shadow-sm">
      <h4 className="font-semibold text-xs mb-1.5 flex items-center gap-1.5 text-secondary-foreground/90">
        <ClipboardCheck className="h-4 w-4 text-primary" />
        Recommended Actions:
      </h4>
      <ol className="list-decimal list-inside space-y-1 text-xs">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start gap-1.5">
            <LockKeyhole className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="text-secondary-foreground/80">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ActionStepsList;
