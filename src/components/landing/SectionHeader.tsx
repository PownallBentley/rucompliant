import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center max-w-2xl mx-auto", className)}>
      <h2 className="font-extrabold text-[32px] md:text-[40px] text-foreground leading-[1.2] tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-normal text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
