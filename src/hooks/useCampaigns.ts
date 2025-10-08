import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Campaign {
  id: string;
  campaign_name: string;
  campaign_type: string;
  target_audience?: string;
  status: string;
  template_id?: string;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  template_name?: string;
  creator_name?: string;
}

interface CampaignFilters {
  status?: string;
  campaignType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export function useCampaigns(filters?: CampaignFilters) {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ["campaigns", filters],
    queryFn: async () => {
      let query = supabase
        .from("bulk_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }
      if (filters?.campaignType) {
        query = query.eq("campaign_type", filters.campaignType);
      }
      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }
      if (filters?.search) {
        query = query.or(
          `campaign_name.ilike.%${filters.search}%,target_audience.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch related data
      const templateIds = data.map(c => c.template_id).filter(Boolean);
      const creatorIds = data.map(c => c.created_by).filter(Boolean);

      const [templates, creators] = await Promise.all([
        templateIds.length > 0
          ? supabase.from("message_templates").select("id, template_name").in("id", templateIds)
          : { data: [] },
        creatorIds.length > 0
          ? supabase.from("profiles").select("user_id, display_name").in("user_id", creatorIds)
          : { data: [] },
      ]);

      const templatesMap = new Map<string, string>();
      templates.data?.forEach(t => templatesMap.set(t.id, t.template_name));
      
      const creatorsMap = new Map<string, string>();
      creators.data?.forEach(c => creatorsMap.set(c.user_id, c.display_name));

      return data.map((campaign): Campaign => ({
        ...campaign,
        template_name: campaign.template_id ? templatesMap.get(campaign.template_id) : undefined,
        creator_name: campaign.created_by ? creatorsMap.get(campaign.created_by) : undefined,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bulk_campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete campaign: ${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCampaign: Omit<Campaign, "id" | "created_at" | "updated_at" | "template_name" | "creator_name">) => {
      const cleanData = { ...newCampaign };
      delete (cleanData as any).template_name;
      delete (cleanData as any).creator_name;

      const { data, error } = await supabase.from("bulk_campaigns").insert(cleanData).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create campaign: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Campaign> }) => {
      const cleanData = { ...updates };
      delete (cleanData as any).template_name;
      delete (cleanData as any).creator_name;
      delete (cleanData as any).id;
      delete (cleanData as any).created_at;
      delete (cleanData as any).updated_at;

      const { data, error } = await supabase
        .from("bulk_campaigns")
        .update(cleanData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campaign updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update campaign: ${error.message}`);
    },
  });

  return {
    campaigns,
    isLoading,
    error,
    deleteCampaign: deleteMutation.mutate,
    createCampaign: createMutation.mutate,
    updateCampaign: updateMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
