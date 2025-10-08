import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessageStats } from "@/hooks/useMessageStats";
import { Mail, TrendingUp, Activity, AlertCircle, MousePointerClick, Send } from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingSpinner";

export function CampaignStatsWidget() {
  const { stats, isLoading } = useMessageStats();

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading stats..." />;
  }

  const statCards = [
    {
      title: "Sent Today",
      value: stats.totalSentToday,
      icon: Send,
      description: "Messages sent today",
    },
    {
      title: "Sent This Week",
      value: stats.totalSentWeek,
      icon: Mail,
      description: "Messages sent this week",
    },
    {
      title: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: Activity,
      description: "Campaigns in progress",
    },
    {
      title: "Avg Open Rate",
      value: `${stats.averageOpenRate}%`,
      icon: TrendingUp,
      description: "Email open rate",
    },
    {
      title: "Avg Click Rate",
      value: `${stats.averageClickRate}%`,
      icon: MousePointerClick,
      description: "Click-through rate",
    },
    {
      title: "Failed Messages",
      value: stats.failedMessages,
      icon: AlertCircle,
      description: "Need attention",
      alert: stats.failedMessages > 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={stat.alert ? "border-destructive" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.alert ? "text-destructive" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.alert ? "text-destructive" : ""}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
