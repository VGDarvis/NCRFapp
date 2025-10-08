import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCRMStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["crm-stats"],
    queryFn: async () => {
      const [orgsResult, contactsResult, interactionsResult] = await Promise.all([
        supabase.from("crm_organizations").select("partnership_status", { count: "exact", head: true }),
        supabase.from("crm_contacts").select("status", { count: "exact", head: true }),
        supabase
          .from("crm_interactions")
          .select("*", { count: "exact" })
          .gte("interaction_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const activeOrgs = await supabase
        .from("crm_organizations")
        .select("*", { count: "exact", head: true })
        .eq("partnership_status", "partner");

      const activeContacts = await supabase
        .from("crm_contacts")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      return {
        totalOrganizations: orgsResult.count || 0,
        activePartners: activeOrgs.count || 0,
        totalContacts: contactsResult.count || 0,
        activeContacts: activeContacts.count || 0,
        interactionsThisMonth: interactionsResult.count || 0,
      };
    },
  });

  return { stats, isLoading };
}
