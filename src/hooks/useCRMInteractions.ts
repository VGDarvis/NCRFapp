import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCRMInteractions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interactions, isLoading } = useQuery({
    queryKey: ["crm-interactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_interactions")
        .select(`
          *,
          organization:crm_organizations(name),
          contact:crm_contacts(first_name, last_name),
          staff:profiles!crm_interactions_created_by_fkey(display_name)
        `)
        .order("interaction_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newInteraction: any) => {
      const { data, error } = await supabase
        .from("crm_interactions")
        .insert(newInteraction)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      toast({ title: "Interaction logged successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error logging interaction", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("crm_interactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-interactions"] });
      toast({ title: "Interaction updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating interaction", description: error.message, variant: "destructive" });
    },
  });

  return {
    interactions,
    isLoading,
    createInteraction: createMutation.mutate,
    updateInteraction: updateMutation.mutate,
  };
}
