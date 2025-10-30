import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GuestSessionData {
  sessionId: string;
  eventId: string | null;
  entrySource: string;
  deviceType: string;
}

interface InteractionData {
  booths_viewed?: number;
  booths_favorited?: string[];
  seminars_saved?: string[];
  map_interactions?: number;
}

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

const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
};

export function useGuestSession(eventId: string | null, currentPage: string) {
  const sessionIdRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const initSession = async () => {
      try {
        const sessionId = getSessionId();
        sessionIdRef.current = sessionId;

        // Extract entry source from URL
        const urlParams = new URLSearchParams(window.location.search);
        const entrySource = urlParams.get("source") || "direct";
        const deviceType = getDeviceType();

        // Check if session already exists
        const { data: existingSession } = await supabase
          .from("guest_sessions")
          .select("id, ended_at")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (!existingSession || existingSession.ended_at) {
          // Create new session
          await supabase.from("guest_sessions").insert({
            session_id: sessionId,
            event_id: eventId,
            entry_source: entrySource,
            device_type: deviceType,
            page_views: [{ page: currentPage, timestamp: new Date().toISOString() }],
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          });
        } else {
          // Update existing session with new page view
          const { data: currentSession } = await supabase
            .from("guest_sessions")
            .select("page_views")
            .eq("session_id", sessionId)
            .single();
          
          const currentPageViews = Array.isArray(currentSession?.page_views) 
            ? currentSession.page_views 
            : [];
          
          await supabase
            .from("guest_sessions")
            .update({
              last_active_at: new Date().toISOString(),
              page_views: [...currentPageViews, { page: currentPage, timestamp: new Date().toISOString() }],
            })
            .eq("session_id", sessionId);
        }

        setIsActive(true);

        // Set up heartbeat to update last_active_at every 2 minutes
        heartbeatIntervalRef.current = setInterval(async () => {
          await supabase
            .from("guest_sessions")
            .update({ last_active_at: new Date().toISOString() })
            .eq("session_id", sessionId);
        }, 120000); // 2 minutes
      } catch (error) {
        console.error("Guest session tracking error:", error);
      }
    };

    initSession();

    // End session when user leaves
    const handleBeforeUnload = async () => {
      if (sessionIdRef.current) {
        const sessionStart = localStorage.getItem("session_start_time");
        const duration = sessionStart
          ? Math.floor((Date.now() - parseInt(sessionStart)) / 1000)
          : 0;

        await supabase
          .from("guest_sessions")
          .update({
            ended_at: new Date().toISOString(),
            last_active_at: new Date().toISOString(),
          })
          .eq("session_id", sessionIdRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [eventId, currentPage]);

  // Track page views
  const trackPageView = async (page: string) => {
    if (!sessionIdRef.current) return;

    try {
      const { data: session } = await supabase
        .from("guest_sessions")
        .select("page_views")
        .eq("session_id", sessionIdRef.current)
        .single();

      if (session) {
        const pageViews = Array.isArray(session.page_views) ? session.page_views : [];
        await supabase
          .from("guest_sessions")
          .update({
            page_views: [...pageViews, { page, timestamp: new Date().toISOString() }],
            last_active_at: new Date().toISOString(),
          })
          .eq("session_id", sessionIdRef.current);
      }
    } catch (error) {
      console.error("Page view tracking error:", error);
    }
  };

  // Track interactions
  const trackInteraction = async (interactionData: Partial<InteractionData>) => {
    if (!sessionIdRef.current) return;

    try {
      const { data: session } = await supabase
        .from("guest_sessions")
        .select("interactions")
        .eq("session_id", sessionIdRef.current)
        .single();

      if (session) {
        const currentInteractions = (session.interactions as InteractionData) || {};
        const updatedInteractions = {
          ...currentInteractions,
          ...interactionData,
        };

        await supabase
          .from("guest_sessions")
          .update({
            interactions: updatedInteractions,
            last_active_at: new Date().toISOString(),
          })
          .eq("session_id", sessionIdRef.current);
      }
    } catch (error) {
      console.error("Interaction tracking error:", error);
    }
  };

  return {
    sessionId: sessionIdRef.current,
    isActive,
    trackPageView,
    trackInteraction,
  };
}
