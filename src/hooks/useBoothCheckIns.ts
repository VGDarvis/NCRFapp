import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BoothCheckIn {
  id: string;
  user_id: string | null;
  booth_id: string;
  event_id: string;
  check_in_time: string;
  check_in_method: string;
  session_id: string | null;
  metadata: any;
}

export function useBoothCheckIns(eventId: string | null) {
  const queryClient = useQueryClient();

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["booth-check-ins", eventId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!eventId) return [];

      let query = supabase
        .from("booth_check_ins")
        .select("*")
        .eq("event_id", eventId)
        .order("check_in_time", { ascending: false });

      if (user) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BoothCheckIn[];
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000,
  });

  const createCheckIn = useMutation({
    mutationFn: async ({ 
      boothId, 
      eventId, 
      method = "qr_scan",
      metadata = {}
    }: { 
      boothId: string; 
      eventId: string; 
      method?: string;
      metadata?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("booth_check_ins")
        .insert({
          user_id: user?.id || null,
          booth_id: boothId,
          event_id: eventId,
          check_in_method: method,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booth-check-ins"] });
      toast.success("Checked in successfully!");
    },
    onError: () => {
      toast.error("Failed to check in");
    },
  });

  const hasVisitedBooth = (boothId: string) => {
    return checkIns?.some(checkIn => checkIn.booth_id === boothId) ?? false;
  };

  return {
    checkIns,
    isLoading,
    createCheckIn,
    hasVisitedBooth,
  };
}
