import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const IDLE_WARNING_TIME = 30 * 60 * 1000; // 30 minutes
const IDLE_LOGOUT_TIME = 35 * 60 * 1000; // 35 minutes

export function useSessionManager() {
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null);
    });
  }, []);

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, resetActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity);
      });
    };
  }, [resetActivity]);

  useEffect(() => {
    const checkIdleTime = setInterval(() => {
      const idleTime = Date.now() - lastActivity;

      if (idleTime >= IDLE_LOGOUT_TIME) {
        supabase.auth.signOut();
        window.location.href = '/';
      } else if (idleTime >= IDLE_WARNING_TIME && !showWarning) {
        setShowWarning(true);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkIdleTime);
  }, [lastActivity, showWarning]);

  return {
    showWarning,
    userEmail,
    resetActivity,
    dismissWarning: () => setShowWarning(false)
  };
}
