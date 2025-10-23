import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BoothFavorite {
  id: string;
  user_id: string;
  booth_id: string;
  event_id: string;
  visit_order: number | null;
  notes: string | null;
  created_at: string;
}

export function useBoothFavorites(eventId: string | null) {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["booth-favorites", eventId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !eventId) return [];

      const { data, error } = await supabase
        .from("user_booth_favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .order("visit_order", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return data as BoothFavorite[];
    },
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000,
  });

  const addFavorite = useMutation({
    mutationFn: async ({ boothId, eventId, notes }: { boothId: string; eventId: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to save favorites");

      const { data, error } = await supabase
        .from("user_booth_favorites")
        .insert({
          user_id: user.id,
          booth_id: boothId,
          event_id: eventId,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booth-favorites"] });
      toast.success("Added to favorites");
    },
    onError: (error: any) => {
      if (error.message.includes("duplicate")) {
        toast.error("This booth is already in your favorites");
      } else {
        toast.error("Failed to add favorite");
      }
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async ({ boothId, eventId }: { boothId: string; eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("user_booth_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("booth_id", boothId)
        .eq("event_id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booth-favorites"] });
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove favorite");
    },
  });

  const updateFavoriteOrder = useMutation({
    mutationFn: async ({ favoriteId, visitOrder }: { favoriteId: string; visitOrder: number }) => {
      const { error } = await supabase
        .from("user_booth_favorites")
        .update({ visit_order: visitOrder })
        .eq("id", favoriteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booth-favorites"] });
    },
  });

  const isFavorite = (boothId: string) => {
    return favorites?.some(fav => fav.booth_id === boothId) ?? false;
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    updateFavoriteOrder,
    isFavorite,
  };
}
