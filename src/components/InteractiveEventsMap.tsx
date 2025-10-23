import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  event_date: string;
  latitude?: number;
  longitude?: number;
}

interface InteractiveEventsMapProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const InteractiveEventsMap = ({ events, onEventClick }: InteractiveEventsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Geocode addresses to get coordinates
  const geocodeAddress = async (address: string, city: string, state: string): Promise<[number, number] | null> => {
    try {
      const query = encodeURIComponent(`${address}, ${city}, ${state}`);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center as [number, number];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        if (data?.token) {
          setMapboxToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch Mapbox token:', error);
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isLoadingToken) return;

    if (map.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-95, 37], // Center of USA
      zoom: 3.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, isLoadingToken]);

  useEffect(() => {
    if (!map.current || !events.length || isLoadingToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each event
    const addMarkers = async () => {
      const bounds = new mapboxgl.LngLatBounds();

      for (const event of events) {
        let coordinates: [number, number] | null = null;

        if (event.latitude && event.longitude) {
          coordinates = [event.longitude, event.latitude];
        } else {
          coordinates = await geocodeAddress(event.address, event.city, event.state);
        }

        if (coordinates) {
          bounds.extend(coordinates);

          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.innerHTML = `
            <div class="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `;

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm mb-1">${event.title}</h3>
              <p class="text-xs text-muted-foreground mb-1">${event.location_name}</p>
              <p class="text-xs text-muted-foreground">${new Date(event.event_date).toLocaleDateString()}</p>
              <button 
                class="mt-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 w-full"
                onclick="window.dispatchEvent(new CustomEvent('event-marker-click', { detail: '${event.id}' }))"
              >
                View Details
              </button>
            </div>
          `);

          const marker = new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map.current!);

          markersRef.current.push(marker);
        }
      }

      // Fit map to show all markers
      if (!bounds.isEmpty()) {
        map.current?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 12,
        });
      }
    };

    addMarkers();

    // Listen for marker clicks
    const handleMarkerClick = (e: any) => {
      const eventId = e.detail;
      const event = events.find(ev => ev.id === eventId);
      if (event) {
        onEventClick(event);
      }
    };

    window.addEventListener('event-marker-click', handleMarkerClick);

    return () => {
      window.removeEventListener('event-marker-click', handleMarkerClick);
    };
  }, [events, onEventClick, isLoadingToken]);

  if (isLoadingToken) {
    return (
      <div className="w-full h-[500px] bg-muted/50 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg shadow-lg" />
    </div>
  );
};
