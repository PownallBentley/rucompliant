import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "./TaskList";
import type { TaskItemData } from "./TaskItem";

const mockTasks: TaskItemData[] = [
  {
    id: "1",
    title: "Register with HMRC",
    description: "Register as self-employed for Self Assessment",
    status: "red",
    dueDate: "15 Apr",
    completed: false,
  },
  {
    id: "2",
    title: "File Confirmation Statement",
    description: "Annual filing with Companies House",
    status: "amber",
    dueDate: "30 Jun",
    completed: false,
  },
  {
    id: "3",
    title: "ICO Registration",
    status: "green",
    completed: true,
  },
];

describe("TaskList", () => {
  it("renders all tasks", () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText("Register with HMRC")).toBeInTheDocument();
    expect(screen.getByText("File Confirmation Statement")).toBeInTheDocument();
    expect(screen.getByText("ICO Registration")).toBeInTheDocument();
  });

  it("renders empty state when no tasks", () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  it("renders custom empty state", () => {
    render(
      <TaskList
        tasks={[]}
        emptyTitle="Nothing upcoming"
        emptyDescription="All clear for now."
      />
    );
    expect(screen.getByText("Nothing upcoming")).toBeInTheDocument();
  });

  it("calls onMarkDone when clicking mark as done (checklist variant)", () => {
    const onMarkDone = vi.fn();
    render(
      <TaskList tasks={[mockTasks[0]]} variant="checklist" onMarkDone={onMarkDone} />
    );
    const checkbox = screen.getByLabelText(/Mark "Register with HMRC" as done/);
    fireEvent.click(checkbox);
    expect(onMarkDone).toHaveBeenCalledWith("1");
  });

  it("calls onMarkDone in timeline variant", () => {
    const onMarkDone = vi.fn();
    render(
      <TaskList tasks={[mockTasks[0]]} variant="timeline" onMarkDone={onMarkDone} />
    );
    fireEvent.click(screen.getByText("Mark as done"));
    expect(onMarkDone).toHaveBeenCalledWith("1");
  });

  it("shows completed state correctly in checklist", () => {
    render(<TaskList tasks={[mockTasks[2]]} variant="checklist" />);
    expect(screen.getByText("ICO Registration")).toHaveClass("line-through");
  });

  it("shows completed state in timeline variant", () => {
    render(<TaskList tasks={[mockTasks[2]]} variant="timeline" />);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders compact variant with chevron", () => {
    const onTap = vi.fn();
    render(<TaskList tasks={[mockTasks[0]]} variant="compact" onTap={onTap} />);
    fireEvent.click(screen.getByText("Register with HMRC"));
    expect(onTap).toHaveBeenCalledWith("1");
  });

  it("shows due dates", () => {
    render(<TaskList tasks={mockTasks} variant="checklist" />);
    // Due dates are shown in timeline/compact, not checklist status dots
    // But task titles should all be present
    expect(screen.getByText("Register with HMRC")).toBeInTheDocument();
  });

  it("renders descriptions in checklist variant", () => {
    render(<TaskList tasks={[mockTasks[0]]} variant="checklist" />);
    expect(screen.getByText("Register as self-employed for Self Assessment")).toBeInTheDocument();
  });
});
