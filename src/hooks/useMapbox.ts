import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useMapbox(containerId: string, mapboxToken: string | null) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(mapboxToken);

  // Fetch token from edge function if not provided
  useEffect(() => {
    if (mapboxToken) {
      setToken(mapboxToken);
      return;
    }

    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        if (data?.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
      }
    };

    fetchToken();
  }, [mapboxToken]);

  useEffect(() => {
    if (!token) return;

    try {
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: containerId,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-95.7129, 37.0902], // Center of USA
        zoom: 4,
        projection: "mercator" as any,
      });

      // Add navigation controls
      map.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: false }),
        "top-right"
      );

      map.on("load", () => {
        setIsLoaded(true);
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        toast.error("Map loading error. Please check your token.");
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
        setIsLoaded(false);
      };
    } catch (error) {
      console.error("Failed to initialize Mapbox:", error);
      toast.error("Failed to initialize map");
    }
  }, [containerId, token]);

  return { map: mapRef.current, isLoaded };
}
