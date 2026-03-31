import RagStatus from "@/components/shared/RagStatus";
import type { DomainScore } from "@/services/healthScoreService";
import { EmptyState } from "@/components/ui";

interface DomainBreakdownProps {
  domains: DomainScore[];
  loading?: boolean;
}

export default function DomainBreakdown({ domains, loading }: DomainBreakdownProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-surface rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <EmptyState
        icon="shield"
        title="No compliance domains"
        description="Complete onboarding to set up your compliance domains."
      />
    );
  }

  // Sort: Red first, then Amber, then Green
  const sorted = [...domains].sort((a, b) => {
    const order = { red: 0, amber: 1, green: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((domain) => (
        <RagStatus
          key={domain.id}
          status={domain.status}
          variant="card"
          title={domain.domainName}
          description={domain.domainDescription}
        />
      ))}
    </div>
  );
}
