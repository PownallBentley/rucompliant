import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";
import type { IconKey } from "@/components/ui/AppIcon";
import RagStatus from "./RagStatus";
import type { HealthStatus } from "@/types";

export interface TaskItemData {
  id: string;
  title: string;
  description?: string;
  status: HealthStatus;
  dueDate?: string;
  completed?: boolean;
  actionLabel?: string;
  actionUrl?: string;
  icon?: IconKey;
}

interface TaskItemProps {
  task: TaskItemData;
  variant: "checklist" | "timeline" | "compact";
  onMarkDone?: (taskId: string) => void;
  onTap?: (taskId: string) => void;
  className?: string;
}

export default function TaskItem({
  task,
  variant,
  onMarkDone,
  onTap,
  className,
}: TaskItemProps) {
  const isCompleted = task.completed;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => onTap?.(task.id)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-white text-left transition-colors hover:bg-surface",
          className
        )}
      >
        <RagStatus status={task.status} variant="dot" size="sm" showLabel={false} />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
            isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {task.title}
          </p>
        </div>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {task.dueDate}
          </span>
        )}
        <AppIcon name="chevron-right" className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>
    );
  }

  if (variant === "timeline") {
    return (
      <div className={cn(
        "flex gap-4 p-4 rounded-xl border border-border bg-white",
        className
      )}>
        <div className="flex flex-col items-center shrink-0">
          <RagStatus status={task.status} variant="dot" size="sm" showLabel={false} />
          <div className="w-px flex-1 bg-border mt-2" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={cn(
              "text-sm font-semibold",
              isCompleted ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              {task.title}
            </p>
            {task.dueDate && (
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                {task.dueDate}
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {task.description}
            </p>
          )}
          {!isCompleted && onMarkDone && (
            <button
              type="button"
              onClick={() => onMarkDone(task.id)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <AppIcon name="check" className="w-3.5 h-3.5" />
              Mark as done
            </button>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald">
              <AppIcon name="check" className="w-3.5 h-3.5" />
              Done
            </span>
          )}
        </div>
      </div>
    );
  }

  // checklist variant (default)
  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border border-border bg-white transition-colors",
      !isCompleted && "hover:bg-surface",
      className
    )}>
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => !isCompleted && onMarkDone?.(task.id)}
        disabled={isCompleted}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
          isCompleted
            ? "bg-emerald border-emerald"
            : "border-border hover:border-primary"
        )}
        aria-label={isCompleted ? "Completed" : `Mark "${task.title}" as done`}
      >
        {isCompleted && (
          <AppIcon name="check" className="w-3 h-3 text-white" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-semibold",
            isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {task.title}
          </p>
          <RagStatus status={task.status} variant="dot" size="sm" />
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            {task.description}
          </p>
        )}
      </div>
    </div>
  );
}
