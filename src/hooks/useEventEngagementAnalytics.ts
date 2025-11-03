import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface QRCodeMetrics {
  total_qr_scans: number;
  qr_registrations: number;
  conversion_rate: number;
}

export interface AppUsageMetrics {
  total_sessions: number;
  active_now: number;
  avg_duration_seconds: number;
  total_page_views: number;
  unique_visitors: number;
}

export interface RegistrationMetrics {
  total_registrations: number;
  checked_in: number;
  check_in_rate: number;
  profile_signups: number;
}

export interface EntrySourceData {
  source: string;
  count: number;
}

export interface DeviceData {
  device: string;
  count: number;
}

export interface BoothEngagementData {
  booth_number: string;
  organization: string;
  visits: number;
}

export interface HourlyActivity {
  hour: string;
  sessions: number;
  scans: number;
}

export function useEventEngagementAnalytics(eventId: string | null) {
  // QR Code Metrics
  const { data: qrMetrics, isLoading: qrLoading } = useQuery({
    queryKey: ["qr-metrics", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      // Total QR scans from guest sessions
      const { count: qrScans } = await supabase
        .from("guest_sessions")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("entry_source", "qr_code");

      // Registrations after QR scan
      const { count: qrRegistrations } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .not("qr_code", "is", null);

      return {
        total_qr_scans: qrScans || 0,
        qr_registrations: qrRegistrations || 0,
        conversion_rate: qrScans ? ((qrRegistrations || 0) / qrScans) * 100 : 0,
      } as QRCodeMetrics;
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // App Usage Metrics
  const { data: appUsage, isLoading: appLoading } = useQuery({
    queryKey: ["app-usage", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data: sessions, error } = await supabase
        .from("guest_sessions")
        .select("started_at, ended_at, last_active_at, session_id")
        .eq("event_id", eventId);

      if (error) throw error;

      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const activeSessions = sessions?.filter(
        (s) => new Date(s.last_active_at || s.started_at) > fiveMinutesAgo
      ).length || 0;

      // Calculate average session duration from started_at and ended_at
      const sessionsWithDuration = sessions?.filter(s => s.ended_at) || [];
      const avgDuration = sessionsWithDuration.length
        ? sessionsWithDuration.reduce((sum, s) => {
            const duration = (new Date(s.ended_at!).getTime() - new Date(s.started_at).getTime()) / 1000;
            return sum + duration;
          }, 0) / sessionsWithDuration.length
        : 0;

      const { count: pageViews } = await supabase
        .from("guest_analytics")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);

      const uniqueVisitors = new Set(sessions?.map(s => s.session_id)).size;

      return {
        total_sessions: sessions?.length || 0,
        active_now: activeSessions,
        avg_duration_seconds: Math.round(avgDuration),
        total_page_views: pageViews || 0,
        unique_visitors: uniqueVisitors,
      } as AppUsageMetrics;
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Registration Metrics
  const { data: registrationMetrics, isLoading: regLoading } = useQuery({
    queryKey: ["registration-metrics", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data: registrations } = await supabase
        .from("registrations")
        .select("checked_in_at, user_id")
        .eq("event_id", eventId);

      const total = registrations?.length || 0;
      const checkedIn = registrations?.filter((r) => r.checked_in_at).length || 0;

      // Profile signups (users with profiles)
      const userIds = registrations?.map(r => r.user_id).filter(Boolean) || [];
      const { count: profileCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .in("id", userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

      return {
        total_registrations: total,
        checked_in: checkedIn,
        check_in_rate: total ? (checkedIn / total) * 100 : 0,
        profile_signups: profileCount || 0,
      } as RegistrationMetrics;
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Entry Sources
  const { data: entrySources, isLoading: entryLoading } = useQuery({
    queryKey: ["entry-sources", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data } = await supabase
        .from("guest_sessions")
        .select("entry_source")
        .eq("event_id", eventId);

      const sources = data?.reduce((acc, session) => {
        const source = session.entry_source || "direct";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(sources || {})
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Device Types
  const { data: deviceTypes, isLoading: deviceLoading } = useQuery({
    queryKey: ["device-types", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data } = await supabase
        .from("guest_sessions")
        .select("device_type")
        .eq("event_id", eventId);

      const devices = data?.reduce((acc, session) => {
        const device = session.device_type || "unknown";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(devices || {})
        .map(([device, count]) => ({ device, count }))
        .sort((a, b) => b.count - a.count);
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Booth Engagement
  const { data: boothEngagement, isLoading: boothLoading } = useQuery({
    queryKey: ["booth-engagement", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data } = await supabase
        .from("booth_check_ins")
        .select(`
          booth_id,
          booths!inner(table_no, organization)
        `)
        .eq("booths.event_id", eventId);

      const boothCounts = data?.reduce((acc, checkIn: any) => {
        const boothNumber = checkIn.booths?.table_no || "Unknown";
        const org = checkIn.booths?.organization || "Unknown";
        const key = `${boothNumber}-${org}`;
        
        if (!acc[key]) {
          acc[key] = { booth_number: boothNumber, organization: org, visits: 0 };
        }
        acc[key].visits++;
        return acc;
      }, {} as Record<string, BoothEngagementData>);

      return Object.values(boothCounts || {})
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  // Hourly Activity
  const { data: hourlyActivity, isLoading: hourlyLoading } = useQuery({
    queryKey: ["hourly-activity", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data: sessions } = await supabase
        .from("guest_sessions")
        .select("started_at, entry_source")
        .eq("event_id", eventId);

      const hourlyData = sessions?.reduce((acc, session) => {
        const hour = new Date(session.started_at).getHours();
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        
        if (!acc[hourKey]) {
          acc[hourKey] = { hour: hourKey, sessions: 0, scans: 0 };
        }
        
        acc[hourKey].sessions++;
        if (session.entry_source === 'qr_code') {
          acc[hourKey].scans++;
        }
        return acc;
      }, {} as Record<string, HourlyActivity>);

      return Object.values(hourlyData || {}).sort((a, b) => 
        a.hour.localeCompare(b.hour)
      );
    },
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  return {
    qrMetrics,
    appUsage,
    registrationMetrics,
    entrySources,
    deviceTypes,
    boothEngagement,
    hourlyActivity,
    isLoading: qrLoading || appLoading || regLoading || entryLoading || 
               deviceLoading || boothLoading || hourlyLoading,
  };
}
