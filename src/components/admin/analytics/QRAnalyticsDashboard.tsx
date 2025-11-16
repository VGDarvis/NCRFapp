import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QrCode, TrendingUp, Users, Clock, Activity, Download } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useQRCodeAnalytics } from "@/hooks/useQRCodeAnalytics";
import { DateRangePicker } from "./shared/DateRangePicker";
import { LineChartCard } from "./charts/LineChartCard";
import { PieChartCard } from "./charts/PieChartCard";
import { BarChartCard } from "./charts/BarChartCard";
import { format, subDays } from "date-fns";
import { toast } from "sonner";

export const QRAnalyticsDashboard = () => {
  const { events } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Auto-select the first event
  useEffect(() => {
    if (events && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const eventIds = selectedEventId ? [selectedEventId] : null;
  const { data: analytics, isLoading } = useQRCodeAnalytics(eventIds, dateRange);

  const selectedEvent = events?.find((e) => e.id === selectedEventId);

  const handleExport = () => {
    if (!analytics) return;
    
    const csvContent = [
      ["QR Code Analytics Report"],
      [`Event: ${selectedEvent?.title || "All Events"}`],
      [`Date Range: ${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`],
      [""],
      ["Metric", "Value"],
      ["Total App Opens", analytics.totalScans],
      ["Unique Visitors", analytics.uniqueAttendees],
      ["Daily Average", analytics.averagePerDay],
      ["Active Now", analytics.activeNow],
      ["Avg Session Duration (seconds)", analytics.averageSessionDuration],
      [""],
      ["Daily Breakdown"],
      ["Date", "Scans", "Unique Visitors"],
      ...analytics.dailyBreakdown.map((day) => [day.date, day.scans, day.uniqueAttendees]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Analytics exported successfully!");
  };

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            QR Code Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Track all QR code scans and app visits
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select event" />
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="glass-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total App Opens</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalScans}</div>
            <p className="text-xs text-muted-foreground">All-time scans tracked</p>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueAttendees}</div>
            <p className="text-xs text-muted-foreground">Distinct sessions</p>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averagePerDay}</div>
            <p className="text-xs text-muted-foreground">Scans per day</p>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeNow}</div>
            <p className="text-xs text-muted-foreground">Last 5 minutes</p>
          </CardContent>
        </Card>

        <Card className="glass-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(analytics.averageSessionDuration / 60)}m{" "}
              {analytics.averageSessionDuration % 60}s
            </div>
            <p className="text-xs text-muted-foreground">Time in app</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartCard
          title="Daily Scans Trend"
          description="Track QR code scans over time"
          data={analytics.dailyBreakdown.map((day) => ({
            date: format(new Date(day.date), "MMM d"),
            scans: day.scans,
          }))}
          dataKey="scans"
          xAxisKey="date"
          color="hsl(var(--primary))"
        />

        <PieChartCard
          title="Entry Source Breakdown"
          description="How visitors accessed the app"
          data={analytics.entrySourceBreakdown}
          dataKey="count"
          nameKey="source"
        />

        <BarChartCard
          title="Device Distribution"
          description="Visitor device types"
          data={analytics.deviceBreakdown}
          dataKey="count"
          xAxisKey="device"
        />

        <BarChartCard
          title="Hourly Activity Pattern"
          description="Scans by time of day"
          data={analytics.hourlyActivity
            .filter((h) => h.scans > 0)
            .map((h) => ({
              hour: `${h.hour}:00`,
              scans: h.scans,
            }))}
          dataKey="scans"
          xAxisKey="hour"
        />
      </div>

      {/* Peak Day & Insights */}
      {analytics.peakDay && (
        <Card className="glass-premium">
          <CardHeader>
            <CardTitle>Peak Activity</CardTitle>
            <CardDescription>Busiest day in selected range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-2xl font-bold">
                  {format(new Date(analytics.peakDay.date), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold text-primary">{analytics.peakDay.scans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Comparison */}
      {analytics.byEvent.length > 1 && (
        <Card className="glass-premium">
          <CardHeader>
            <CardTitle>Multi-Event Comparison</CardTitle>
            <CardDescription>Scans across different events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.byEvent.map((event) => (
                <div key={event.eventId} className="flex items-center justify-between">
                  <span className="font-medium">{event.eventName}</span>
                  <span className="text-2xl font-bold text-primary">{event.totalScans}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
