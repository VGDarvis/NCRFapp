import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, format, eachDayOfInterval, differenceInDays } from "date-fns";

export interface DailyBreakdown {
  date: string;
  scans: number;
  uniqueAttendees: number;
}

export interface EventComparison {
  eventId: string;
  eventName: string;
  totalScans: number;
}

export interface EntrySourceBreakdown {
  source: string;
  count: number;
  percentage: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
  percentage: number;
}

export interface HourlyActivity {
  hour: number;
  scans: number;
}

export interface QRCodeAnalytics {
  totalScans: number;
  averagePerDay: number;
  uniqueAttendees: number;
  dailyBreakdown: DailyBreakdown[];
  peakDay: {
    date: string;
    scans: number;
  } | null;
  byEvent: EventComparison[];
  entrySourceBreakdown: EntrySourceBreakdown[];
  deviceBreakdown: DeviceBreakdown[];
  hourlyActivity: HourlyActivity[];
  activeNow: number;
  averageSessionDuration: number;
}

export function useQRCodeAnalytics(
  eventIds: string[] | null,
  dateRange: { from: Date; to: Date } | null
) {
  return useQuery({
    queryKey: ["qr-code-analytics", eventIds, dateRange],
    queryFn: async (): Promise<QRCodeAnalytics> => {
      if (!eventIds || eventIds.length === 0 || !dateRange) {
        return {
          totalScans: 0,
          averagePerDay: 0,
          uniqueAttendees: 0,
          dailyBreakdown: [],
          peakDay: null,
          byEvent: [],
          entrySourceBreakdown: [],
          deviceBreakdown: [],
          hourlyActivity: [],
          activeNow: 0,
          averageSessionDuration: 0,
        };
      }

      const startDate = startOfDay(dateRange.from);
      const endDate = endOfDay(dateRange.to);

      // Fetch all guest sessions within date range
      const { data: sessions, error } = await supabase
        .from("guest_sessions")
        .select("session_id, event_id, created_at, last_active_at, entry_source, device_type, events(title)")
        .in("event_id", eventIds)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      if (error) throw error;

      const allSessions = sessions || [];
      const totalScans = allSessions.length;
      const uniqueAttendees = new Set(allSessions.map((s) => s.session_id)).size;

      // Calculate active now (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activeNow = allSessions.filter(
        (s) => s.last_active_at && new Date(s.last_active_at) > fiveMinutesAgo
      ).length;

      // Calculate average session duration
      const sessionsWithDuration = allSessions.filter(
        (s) => s.last_active_at && s.created_at
      );
      const totalDuration = sessionsWithDuration.reduce((sum, s) => {
        const duration = new Date(s.last_active_at!).getTime() - new Date(s.created_at).getTime();
        return sum + duration;
      }, 0);
      const averageSessionDuration = sessionsWithDuration.length > 0
        ? Math.round(totalDuration / sessionsWithDuration.length / 1000) // Convert to seconds
        : 0;

      // Calculate days in range
      const daysInRange = differenceInDays(endDate, startDate) + 1;
      const averagePerDay = daysInRange > 0 ? totalScans / daysInRange : 0;

      // Group by day
      const scansByDay = new Map<string, { scans: number; uniqueAttendees: Set<string> }>();
      
      allSessions.forEach((session) => {
        const day = format(new Date(session.created_at), "yyyy-MM-dd");
        if (!scansByDay.has(day)) {
          scansByDay.set(day, { scans: 0, uniqueAttendees: new Set() });
        }
        const dayData = scansByDay.get(day)!;
        dayData.scans++;
        dayData.uniqueAttendees.add(session.session_id);
      });

      // Create daily breakdown for all days in range
      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      const dailyBreakdown: DailyBreakdown[] = allDays.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayData = scansByDay.get(dayStr);
        return {
          date: dayStr,
          scans: dayData?.scans || 0,
          uniqueAttendees: dayData?.uniqueAttendees.size || 0,
        };
      });

      // Find peak day
      const peakDay = dailyBreakdown.reduce(
        (max, day) => (day.scans > (max?.scans || 0) ? day : max),
        null as DailyBreakdown | null
      );

      // Group by event
      const scansByEvent = new Map<string, { eventName: string; scans: number }>();
      allSessions.forEach((session) => {
        const eventId = session.event_id;
        const eventName = (session.events as any)?.title || "Unknown Event";
        if (!scansByEvent.has(eventId)) {
          scansByEvent.set(eventId, { eventName, scans: 0 });
        }
        scansByEvent.get(eventId)!.scans++;
      });

      const byEvent: EventComparison[] = Array.from(scansByEvent.entries()).map(
        ([eventId, data]) => ({
          eventId,
          eventName: data.eventName,
          totalScans: data.scans,
        })
      );

      // Entry source breakdown
      const sourceCount = new Map<string, number>();
      allSessions.forEach((session) => {
        const source = session.entry_source || "direct";
        sourceCount.set(source, (sourceCount.get(source) || 0) + 1);
      });

      const entrySourceBreakdown: EntrySourceBreakdown[] = Array.from(sourceCount.entries())
        .map(([source, count]) => ({
          source: source.replace("qr_", "").replace("_", " ").toUpperCase(),
          count,
          percentage: Math.round((count / totalScans) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      // Device breakdown
      const deviceCount = new Map<string, number>();
      allSessions.forEach((session) => {
        const device = session.device_type || "unknown";
        deviceCount.set(device, (deviceCount.get(device) || 0) + 1);
      });

      const deviceBreakdown: DeviceBreakdown[] = Array.from(deviceCount.entries())
        .map(([device, count]) => ({
          device: device.charAt(0).toUpperCase() + device.slice(1),
          count,
          percentage: Math.round((count / totalScans) * 100),
        }))
        .sort((a, b) => b.count - a.count);

      // Hourly activity
      const hourCount = new Map<number, number>();
      allSessions.forEach((session) => {
        const hour = new Date(session.created_at).getHours();
        hourCount.set(hour, (hourCount.get(hour) || 0) + 1);
      });

      const hourlyActivity: HourlyActivity[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        scans: hourCount.get(hour) || 0,
      }));

      return {
        totalScans,
        averagePerDay: Math.round(averagePerDay * 10) / 10,
        uniqueAttendees,
        dailyBreakdown,
        peakDay: peakDay
          ? {
              date: peakDay.date,
              scans: peakDay.scans,
            }
          : null,
        byEvent,
        entrySourceBreakdown,
        deviceBreakdown,
        hourlyActivity,
        activeNow,
        averageSessionDuration,
      };
    },
    enabled: !!eventIds && eventIds.length > 0 && !!dateRange,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
