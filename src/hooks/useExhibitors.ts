import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Booth } from "./useBooths";

export interface ExhibitorFilters {
  search?: string;
  orgType?: string;
  sponsorTier?: string;
  hasOnSpotAdmission?: boolean;
  hasFeeWaiver?: boolean;
  hasScholarships?: boolean;
  assignedOnly?: boolean;
  unassignedOnly?: boolean;
}

export function useExhibitors(eventId: string | null, filters?: ExhibitorFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["exhibitors", eventId, filters],
    queryFn: async () => {
      if (!eventId) return [];

      // Check if user is authenticated (admins need full access to contact info)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Authenticated admins get full booth data including contact info
        let query = supabase
          .from("booths")
          .select("*")
          .eq("event_id", eventId);

        // Apply filters
        if (filters?.search) {
          query = query.ilike("org_name", `%${filters.search}%`);
        }

        if (filters?.orgType) {
          query = query.eq("org_type", filters.orgType);
        }

        if (filters?.sponsorTier) {
          query = query.eq("sponsor_tier", filters.sponsorTier);
        }

        if (filters?.hasOnSpotAdmission) {
          query = query.eq("offers_on_spot_admission", true);
        }

        if (filters?.hasFeeWaiver) {
          query = query.eq("waives_application_fee", true);
        }

        if (filters?.hasScholarships) {
          query = query.not("scholarship_info", "is", null);
        }

        if (filters?.assignedOnly) {
          query = query.not("x_position", "is", null);
        }

        if (filters?.unassignedOnly) {
          query = query.is("x_position", null);
        }

        const { data, error } = await query.order("org_name");

        if (error) throw error;
        
        // Map data to match Booth interface
        return (data || []).map(booth => ({
          ...booth,
          booth_number: booth.table_no,
          qr_code_url: null,
        }));
      } else {
        // This shouldn't happen for exhibitors module (admin only), but handle gracefully
        return [];
      }
    },
    enabled: !!eventId,
  });

  const updateExhibitor = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Booth> }) => {
      const { error } = await supabase
        .from("booths")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exhibitors", eventId] });
      queryClient.invalidateQueries({ queryKey: ["booths", eventId] });
      toast.success("Exhibitor updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update exhibitor", {
        description: error.message,
      });
    },
  });

  const deleteExhibitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("booths").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exhibitors", eventId] });
      queryClient.invalidateQueries({ queryKey: ["booths", eventId] });
      toast.success("Exhibitor deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete exhibitor", {
        description: error.message,
      });
    },
  });

  return {
    exhibitors: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    updateExhibitor: updateExhibitor.mutate,
    deleteExhibitor: deleteExhibitor.mutate,
    isUpdating: updateExhibitor.isPending,
    isDeleting: deleteExhibitor.isPending,
  };
}
