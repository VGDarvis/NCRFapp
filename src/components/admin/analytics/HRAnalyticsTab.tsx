import { useState } from "react";
import { subDays } from "date-fns";
import { DateRangePicker } from "./shared/DateRangePicker";
import { ExportButton } from "./shared/ExportButton";
import { LineChartCard } from "./charts/LineChartCard";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { AreaChartCard } from "./charts/AreaChartCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useTrendData } from "@/hooks/useTrendData";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { StatsCard } from "../shared/StatsCard";
import { Users, CheckCircle, FileText, TrendingUp } from "lucide-react";

export function HRAnalyticsTab() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  const { data, isLoading: hrLoading } = useAnalyticsData("hr", dateRange);
  const hrData = data && 'employees' in data ? data : null;
  const { data: headcountTrend, isLoading: trendLoading } = useTrendData(
    "employee_headcount",
    dateRange
  );

  if (hrLoading || trendLoading) {
    return <LoadingSpinner size="lg" text="Loading HR analytics..." />;
  }

  const employeesByStatus = [
    { name: "Active", value: hrData?.headcount?.active || 0 },
    { name: "On Leave", value: hrData?.headcount?.onLeave || 0 },
  ];

  const departmentDistribution = hrData?.employees?.reduce((acc: any[], emp: any) => {
    const deptName = emp.departments?.name || "Unassigned";
    const existing = acc.find((item) => item.name === deptName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: deptName, value: 1 });
    }
    return acc;
  }, []) || [];

  const onboardingCompletion = hrData?.onboarding?.length
    ? ((hrData.onboarding.filter((t: any) => t.is_completed).length / hrData.onboarding.length) * 100).toFixed(1)
    : 0;

  const documentTypes = hrData?.documents?.reduce((acc: any[], doc: any) => {
    const existing = acc.find((item) => item.name === doc.document_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: doc.document_type, value: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">HR Analytics</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportButton data={hrData?.employees || []} filename="hr-analytics" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={hrData?.headcount?.total || 0}
          icon={Users}
          description="All employees"
        />
        <StatsCard
          title="Active Employees"
          value={hrData?.headcount?.active || 0}
          icon={CheckCircle}
          description="Currently working"
        />
        <StatsCard
          title="Onboarding Tasks"
          value={hrData?.onboarding?.filter((t: any) => !t.is_completed).length || 0}
          icon={TrendingUp}
          description="Pending tasks"
        />
        <StatsCard
          title="Documents Uploaded"
          value={hrData?.documents?.length || 0}
          icon={FileText}
          description="This period"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <AreaChartCard
          title="Headcount Trend"
          description="Total employees over time"
          data={headcountTrend || []}
          dataKey="value"
          xAxisKey="date"
        />

        <PieChartCard
          title="Employee Status"
          description="Distribution by employment status"
          data={employeesByStatus}
          dataKey="value"
          nameKey="name"
        />

        <BarChartCard
          title="Department Distribution"
          description="Employees by department"
          data={departmentDistribution}
          dataKey="value"
          xAxisKey="name"
          horizontal
        />

        <PieChartCard
          title="Document Types"
          description="Documents by type"
          data={documentTypes}
          dataKey="value"
          nameKey="name"
        />
      </div>

      {/* Onboarding Progress */}
      <div className="glass-premium p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Onboarding Completion Rate</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-primary">{onboardingCompletion}%</div>
          <div className="text-sm text-muted-foreground">
            {hrData?.onboarding?.filter((t: any) => t.is_completed).length || 0} of{" "}
            {hrData?.onboarding?.length || 0} tasks completed
          </div>
        </div>
      </div>
    </div>
  );
}
