import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventAnalytics } from "@/hooks/useEventAnalytics";
import { Activity, Eye, Clock, Users, Smartphone, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

interface GuestAnalyticsDashboardProps {
  eventId: string | null;
}

export const GuestAnalyticsDashboard = ({ eventId }: GuestAnalyticsDashboardProps) => {
  const { sessionStats, pageViews, entrySources, deviceTypes, isLoading } = useEventAnalytics(eventId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!eventId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Guest Analytics</CardTitle>
          <CardDescription>Select an event to view guest analytics</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats?.active_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">guests currently browsing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats?.total_sessions || 0}</div>
            <p className="text-xs text-muted-foreground">unique visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(sessionStats?.avg_session_duration || 0)}
            </div>
            <p className="text-xs text-muted-foreground">per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionStats?.total_page_views || 0}</div>
            <p className="text-xs text-muted-foreground">total interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Entry Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Entry Points
            </CardTitle>
            <CardDescription>Where guests scanned QR codes</CardDescription>
          </CardHeader>
          <CardContent>
            {entrySources && entrySources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={entrySources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ entry_source, percent }) =>
                      `${entry_source} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="entry_source"
                  >
                    {entrySources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No entry data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Popular Sections
            </CardTitle>
            <CardDescription>Most visited tabs</CardDescription>
          </CardHeader>
          <CardContent>
            {pageViews && pageViews.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViews.slice(0, 5)}>
                  <XAxis dataKey="page" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No page view data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Breakdown
            </CardTitle>
            <CardDescription>How guests are accessing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceTypes && deviceTypes.length > 0 ? (
              deviceTypes.map((device: any, index) => {
                const total = deviceTypes.reduce((acc: number, d: any) => acc + d.count, 0);
                const percentage = (device.count / total) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{device.device}</span>
                      <span className="font-medium">
                        {device.count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No device data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Engagement Tips */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle>Engagement Insights</CardTitle>
            <CardDescription>Real-time optimization tips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="text-sm">
                <strong>Active guests:</strong> {sessionStats?.active_sessions || 0} people are
                exploring right now
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary mt-2" />
              <div className="text-sm">
                <strong>Avg. time:</strong> Guests spend{" "}
                {formatDuration(sessionStats?.avg_session_duration || 0)} on average
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-accent mt-2" />
              <div className="text-sm">
                <strong>Top entry:</strong>{" "}
                {entrySources && entrySources[0]
                  ? `${entrySources[0].entry_source} (${entrySources[0].count} scans)`
                  : "No data yet"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
