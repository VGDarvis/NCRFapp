import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GuestSessionStats {
  total_sessions: number;
  active_sessions: number;
  avg_session_duration: number;
  total_page_views: number;
  unique_visitors: number;
}

interface PageViewStats {
  page: string;
  views: number;
}

interface EntrySourceStats {
  entry_source: string;
  count: number;
}

export function useEventAnalytics(eventId: string | null) {
  // Fetch guest session statistics
  const { data: sessionStats, isLoading: statsLoading } = useQuery({
    queryKey: ["event-analytics", "sessions", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      // Get total sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from("guest_sessions")
        .select("*")
        .eq("event_id", eventId);

      if (sessionsError) throw sessionsError;

      // Get active sessions (last activity within 5 minutes)
      const activeSessions = sessions?.filter(
        (s) => new Date(s.last_active_at) > fiveMinutesAgo && !s.ended_at
      ).length || 0;

      // Calculate average session duration for completed sessions
      const completedSessions = sessions?.filter((s) => s.ended_at) || [];
      const avgDuration = completedSessions.length > 0
        ? completedSessions.reduce((acc, s) => {
            const start = new Date(s.started_at);
            const end = new Date(s.ended_at!);
            return acc + (end.getTime() - start.getTime()) / 1000;
          }, 0) / completedSessions.length
        : 0;

      // Count total page views
      const totalPageViews = sessions?.reduce((acc, s) => {
        const pageViews = Array.isArray(s.page_views) ? s.page_views : [];
        return acc + pageViews.length;
      }, 0) || 0;

      return {
        total_sessions: sessions?.length || 0,
        active_sessions: activeSessions,
        avg_session_duration: Math.round(avgDuration),
        total_page_views: totalPageViews,
        unique_visitors: sessions?.length || 0,
      } as GuestSessionStats;
    },
    enabled: !!eventId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch page view statistics
  const { data: pageViews, isLoading: pageViewsLoading } = useQuery({
    queryKey: ["event-analytics", "page-views", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data: sessions, error } = await supabase
        .from("guest_sessions")
        .select("page_views")
        .eq("event_id", eventId);

      if (error) throw error;

      // Aggregate page views
      const pageViewCounts: Record<string, number> = {};
      sessions?.forEach((session) => {
        const pageViews = Array.isArray(session.page_views) ? session.page_views : [];
        pageViews.forEach((pv: any) => {
          const page = pv.page || "unknown";
          pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
        });
      });

      return Object.entries(pageViewCounts)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views);
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Fetch entry source statistics
  const { data: entrySources, isLoading: entrySourcesLoading } = useQuery({
    queryKey: ["event-analytics", "entry-sources", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data: sessions, error } = await supabase
        .from("guest_sessions")
        .select("entry_source")
        .eq("event_id", eventId);

      if (error) throw error;

      // Count entry sources
      const sourceCounts: Record<string, number> = {};
      sessions?.forEach((session) => {
        const source = session.entry_source || "direct";
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      });

      return Object.entries(sourceCounts)
        .map(([entry_source, count]) => ({ entry_source, count }))
        .sort((a, b) => b.count - a.count);
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Fetch device type distribution
  const { data: deviceTypes, isLoading: deviceTypesLoading } = useQuery({
    queryKey: ["event-analytics", "device-types", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data: sessions, error } = await supabase
        .from("guest_sessions")
        .select("device_type")
        .eq("event_id", eventId);

      if (error) throw error;

      const deviceCounts: Record<string, number> = {};
      sessions?.forEach((session) => {
        const device = session.device_type || "unknown";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      return Object.entries(deviceCounts).map(([device, count]) => ({
        device,
        count,
      }));
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  return {
    sessionStats,
    pageViews: pageViews as PageViewStats[] | undefined,
    entrySources: entrySources as EntrySourceStats[] | undefined,
    deviceTypes,
    isLoading: statsLoading || pageViewsLoading || entrySourcesLoading || deviceTypesLoading,
  };
}
