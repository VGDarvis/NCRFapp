import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve session ID from localStorage
const getSessionId = () => {
  const key = "guest_session_id";
  let sessionId = localStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};

export function useGuestAnalytics(eventId: string | null, pageView: string) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount
    if (!eventId || hasTracked.current) return;

    const trackPageView = async () => {
      try {
        const sessionId = getSessionId();
        
        await supabase
          .from("guest_analytics")
          .insert({
            event_id: eventId,
            session_id: sessionId,
            page_view: pageView,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });

        hasTracked.current = true;
      } catch (error) {
        console.error("Analytics tracking error:", error);
        // Silent fail - don't disrupt user experience
      }
    };

    trackPageView();
  }, [eventId, pageView]);
}
