import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck, ShieldQuestion, Info } from "lucide-react";
import type { FC } from "react";

interface ThreatLevelIndicatorProps {
  level: number;
}

const ThreatLevelIndicator: FC<ThreatLevelIndicatorProps> = ({ level }) => {
  let progressColorClass = "bg-green-500";
  let IconComponent = ShieldCheck;
  let levelText = "Low";

  if (level >= 4 && level <= 7) {
    progressColorClass = "bg-yellow-500";
    IconComponent = ShieldQuestion;
    levelText = "Medium";
  } else if (level > 7) {
    progressColorClass = "bg-red-500";
    IconComponent = ShieldAlert;
    levelText = "High";
  }

  return (
    <div className="mt-2 p-3 bg-accent/50 rounded-md shadow">
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className={`h-5 w-5 ${
          level > 7 ? 'text-red-600' : level >=4 ? 'text-yellow-600' : 'text-green-600'
        }`} />
        <span className="font-semibold text-sm">Threat Level: {level}/10 ({levelText})</span>
      </div>
      <Progress value={level * 10} className={`h-2 [&>div]:${progressColorClass}`} />
    </div>
  );
};

export default ThreatLevelIndicator;
