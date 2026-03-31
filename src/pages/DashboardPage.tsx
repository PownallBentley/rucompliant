import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useHealthScoreStore } from "@/stores/healthScoreStore";
import {
  fetchHealthScore,
  fetchDomainScores,
  fetchNextActions,
  calculateOverallStatus,
} from "@/services/healthScoreService";
import RagStatus from "@/components/shared/RagStatus";
import DomainBreakdown from "@/components/dashboard/DomainBreakdown";
import NextActions from "@/components/dashboard/NextActions";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const {
    overallStatus,
    previousStatus,
    calculatedAt,
    domainScores,
    nextActions,
    loading,
    setOverallStatus,
    setDomainScores,
    setNextActions,
    setLoading,
  } = useHealthScoreStore();

  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      setLoading(true);
      try {
        const [healthScore, domains, actions] = await Promise.all([
          fetchHealthScore(user!.id),
          fetchDomainScores(user!.id),
          fetchNextActions(user!.id),
        ]);

        if (healthScore) {
          setOverallStatus(
            healthScore.overallStatus,
            healthScore.previousStatus,
            healthScore.calculatedAt
          );
        } else if (domains.length > 0) {
          // Calculate from domain scores if no health_scores row
          const calculated = calculateOverallStatus(domains);
          setOverallStatus(calculated, null, new Date().toISOString());
        }

        setDomainScores(domains);
        setNextActions(actions);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, setOverallStatus, setDomainScores, setNextActions, setLoading]);

  // Determine trend for display
  const trend = previousStatus
    ? previousStatus === overallStatus
      ? "stable" as const
      : (previousStatus === "red" && overallStatus !== "red")
        || (previousStatus === "amber" && overallStatus === "green")
        ? "improving" as const
        : "declining" as const
    : undefined;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your compliance overview at a glance
        </p>
      </div>

      {/* Health Score Hero */}
      <section>
        {loading ? (
          <div className="h-40 bg-surface rounded-xl animate-pulse" />
        ) : overallStatus ? (
          <RagStatus
            status={overallStatus}
            variant="large"
            trend={trend}
            lastUpdated={calculatedAt ? new Date(calculatedAt) : undefined}
          />
        ) : (
          <div className="bg-white rounded-xl border border-border p-8 text-center">
            <p className="text-muted-foreground">
              Complete your onboarding to see your Health Score.
            </p>
          </div>
        )}
      </section>

      {/* Domain Breakdown */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Compliance Domains</h2>
          <p className="text-sm text-muted-foreground">
            How you're doing across each area of compliance
          </p>
        </div>
        <DomainBreakdown domains={domainScores} loading={loading} />
      </section>

      {/* Next 3 Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Next Actions</h2>
          <p className="text-sm text-muted-foreground">
            Your most urgent upcoming tasks
          </p>
        </div>
        <NextActions actions={nextActions} loading={loading} />
      </section>
    </div>
  );
}
