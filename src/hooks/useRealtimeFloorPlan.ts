import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRealtimeFloorPlan = (eventId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel("floor-plan-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booths",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log("Booth change detected:", payload);
          
          // Invalidate booths query to refetch
          queryClient.invalidateQueries({ queryKey: ["booths", eventId] });
          
          if (payload.eventType === "UPDATE") {
            toast.info("Floor plan updated", {
              description: "The floor plan has been updated by an admin",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "floor_plans",
        },
        (payload) => {
          console.log("Floor plan change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["floor-plans"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient]);
};
