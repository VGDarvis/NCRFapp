import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSchools() {
  const queryClient = useQueryClient();

  const { data: schools, isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools_database")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const updateSchool = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("schools_database")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update school: ${error.message}`);
    },
  });

  const createSchool = useMutation({
    mutationFn: async (newSchool: any) => {
      const { error } = await supabase
        .from("schools_database")
        .insert(newSchool);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create school: ${error.message}`);
    },
  });

  const deleteSchool = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("schools_database")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete school: ${error.message}`);
    },
  });

  return {
    schools,
    isLoading,
    updateSchool,
    createSchool,
    deleteSchool,
  };
}
