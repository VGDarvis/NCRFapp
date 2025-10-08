import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MessageTemplate {
  id: string;
  template_name: string;
  template_type: string;
  subject?: string;
  body: string;
  category?: string;
  variables?: any;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  usage_count?: number;
  last_used?: string;
}

interface TemplateFilters {
  templateType?: string;
  category?: string;
  isActive?: boolean;
  search?: string;
}

export function useMessageTemplates(filters?: TemplateFilters) {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ["message_templates", filters],
    queryFn: async () => {
      let query = supabase
        .from("message_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.templateType && filters.templateType !== "all") {
        query = query.eq("template_type", filters.templateType);
      }
      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      }
      if (filters?.search) {
        query = query.or(
          `template_name.ilike.%${filters.search}%,body.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get usage count and last used for each template
      const templateIds = data.map(t => t.id);
      
      if (templateIds.length > 0) {
        const { data: usageData } = await supabase
          .from("messages")
          .select("template_id, sent_at")
          .in("template_id", templateIds)
          .order("sent_at", { ascending: false });

        const usageMap = new Map<string, { count: number; lastUsed?: string }>();
        usageData?.forEach(msg => {
          const existing = usageMap.get(msg.template_id) || { count: 0 };
          usageMap.set(msg.template_id, {
            count: existing.count + 1,
            lastUsed: existing.lastUsed || msg.sent_at,
          });
        });

        return data.map((template): MessageTemplate => ({
          ...template,
          usage_count: usageMap.get(template.id)?.count || 0,
          last_used: usageMap.get(template.id)?.lastUsed,
        }));
      }

      return data.map(template => ({ ...template, usage_count: 0 }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("message_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message_templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newTemplate: Omit<MessageTemplate, "id" | "created_at" | "updated_at" | "usage_count" | "last_used">) => {
      const cleanData = { ...newTemplate };
      delete (cleanData as any).usage_count;
      delete (cleanData as any).last_used;

      const { data, error } = await supabase.from("message_templates").insert(cleanData).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message_templates"] });
      toast.success("Template created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MessageTemplate> }) => {
      const cleanData = { ...updates };
      delete (cleanData as any).usage_count;
      delete (cleanData as any).last_used;
      delete (cleanData as any).id;
      delete (cleanData as any).created_at;
      delete (cleanData as any).updated_at;

      const { data, error } = await supabase
        .from("message_templates")
        .update(cleanData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message_templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });

  return {
    templates,
    isLoading,
    error,
    deleteTemplate: deleteMutation.mutate,
    createTemplate: createMutation.mutate,
    updateTemplate: updateMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
