import { useHRStats } from "@/hooks/useHRStats";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { Users, Building2, CheckSquare, AlertCircle, UserPlus, FileText } from "lucide-react";

export function HRStatsWidget() {
  const { stats, isLoading } = useHRStats();

  if (isLoading) {
    return <LoadingSpinner text="Loading HR statistics..." />;
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Employees"
        value={stats.totalEmployees}
        description={`${stats.activeEmployees} active, ${stats.onLeaveEmployees} on leave`}
        icon={Users}
      />
      <StatsCard
        title="Active Departments"
        value={stats.activeDepartments}
        icon={Building2}
      />
      <StatsCard
        title="Pending Tasks"
        value={stats.pendingTasks}
        description={stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : undefined}
        icon={CheckSquare}
        className={stats.overdueTasks > 0 ? "border-destructive/50" : undefined}
      />
      <StatsCard
        title="New Hires This Month"
        value={stats.newHiresThisMonth}
        icon={UserPlus}
      />
    </div>
  );
}
