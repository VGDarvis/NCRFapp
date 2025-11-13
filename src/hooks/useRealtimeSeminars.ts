import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealtimeSeminars = (eventId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!eventId) return;

    const channel = supabase
      .channel(`seminar-updates-${eventId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seminar_sessions',
        filter: `event_id=eq.${eventId}`
      }, (payload) => {
        console.log('🔔 Seminar updated:', payload);
        
        // Invalidate seminar sessions query
        queryClient.invalidateQueries({ 
          queryKey: ['seminar-sessions', eventId] 
        });
        
        // Show appropriate toast based on event type
        if (payload.eventType === 'INSERT') {
          const newSeminar = payload.new as any;
          toast.success('New seminar added!', {
            description: newSeminar.title,
            duration: 3000
          });
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Seminar updated', {
            description: 'Schedule has been refreshed',
            duration: 2000
          });
        } else if (payload.eventType === 'DELETE') {
          toast.info('Seminar removed', {
            duration: 2000
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, queryClient]);
};
