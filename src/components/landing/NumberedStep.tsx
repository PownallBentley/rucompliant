import { cn } from "@/lib/utils";

interface NumberedStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
  className?: string;
}

export default function NumberedStep({ number, title, description, isLast = false, className }: NumberedStepProps) {
  return (
    <div className={cn(
      "flex gap-6 items-start",
      !isLast && "pb-8 border-b border-border",
      className
    )}>
      <span className="font-extrabold text-[48px] md:text-[64px] text-primary leading-none mt-[-8px] select-none">
        {number}
      </span>
      <div>
        <h3 className="font-bold text-lg text-foreground mb-2">{title}</h3>
        <p className="font-normal text-[15px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
