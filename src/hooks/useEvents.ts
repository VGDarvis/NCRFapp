import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useEvents() {
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(*),
          event_tags(tag:tags(*))
        `)
        .order("start_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: upcomingEvents, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ["events-upcoming"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          venue:venues(*),
          event_tags(tag:tags(*))
        `)
        .eq("status", "upcoming")
        .gte("start_at", new Date().toISOString())
        .order("start_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (newEvent: any) => {
      const { error } = await supabase
        .from("events")
        .insert(newEvent);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events-upcoming"] });
      toast.success("Event created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create event: ${error.message}`);
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events-upcoming"] });
      toast.success("Event updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events-upcoming"] });
      toast.success("Event deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete event: ${error.message}`);
    },
  });

  return {
    events,
    upcomingEvents,
    isLoading,
    isLoadingUpcoming,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
