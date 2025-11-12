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

      try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        // QR Scans Today
        const { count: qrScansToday } = await supabase
          .from("guest_sessions")
          .select("*", { count: "exact", head: true })
          .eq("event_id", eventId)
          .gte("created_at", todayStart.toISOString());

        // Total App Users
        const { count: totalAppUsers } = await supabase
          .from("guest_sessions")
          .select("*", { count: "exact", head: true })
          .eq("event_id", eventId);

        // Active Now - sessions active within last 5 minutes
        const { data: allActiveSessions } = await supabase
          .from("guest_sessions")
          .select("id, last_active_at")
          .eq("event_id", eventId);
        
        const activeNow = allActiveSessions?.filter(
          s => s.last_active_at && new Date(s.last_active_at) >= fiveMinutesAgo
        ).length || 0;

        // Beta Sign-Ups
        const { count: betaSignUps } = await supabase
          .from("beta_interest")
          .select("*", { count: "exact", head: true })
          .eq("event_id", eventId);

        // Average Session Duration
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
            return (end - start) / 1000;
          });
          avgSessionDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        }

        // Popular Booths
        const { data: checkInsData } = await supabase
          .from("booth_check_ins")
          .select("booth_id")
          .eq("event_id", eventId);

        const popularBoothsCount = checkInsData ? new Set(checkInsData.map(c => c.booth_id)).size : 0;

        return {
          qrScansToday: qrScansToday || 0,
          totalAppUsers: totalAppUsers || 0,
          activeNow,
          betaSignUps: betaSignUps || 0,
          avgSessionDuration: Math.round(avgSessionDuration),
          popularBoothsCount,
        };
      } catch (error) {
        console.error("Error fetching expo stats:", error);
        return {
          qrScansToday: 0,
          totalAppUsers: 0,
          activeNow: 0,
          betaSignUps: 0,
          avgSessionDuration: 0,
          popularBoothsCount: 0,
        };
      }
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });
}
