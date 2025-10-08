import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MessageStats {
  totalSentToday: number;
  totalSentWeek: number;
  activeCampaigns: number;
  averageOpenRate: number;
  averageClickRate: number;
  failedMessages: number;
}

export function useMessageStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["message_stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      const weekAgoStr = weekAgo.toISOString();

      // Get messages sent today
      const { count: sentToday } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", todayStr);

      // Get messages sent this week
      const { count: sentWeek } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("sent_at", weekAgoStr);

      // Get active campaigns
      const { count: activeCampaigns } = await supabase
        .from("bulk_campaigns")
        .select("*", { count: "exact", head: true })
        .in("status", ["scheduled", "in-progress"]);

      // Get open and click rates
      const { data: sentMessages } = await supabase
        .from("messages")
        .select("opened_at, clicked_at")
        .eq("status", "delivered");

      const totalSent = sentMessages?.length || 0;
      const totalOpened = sentMessages?.filter(m => m.opened_at).length || 0;
      const totalClicked = sentMessages?.filter(m => m.clicked_at).length || 0;

      const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const averageClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

      // Get failed messages
      const { count: failedMessages } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "failed");

      const stats: MessageStats = {
        totalSentToday: sentToday || 0,
        totalSentWeek: sentWeek || 0,
        activeCampaigns: activeCampaigns || 0,
        averageOpenRate: Math.round(averageOpenRate * 10) / 10,
        averageClickRate: Math.round(averageClickRate * 10) / 10,
        failedMessages: failedMessages || 0,
      };

      return stats;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    stats: stats || {
      totalSentToday: 0,
      totalSentWeek: 0,
      activeCampaigns: 0,
      averageOpenRate: 0,
      averageClickRate: 0,
      failedMessages: 0,
    },
    isLoading,
    error,
  };
}
