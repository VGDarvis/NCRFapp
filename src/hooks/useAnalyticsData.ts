import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";

export interface DateRange {
  from: Date;
  to: Date;
}

export function useAnalyticsData(module: string, dateRange: DateRange) {
  return useQuery({
    queryKey: ["analytics", module, dateRange],
    queryFn: async () => {
      const { from, to } = dateRange;

      switch (module) {
        case "messages":
          return fetchMessagesAnalytics(from, to);
        case "crm":
          return fetchCRMAnalytics(from, to);
        case "hr":
          return fetchHRAnalytics(from, to);
        case "programs":
          return fetchProgramAnalytics(from, to);
        default:
          return null;
      }
    },
  });
}

async function fetchMessagesAnalytics(from: Date, to: Date) {
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .gte("sent_at", from.toISOString())
    .lte("sent_at", to.toISOString());

  const { data: campaigns } = await supabase
    .from("bulk_campaigns")
    .select("*")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString());

  return {
    messages: messages || [],
    campaigns: campaigns || [],
    totalSent: messages?.length || 0,
    opened: messages?.filter((m) => m.opened_at).length || 0,
    clicked: messages?.filter((m) => m.clicked_at).length || 0,
    failed: messages?.filter((m) => m.status === "failed").length || 0,
  };
}

async function fetchCRMAnalytics(from: Date, to: Date) {
  const { data: organizations } = await supabase
    .from("crm_organizations")
    .select("*");

  const { data: contacts } = await supabase.from("crm_contacts").select("*");

  const { data: interactions } = await supabase
    .from("crm_interactions")
    .select("*")
    .gte("interaction_date", from.toISOString())
    .lte("interaction_date", to.toISOString());

  return {
    organizations: organizations || [],
    contacts: contacts || [],
    interactions: interactions || [],
    partnershipPipeline: {
      prospect: organizations?.filter((o) => o.partnership_status === "prospect").length || 0,
      engaged: organizations?.filter((o) => o.partnership_status === "engaged").length || 0,
      partner: organizations?.filter((o) => o.partnership_status === "partner").length || 0,
    },
  };
}

async function fetchHRAnalytics(from: Date, to: Date) {
  const { data: employees } = await supabase.from("employees").select("*, departments(name)");

  const { data: onboarding } = await supabase
    .from("hr_onboarding")
    .select("*")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString());

  const { data: documents } = await supabase
    .from("employee_documents")
    .select("*")
    .gte("created_at", from.toISOString())
    .lte("created_at", to.toISOString());

  return {
    employees: employees || [],
    onboarding: onboarding || [],
    documents: documents || [],
    headcount: {
      total: employees?.length || 0,
      active: employees?.filter((e) => e.status === "active").length || 0,
      onLeave: employees?.filter((e) => e.status === "on-leave").length || 0,
    },
  };
}

async function fetchProgramAnalytics(from: Date, to: Date) {
  const { data: events } = await supabase
    .from("expo_events")
    .select("*")
    .gte("event_date", from.toISOString())
    .lte("event_date", to.toISOString());

  const { data: attendance } = await supabase
    .from("event_attendance")
    .select("*, expo_events(title, city, state)")
    .gte("registration_date", from.toISOString())
    .lte("registration_date", to.toISOString());

  const { data: downloads } = await supabase
    .from("booklet_downloads")
    .select("*")
    .gte("downloaded_at", from.toISOString())
    .lte("downloaded_at", to.toISOString());

  return {
    events: events || [],
    attendance: attendance || [],
    downloads: downloads || [],
    totalEvents: events?.length || 0,
    totalAttendees: attendance?.length || 0,
    attendanceRate: attendance
      ? (attendance.filter((a) => a.attended).length / attendance.length) * 100
      : 0,
  };
}
