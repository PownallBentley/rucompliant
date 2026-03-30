import AppIcon from "@/components/ui/AppIcon";

export default function HeroHealthCard() {
  return (
    <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end relative z-10">
      <div className="w-[320px] bg-white rounded-xl border-[1.5px] border-emerald p-6 animate-float">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="section-label text-muted-foreground">Compliance Health</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <AppIcon name="shield-check" className="w-4 h-4 text-emerald" />
          </div>
        </div>

        {/* Score */}
        <div className="flex items-end gap-3 mb-2">
          <span className="font-extrabold text-[64px] leading-none text-emerald tracking-tight">94</span>
          <span className="text-sm font-medium text-muted-foreground mb-2">/ 100</span>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mt-2">
          <AppIcon name="circle-check" className="w-3 h-3 mr-1.5" />
          ALL CLEAR — YOU ARE COMPLIANT
        </div>

        {/* Progress items */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">HMRC Self Assessment</span>
            <span className="text-emerald font-semibold flex items-center gap-1">
              <AppIcon name="check" className="w-3 h-3" /> Done
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald rounded-full" />
          </div>

          <div className="flex justify-between items-center text-sm mt-4">
            <span className="text-muted-foreground">Companies House</span>
            <span className="text-emerald font-semibold flex items-center gap-1">
              <AppIcon name="check" className="w-3 h-3" /> Done
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald rounded-full" />
          </div>
        </div>
      </div>

      {/* Decorative blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
