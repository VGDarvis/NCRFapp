import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  amenities: any;
  floor_plans: any;
  parking_info: string | null;
  accessibility_info: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

export function useVenues() {
  return useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as any as Venue[];
    },
  });
}

export function useVenue(id: string | null) {
  return useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as any as Venue;
    },
    enabled: !!id,
  });
}
