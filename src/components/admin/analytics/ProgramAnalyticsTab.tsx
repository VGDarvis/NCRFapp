import { useState } from "react";
import { subDays } from "date-fns";
import { DateRangePicker } from "./shared/DateRangePicker";
import { ExportButton } from "./shared/ExportButton";
import { LineChartCard } from "./charts/LineChartCard";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useTrendData } from "@/hooks/useTrendData";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { StatsCard } from "../shared/StatsCard";
import { Calendar, Users, Download, TrendingUp } from "lucide-react";

export function ProgramAnalyticsTab() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date(),
  });

  const { data, isLoading: programLoading } = useAnalyticsData("programs", dateRange);
  const programData = data && 'events' in data ? data : null;
  const { data: registrationsTrend, isLoading: trendLoading } = useTrendData(
    "event_registrations",
    dateRange
  );

  if (programLoading || trendLoading) {
    return <LoadingSpinner size="lg" text="Loading program analytics..." />;
  }

  const eventsByType = programData?.events?.reduce((acc: any[], event: any) => {
    const existing = acc.find((item) => item.name === event.event_type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: event.event_type, value: 1 });
    }
    return acc;
  }, []) || [];

  const eventsByState = programData?.events?.reduce((acc: any[], event: any) => {
    const existing = acc.find((item) => item.name === event.state);
    if (existing) {
      existing.value += 1;
    } else if (event.state) {
      acc.push({ name: event.state, value: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value).slice(0, 10) || [];

  const topEvents = programData?.events
    ?.map((event: any) => ({
      name: event.title,
      value: event.attendee_count || 0,
    }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 10) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Program Analytics</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportButton data={programData?.events || []} filename="program-analytics" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={programData?.totalEvents || 0}
          icon={Calendar}
          description="Events held"
        />
        <StatsCard
          title="Total Attendees"
          value={programData?.totalAttendees || 0}
          icon={Users}
          description="Across all events"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${programData?.attendanceRate.toFixed(1) || 0}%`}
          icon={TrendingUp}
          description="Registration to attendance"
        />
        <StatsCard
          title="Booklet Downloads"
          value={programData?.downloads.length || 0}
          icon={Download}
          description="Scholarship resources"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartCard
          title="Event Registrations Over Time"
          description="Daily registration count"
          data={registrationsTrend || []}
          dataKey="value"
          xAxisKey="date"
        />

        <PieChartCard
          title="Events by Type"
          description="Distribution of event types"
          data={eventsByType}
          dataKey="value"
          nameKey="name"
        />

        <BarChartCard
          title="Top Events by Attendance"
          description="Most attended events"
          data={topEvents}
          dataKey="value"
          xAxisKey="name"
          horizontal
        />

        <BarChartCard
          title="Events by State"
          description="Geographic distribution of events"
          data={eventsByState}
          dataKey="value"
          xAxisKey="name"
        />
      </div>
    </div>
  );
}
