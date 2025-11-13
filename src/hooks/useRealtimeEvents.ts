import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealtimeEvents = (eventId?: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('event-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: eventId ? `id=eq.${eventId}` : undefined
      }, (payload) => {
        console.log('🔔 Event updated:', payload);
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['active-event'] });
        queryClient.invalidateQueries({ queryKey: ['events-with-venues'] });
        
        // Show toast notification for updates
        if (payload.eventType === 'UPDATE') {
          toast.success('Event updated!', {
            description: 'New event details are now live',
            duration: 3000
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient]);
};
