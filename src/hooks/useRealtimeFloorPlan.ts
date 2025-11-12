import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRealtimeFloorPlan = (eventId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!eventId) return;

    console.log("🔄 Starting real-time subscription for event:", eventId);

    const channel = supabase
      .channel(`floor-plan-changes-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booths",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log("🔔 Booth change detected:", payload.eventType, payload);
          
          // Invalidate both generic and event-specific booth queries
          queryClient.invalidateQueries({ queryKey: ["booths"] });
          queryClient.invalidateQueries({ queryKey: ["booths", eventId] });
          
          if (payload.eventType === "UPDATE") {
            const updatedBooth = payload.new as any;
            const tableNo = updatedBooth?.table_no || "Unknown";
            const gridRow = updatedBooth?.grid_row;
            const gridCol = updatedBooth?.grid_col;
            
            if (gridRow !== null && gridCol !== null) {
              const rowLabel = String.fromCharCode(65 + gridRow);
              const colLabel = (gridCol + 1).toString();
              
              toast.success(`📍 Booth ${tableNo} moved`, {
                description: `New position: Row ${rowLabel}, Column ${colLabel}`,
                duration: 3000,
              });
            } else {
              toast.info(`📍 Booth ${tableNo} updated`, {
                description: "Floor plan updated",
                duration: 2000,
              });
            }
          } else if (payload.eventType === "INSERT") {
            toast.info("🆕 New booth added to floor plan", {
              duration: 2000,
            });
          } else if (payload.eventType === "DELETE") {
            const deletedBooth = payload.old as any;
            toast.info(`🗑️ Booth ${deletedBooth?.table_no || 'Unknown'} removed`, {
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
          console.log("🔔 Floor plan change detected:", payload.eventType);
          queryClient.invalidateQueries({ queryKey: ["floor-plans"] });
          queryClient.invalidateQueries({ queryKey: ["floor-plan"] });
        }
      )
      .subscribe((status) => {
        console.log("📡 Real-time subscription status:", status);
      });

    return () => {
      console.log("🔌 Unsubscribing from real-time updates");
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient]);
};
