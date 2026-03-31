import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";
import type { ConciergeStage } from "@/services/conciergeService";
import type { ConciergeTaskData } from "@/services/conciergeService";
import { getStageProgress } from "@/services/conciergeService";

interface StageSelectorProps {
  stages: ConciergeStage[];
  currentIndex: number;
  tasksByStage: Record<string, ConciergeTaskData[]>;
  onSelect: (index: number) => void;
}

export default function StageSelector({
  stages,
  currentIndex,
  tasksByStage,
  onSelect,
}: StageSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {stages.map((stage, i) => {
        const tasks = tasksByStage[stage.id] ?? [];
        const progress = getStageProgress(tasks);
        const isActive = i === currentIndex;
        const isComplete = progress.total > 0 && progress.percentage === 100;

        return (
          <button
            key={stage.id}
            onClick={() => onSelect(i)}
            className={cn(
              "flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border bg-white hover:border-primary/30"
            )}
          >
            {/* Stage number / check */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
              isComplete
                ? "bg-emerald text-white"
                : isActive
                  ? "bg-primary text-white"
                  : "bg-surface text-muted-foreground"
            )}>
              {isComplete ? (
                <AppIcon name="check" className="w-4 h-4" />
              ) : (
                stage.stageNumber
              )}
            </div>

            {/* Stage info */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-semibold truncate",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {stage.name}
              </p>
              {tasks.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {progress.completed}/{progress.total} done
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
