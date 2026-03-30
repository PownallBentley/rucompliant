import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import TaskItem from "./TaskItem";
import type { TaskItemData } from "./TaskItem";

interface TaskListProps {
  tasks: TaskItemData[];
  variant?: "checklist" | "timeline" | "compact";
  onMarkDone?: (taskId: string) => void;
  onTap?: (taskId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: "clipboard-list" | "calendar" | "check-circle";
  className?: string;
}

export default function TaskList({
  tasks,
  variant = "checklist",
  onMarkDone,
  onTap,
  emptyTitle = "No tasks yet",
  emptyDescription = "Tasks will appear here once your compliance profile is set up.",
  emptyIcon = "clipboard-list",
  className,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className={cn(
      "flex flex-col",
      variant === "compact" ? "gap-2" : "gap-3",
      className
    )}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          variant={variant}
          onMarkDone={onMarkDone}
          onTap={onTap}
        />
      ))}
    </div>
  );
}

export type { TaskItemData, TaskListProps };
