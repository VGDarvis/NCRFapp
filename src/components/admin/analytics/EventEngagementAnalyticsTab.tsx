import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventEngagementAnalytics } from "@/hooks/useEventEngagementAnalytics";
import { useEvents } from "@/hooks/useEvents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Users, UserCheck, Activity, Smartphone, TrendingUp } from "lucide-react";
import { BarChartCard } from "./charts/BarChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { ExportButton } from "./shared/ExportButton";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export function EventEngagementAnalyticsTab() {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Header with Event Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Event Engagement Analytics</h2>
          <p className="text-muted-foreground">
            Real-time tracking of QR scans, app usage, and attendee engagement
          </p>
        </div>
        <div className="flex gap-2 items-center">
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
          <ExportButton 
            data={[{
              event: selectedEvent?.title,
              qrMetrics,
              appUsage,
              registrationMetrics,
              entrySources,
              deviceTypes,
              boothEngagement,
            }]} 
            filename={`event-engagement-${selectedEvent?.title || 'report'}`} 
          />
        </div>
      </div>

      {/* Real-Time KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Codes Scanned</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qrMetrics?.total_qr_scans || 0}</div>
            <p className="text-xs text-muted-foreground">
              {qrMetrics?.conversion_rate.toFixed(1)}% conversion to registration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active App Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appUsage?.active_now || 0}</div>
            <p className="text-xs text-muted-foreground">
              {appUsage?.total_sessions || 0} total sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked-In Attendees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrationMetrics?.checked_in || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {registrationMetrics?.total_registrations || 0} registered ({registrationMetrics?.check_in_rate.toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Signups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrationMetrics?.profile_signups || 0}</div>
            <p className="text-xs text-muted-foreground">
              {appUsage?.unique_visitors || 0} unique visitors
            </p>
          </CardContent>
        </Card>
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

        {/* Booth Engagement */}
        <BarChartCard
          title="Top 10 Most Visited Booths"
          description="Booth engagement rankings"
          data={boothEngagement?.map((booth) => ({
            name: booth.booth_number,
            value: booth.visits,
          })) || []}
          dataKey="value"
          xAxisKey="name"
          color="hsl(var(--chart-3))"
        />
      </div>

      {/* Engagement Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">Average Session Duration</p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(appUsage?.avg_duration_seconds || 0)} per visitor
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">Total Page Views</p>
              <p className="text-sm text-muted-foreground">
                {appUsage?.total_page_views || 0} pages viewed across all sessions
              </p>
            </div>
          </div>
          {qrMetrics && qrMetrics.conversion_rate > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">QR Code Performance</p>
                <p className="text-sm text-muted-foreground">
                  {qrMetrics.conversion_rate.toFixed(1)}% of QR scans resulted in registrations
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
