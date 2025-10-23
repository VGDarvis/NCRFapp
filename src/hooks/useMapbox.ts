import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";

export function useMapbox(containerId: string, mapboxToken: string | null) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

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
  }, [containerId, mapboxToken]);

  return { map: mapRef.current, isLoaded };
}
