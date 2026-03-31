import { ProgressBar } from "@/components/ui";
import AppIcon from "@/components/ui/AppIcon";
import type { StageProgress as StageProgressData } from "@/services/conciergeService";

interface StageProgressProps {
  progress: StageProgressData;
  stageName: string;
}

export default function StageProgress({ progress, stageName }: StageProgressProps) {
  const isComplete = progress.total > 0 && progress.percentage === 100;

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">{stageName}</span>
        <span className="text-xs font-medium text-muted-foreground">
          {progress.completed} of {progress.total} tasks
        </span>
      </div>
      <ProgressBar
        value={progress.percentage}
        color={isComplete ? "success" : "primary"}
        size="md"
      />
      {isComplete && (
        <div className="flex items-center gap-2 mt-3 text-emerald">
          <AppIcon name="check-circle" className="w-4 h-4" />
          <span className="text-sm font-semibold">Stage complete!</span>
        </div>
      )}
    </div>
  );
}
