import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import QuestionFlow from "./QuestionFlow";
import type { QuestionFlowStep } from "./QuestionStep";

// ============================================================================
// TEST DATA
// ============================================================================

const mockSteps: QuestionFlowStep[] = [
  {
    id: "business-type",
    type: "choice",
    question: "What type of business do you run?",
    description: "This helps us tailor your compliance checklist.",
    options: [
      { value: "sole-trader", label: "Sole trader", icon: "user" },
      { value: "limited", label: "Limited company", icon: "briefcase" },
      { value: "partnership", label: "Partnership", icon: "users" },
    ],
  },
  {
    id: "headcount",
    type: "number-picker",
    question: "How many people work in your business?",
    options: [
      { value: "1", label: "Just me" },
      { value: "2-4", label: "2-4" },
      { value: "5-9", label: "5-9" },
      { value: "10+", label: "10+" },
    ],
  },
  {
    id: "vat-registered",
    type: "yes-no-unsure",
    question: "Are you VAT registered?",
    tooltip: "If your turnover is over £85,000 you must register for VAT.",
  },
  {
    id: "sector",
    type: "searchable-list",
    question: "What sector is your business in?",
    searchItems: [
      "Retail",
      "Construction",
      "Technology",
      "Healthcare",
      "Hospitality",
      "Professional Services",
    ],
  },
  {
    id: "trading-start",
    type: "month-year-picker",
    question: "When did you start trading?",
    skipLabel: "We haven't started yet",
    required: false,
  },
];

// ============================================================================
// TESTS
// ============================================================================

describe("QuestionFlow", () => {
  it("renders first step with correct question text", () => {
    render(
      <QuestionFlow steps={mockSteps} onComplete={vi.fn()} />
    );

    expect(
      screen.getByText("What type of business do you run?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("This helps us tailor your compliance checklist.")
    ).toBeInTheDocument();
  });

  it("shows title when provided", () => {
    render(
      <QuestionFlow
        steps={mockSteps}
        onComplete={vi.fn()}
        title="Set up your business"
      />
    );

    expect(screen.getByText("Set up your business")).toBeInTheDocument();
  });

  it("progress bar shows correct step count", () => {
    render(
      <QuestionFlow steps={mockSteps} onComplete={vi.fn()} />
    );

    expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
  });

  it("selecting an option updates internal state", () => {
    render(
      <QuestionFlow steps={mockSteps} onComplete={vi.fn()} />
    );

    const soleTraderBtn = screen.getByText("Sole trader").closest("button")!;
    fireEvent.click(soleTraderBtn);

    expect(soleTraderBtn).toHaveAttribute("aria-selected", "true");
  });

  it("back button navigates to previous step", () => {
    vi.useFakeTimers();
    const onStepChange = vi.fn();

    render(
      <QuestionFlow
        steps={mockSteps}
        onComplete={vi.fn()}
        onStepChange={onStepChange}
      />
    );

    // Select an option to auto-advance
    fireEvent.click(screen.getByText("Sole trader").closest("button")!);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(
      screen.getByText("How many people work in your business?")
    ).toBeInTheDocument();

    // Click back
    fireEvent.click(screen.getByLabelText("Go back"));

    expect(
      screen.getByText("What type of business do you run?")
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("does not show back button on first step", () => {
    render(
      <QuestionFlow steps={mockSteps} onComplete={vi.fn()} />
    );

    expect(screen.queryByLabelText("Go back")).not.toBeInTheDocument();
  });

  it("onComplete is called with all answers when last step is completed", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    // Use a minimal 2-step flow for simplicity
    const twoSteps: QuestionFlowStep[] = [
      {
        id: "q1",
        type: "yes-no-unsure",
        question: "First question?",
      },
      {
        id: "q2",
        type: "yes-no-unsure",
        question: "Second question?",
      },
    ];

    render(<QuestionFlow steps={twoSteps} onComplete={onComplete} />);

    // Answer first question
    fireEvent.click(screen.getByText("Yes").closest("button")!);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText("Second question?")).toBeInTheDocument();

    // Answer second question
    fireEvent.click(screen.getByText("No").closest("button")!);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onComplete).toHaveBeenCalledWith({
      q1: "yes",
      q2: "no",
    });

    vi.useRealTimers();
  });

  it("skip button works when configured", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    const skippableSteps: QuestionFlowStep[] = [
      {
        id: "optional-q",
        type: "month-year-picker",
        question: "When did you start?",
        skipLabel: "We haven't started yet",
        required: false,
      },
    ];

    render(
      <QuestionFlow steps={skippableSteps} onComplete={onComplete} />
    );

    // The skip button is rendered inside the MonthYearPickerStep
    const skipBtn = screen.getByText("We haven't started yet");
    expect(skipBtn).toBeInTheDocument();

    fireEvent.click(skipBtn);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onComplete).toHaveBeenCalledWith({
      "optional-q": "skipped",
    });

    vi.useRealTimers();
  });

  it("renders searchable list with search input", () => {
    // Start directly at the searchable-list step using initialAnswers to advance
    const searchStep: QuestionFlowStep[] = [
      {
        id: "sector",
        type: "searchable-list",
        question: "What sector is your business in?",
        searchItems: ["Retail", "Construction", "Technology"],
      },
    ];

    render(
      <QuestionFlow steps={searchStep} onComplete={vi.fn()} />
    );

    expect(screen.getByPlaceholderText("Start typing to search...")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();
    expect(screen.getByText("Construction")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("searchable list filters items based on input", () => {
    const searchStep: QuestionFlowStep[] = [
      {
        id: "sector",
        type: "searchable-list",
        question: "Pick a sector",
        searchItems: ["Retail", "Construction", "Technology"],
      },
    ];

    render(
      <QuestionFlow steps={searchStep} onComplete={vi.fn()} />
    );

    const input = screen.getByPlaceholderText("Start typing to search...");
    fireEvent.change(input, { target: { value: "tech" } });

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.queryByText("Retail")).not.toBeInTheDocument();
    expect(screen.queryByText("Construction")).not.toBeInTheDocument();
  });

  it("renders tooltip trigger when tooltip is configured", () => {
    const tooltipSteps: QuestionFlowStep[] = [
      {
        id: "q",
        type: "yes-no-unsure",
        question: "Are you VAT registered?",
        tooltip: "Some helpful info here.",
      },
    ];

    render(
      <QuestionFlow steps={tooltipSteps} onComplete={vi.fn()} />
    );

    expect(screen.getByText("Not sure? Tap here")).toBeInTheDocument();
  });
});
