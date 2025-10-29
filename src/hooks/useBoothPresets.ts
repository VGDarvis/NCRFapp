import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BoothPreset {
  id: string;
  preset_type: "booth_number" | "organization";
  preset_value: string;
  event_id: string;
  display_order: number;
  is_active: boolean;
}

export function useBoothPresets(eventId: string | null, presetType?: "booth_number" | "organization") {
  return useQuery({
    queryKey: ["booth-presets", eventId, presetType],
    queryFn: async () => {
      if (!eventId) return [];

      let query = supabase
        .from("booth_presets")
        .select("*")
        .eq("event_id", eventId)
        .eq("is_active", true)
        .order("display_order");

      if (presetType) {
        query = query.eq("preset_type", presetType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BoothPreset[];
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Helper function to get available booth numbers
export function useAvailableBoothNumbers(eventId: string | null) {
  const { data: presets, ...rest } = useBoothPresets(eventId, "booth_number");
  return {
    ...rest,
    boothNumbers: presets?.map(p => p.preset_value) || [],
  };
}

// Helper function to get organizations
export function useOrganizationOptions(eventId: string | null) {
  const { data: presets, ...rest } = useBoothPresets(eventId, "organization");
  return {
    ...rest,
    organizations: presets?.map(p => p.preset_value) || [],
  };
}
