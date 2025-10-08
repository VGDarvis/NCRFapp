import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useYouthServices() {
  const queryClient = useQueryClient();

  const { data: youthServices, isLoading } = useQuery({
    queryKey: ["youth-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youth_services_database")
        .select("*")
        .order("organization_name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateYouthService = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("youth_services_database")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youth-services"] });
      toast.success("Youth service updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update youth service: ${error.message}`);
    },
  });

  const createYouthService = useMutation({
    mutationFn: async (newService: any) => {
      const { error } = await supabase
        .from("youth_services_database")
        .insert(newService);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youth-services"] });
      toast.success("Youth service created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create youth service: ${error.message}`);
    },
  });

  const deleteYouthService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("youth_services_database")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youth-services"] });
      toast.success("Youth service deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete youth service: ${error.message}`);
    },
  });

  return {
    youthServices,
    isLoading,
    updateYouthService,
    createYouthService,
    deleteYouthService,
  };
}
