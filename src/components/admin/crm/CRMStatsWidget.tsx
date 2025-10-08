import { Building2, Users, MessageSquare, Target } from "lucide-react";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { useCRMStats } from "@/hooks/useCRMStats";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";

export function CRMStatsWidget() {
  const { stats, isLoading } = useCRMStats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Organizations"
        value={stats?.totalOrganizations || 0}
        description={`${stats?.activePartners || 0} active partners`}
        icon={Building2}
      />
      <StatsCard
        title="Total Contacts"
        value={stats?.totalContacts || 0}
        description={`${stats?.activeContacts || 0} active`}
        icon={Users}
      />
      <StatsCard
        title="Interactions (30d)"
        value={stats?.interactionsThisMonth || 0}
        icon={MessageSquare}
      />
      <StatsCard
        title="Success Rate"
        value="0%"
        description="Partnership conversion"
        icon={Target}
      />
    </div>
  );
}
