// src/components/shared/QuestionFlow.tsx
// Reusable multi-step question flow with progress tracking.
// Designed for non-technical users: large tap targets, plain English, one question per screen.

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button, ProgressBar, AppIcon } from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuestionStep from "./QuestionStep";
import type { QuestionFlowStep } from "./QuestionStep";

// ============================================================================
// TYPES
// ============================================================================

export type { QuestionFlowStep, ChoiceOption } from "./QuestionStep";

export interface QuestionFlowProps {
  steps: QuestionFlowStep[];
  onComplete: (answers: Record<string, string>) => void;
  onStepChange?: (stepIndex: number) => void;
  initialAnswers?: Record<string, string>;
  title?: string;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Auto-advance types get a brief delay for visual feedback */
const AUTO_ADVANCE_TYPES = new Set(["choice", "number-picker", "yes-no-unsure"]);
const AUTO_ADVANCE_DELAY_MS = 400;

// ============================================================================
// COMPONENT
// ============================================================================

export default function QuestionFlow({
  steps,
  onComplete,
  onStepChange,
  initialAnswers = {},
  title,
  className,
}: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const currentStep = steps[currentIndex];
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;
  const currentValue = answers[currentStep?.id] ?? "";
  const isRequired = currentStep?.required !== false;
  const hasAnswer = currentValue.length > 0;
  const canProceed = hasAnswer || !isRequired;

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentIndex);
  }, [currentIndex, onStepChange]);

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isFirstStep) {
        goBack();
      }
      if (e.key === "Enter" && canProceed) {
        goForward();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, canProceed, isFirstStep]);

  const goBack = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    setDirection("backward");
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goForward = useCallback(() => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      setDirection("forward");
      setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
    }
  }, [isLastStep, answers, onComplete, steps.length]);

  const handleAnswerChange = useCallback(
    (value: string) => {
      const updated = { ...answers, [currentStep.id]: value };
      setAnswers(updated);

      // Auto-advance for selection types or skip actions
      if (AUTO_ADVANCE_TYPES.has(currentStep.type) || value === "skipped") {
        if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

        const delay = prefersReducedMotion ? 0 : AUTO_ADVANCE_DELAY_MS;
        autoAdvanceTimer.current = setTimeout(() => {
          if (isLastStep) {
            onComplete(updated);
          } else {
            setDirection("forward");
            setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
          }
        }, delay);
      }
    },
    [answers, currentStep, isLastStep, onComplete, steps.length, prefersReducedMotion]
  );

  const handleSkip = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    const updated = { ...answers, [currentStep.id]: "skipped" };
    setAnswers(updated);

    if (isLastStep) {
      onComplete(updated);
    } else {
      setDirection("forward");
      setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
    }
  }, [answers, currentStep, isLastStep, onComplete, steps.length]);

  if (!currentStep) return null;

  const progressPercent = ((currentIndex + 1) / steps.length) * 100;
  // month-year-picker has its own skip button built into the step
  const showSkip =
    currentStep.type !== "month-year-picker" &&
    (!isRequired || currentStep.skipLabel);

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto flex flex-col min-h-0",
        className
      )}
    >
      {/* Header: title + progress */}
      <div className="flex flex-col gap-2 mb-6">
        {title && (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        )}
        <ProgressBar
          value={progressPercent}
          color="primary"
          size="md"
          label={`Step ${currentIndex + 1} of ${steps.length}`}
        />
      </div>

      {/* Question area */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !prefersReducedMotion && "transition-opacity duration-200",
          !prefersReducedMotion && direction === "forward" && "animate-slide-up",
        )}
        key={currentStep.id}
      >
        {/* Question text */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground leading-tight">
            {currentStep.question}
          </h3>
          {currentStep.description && (
            <p className="mt-2 text-base text-muted-foreground">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Step content */}
        <QuestionStep
          step={currentStep}
          value={currentValue}
          onChange={handleAnswerChange}
        />

        {/* Tooltip */}
        {currentStep.tooltip && (
          <div className="mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
                      "hover:text-foreground transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    )}
                  >
                    <AppIcon name="question" className="w-4 h-4" />
                    <span>Not sure? Tap here</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{currentStep.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* Back button */}
          {!isFirstStep ? (
            <Button
              variant="ghost"
              size="md"
              leftIcon="arrow-left"
              onClick={goBack}
              aria-label="Go back"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {/* Next / Complete button (only for non-auto-advance types) */}
          {!AUTO_ADVANCE_TYPES.has(currentStep.type) && (
            <Button
              variant="primary"
              size="md"
              rightIcon="arrow-right"
              onClick={goForward}
              disabled={!canProceed}
              aria-label={isLastStep ? "Complete" : "Next"}
            >
              {isLastStep ? "Complete" : "Next"}
            </Button>
          )}
        </div>

        {/* Skip button */}
        {showSkip && (
          <button
            type="button"
            onClick={handleSkip}
            className={cn(
              "w-full min-h-[44px] px-4 py-2 rounded-xl",
              "text-sm text-muted-foreground hover:text-foreground",
              "border border-dashed border-border hover:bg-accent/50",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {currentStep.skipLabel ?? "Skip this question"}
          </button>
        )}
      </div>
    </div>
  );
}
