import mapboxgl from "mapbox-gl";
import { Booth } from "@/hooks/useBooths";

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    [key: string]: any;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export const convertBoothsToGeoJSON = (booths: Booth[]): GeoJSONFeatureCollection => {
  const features: GeoJSONFeature[] = booths
    .filter((booth) => booth.longitude && booth.latitude)
    .map((booth) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [booth.longitude!, booth.latitude!],
      },
      properties: {
        id: booth.id,
        name: booth.sponsor?.name || "Unknown",
        tier: booth.sponsor?.tier || "default",
        booth_number: booth.booth_number,
        logo_url: booth.sponsor?.logo_url,
      },
    }));

  return {
    type: "FeatureCollection",
    features,
  };
};

export const getTierColor = (tier: string | null): string => {
  switch (tier?.toLowerCase()) {
    case "platinum":
      return "from-yellow-400 to-yellow-600";
    case "gold":
      return "from-amber-400 to-amber-600";
    case "silver":
      return "from-gray-300 to-gray-500";
    default:
      return "from-blue-400 to-blue-600";
  }
};

export const flyToLocation = (
  map: mapboxgl.Map,
  longitude: number,
  latitude: number,
  zoom: number = 15
) => {
  map.flyTo({
    center: [longitude, latitude],
    zoom,
    duration: 1500,
    essential: true,
  });
};

export const fitBounds = (
  map: mapboxgl.Map,
  coordinates: [number, number][]
) => {
  if (coordinates.length === 0) return;

  const bounds = coordinates.reduce(
    (bounds, coord) => bounds.extend(coord),
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
  );

  map.fitBounds(bounds, {
    padding: { top: 100, bottom: 100, left: 100, right: 100 },
    maxZoom: 15,
    duration: 1500,
  });
};

export const createMarkerElement = (
  type: "venue" | "booth",
  tier?: string | null
): HTMLDivElement => {
  const el = document.createElement("div");
  el.style.cursor = "pointer";

  if (type === "venue") {
    el.className =
      "w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl flex items-center justify-center border-4 border-white transition-transform hover:scale-110";
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `;
  } else {
    const colorClass = getTierColor(tier);
    el.className = `w-8 h-8 bg-gradient-to-br ${colorClass} rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110`;
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/>
        <path d="M16 6h.01"/>
        <path d="M12 6h.01"/>
        <path d="M12 10h.01"/>
        <path d="M12 14h.01"/>
        <path d="M16 10h.01"/>
        <path d="M16 14h.01"/>
        <path d="M8 10h.01"/>
        <path d="M8 14h.01"/>
      </svg>
    `;
  }

  return el;
};
