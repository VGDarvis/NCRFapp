import { useState } from "react";
import { subDays } from "date-fns";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { LineChartCard } from "@/components/admin/analytics/charts/LineChartCard";
import { BarChartCard } from "@/components/admin/analytics/charts/BarChartCard";
import { PieChartCard } from "@/components/admin/analytics/charts/PieChartCard";
import { DateRangePicker } from "@/components/admin/analytics/shared/DateRangePicker";
import { SearchQueryAnalysis } from "./SearchQueryAnalysis";
import {
  useSearchAnalytics,
  useTopQueries,
  useSearchesOverTime,
  useDatabaseHealth,
  useZeroResultQueries,
} from "@/hooks/useEducationAnalytics";
import { Search, Users, Clock, TrendingUp, Database, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsTab() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: searchStats, isLoading: statsLoading } = useSearchAnalytics(
    dateRange.from,
    dateRange.to
  );
  const { data: topQueries, isLoading: queriesLoading } = useTopQueries(10);
  const { data: searchesOverTime, isLoading: timeSeriesLoading } = useSearchesOverTime(
    dateRange.from,
    dateRange.to
  );
  const { data: dbHealth, isLoading: healthLoading } = useDatabaseHealth();
  const { data: zeroResultQueries } = useZeroResultQueries();

  if (statsLoading || queriesLoading || timeSeriesLoading || healthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const verificationRate = dbHealth
    ? Math.round(
        ((dbHealth.verifiedSchools + dbHealth.verifiedServices) /
          (dbHealth.totalSchools + dbHealth.totalServices)) *
          100
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Search & Database Analytics</h2>
          <p className="text-muted-foreground">
            Track AI search performance and data quality metrics
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Overview KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Searches"
          value={searchStats?.totalSearches || 0}
          description="AI-powered searches"
          icon={Search}
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatsCard
          title="Unique Users"
          value={searchStats?.uniqueUsers || 0}
          description="Users searching"
          icon={Users}
        />
        <StatsCard
          title="Avg Duration"
          value={`${searchStats?.avgDuration || 0}ms`}
          description="Search processing time"
          icon={Clock}
        />
        <StatsCard
          title="Success Rate"
          value={`${searchStats?.successRate || 0}%`}
          description="Searches with results"
          icon={TrendingUp}
          trend={{
            value: searchStats?.successRate || 0,
            isPositive: (searchStats?.successRate || 0) >= 50,
          }}
        />
      </div>

      {/* Database Health */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Schools"
          value={dbHealth?.totalSchools || 0}
          description={`${dbHealth?.verifiedSchools || 0} verified`}
          icon={Database}
        />
        <StatsCard
          title="Youth Services"
          value={dbHealth?.totalServices || 0}
          description={`${dbHealth?.verifiedServices || 0} verified`}
          icon={Database}
        />
        <StatsCard
          title="Verification Rate"
          value={`${verificationRate}%`}
          description="Data quality score"
          icon={CheckCircle}
          trend={{
            value: verificationRate,
            isPositive: verificationRate >= 70,
          }}
        />
        <StatsCard
          title="Zero Results"
          value={searchStats?.zeroResultSearches || 0}
          description="Searches with no data"
          icon={Search}
          trend={{
            value: searchStats?.zeroResultSearches || 0,
            isPositive: false,
          }}
        />
      </div>

      {/* Alerts for Data Gaps */}
      {searchStats && searchStats.zeroResultSearches > 0 && (
        <Alert>
          <AlertDescription>
            <strong>{searchStats.zeroResultSearches} searches</strong> returned no results. Review
            popular queries below to identify missing data.
          </AlertDescription>
        </Alert>
      )}

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartCard
          title="Searches Over Time"
          description="Daily search volume trend"
          data={searchesOverTime || []}
          dataKey="searches"
          xAxisKey="date"
        />
        <BarChartCard
          title="Top Search Queries"
          description="Most frequently searched terms"
          data={(topQueries || []).map((q) => ({
            name: q.query_text.slice(0, 40) + (q.query_text.length > 40 ? "..." : ""),
            value: q.count,
          }))}
          dataKey="value"
          xAxisKey="name"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <PieChartCard
          title="Data Verification Status"
          description="Verified vs unverified records"
          data={[
            {
              name: "Verified Schools",
              value: dbHealth?.verifiedSchools || 0,
            },
            {
              name: "Unverified Schools",
              value: (dbHealth?.totalSchools || 0) - (dbHealth?.verifiedSchools || 0),
            },
            {
              name: "Verified Services",
              value: dbHealth?.verifiedServices || 0,
            },
            {
              name: "Unverified Services",
              value: (dbHealth?.totalServices || 0) - (dbHealth?.verifiedServices || 0),
            },
          ].filter((d) => d.value > 0)}
          dataKey="value"
          nameKey="name"
        />
        <PieChartCard
          title="Search Success Distribution"
          description="Results vs zero-result searches"
          data={[
            {
              name: "Successful Searches",
              value:
                (searchStats?.totalSearches || 0) - (searchStats?.zeroResultSearches || 0),
            },
            {
              name: "Zero Results",
              value: searchStats?.zeroResultSearches || 0,
            },
          ]}
          dataKey="value"
          nameKey="name"
        />
      </div>

      {/* Detailed Query Analysis */}
      <SearchQueryAnalysis dateRange={dateRange} zeroResultQueries={zeroResultQueries || []} />
    </div>
  );
}
