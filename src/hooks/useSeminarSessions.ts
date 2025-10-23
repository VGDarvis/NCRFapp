import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeminarRoom {
  id: string;
  venue_id: string;
  floor_plan_id: string | null;
  room_name: string;
  room_number: string | null;
  capacity: number | null;
  x_position: number | null;
  y_position: number | null;
  amenities: string[];
  created_at: string;
}

export interface SeminarSession {
  id: string;
  event_id: string;
  room_id: string;
  title: string;
  description: string | null;
  presenter_name: string | null;
  presenter_title: string | null;
  presenter_organization: string | null;
  start_time: string;
  end_time: string;
  category: string | null;
  target_audience: string[] | null;
  max_capacity: number | null;
  registration_required: boolean;
  created_at: string;
  updated_at: string;
  room?: SeminarRoom;
}

export function useSeminarSessions(eventId: string | null) {
  return useQuery({
    queryKey: ["seminar-sessions", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from("seminar_sessions")
        .select(`
          *,
          room:seminar_rooms(*)
        `)
        .eq("event_id", eventId)
        .order("start_time");

      if (error) throw error;
      return data as any as SeminarSession[];
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSeminarRooms(venueId: string | null) {
  return useQuery({
    queryKey: ["seminar-rooms", venueId],
    queryFn: async () => {
      if (!venueId) return [];

      const { data, error } = await supabase
        .from("seminar_rooms")
        .select("*")
        .eq("venue_id", venueId)
        .order("room_name");

      if (error) throw error;
      return data as SeminarRoom[];
    },
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  });
}
