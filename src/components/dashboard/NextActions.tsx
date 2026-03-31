import TaskList from "@/components/shared/TaskList";
import type { TaskItemData } from "@/components/shared/TaskItem";
import type { NextAction } from "@/services/healthScoreService";

interface NextActionsProps {
  actions: NextAction[];
  loading?: boolean;
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function NextActions({ actions, loading }: NextActionsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-surface rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const taskItems: TaskItemData[] = actions.map((action) => ({
    id: action.id,
    title: action.title,
    description: action.domainName ?? undefined,
    status: action.status,
    dueDate: formatDueDate(action.dueDate),
    completed: action.completed,
  }));

  return (
    <TaskList
      tasks={taskItems}
      variant="compact"
      emptyTitle="You're all caught up"
      emptyDescription="No upcoming tasks right now. Great job!"
      emptyIcon="check-circle"
    />
  );
}
