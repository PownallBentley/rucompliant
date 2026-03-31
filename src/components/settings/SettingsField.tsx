import { cn } from "@/lib/utils";

interface SettingsFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url" | "date" | "number";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SettingsField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className,
}: SettingsFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-xs font-semibold text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-[40px] px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground transition-all disabled:opacity-50 disabled:bg-surface"
      />
    </div>
  );
}
