import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, eachDayOfInterval, startOfDay } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export function useTrendData(metric: string, dateRange: DateRange) {
  return useQuery({
    queryKey: ["trend", metric, dateRange],
    queryFn: async () => {
      const { from, to } = dateRange;
      const days = eachDayOfInterval({ start: from, end: to });

      switch (metric) {
        case "messages_sent":
          return fetchMessagesTrend(days);
        case "crm_interactions":
          return fetchInteractionsTrend(days);
        case "event_registrations":
          return fetchRegistrationsTrend(days);
        case "employee_headcount":
          return fetchHeadcountTrend(days);
        default:
          return [];
      }
    },
  });
}

async function fetchMessagesTrend(days: Date[]) {
  const { data } = await supabase
    .from("messages")
    .select("sent_at")
    .gte("sent_at", days[0].toISOString())
    .lte("sent_at", days[days.length - 1].toISOString());

  return days.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = data?.filter((m) => {
      const sentAt = new Date(m.sent_at);
      return sentAt >= dayStart && sentAt <= dayEnd;
    }).length || 0;

    return {
      date: format(day, "MMM dd"),
      value: count,
    };
  });
}

async function fetchInteractionsTrend(days: Date[]) {
  const { data } = await supabase
    .from("crm_interactions")
    .select("interaction_date")
    .gte("interaction_date", days[0].toISOString())
    .lte("interaction_date", days[days.length - 1].toISOString());

  return days.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = data?.filter((i) => {
      const interactionDate = new Date(i.interaction_date);
      return interactionDate >= dayStart && interactionDate <= dayEnd;
    }).length || 0;

    return {
      date: format(day, "MMM dd"),
      value: count,
    };
  });
}

async function fetchRegistrationsTrend(days: Date[]) {
  const { data } = await supabase
    .from("event_attendance")
    .select("registration_date")
    .gte("registration_date", days[0].toISOString())
    .lte("registration_date", days[days.length - 1].toISOString());

  return days.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = data?.filter((a) => {
      const regDate = new Date(a.registration_date);
      return regDate >= dayStart && regDate <= dayEnd;
    }).length || 0;

    return {
      date: format(day, "MMM dd"),
      value: count,
    };
  });
}

async function fetchHeadcountTrend(days: Date[]) {
  const { data } = await supabase
    .from("employees")
    .select("start_date, end_date, status");

  return days.map((day) => {
    const count = data?.filter((e) => {
      const startDate = new Date(e.start_date);
      const endDate = e.end_date ? new Date(e.end_date) : null;
      return startDate <= day && (!endDate || endDate >= day);
    }).length || 0;

    return {
      date: format(day, "MMM dd"),
      value: count,
    };
  });
}
