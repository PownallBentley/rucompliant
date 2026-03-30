// src/components/shared/RagStatus.tsx
// Reusable RAG (Red/Amber/Green) status indicator component
// Used across dashboard, domain cards, task lists, calendar, and AI Advisor

import { cn } from "@/lib/utils";
import { AppIcon, Badge } from "@/components/ui";
import type { IconKey } from "@/components/ui";
import type { HealthStatus } from "@/types";

// ============================================================================
// STATUS CONFIG
// ============================================================================

interface StatusConfig {
  label: string;
  description: string;
  icon: IconKey;
  textClass: string;
  bgClass: string;
  borderClass: string;
  bgTintClass: string;
  dotClass: string;
}

const STATUS_MAP: Record<HealthStatus, StatusConfig> = {
  green: {
    label: "All clear",
    description: "No outstanding actions",
    icon: "check-circle",
    textClass: "text-status-green",
    bgClass: "bg-status-green",
    borderClass: "border-status-green",
    bgTintClass: "bg-status-green/10",
    dotClass: "bg-status-green",
  },
  amber: {
    label: "Needs attention",
    description: "Action needed soon",
    icon: "alert-triangle",
    textClass: "text-status-amber",
    bgClass: "bg-status-amber",
    borderClass: "border-status-amber",
    bgTintClass: "bg-status-amber/10",
    dotClass: "bg-status-amber",
  },
  red: {
    label: "Action required",
    description: "Urgent action needed",
    icon: "alert-circle",
    textClass: "text-status-red",
    bgClass: "bg-status-red",
    borderClass: "border-status-red",
    bgTintClass: "bg-status-red/10",
    dotClass: "bg-status-red",
  },
};

// ============================================================================
// TYPES
// ============================================================================

export interface RagStatusProps {
  status: HealthStatus;
  variant: "dot" | "badge" | "card" | "large";
  label?: string;
  description?: string;
  title?: string;
  trend?: "improving" | "stable" | "declining";
  lastUpdated?: Date;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

// ============================================================================
// TREND CONFIG
// ============================================================================

const TREND_CONFIG = {
  improving: { icon: "trending-up" as IconKey, label: "Improving" },
  stable: { icon: "minus" as IconKey, label: "Stable" },
  declining: { icon: "trending-down" as IconKey, label: "Declining" },
};

// ============================================================================
// DOT VARIANT
// ============================================================================

function DotVariant({
  status,
  label,
  size = "md",
  showLabel = true,
  className,
}: Pick<RagStatusProps, "status" | "label" | "size" | "showLabel" | "className">) {
  const config = STATUS_MAP[status];
  const displayLabel = label ?? config.label;

  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="status"
      aria-label={displayLabel}
    >
      <span
        className={cn("rounded-full shrink-0", dotSize, config.dotClass)}
        aria-hidden="true"
      />
      <AppIcon
        name={config.icon}
        className={cn(iconSize, config.textClass)}
        aria-hidden={true}
      />
      {showLabel && (
        <span className={cn(textSize, config.textClass, "font-medium")}>
          {displayLabel}
        </span>
      )}
    </span>
  );
}

// ============================================================================
// BADGE VARIANT
// ============================================================================

const STATUS_TO_BADGE_VARIANT = {
  green: "success",
  amber: "warning",
  red: "danger",
} as const;

function BadgeVariant({
  status,
  label,
  size = "md",
  className,
}: Pick<RagStatusProps, "status" | "label" | "size" | "className">) {
  const config = STATUS_MAP[status];
  const displayLabel = label ?? config.label;
  const badgeVariant = STATUS_TO_BADGE_VARIANT[status];

  return (
    <Badge
      variant={badgeVariant}
      size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"}
      icon={config.icon}
      className={className}
      role="status"
      aria-label={displayLabel}
    >
      {displayLabel}
    </Badge>
  );
}

// ============================================================================
// CARD VARIANT
// ============================================================================

function CardVariant({
  status,
  label,
  description,
  title,
  className,
}: Pick<RagStatusProps, "status" | "label" | "description" | "title" | "className">) {
  const config = STATUS_MAP[status];
  const displayLabel = label ?? config.label;
  const displayDescription = description ?? config.description;

  return (
    <div
      className={cn(
        "rounded-lg border-[0.5px] border-border p-4",
        "border-l-2",
        config.borderClass,
        config.bgTintClass,
        className
      )}
      role="status"
      aria-label={title ? `${title}: ${displayLabel}` : displayLabel}
    >
      <div className="flex items-start gap-3">
        <AppIcon
          name={config.icon}
          className={cn("w-5 h-5 shrink-0 mt-0.5", config.textClass)}
          aria-hidden={true}
        />
        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-sm font-semibold text-foreground">{title}</p>
          )}
          <p className={cn("text-sm font-medium", config.textClass)}>
            {displayLabel}
          </p>
          {displayDescription && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LARGE VARIANT
// ============================================================================

function LargeVariant({
  status,
  label,
  description,
  trend,
  lastUpdated,
  className,
}: Pick<
  RagStatusProps,
  "status" | "label" | "description" | "trend" | "lastUpdated" | "className"
>) {
  const config = STATUS_MAP[status];
  const displayLabel = label ?? config.label;
  const displayDescription = description ?? config.description;
  const trendConfig = trend ? TREND_CONFIG[trend] : null;

  return (
    <div
      className={cn(
        "w-full rounded-lg border-[0.5px] border-border p-6",
        config.bgTintClass,
        "text-center",
        className
      )}
      role="status"
      aria-label={`Health score: ${displayLabel}`}
    >
      <div className="flex flex-col items-center gap-2">
        <AppIcon
          name={config.icon}
          className={cn("w-10 h-10", config.textClass)}
          aria-hidden={true}
        />
        <p className={cn("text-2xl font-bold", config.textClass)}>
          {displayLabel}
        </p>
        {displayDescription && (
          <p className="text-sm text-muted-foreground">{displayDescription}</p>
        )}

        {trendConfig && (
          <div className="flex items-center gap-1.5 mt-2">
            <AppIcon
              name={trendConfig.icon}
              className="w-4 h-4 text-muted-foreground"
              aria-hidden={true}
            />
            <span className="text-xs text-muted-foreground font-medium">
              {trendConfig.label}
            </span>
          </div>
        )}

        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated:{" "}
            {lastUpdated.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RagStatus({
  variant,
  status,
  label,
  description,
  title,
  trend,
  lastUpdated,
  size = "md",
  showLabel = true,
  className,
}: RagStatusProps) {
  switch (variant) {
    case "dot":
      return (
        <DotVariant
          status={status}
          label={label}
          size={size}
          showLabel={showLabel}
          className={className}
        />
      );
    case "badge":
      return (
        <BadgeVariant
          status={status}
          label={label}
          size={size}
          className={className}
        />
      );
    case "card":
      return (
        <CardVariant
          status={status}
          label={label}
          description={description}
          title={title}
          className={className}
        />
      );
    case "large":
      return (
        <LargeVariant
          status={status}
          label={label}
          description={description}
          trend={trend}
          lastUpdated={lastUpdated}
          className={className}
        />
      );
  }
}

export default RagStatus;
