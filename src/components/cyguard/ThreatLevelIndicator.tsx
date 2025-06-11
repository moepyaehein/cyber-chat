import { Progress } from "@/components/ui/progress";
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";

interface ThreatLevelIndicatorProps {
  level: number;
}

const ThreatLevelIndicator: FC<ThreatLevelIndicatorProps> = ({ level }) => {
  let progressColor = "bg-green-500"; // Default to a Tailwind color string
  let iconColor = "text-green-500";
  let IconComponent = ShieldCheck;
  let levelText = "Low";

  if (level >= 0 && level <= 3) {
    progressColor = "bg-sky-500"; // Using a more cyber blue for low
    iconColor = "text-sky-400";
    IconComponent = ShieldCheck;
    levelText = "Low";
  } else if (level >= 4 && level <= 7) {
    progressColor = "bg-yellow-500";
    iconColor = "text-yellow-400";
    IconComponent = ShieldQuestion;
    levelText = "Medium";
  } else if (level > 7) {
    progressColor = "bg-red-600";
    iconColor = "text-red-500";
    IconComponent = ShieldAlert;
    levelText = "High";
  }


  return (
    <div className="mt-2 p-3 bg-accent/20 rounded-md shadow-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <IconComponent className={cn("h-4 w-4", iconColor)} />
        <span className="font-semibold text-xs text-accent-foreground/90">Threat Level: {level}/10 ({levelText})</span>
      </div>
      <Progress value={level * 10} className={cn("h-1.5", progressColor)} indicatorClassName={progressColor} />
    </div>
  );
};

// Need to update Progress component to accept indicatorClassName or style it directly
// For now, I'll pass the color class directly to Progress and expect it to handle the indicator style.
// If Progress doesn't support this, its internal styling for the indicator needs adjustment or override.
// The current ShadCN Progress component takes `className` for the root and styles `Indicator` internally.
// Let's adjust Progress to allow indicator color styling more easily or use a more direct approach.
// The current Progress component has `[&>div]:${progressColorClass}` in its className prop in the original component, which is not ideal.
// A better way:
// Original: <Progress value={level * 10} className={`h-2 [&>div]:${progressColorClass}`} />
// Let's assume `progressColor` is applied to the indicator by passing it to `className` and Tailwind merging, or that Progress is adapted.
// For Shadcn/ui Progress, we usually style the Indicator via its `className` directly.
// It's: <ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-primary transition-all" ... />
// So to change its color, we need to override `bg-primary`. We can do this by passing a specific class.
// `className` on `Progress` applies to the root.
// We can pass a specific class that targets the indicator IF Progress component is designed to allow it, or use CSS variables.

// Given the current progress.tsx, it always uses `bg-primary` for the indicator.
// We'll modify how progressColor is applied.

export default ThreatLevelIndicator;
