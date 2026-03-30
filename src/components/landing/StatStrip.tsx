import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: StatItem[];
  className?: string;
}

export default function StatStrip({ stats, className }: StatStripProps) {
  return (
    <div className={cn(
      "w-full bg-surface py-12 px-4 border-y border-border",
      className
    )}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center divide-y md:divide-y-0 md:divide-x divide-border gap-8 md:gap-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="w-full md:w-1/3 flex flex-col items-center justify-center py-4 md:py-0 px-4 text-center"
          >
            <span className="font-extrabold text-[40px] text-primary leading-none mb-2">
              {stat.value}
            </span>
            <span className="section-label text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
