import { useMemo } from 'react';
import { useSeminarSessions } from './useSeminarSessions';
import { useRealtimeSeminars } from './useRealtimeSeminars';

const STAGE_CATEGORIES = [
  'entertainment',
  'money_giveaway',
  'scholarship_giveaway',
  'stage_performance'
];

export function useStagePerformances(eventId: string | null) {
  const { data: sessions, isLoading, error } = useSeminarSessions(eventId);
  
  // Enable real-time updates
  useRealtimeSeminars(eventId);
  
  const stagePerformances = useMemo(() => {
    if (!sessions) return [];
    
    return sessions
      .filter(session => 
        session.category && STAGE_CATEGORIES.includes(session.category.toLowerCase())
      )
      .sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
  }, [sessions]);
  
  return {
    performances: stagePerformances,
    isLoading,
    error
  };
}
