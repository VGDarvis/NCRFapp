import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Booth {
  id: string;
  event_id: string;
  sponsor_id: string;
  booth_number: string | null;
  floor_number: number | null;
  zone: string | null;
  is_featured: boolean;
  display_order: number;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  qr_code_url: string | null;
  created_at: string;
  // Direct booth properties from database
  org_name: string;
  logo_url: string | null;
  org_type: string | null;
  sponsor_tier: string | null;
  table_no: string | null;
  website_url: string | null;
  offers_on_spot_admission: boolean;
  waives_application_fee: boolean;
  scholarship_info: string | null;
  floor_plan_id: string | null;
  x_position: number | null;
  y_position: number | null;
  booth_width: number | null;
  booth_depth: number | null;
  grid_row: number | null;
  grid_col: number | null;
  sponsor?: {
    id: string;
    name: string;
    logo_url: string | null;
    website_url: string | null;
    contact_email: string | null;
    tier: string | null;
    org_type: string | null;
  };
}

export interface BoothFilters {
  search?: string;
  org_type?: string[];
  tier?: string[];
}

export function useBooths(eventId: string | null, filters?: BoothFilters) {
  return useQuery({
    queryKey: ["booths", eventId, filters],
    queryFn: async () => {
      if (!eventId) return [];

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Authenticated users get full booth data including contact info (if they have permissions)
        let query = supabase
          .from("booths")
          .select(`
            *,
            sponsor:sponsors(*)
          `)
          .eq("event_id", eventId);

        // Apply filters
        if (filters?.search) {
          query = query.ilike("org_name", `%${filters.search}%`);
        }

        if (filters?.org_type && filters.org_type.length > 0) {
          query = query.in("org_type", filters.org_type);
        }

        if (filters?.tier && filters.tier.length > 0) {
          query = query.in("sponsor_tier", filters.tier);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as any as Booth[];
      } else {
        // Guest users use secure function (no contact info)
        const { data, error } = await supabase.rpc('get_public_booths', {
          p_event_id: eventId
        });

        if (error) throw error;
        
        // Apply client-side filters for guest users
        let filteredData = data || [];
        
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter((booth: any) => 
            booth.org_name?.toLowerCase().includes(searchLower)
          );
        }

        if (filters?.org_type && filters.org_type.length > 0) {
          filteredData = filteredData.filter((booth: any) => 
            filters.org_type!.includes(booth.org_type)
          );
        }

        if (filters?.tier && filters.tier.length > 0) {
          filteredData = filteredData.filter((booth: any) => 
            filters.tier!.includes(booth.sponsor_tier)
          );
        }

        return filteredData as any as Booth[];
      }
    },
    enabled: !!eventId,
  });
}
