import { useState } from "react";
import { subDays } from "date-fns";
import { DateRangePicker } from "./shared/DateRangePicker";
import { ExportButton } from "./shared/ExportButton";
import { LineChartCard } from "./charts/LineChartCard";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { StatsCard } from "../shared/StatsCard";
import { Building2, Users, TrendingUp, MessageSquare } from "lucide-react";

export function CRMAnalyticsTab() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading } = useAnalyticsData("crm", dateRange);
  const crmData = data && 'organizations' in data ? data : null;

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading CRM analytics..." />;
  }

  const organizationsByStatus = [
    { name: "Prospect", value: crmData?.partnershipPipeline?.prospect || 0 },
    { name: "Engaged", value: crmData?.partnershipPipeline?.engaged || 0 },
    { name: "Partner", value: crmData?.partnershipPipeline?.partner || 0 },
  ];

  const industryDistribution = crmData?.organizations?.reduce((acc: any[], org: any) => {
    const existing = acc.find((item) => item.name === org.industry);
    if (existing) {
      existing.value += 1;
    } else if (org.industry) {
      acc.push({ name: org.industry, value: 1 });
    }
    return acc;
  }, []) || [];

  const stateDistribution = crmData?.organizations?.reduce((acc: any[], org: any) => {
    const existing = acc.find((item) => item.name === org.state);
    if (existing) {
      existing.value += 1;
    } else if (org.state) {
      acc.push({ name: org.state, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 10) || [];

  const conversionRate = crmData?.organizations?.length
    ? ((crmData.partnershipPipeline?.partner || 0) / crmData.organizations.length * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">CRM Analytics</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportButton data={crmData?.organizations || []} filename="crm-analytics" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Organizations"
          value={crmData?.organizations?.length || 0}
          icon={Building2}
          description="All organizations in CRM"
        />
        <StatsCard
          title="Active Contacts"
          value={crmData?.contacts?.filter((c: any) => c.status === "active").length || 0}
          icon={Users}
          description="Currently engaged contacts"
        />
        <StatsCard
          title="Interactions This Period"
          value={crmData?.interactions?.length || 0}
          icon={MessageSquare}
          description="Total interactions logged"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          description="Prospect to partner"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChartCard
          title="Partnership Pipeline"
          description="Organizations by partnership status"
          data={organizationsByStatus}
          dataKey="value"
          nameKey="name"
        />

        <PieChartCard
          title="Industry Distribution"
          description="Organizations by industry"
          data={industryDistribution}
          dataKey="value"
          nameKey="name"
        />

        <BarChartCard
          title="Geographic Distribution"
          description="Top 10 states by organization count"
          data={stateDistribution}
          dataKey="value"
          xAxisKey="name"
        />

        <BarChartCard
          title="Contact Status"
          description="Contacts by engagement status"
          data={[
            {
              name: "Active",
              value: crmData?.contacts?.filter((c: any) => c.status === "active").length || 0,
            },
            {
              name: "Inactive",
              value: crmData?.contacts?.filter((c: any) => c.status === "inactive").length || 0,
            },
          ]}
          dataKey="value"
          xAxisKey="name"
        />
      </div>
    </div>
  );
}
