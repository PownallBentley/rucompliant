import AppIcon from "@/components/ui/AppIcon";

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
      <span className="flex items-center gap-1">
        <AppIcon name="check" className="w-3 h-3 text-emerald" /> Free for 14 days
      </span>
      <span className="hidden sm:inline">&middot;</span>
      <span className="flex items-center gap-1">
        <AppIcon name="check" className="w-3 h-3 text-emerald" /> No credit card
      </span>
      <span className="hidden sm:inline">&middot;</span>
      <span className="flex items-center gap-1">
        <AppIcon name="check" className="w-3 h-3 text-emerald" /> Cancel anytime
      </span>
    </div>
  );
}
