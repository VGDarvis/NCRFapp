import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_contact_id?: string;
  subject?: string;
  body: string;
  message_type: string;
  status: string;
  template_id?: string;
  campaign_id?: string;
  sender_id?: string;
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  failed_at?: string;
  error_message?: string;
  metadata?: any;
  created_at: string;
  contact_name?: string;
  campaign_name?: string;
  template_name?: string;
  sender_name?: string;
}

interface MessageFilters {
  status?: string;
  messageType?: string;
  campaignId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export function useMessages(filters?: MessageFilters) {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ["messages", filters],
    queryFn: async () => {
      let query = supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }
      if (filters?.messageType && filters.messageType !== "all") {
        query = query.eq("message_type", filters.messageType);
      }
      if (filters?.campaignId) {
        query = query.eq("campaign_id", filters.campaignId);
      }
      if (filters?.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }
      if (filters?.search) {
        query = query.or(
          `recipient_email.ilike.%${filters.search}%,recipient_phone.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,body.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch related data separately
      const contactIds = data.map(m => m.recipient_contact_id).filter(Boolean);
      const campaignIds = data.map(m => m.campaign_id).filter(Boolean);
      const templateIds = data.map(m => m.template_id).filter(Boolean);
      const senderIds = data.map(m => m.sender_id).filter(Boolean);

      const [contacts, campaigns, templates, senders] = await Promise.all([
        contactIds.length > 0
          ? supabase.from("crm_contacts").select("id, first_name, last_name").in("id", contactIds)
          : { data: [] },
        campaignIds.length > 0
          ? supabase.from("bulk_campaigns").select("id, campaign_name").in("id", campaignIds)
          : { data: [] },
        templateIds.length > 0
          ? supabase.from("message_templates").select("id, template_name").in("id", templateIds)
          : { data: [] },
        senderIds.length > 0
          ? supabase.from("profiles").select("user_id, display_name").in("user_id", senderIds)
          : { data: [] },
      ]);

      const contactsMap = new Map<string, string>();
      contacts.data?.forEach(c => contactsMap.set(c.id, `${c.first_name} ${c.last_name}`));
      
      const campaignsMap = new Map<string, string>();
      campaigns.data?.forEach(c => campaignsMap.set(c.id, c.campaign_name));
      
      const templatesMap = new Map<string, string>();
      templates.data?.forEach(t => templatesMap.set(t.id, t.template_name));
      
      const sendersMap = new Map<string, string>();
      senders.data?.forEach(s => sendersMap.set(s.user_id, s.display_name));

      return data.map((message): Message => ({
        ...message,
        contact_name: message.recipient_contact_id ? contactsMap.get(message.recipient_contact_id) : undefined,
        campaign_name: message.campaign_id ? campaignsMap.get(message.campaign_id) : undefined,
        template_name: message.template_id ? templatesMap.get(message.template_id) : undefined,
        sender_name: message.sender_id ? sendersMap.get(message.sender_id) : undefined,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete message: ${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMessage: Omit<Message, "id" | "created_at" | "contact_name" | "campaign_name" | "template_name" | "sender_name">) => {
      const cleanData = { ...newMessage };
      delete (cleanData as any).contact_name;
      delete (cleanData as any).campaign_name;
      delete (cleanData as any).template_name;
      delete (cleanData as any).sender_name;

      const { data, error } = await supabase.from("messages").insert(cleanData).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create message: ${error.message}`);
    },
  });

  return {
    messages,
    isLoading,
    error,
    deleteMessage: deleteMutation.mutate,
    createMessage: createMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
