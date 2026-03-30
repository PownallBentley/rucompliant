// src/components/shared/QuestionStep.tsx
// Individual step renderer supporting 5 question types for the QuestionFlow.

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AppIcon, Input } from "@/components/ui";
import type { IconKey } from "@/components/ui/AppIcon";

// ============================================================================
// TYPES
// ============================================================================

export interface ChoiceOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface QuestionFlowStep {
  id: string;
  type:
    | "choice"
    | "number-picker"
    | "yes-no-unsure"
    | "searchable-list"
    | "month-year-picker";
  question: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  options?: ChoiceOption[];
  searchItems?: string[];
  skipLabel?: string;
}

interface QuestionStepProps {
  step: QuestionFlowStep;
  value: string;
  onChange: (value: string) => void;
}

// ============================================================================
// SHARED OPTION BUTTON
// ============================================================================

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "w-full min-h-[56px] px-4 py-3 rounded-xl border text-left",
        "font-medium text-foreground transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
          : "border-border bg-background hover:bg-accent/50",
        className
      )}
    >
      {children}
    </button>
  );
}

// ============================================================================
// STEP TYPE: CHOICE
// ============================================================================

function ChoiceStep({
  step,
  value,
  onChange,
}: QuestionStepProps) {
  return (
    <div className="flex flex-col gap-3" role="listbox" aria-label={step.question}>
      {step.options?.map((option) => (
        <OptionButton
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        >
          <div className="flex items-center gap-3">
            {option.icon && (
              <AppIcon
                name={option.icon as IconKey}
                className="w-5 h-5 text-primary shrink-0"
              />
            )}
            <div className="flex flex-col">
              <span className="text-base">{option.label}</span>
              {option.description && (
                <span className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </span>
              )}
            </div>
          </div>
        </OptionButton>
      ))}
    </div>
  );
}

// ============================================================================
// STEP TYPE: NUMBER PICKER
// ============================================================================

function NumberPickerStep({
  step,
  value,
  onChange,
}: QuestionStepProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-3"
      role="listbox"
      aria-label={step.question}
    >
      {step.options?.map((option) => (
        <OptionButton
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          className="text-center justify-center"
        >
          <div className="flex flex-col items-center gap-1">
            {option.icon && (
              <AppIcon
                name={option.icon as IconKey}
                className="w-5 h-5 text-primary"
              />
            )}
            <span className="text-base font-semibold">{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            )}
          </div>
        </OptionButton>
      ))}
    </div>
  );
}

// ============================================================================
// STEP TYPE: YES / NO / UNSURE
// ============================================================================

const YES_NO_UNSURE_OPTIONS: ChoiceOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

function YesNoUnsureStep({
  step,
  value,
  onChange,
}: QuestionStepProps) {
  return (
    <div className="flex flex-col gap-3" role="listbox" aria-label={step.question}>
      {YES_NO_UNSURE_OPTIONS.map((option) => (
        <OptionButton
          key={option.value}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          className="text-center justify-center"
        >
          <span className="text-base font-semibold">{option.label}</span>
        </OptionButton>
      ))}
      {value === "unsure" && (
        <p className="text-sm text-muted-foreground text-center mt-1">
          That&apos;s fine &mdash; you can update this later.
        </p>
      )}
    </div>
  );
}

// ============================================================================
// STEP TYPE: SEARCHABLE LIST
// ============================================================================

function SearchableListStep({
  step,
  value,
  onChange,
}: QuestionStepProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const items = step.searchItems ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [step.searchItems, query]);

  // Focus the search input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Start typing to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
        aria-label="Search options"
      />
      <div
        className="flex flex-col gap-2 max-h-[320px] overflow-y-auto"
        role="listbox"
        aria-label={step.question}
      >
        {filtered.map((item) => (
          <OptionButton
            key={item}
            selected={value === item}
            onClick={() => onChange(item)}
            className="min-h-[44px]"
          >
            <span className="text-base">{item}</span>
          </OptionButton>
        ))}
        {/* "Other" always visible */}
        {!filtered.includes("Other") && (
          <OptionButton
            selected={value === "Other"}
            onClick={() => onChange("Other")}
            className="min-h-[44px] border-dashed"
          >
            <span className="text-base text-muted-foreground">Other</span>
          </OptionButton>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP TYPE: MONTH-YEAR PICKER
// ============================================================================

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function MonthYearPickerStep({
  step,
  value,
  onChange,
}: QuestionStepProps) {
  // value format: "YYYY-MM" or ""
  const [selectedMonth, setSelectedMonth] = useState<number | null>(() => {
    if (value && value.includes("-")) return parseInt(value.split("-")[1], 10) - 1;
    return null;
  });
  const [selectedYear, setSelectedYear] = useState<number | null>(() => {
    if (value && value.includes("-")) return parseInt(value.split("-")[0], 10);
    return null;
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

  const handleMonthSelect = useCallback(
    (monthIdx: number) => {
      setSelectedMonth(monthIdx);
      if (selectedYear !== null) {
        const mm = String(monthIdx + 1).padStart(2, "0");
        onChange(`${selectedYear}-${mm}`);
      }
    },
    [selectedYear, onChange]
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      setSelectedYear(year);
      if (selectedMonth !== null) {
        const mm = String(selectedMonth + 1).padStart(2, "0");
        onChange(`${year}-${mm}`);
      }
    },
    [selectedMonth, onChange]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Month grid */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Month</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="listbox" aria-label="Select month">
          {MONTHS.map((m, idx) => (
            <OptionButton
              key={m}
              selected={selectedMonth === idx}
              onClick={() => handleMonthSelect(idx)}
              className="min-h-[44px] text-center justify-center"
            >
              <span className="text-sm font-medium">{m}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Year buttons */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Year</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="listbox" aria-label="Select year">
          {years.map((y) => (
            <OptionButton
              key={y}
              selected={selectedYear === y}
              onClick={() => handleYearSelect(y)}
              className="min-h-[44px] text-center justify-center"
            >
              <span className="text-sm font-medium">{y}</span>
            </OptionButton>
          ))}
        </div>
      </div>

      {/* Skip option */}
      {step.skipLabel && (
        <button
          type="button"
          onClick={() => onChange("skipped")}
          className={cn(
            "w-full min-h-[44px] px-4 py-3 rounded-xl border border-dashed border-border",
            "text-sm text-muted-foreground hover:bg-accent/50 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {step.skipLabel}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function QuestionStep(props: QuestionStepProps) {
  const { step } = props;

  switch (step.type) {
    case "choice":
      return <ChoiceStep {...props} />;
    case "number-picker":
      return <NumberPickerStep {...props} />;
    case "yes-no-unsure":
      return <YesNoUnsureStep {...props} />;
    case "searchable-list":
      return <SearchableListStep {...props} />;
    case "month-year-picker":
      return <MonthYearPickerStep {...props} />;
    default:
      return null;
  }
}
