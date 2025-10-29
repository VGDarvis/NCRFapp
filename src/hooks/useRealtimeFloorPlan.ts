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
            const gridRow = updatedBooth?.grid_row;
            const gridCol = updatedBooth?.grid_col;
            
            if (gridRow !== null && gridCol !== null) {
              const rowLabel = String.fromCharCode(65 + gridRow); // A-H
              const colLabel = (gridCol + 1).toString(); // 1-12
              
              toast.success(`📍 Booth ${tableNo} moved`, {
                description: `New position: Row ${rowLabel}, Column ${colLabel}`,
                duration: 3000,
              });
            } else {
              toast.info(`📍 Booth ${tableNo} updated`, {
                description: "Floor plan updated by admin",
                duration: 2000,
              });
            }
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
