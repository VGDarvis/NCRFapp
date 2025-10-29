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
            const updatedBooth = payload.new as any;
            const tableNo = updatedBooth?.table_no || "Unknown";
            
            toast.info(`📍 Booth ${tableNo} repositioned`, {
              description: "Floor plan updated by admin",
              duration: 2500,
            });
          } else if (payload.eventType === "INSERT") {
            toast.info("🆕 New booth added to floor plan", {
              duration: 2000,
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
