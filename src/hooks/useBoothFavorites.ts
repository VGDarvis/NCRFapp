import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
  const [isGuest, setIsGuest] = useState(false);
  const [localFavorites, setLocalFavorites] = useState<BoothFavorite[]>([]);

  // Check if user is guest (not authenticated)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(!user);
      
      // Load from localStorage if guest
      if (!user && eventId) {
        const stored = localStorage.getItem(`booth_favorites_${eventId}`);
        if (stored) {
          setLocalFavorites(JSON.parse(stored));
        }
      }
    };
    checkAuth();
  }, [eventId]);

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
      
      // Guest mode: use localStorage
      if (!user) {
        const stored = localStorage.getItem(`booth_favorites_${eventId}`);
        const current: BoothFavorite[] = stored ? JSON.parse(stored) : [];
        
        // Check for duplicate
        if (current.some(fav => fav.booth_id === boothId)) {
          throw new Error("duplicate");
        }
        
        const newFavorite: BoothFavorite = {
          id: `local_${Date.now()}`,
          user_id: "guest",
          booth_id: boothId,
          event_id: eventId,
          visit_order: null,
          notes: notes || null,
          created_at: new Date().toISOString(),
        };
        
        current.push(newFavorite);
        localStorage.setItem(`booth_favorites_${eventId}`, JSON.stringify(current));
        setLocalFavorites(current);
        return newFavorite;
      }

      // Authenticated mode: use database
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
      
      // Guest mode: use localStorage
      if (!user) {
        const stored = localStorage.getItem(`booth_favorites_${eventId}`);
        const current: BoothFavorite[] = stored ? JSON.parse(stored) : [];
        const filtered = current.filter(fav => fav.booth_id !== boothId);
        localStorage.setItem(`booth_favorites_${eventId}`, JSON.stringify(filtered));
        setLocalFavorites(filtered);
        return;
      }

      // Authenticated mode: use database
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
    const allFavorites = isGuest ? localFavorites : (favorites || []);
    return allFavorites.some(fav => fav.booth_id === boothId);
  };

  return {
    favorites: isGuest ? localFavorites : favorites,
    isLoading: isGuest ? false : isLoading,
    addFavorite,
    removeFavorite,
    updateFavoriteOrder,
    isFavorite,
    isGuest,
  };
}
