import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ActiveEventStats {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  status: string;
  venue_id: string | null;
  flyer_url: string | null;
  venue?: {
    name: string;
    city: string;
    state: string;
  } | null;
  booth_count: number;
  seminar_count: number;
}

export function useActiveEvent() {
  const queryClient = useQueryClient();

  const { data: activeEvent, isLoading } = useQuery({
    queryKey: ["active-event"],
    queryFn: async () => {
      // Fallback chain: in_progress → upcoming → most recent completed
      const tryFetch = async (status: string, ascending: boolean, timeFilter?: { col: string; op: 'gte' | 'lte'; val: string }) => {
        let q = supabase
          .from("events")
          .select(`*, venue:venues(name, city, state)`)
          .eq("status", status)
          .order("start_at", { ascending })
          .limit(1);
        if (timeFilter) {
          q = q[timeFilter.op](timeFilter.col, timeFilter.val);
        }
        const { data, error } = await q.maybeSingle();
        if (error) throw error;
        return data;
      };

      const now = new Date().toISOString();
      const event =
        (await tryFetch("in_progress", true)) ||
        (await tryFetch("upcoming", true, { col: "start_at", op: "gte", val: now })) ||
        (await tryFetch("completed", false));

      if (!event) return null;

      // Get booth count
      const { count: boothCount } = await supabase
        .from("booths")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);

      // Get seminar count
      const { count: seminarCount } = await supabase
        .from("seminar_sessions")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);

      return {
        id: event.id,
        name: event.title,
        start_at: event.start_at,
        end_at: event.end_at,
        status: event.status || "upcoming",
        venue_id: event.venue_id,
        flyer_url: event.event_flyer_url || event.image_url || null,
        venue: event.venue,
        booth_count: boothCount || 0,
        seminar_count: seminarCount || 0,
      } as ActiveEventStats;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const updateEventStatus = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      const { error } = await supabase
        .from("events")
        .update({ status })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-event"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events-upcoming"] });
      toast.success("Event status updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update event status: ${error.message}`);
    },
  });

  return {
    activeEvent,
    isLoading,
    updateEventStatus,
  };
}
