import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCRMIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addedSchools, setAddedSchools] = useState<Set<string>>(new Set());

  // Check if schools are already in CRM
  const { data: existingOrgs } = useQuery({
    queryKey: ["crm-organizations-check"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("id, name, metadata");

      if (error) throw error;
      return data;
    },
  });

  const checkIfInCRM = (schoolId: string) => {
    if (addedSchools.has(schoolId)) return true;
    return existingOrgs?.some(org => 
      org.metadata?.school_id === schoolId
    ) || false;
  };

  const addSchoolMutation = useMutation({
    mutationFn: async (schoolData: any) => {
      // Check for duplicates
      const { data: existing } = await supabase
        .from("crm_organizations")
        .select("id")
        .eq("name", schoolData.school_name || schoolData.organization_name)
        .maybeSingle();

      if (existing) {
        throw new Error("This organization already exists in CRM");
      }

      // Create organization
      const orgData = {
        name: schoolData.school_name || schoolData.organization_name,
        organization_type: "educational_institution",
        city: schoolData.city,
        state: schoolData.state,
        zip_code: schoolData.zip_code,
        website: schoolData.website,
        email: schoolData.contact_email,
        phone: schoolData.phone,
        partnership_status: "prospect",
        source: "school_finder_search",
        metadata: {
          school_id: schoolData.id,
          school_type: schoolData.school_type,
          enrollment: schoolData.total_enrollment || schoolData.student_count,
          athletic_division: schoolData.athletic_division,
          athletic_programs: schoolData.athletic_programs,
          verification_status: schoolData.verification_status,
        },
      };

      const { data: org, error: orgError } = await supabase
        .from("crm_organizations")
        .insert(orgData)
        .select()
        .single();

      if (orgError) throw orgError;

      // Create initial interaction
      const interactionData = {
        organization_id: org.id,
        interaction_type: "note",
        subject: "Added from School Finder",
        notes: `Added via AI-powered School Finder search. Verification status: ${schoolData.verification_status || 'pending'}`,
        interaction_date: new Date().toISOString(),
      };

      const { error: interactionError } = await supabase
        .from("crm_interactions")
        .insert(interactionData);

      if (interactionError) throw interactionError;

      return { org, schoolData };
    },
    onSuccess: ({ schoolData }) => {
      setAddedSchools(prev => new Set(prev).add(schoolData.id));
      queryClient.invalidateQueries({ queryKey: ["crm-organizations-check"] });
      queryClient.invalidateQueries({ queryKey: ["crm-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });
      
      toast({
        title: "Added to CRM",
        description: `${schoolData.school_name || schoolData.organization_name} has been added to your CRM`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding to CRM",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkAddMutation = useMutation({
    mutationFn: async (schools: any[]) => {
      const results = {
        added: 0,
        skipped: 0,
        errors: [] as string[],
      };

      for (const school of schools) {
        try {
          // Check for duplicates
          const { data: existing } = await supabase
            .from("crm_organizations")
            .select("id")
            .eq("name", school.school_name || school.organization_name)
            .maybeSingle();

          if (existing) {
            results.skipped++;
            continue;
          }

          const orgData = {
            name: school.school_name || school.organization_name,
            organization_type: "educational_institution",
            city: school.city,
            state: school.state,
            zip_code: school.zip_code,
            website: school.website,
            email: school.contact_email,
            phone: school.phone,
            partnership_status: "prospect",
            source: "school_finder_bulk_import",
            metadata: {
              school_id: school.id,
              school_type: school.school_type,
              enrollment: school.total_enrollment || school.student_count,
              athletic_division: school.athletic_division,
            },
          };

          const { data: org, error: orgError } = await supabase
            .from("crm_organizations")
            .insert(orgData)
            .select()
            .single();

          if (orgError) throw orgError;

          // Create initial interaction
          await supabase
            .from("crm_interactions")
            .insert({
              organization_id: org.id,
              interaction_type: "note",
              subject: "Bulk import from School Finder",
              notes: "Added via bulk import from School Finder search results",
              interaction_date: new Date().toISOString(),
            });

          setAddedSchools(prev => new Set(prev).add(school.id));
          results.added++;
        } catch (error: any) {
          results.errors.push(`${school.school_name || school.organization_name}: ${error.message}`);
        }
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["crm-organizations-check"] });
      queryClient.invalidateQueries({ queryKey: ["crm-organizations"] });
      queryClient.invalidateQueries({ queryKey: ["crm-stats"] });

      let description = `${results.added} organizations added`;
      if (results.skipped > 0) {
        description += `, ${results.skipped} skipped (already in CRM)`;
      }
      if (results.errors.length > 0) {
        description += `, ${results.errors.length} errors`;
      }

      toast({
        title: "Bulk import complete",
        description,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addSchoolToCRM: addSchoolMutation.mutate,
    addBulkSchoolsToCRM: async (schools: any[]) => {
      const result = await bulkAddMutation.mutateAsync(schools);
      return { success: result.added > 0, result };
    },
    isAddingToCRM: addSchoolMutation.isPending || bulkAddMutation.isPending,
    checkIfInCRM,
  };
}
