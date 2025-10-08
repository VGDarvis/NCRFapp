import { useState } from "react";
import { subDays } from "date-fns";
import { DateRangePicker } from "./shared/DateRangePicker";
import { ExportButton } from "./shared/ExportButton";
import { LineChartCard } from "./charts/LineChartCard";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { AreaChartCard } from "./charts/AreaChartCard";
import { useTrendData } from "@/hooks/useTrendData";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { StatsCard } from "../shared/StatsCard";
import { useMessageStats } from "@/hooks/useMessageStats";
import { useCRMStats } from "@/hooks/useCRMStats";
import { useHRStats } from "@/hooks/useHRStats";
import { Mail, Users, Briefcase, Activity } from "lucide-react";

export function DashboardTab() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: messagesTrend, isLoading: messagesTrendLoading } = useTrendData(
    "messages_sent",
    dateRange
  );
  const { data: interactionsTrend, isLoading: interactionsTrendLoading } = useTrendData(
    "crm_interactions",
    dateRange
  );
  const { data: headcountTrend, isLoading: headcountTrendLoading } = useTrendData(
    "employee_headcount",
    dateRange
  );

  const { stats: messageStats } = useMessageStats();
  const { stats: crmStats } = useCRMStats();
  const { stats: hrStats } = useHRStats();

  const { data, isLoading: analyticsLoading } = useAnalyticsData(
    "programs",
    dateRange
  );
  const analyticsData = data && 'events' in data ? data : null;

  const activityDistribution = [
    { name: "CRM", value: crmStats?.activePartners || 0 },
    { name: "Messages", value: messageStats?.totalSentWeek || 0 },
    { name: "HR", value: hrStats?.pendingTasks || 0 },
    { name: "Events", value: analyticsData?.totalEvents || 0 },
  ];

  if (messagesTrendLoading || interactionsTrendLoading || headcountTrendLoading || analyticsLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportButton data={messagesTrend || []} filename="dashboard-analytics" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Messages This Week"
          value={messageStats?.totalSentWeek || 0}
          icon={Mail}
          description="Total messages sent"
        />
        <StatsCard
          title="Active CRM Contacts"
          value={crmStats?.activeContacts || 0}
          icon={Users}
          description="Currently engaged"
        />
        <StatsCard
          title="Total Employees"
          value={hrStats?.totalEmployees || 0}
          icon={Briefcase}
          description="Active staff members"
        />
        <StatsCard
          title="Pending HR Tasks"
          value={hrStats?.pendingTasks || 0}
          icon={Activity}
          description="Onboarding tasks"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartCard
          title="Messages Sent Over Time"
          description="Daily message volume for the selected period"
          data={messagesTrend || []}
          dataKey="value"
          xAxisKey="date"
        />

        <BarChartCard
          title="CRM Interactions"
          description="Daily interaction count"
          data={interactionsTrend || []}
          dataKey="value"
          xAxisKey="date"
        />

        <AreaChartCard
          title="Employee Headcount Trend"
          description="Total employees over time"
          data={headcountTrend || []}
          dataKey="value"
          xAxisKey="date"
        />

        <PieChartCard
          title="Activity Distribution"
          description="Activity breakdown by module"
          data={activityDistribution}
          dataKey="value"
          nameKey="name"
        />
      </div>
    </div>
  );
}
