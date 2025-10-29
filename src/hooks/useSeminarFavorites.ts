import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export interface SeminarFavorite {
  id: string;
  user_id: string;
  seminar_id: string;
  event_id: string;
  notes: string | null;
  reminder_sent: boolean;
  created_at: string;
}

export function useSeminarFavorites(eventId: string | null) {
  const queryClient = useQueryClient();
  const [isGuest, setIsGuest] = useState(true);
  const [guestFavorites, setGuestFavorites] = useState<string[]>([]);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(!user);
      
      // Load guest favorites from localStorage if guest
      if (!user && eventId) {
        const stored = localStorage.getItem(`seminar-favorites-${eventId}`);
        if (stored) {
          try {
            setGuestFavorites(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse guest favorites:", e);
          }
        }
      }
    };
    checkAuth();
  }, [eventId]);

  // Fetch favorites for authenticated users
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["seminar-favorites", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_seminar_favorites")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as SeminarFavorite[];
    },
    enabled: !!eventId && !isGuest,
  });

  // Add favorite mutation
  const addFavorite = useMutation({
    mutationFn: async ({ seminarId, notes }: { seminarId: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Guest mode - save to localStorage
        if (!eventId) throw new Error("Event ID required");
        const updated = [...guestFavorites, seminarId];
        setGuestFavorites(updated);
        localStorage.setItem(`seminar-favorites-${eventId}`, JSON.stringify(updated));
        throw new Error("GUEST_MODE"); // Special error to handle differently
      }

      if (!eventId) throw new Error("Event ID required");

      const { error } = await supabase
        .from("user_seminar_favorites")
        .insert({
          user_id: user.id,
          seminar_id: seminarId,
          event_id: eventId,
          notes: notes || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar-favorites", eventId] });
      toast.success("Added to My Schedule");
    },
    onError: (error: Error) => {
      if (error.message === "GUEST_MODE") {
        toast.info("Sign in to save favorites across devices");
      } else {
        toast.error("Failed to add favorite", {
          description: error.message,
        });
      }
    },
  });

  // Remove favorite mutation
  const removeFavorite = useMutation({
    mutationFn: async (seminarId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Guest mode - remove from localStorage
        if (!eventId) throw new Error("Event ID required");
        const updated = guestFavorites.filter(id => id !== seminarId);
        setGuestFavorites(updated);
        localStorage.setItem(`seminar-favorites-${eventId}`, JSON.stringify(updated));
        throw new Error("GUEST_MODE");
      }

      const { error } = await supabase
        .from("user_seminar_favorites")
        .delete()
        .eq("seminar_id", seminarId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminar-favorites", eventId] });
      toast.success("Removed from My Schedule");
    },
    onError: (error: Error) => {
      if (error.message !== "GUEST_MODE") {
        toast.error("Failed to remove favorite", {
          description: error.message,
        });
      }
    },
  });

  // Check if seminar is favorited
  const isFavorite = (seminarId: string): boolean => {
    if (isGuest) {
      return guestFavorites.includes(seminarId);
    }
    return favorites.some(f => f.seminar_id === seminarId);
  };

  // Toggle favorite
  const toggleFavorite = async (seminarId: string, notes?: string) => {
    if (isFavorite(seminarId)) {
      await removeFavorite.mutateAsync(seminarId);
    } else {
      await addFavorite.mutateAsync({ seminarId, notes });
    }
  };

  return {
    favorites: isGuest ? guestFavorites.map(id => ({ seminar_id: id })) : favorites,
    isLoading,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    toggleFavorite,
    isFavorite,
    isGuest,
    requiresAuth: false, // Seminars can be favorited as guest
  };
}
