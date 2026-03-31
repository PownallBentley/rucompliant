import { cn } from "@/lib/utils";

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function SettingsToggle({
  label,
  description,
  checked,
  onChange,
  className,
}: SettingsToggleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white transition-transform mt-0.5",
            checked ? "translate-x-[22px] ml-0" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
