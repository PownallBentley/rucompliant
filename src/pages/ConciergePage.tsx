import { useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useConciergeStore } from "@/stores/conciergeStore";
import {
  fetchStages,
  fetchTasksForStage,
  markTaskDone,
  getStageProgress,
  getTaskStatus,
} from "@/services/conciergeService";
import { fetchProfile } from "@/services/accountService";
import { LoadingSpinner } from "@/components/ui";
import TaskList from "@/components/shared/TaskList";
import type { TaskItemData } from "@/components/shared/TaskItem";
import StageSelector from "@/components/concierge/StageSelector";
import StageProgress from "@/components/concierge/StageProgress";

export default function ConciergePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    stages,
    currentStageIndex,
    tasksByStage,
    loading,
    setStages,
    setCurrentStageIndex,
    setTasksForStage,
    markTaskCompleted,
    setLoading,
  } = useConciergeStore();

  useEffect(() => {
    if (!user) return;

    async function loadConcierge() {
      setLoading(true);
      try {
        const [stagesData, profile] = await Promise.all([
          fetchStages(),
          fetchProfile(user!.id),
        ]);

        setStages(stagesData);

        // Load tasks for all stages
        const businessType = profile?.business_type ?? "sole_trader";
        const headcount = profile?.headcount ?? 1;

        await Promise.all(
          stagesData.map(async (stage) => {
            const tasks = await fetchTasksForStage(
              user!.id,
              stage.id,
              businessType,
              headcount,
            );
            setTasksForStage(stage.id, tasks);
          })
        );
      } finally {
        setLoading(false);
      }
    }

    loadConcierge();
  }, [user, setStages, setTasksForStage, setLoading]);

  const currentStage = stages[currentStageIndex];
  const currentTasks = useMemo(
    () => (currentStage ? tasksByStage[currentStage.id] ?? [] : []),
    [currentStage, tasksByStage]
  );
  const progress = currentTasks.length > 0 ? getStageProgress(currentTasks) : null;

  const handleMarkDone = useCallback(
    async (taskId: string) => {
      if (!user || !currentStage) return;
      try {
        await markTaskDone(user.id, taskId);
        markTaskCompleted(currentStage.id, taskId);
      } catch (err) {
        console.error("Failed to mark task done:", err);
      }
    },
    [user, currentStage, markTaskCompleted]
  );

  const handleTaskTap = useCallback(
    (taskId: string) => {
      const task = currentTasks.find((t) => t.id === taskId);
      if (!task) return;

      if (task.actionType === "external_link" && task.actionUrl) {
        window.open(task.actionUrl, "_blank", "noopener");
      } else if (task.actionType === "internal_workflow" && task.actionUrl) {
        navigate(task.actionUrl);
      }
    },
    [currentTasks, navigate]
  );

  // Convert concierge tasks to TaskItemData for TaskList
  const taskItems: TaskItemData[] = currentTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: getTaskStatus(task),
    completed: task.completed,
    actionLabel: task.actionType === "external_link" ? "Open" : undefined,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Loading your journey..." centered />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance Journey</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete these tasks to get your business fully compliant
        </p>
      </div>

      {/* Stage selector */}
      <StageSelector
        stages={stages}
        currentIndex={currentStageIndex}
        tasksByStage={tasksByStage}
        onSelect={setCurrentStageIndex}
      />

      {/* Stage progress */}
      {currentStage && progress && (
        <StageProgress
          progress={progress}
          stageName={currentStage.name}
        />
      )}

      {/* Stage description */}
      {currentStage && (
        <p className="text-sm text-muted-foreground">
          {currentStage.description}
        </p>
      )}

      {/* Task list */}
      <TaskList
        tasks={taskItems}
        variant="checklist"
        onMarkDone={handleMarkDone}
        onTap={handleTaskTap}
        emptyTitle="No tasks for this stage"
        emptyDescription="Based on your business profile, you don't have any tasks in this stage."
        emptyIcon="check-circle"
      />
    </div>
  );
}
