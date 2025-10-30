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
        .or('activity_category.eq.booth,action.ilike.%booth%,action.ilike.%floor plan%')
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

  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('added') || actionLower.includes('created')) return "🟢";
    if (actionLower.includes('updated') || actionLower.includes('moved') || actionLower.includes('edited') || actionLower.includes('uploaded')) return "🔵";
    if (actionLower.includes('deleted') || actionLower.includes('removed')) return "🔴";
    return "🟣";
  };

  const getActivityColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('added') || actionLower.includes('created')) return "text-green-500";
    if (actionLower.includes('updated') || actionLower.includes('moved') || actionLower.includes('edited') || actionLower.includes('uploaded')) return "text-blue-500";
    if (actionLower.includes('deleted') || actionLower.includes('removed')) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <Card className="glass-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Booth Activity Feed
        </CardTitle>
        <CardDescription>Recent booth and floor plan changes</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading activities...</div>
          ) : activities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No booth activity yet"
              description="Booth changes will appear here"
            />
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-3 rounded-lg glass-medium border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <div className="text-xl">{getActivityIcon(activity.action)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className={`text-xs font-medium ${getActivityColor(activity.action)}`}>
                      Booth Management
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
