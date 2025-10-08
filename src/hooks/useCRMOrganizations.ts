import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCRMOrganizations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["crm-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select(`
          *,
          contacts:crm_contacts(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newOrg: any) => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .insert(newOrg)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-organizations"] });
      toast({ title: "Organization created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error creating organization", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-organizations"] });
      toast({ title: "Organization updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating organization", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("crm_organizations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-organizations"] });
      toast({ title: "Organization deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting organization", description: error.message, variant: "destructive" });
    },
  });

  return {
    organizations,
    isLoading,
    createOrganization: createMutation.mutate,
    updateOrganization: updateMutation.mutate,
    deleteOrganization: deleteMutation.mutate,
  };
}
