import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Zone {
  id: string;
  name: string;
  startRow: number;
  startCol: number;
  rows: number;
  cols: number;
  color: string;
}

export function useZones(floorPlanId: string | null) {
  const queryClient = useQueryClient();

  const { data: zones = [], isLoading } = useQuery({
    queryKey: ["zones", floorPlanId],
    queryFn: async () => {
      if (!floorPlanId) return [];

      const { data, error } = await supabase
        .from("floor_plans")
        .select("zones")
        .eq("id", floorPlanId)
        .single();

      if (error) throw error;
      return (data?.zones as any as Zone[]) || [];
    },
    enabled: !!floorPlanId,
  });

  const saveZones = useMutation({
    mutationFn: async ({ floorPlanId, zones }: { floorPlanId: string; zones: Zone[] }) => {
      const { error } = await supabase
        .from("floor_plans")
        .update({ zones: zones as any })
        .eq("id", floorPlanId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones", floorPlanId] });
      toast.success("Zones updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update zones", {
        description: error.message,
      });
    },
  });

  return {
    zones,
    isLoading,
    saveZones: saveZones.mutate,
    isSaving: saveZones.isPending,
  };
}
