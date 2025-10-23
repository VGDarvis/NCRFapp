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
  notes: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  qr_code_url: string | null;
  created_at: string;
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

      let query = supabase
        .from("booths")
        .select(`
          *,
          sponsor:sponsors(*)
        `)
        .eq("event_id", eventId);

      // Apply filters
      if (filters?.search) {
        query = query.ilike("sponsor.name", `%${filters.search}%`);
      }

      if (filters?.org_type && filters.org_type.length > 0) {
        query = query.in("sponsor.org_type", filters.org_type);
      }

      if (filters?.tier && filters.tier.length > 0) {
        query = query.in("sponsor.tier", filters.tier);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as any as Booth[];
    },
    enabled: !!eventId,
  });
}
