import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
  activity_category: string | null;
}

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('activity_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, 
        (payload) => {
          setActivities((prev) => [payload.new as ActivityLog, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (category: string | null) => {
    return "🔔";
  };

  const getActivityColor = (category: string | null) => {
    const colors: Record<string, string> = {
      hr: "text-blue-500",
      crm: "text-green-500",
      system: "text-purple-500",
      user: "text-amber-500",
    };
    return colors[category || "system"] || "text-muted-foreground";
  };

  return (
    <Card className="glass-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest system events and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading activities...</div>
          ) : activities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="System activity will appear here"
            />
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg glass-medium border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <div className="text-xl">{getActivityIcon(activity.activity_category)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className={`text-xs ${getActivityColor(activity.activity_category)}`}>
                      {activity.activity_category || 'System'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
