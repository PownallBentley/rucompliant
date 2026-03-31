import { cn } from "@/lib/utils";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsCard({ title, description, children, className }: SettingsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-border p-6", className)}>
      <div className="mb-5">
        <h3 className="font-bold text-base text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
