import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ExpoStats {
  qrScansToday: number;
  totalAppUsers: number;
  activeNow: number;
  betaSignUps: number;
  avgSessionDuration: number;
  popularBoothsCount: number;
}

export function useExpoStats(eventId: string | null) {
  return useQuery({
    queryKey: ["expo-stats", eventId],
    queryFn: async (): Promise<ExpoStats> => {
      if (!eventId) {
        return {
          qrScansToday: 0,
          totalAppUsers: 0,
          activeNow: 0,
          betaSignUps: 0,
          avgSessionDuration: 0,
          popularBoothsCount: 0,
        };
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // QR Scans Today
      const qrScansResult: any = await supabase
        .from("guest_sessions")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId)
        .gte("created_at", todayStart.toISOString());
      const qrScansToday = qrScansResult?.count || 0;

      // Total App Users (all time for this event)
      const totalUsersResult: any = await supabase
        .from("guest_sessions")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);
      const totalAppUsers = totalUsersResult?.count || 0;

      // Active Now (sessions updated in last 5 minutes)
      const activeResult: any = await supabase
        .from("guest_sessions")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("is_active", true)
        .gte("last_active_at", fiveMinutesAgo.toISOString());
      const activeNow = activeResult?.count || 0;

      // Beta Sign-Ups
      const betaResult: any = await supabase
        .from("beta_interest")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId);
      const betaSignUps = betaResult?.count || 0;

      // Average Session Duration (calculate from created_at to last_active_at)
      const { data: sessionData } = await supabase
        .from("guest_sessions")
        .select("created_at, last_active_at")
        .eq("event_id", eventId)
        .not("last_active_at", "is", null);

      let avgSessionDuration = 0;
      if (sessionData && sessionData.length > 0) {
        const durations = sessionData.map(s => {
          const start = new Date(s.created_at).getTime();
          const end = new Date(s.last_active_at!).getTime();
          return (end - start) / 1000; // Convert to seconds
        });
        avgSessionDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      }

      // Popular Booths (count of check-ins per booth)
      const { data: checkInsData } = await supabase
        .from("booth_check_ins")
        .select("booth_id")
        .eq("event_id", eventId);

      const popularBoothsCount = checkInsData ? new Set(checkInsData.map(c => c.booth_id)).size : 0;

      return {
        qrScansToday,
        totalAppUsers,
        activeNow,
        betaSignUps,
        avgSessionDuration: Math.round(avgSessionDuration),
        popularBoothsCount,
      };
    },
    enabled: !!eventId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
