import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";

interface PricingFeature {
  text: string;
  bold?: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  subtitle: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  className?: string;
}

export default function PricingCard({
  name,
  price,
  period,
  subtitle,
  features,
  highlighted = false,
  badge,
  ctaText = "Start 14-day free trial",
  className,
}: PricingCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl p-8 flex flex-col h-full relative",
      highlighted
        ? "border-2 border-primary md:-translate-y-2"
        : "border border-border",
      className
    )}>
      {badge && (
        <div className="absolute -top-4 right-6 bg-primary text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-full">
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold text-xl text-foreground mb-2">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold text-[40px] text-foreground">{price}</span>
          <span className="font-medium text-base text-muted-foreground">{period}</span>
        </div>
        <span className={cn(
          "text-sm font-medium mt-1 block",
          highlighted ? "text-emerald font-semibold" : "text-muted-foreground text-xs"
        )}>
          {subtitle}
        </span>
      </div>

      <div className="flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <AppIcon name="circle-check" className="w-4 h-4 text-emerald mt-0.5 shrink-0" />
              <span className={cn("text-sm text-foreground", feature.bold && "font-medium")}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/auth">
        <button className={cn(
          "w-full h-[44px] font-bold text-[15px] rounded-lg transition-colors",
          highlighted
            ? "bg-magenta text-white hover:bg-magenta-600"
            : "bg-white border-[1.5px] border-primary text-primary hover:bg-primary/5"
        )}>
          {ctaText}
        </button>
      </Link>
    </div>
  );
}
