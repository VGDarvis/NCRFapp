import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FloorPlan {
  id: string;
  venue_id: string;
  floor_number: number;
  floor_name: string | null;
  svg_data: string | null;
  image_url: string | null;
  width_meters: number | null;
  height_meters: number | null;
  scale_factor: number;
  created_at: string;
  updated_at: string;
}

export function useFloorPlans(venueId: string | null) {
  return useQuery({
    queryKey: ["floor-plans", venueId],
    queryFn: async () => {
      if (!venueId) return [];

      const { data, error } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("venue_id", venueId)
        .order("floor_number");

      if (error) throw error;
      return data as FloorPlan[];
    },
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFloorPlan(floorPlanId: string | null) {
  return useQuery({
    queryKey: ["floor-plan", floorPlanId],
    queryFn: async () => {
      if (!floorPlanId) return null;

      const { data, error } = await supabase
        .from("floor_plans")
        .select("*")
        .eq("id", floorPlanId)
        .single();

      if (error) throw error;
      return data as FloorPlan;
    },
    enabled: !!floorPlanId,
    staleTime: 5 * 60 * 1000,
  });
}
