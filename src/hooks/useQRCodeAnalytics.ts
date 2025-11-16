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
        };
      }

      const startDate = startOfDay(dateRange.from);
      const endDate = endOfDay(dateRange.to);

      // Fetch all check-ins within date range
      const { data: checkIns, error } = await supabase
        .from("registrations")
        .select("checked_in_at, event_id, user_id, events(title)")
        .in("event_id", eventIds)
        .not("checked_in_at", "is", null)
        .gte("checked_in_at", startDate.toISOString())
        .lte("checked_in_at", endDate.toISOString());

      if (error) throw error;

      const scans = checkIns || [];
      const totalScans = scans.length;
      const uniqueAttendees = new Set(scans.map((s) => s.user_id)).size;

      // Calculate days in range
      const daysInRange = differenceInDays(endDate, startDate) + 1;
      const averagePerDay = daysInRange > 0 ? totalScans / daysInRange : 0;

      // Group by day
      const scansByDay = new Map<string, { scans: number; uniqueAttendees: Set<string> }>();
      
      scans.forEach((scan) => {
        const day = format(new Date(scan.checked_in_at!), "yyyy-MM-dd");
        if (!scansByDay.has(day)) {
          scansByDay.set(day, { scans: 0, uniqueAttendees: new Set() });
        }
        const dayData = scansByDay.get(day)!;
        dayData.scans++;
        if (scan.user_id) {
          dayData.uniqueAttendees.add(scan.user_id);
        }
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
      scans.forEach((scan) => {
        const eventId = scan.event_id;
        const eventName = (scan.events as any)?.title || "Unknown Event";
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
      };
    },
    enabled: !!eventIds && eventIds.length > 0 && !!dateRange,
    refetchInterval: 30000,
  });
}
