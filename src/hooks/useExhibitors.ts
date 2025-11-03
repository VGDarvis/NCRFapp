import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Exhibitor {
  id: string;
  org_name: string;
  org_type: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  campus_address: string | null;
  campus_city: string | null;
  campus_state: string | null;
  campus_zip: string | null;
  latitude: number | null;
  longitude: number | null;
  offers_on_spot_admission: boolean;
  waives_application_fee: boolean;
  scholarship_info: string | null;
  is_verified: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface ExhibitorFilters {
  search?: string;
  orgType?: string;
  hasOnSpotAdmission?: boolean;
  hasFeeWaiver?: boolean;
  hasScholarships?: boolean;
  isVerified?: boolean;
}

export function useExhibitors(filters?: ExhibitorFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["exhibitors", filters],
    queryFn: async () => {
      let query = supabase
        .from("exhibitors")
        .select("*");

      // Apply filters
      if (filters?.search) {
        query = query.ilike("org_name", `%${filters.search}%`);
      }

      if (filters?.orgType) {
        query = query.eq("org_type", filters.orgType);
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

      if (filters?.isVerified !== undefined) {
        query = query.eq("is_verified", filters.isVerified);
      }

      const { data, error } = await query.order("org_name");

      if (error) throw error;
      return (data || []) as Exhibitor[];
    },
  });

  const createExhibitor = useMutation({
    mutationFn: async (exhibitor: Partial<Exhibitor>) => {
      const { data, error } = await supabase
        .from("exhibitors")
        .insert([exhibitor as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exhibitors"] });
      toast.success("Exhibitor created successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to create exhibitor", {
        description: error.message,
      });
    },
  });

  const updateExhibitor = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Exhibitor> }) => {
      const { error } = await supabase
        .from("exhibitors")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exhibitors"] });
      toast.success("Exhibitor updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update exhibitor", {
        description: error.message,
      });
    },
  });

  const deleteExhibitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exhibitors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exhibitors"] });
      toast.success("Exhibitor deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete exhibitor", {
        description: error.message,
      });
    },
  });

  return {
    exhibitors: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createExhibitor: createExhibitor.mutate,
    updateExhibitor: updateExhibitor.mutate,
    deleteExhibitor: deleteExhibitor.mutate,
    isCreating: createExhibitor.isPending,
    isUpdating: updateExhibitor.isPending,
    isDeleting: deleteExhibitor.isPending,
  };
}
