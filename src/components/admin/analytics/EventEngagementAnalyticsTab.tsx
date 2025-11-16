import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventEngagementAnalytics } from "@/hooks/useEventEngagementAnalytics";
import { useQRCodeAnalytics } from "@/hooks/useQRCodeAnalytics";
import { useEvents } from "@/hooks/useEvents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Users, UserCheck, Activity, Smartphone, TrendingUp, Calendar } from "lucide-react";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { LineChartCard } from "./charts/LineChartCard";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ExportButton } from "./shared/ExportButton";
import { DateRangePicker } from "./shared/DateRangePicker";
import { StatsCard } from "../shared/StatsCard";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { subDays, format } from "date-fns";

export function EventEngagementAnalyticsTab() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const {
    qrMetrics,
    appUsage,
    registrationMetrics,
    entrySources,
    deviceTypes,
    boothEngagement,
    hourlyActivity,
    isLoading,
  } = useEventEngagementAnalytics(selectedEventId);

  // Historical QR Analytics
  const { data: historicalQR, isLoading: historicalLoading } = useQRCodeAnalytics(
    selectedEventId ? [selectedEventId] : null,
    dateRange
  );

  // Auto-select the most recent upcoming event
  useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      const upcomingEvents = events
        .filter((e) => e.status === "upcoming")
        .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
      
      if (upcomingEvents.length > 0) {
        setSelectedEventId(upcomingEvents[0].id);
      } else {
        setSelectedEventId(events[0].id);
      }
    }
  }, [events, selectedEventId]);

  // Real-time updates
  useEffect(() => {
    if (!selectedEventId) return;

    const channel = supabase
      .channel('event-engagement-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guest_sessions',
          filter: `event_id=eq.${selectedEventId}`,
        },
        () => {
          // Query invalidation happens automatically via refetchInterval
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
          filter: `event_id=eq.${selectedEventId}`,
        },
        () => {
          // Query invalidation happens automatically
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedEventId]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading || historicalLoading) {
    return <LoadingSpinner />;
  }

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Header with Event Selector and Date Range */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Event Engagement Analytics</h2>
            <p className="text-muted-foreground">
              Real-time tracking and historical analysis of QR scans, app usage, and attendee engagement
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events?.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <ExportButton
              data={[
                { section: "QR Metrics", ...qrMetrics },
                { section: "App Usage", ...appUsage },
                { section: "Registration Metrics", ...registrationMetrics },
                { section: "Historical QR Data", ...historicalQR },
              ]}
              filename={`${selectedEvent?.title || "event"}-analytics-${new Date().toISOString()}`}
            />
          </div>
        </div>
      </div>

      {/* Historical QR Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Historical QR Code Analytics</h3>
          <span className="text-sm text-muted-foreground">
            ({format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")})
          </span>
        </div>

        {/* Historical KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Cumulative Scans"
            value={historicalQR?.totalScans || 0}
            description={`Across ${Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days`}
            icon={QrCode}
          />
          <StatsCard
            title="Daily Average"
            value={historicalQR?.averagePerDay.toFixed(1) || "0"}
            description="Average scans per day"
            icon={TrendingUp}
          />
          <StatsCard
            title="Peak Day"
            value={historicalQR?.peakDay?.scans || 0}
            description={historicalQR?.peakDay ? format(new Date(historicalQR.peakDay.date), "MMM d") : "No data"}
            icon={Activity}
          />
          <StatsCard
            title="Unique Attendees"
            value={historicalQR?.uniqueAttendees || 0}
            description={`${((historicalQR?.uniqueAttendees || 0) / (historicalQR?.totalScans || 1) * 100).toFixed(0)}% unique rate`}
            icon={Users}
          />
        </div>

        {/* Daily Breakdown Chart */}
        <LineChartCard
          title="Daily QR Code Scans"
          description="Scan activity over the selected date range"
          data={historicalQR?.dailyBreakdown.map(d => ({
            ...d,
            dateFormatted: format(new Date(d.date), "MMM d")
          })) || []}
          dataKey="scans"
          xAxisKey="dateFormatted"
        />

        {/* Event Comparison if multiple events */}
        {historicalQR?.byEvent && historicalQR.byEvent.length > 1 && (
          <BarChartCard
            title="Scans by Event"
            description="Comparison across events in the selected period"
            data={historicalQR.byEvent}
            dataKey="totalScans"
            xAxisKey="eventName"
          />
        )}
      </div>

      {/* Real-time Activity Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Real-time Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="QR Code Scans Today"
            value={qrMetrics?.total_qr_scans || 0}
            description={`${qrMetrics?.conversion_rate.toFixed(1)}% conversion rate`}
            icon={QrCode}
          />
          <StatsCard
            title="Active App Users"
            value={appUsage?.active_now || 0}
            description={`${appUsage?.total_sessions || 0} total sessions`}
            icon={Activity}
          />
          <StatsCard
            title="Checked In"
            value={registrationMetrics?.checked_in || 0}
            description={`${registrationMetrics?.check_in_rate.toFixed(1)}% of registrations`}
            icon={UserCheck}
          />
          <StatsCard
            title="Profile Sign-ups"
            value={registrationMetrics?.profile_signups || 0}
            description={`${((registrationMetrics?.profile_signups || 0) / (registrationMetrics?.total_registrations || 1) * 100).toFixed(1)}% of attendees`}
            icon={Users}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card className="glass-premium">
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
            <CardDescription>Sessions and QR scans throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: { label: "Sessions", color: "hsl(var(--chart-1))" },
                scans: { label: "QR Scans", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="hour"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Entry Sources */}
        <PieChartCard
          title="Entry Sources"
          description="How attendees discovered the event"
          data={entrySources?.map((source) => ({
            name: source.source,
            value: source.count,
          })) || []}
          dataKey="value"
          nameKey="name"
        />

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Platform usage distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceTypes && deviceTypes.length > 0 ? (
              deviceTypes.map((device) => {
                const total = deviceTypes.reduce((sum, d) => sum + d.count, 0);
                const percentage = ((device.count / total) * 100).toFixed(1);
                return (
                  <div key={device.device} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{device.device}</span>
                      <span className="text-muted-foreground">
                        {device.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No device data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Booth Engagement */}
        <BarChartCard
          title="Top Booth Engagement"
          description="Most visited booths"
          data={boothEngagement?.slice(0, 10) || []}
          dataKey="visits"
          xAxisKey="booth_number"
        />
      </div>

      {/* Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Insights</CardTitle>
          <CardDescription>Key takeaways from the analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            <p className="text-sm">
              <strong>Session Duration:</strong> Average session time is{" "}
              {formatDuration(appUsage?.avg_duration_seconds || 0)}, showing{" "}
              {(appUsage?.avg_duration_seconds || 0) > 180 ? "strong" : "moderate"} engagement
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
            <p className="text-sm">
              <strong>QR Code Performance:</strong> {qrMetrics?.conversion_rate.toFixed(1)}%
              conversion rate from scan to registration. Historical average:{" "}
              {historicalQR?.averagePerDay.toFixed(1)} scans/day
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            <p className="text-sm">
              <strong>Peak Activity:</strong> Most activity occurs at{" "}
              {hourlyActivity && hourlyActivity.length > 0
                ? hourlyActivity.reduce((max, h) =>
                    h.sessions > max.sessions ? h : max
                  ).hour
                : "N/A"}{" "}
              - consider timing key announcements during this window
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
