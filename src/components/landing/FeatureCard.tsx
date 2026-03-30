import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";
import type { IconKey } from "@/components/ui/AppIcon";

interface FeatureCardProps {
  icon: IconKey;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "bg-surface rounded-xl p-6 border border-border transition-all",
      className
    )}>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
        <AppIcon name={icon} className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-3">{title}</h3>
      <p className="font-normal text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
