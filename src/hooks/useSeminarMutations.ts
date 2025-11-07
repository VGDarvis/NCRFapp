import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateSeminarData {
  event_id: string;
  title: string;
  description?: string;
  presenter_name?: string;
  presenter_title?: string;
  presenter_organization?: string;
  start_time: string;
  end_time: string;
  room_name: string;
  venue_id: string;
  category?: string;
  max_capacity?: number;
  registration_required?: boolean;
}

interface UpdateSeminarData extends Partial<CreateSeminarData> {
  id: string;
}

export function useSeminarMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const ensureRoomExists = async (roomName: string, venueId: string) => {
    // Check if room exists
    const { data: existingRoom } = await supabase
      .from("seminar_rooms")
      .select("id")
      .eq("room_name", roomName)
      .eq("venue_id", venueId)
      .maybeSingle();

    if (existingRoom) {
      return existingRoom.id;
    }

    // Create room if it doesn't exist
    const { data: newRoom, error } = await supabase
      .from("seminar_rooms")
      .insert({
        venue_id: venueId,
        room_name: roomName,
      })
      .select("id")
      .single();

    if (error) throw error;
    return newRoom.id;
  };

  const createSeminar = useMutation({
    mutationFn: async (data: CreateSeminarData) => {
      // First, ensure the room exists
      const roomId = await ensureRoomExists(data.room_name, data.venue_id);

      // Create the seminar session
      const { data: seminar, error } = await supabase
        .from("seminar_sessions")
        .insert({
          event_id: data.event_id,
          room_id: roomId,
          title: data.title,
          description: data.description,
          presenter_name: data.presenter_name,
          presenter_title: data.presenter_title,
          presenter_organization: data.presenter_organization,
          start_time: data.start_time,
          end_time: data.end_time,
          category: data.category,
          max_capacity: data.max_capacity,
          registration_required: data.registration_required || false,
        })
        .select()
        .single();

      if (error) throw error;
      return seminar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["seminar-rooms"] });
      toast({
        title: "Success",
        description: "Seminar created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create seminar",
        variant: "destructive",
      });
    },
  });

  const updateSeminar = useMutation({
    mutationFn: async (data: UpdateSeminarData) => {
      const { id, room_name, venue_id, ...updateData } = data;

      let roomId = undefined;
      if (room_name && venue_id) {
        roomId = await ensureRoomExists(room_name, venue_id);
      }

      const { data: seminar, error } = await supabase
        .from("seminar_sessions")
        .update({
          ...updateData,
          ...(roomId && { room_id: roomId }),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return seminar;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["seminar-rooms"] });
      toast({
        title: "Success",
        description: "Seminar updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update seminar",
        variant: "destructive",
      });
    },
  });

  const deleteSeminar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("seminar_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar-sessions"] });
      toast({
        title: "Success",
        description: "Seminar deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete seminar",
        variant: "destructive",
      });
    },
  });

  return {
    createSeminar,
    updateSeminar,
    deleteSeminar,
  };
}
