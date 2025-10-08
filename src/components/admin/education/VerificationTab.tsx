import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, MapPin, Building2, Users } from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";

export function VerificationTab() {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const { data: unverifiedSchools, isLoading: loadingSchools, refetch: refetchSchools } = useQuery({
    queryKey: ["unverified-schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_database")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: unverifiedServices, isLoading: loadingServices, refetch: refetchServices } = useQuery({
    queryKey: ["unverified-youth-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youth_services_database")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleVerify = async (id: string, type: "school" | "youth_service", action: "verified" | "rejected") => {
    setVerifyingId(id);
    
    try {
      const table = type === "school" ? "school_database" : "youth_services_database";
      
      // Update the record
      const { error: updateError } = await supabase
        .from(table)
        .update({ 
          verification_status: action === "verified" ? "verified" : "rejected",
          verified_at: new Date().toISOString()
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Log verification history
      const { data: userData } = await supabase.auth.getUser();
      const { error: historyError } = await supabase
        .from("verification_history")
        .insert({
          record_type: type,
          record_id: id,
          action,
          verified_by: userData?.user?.id,
          notes: notes[id] || null,
        });

      if (historyError) throw historyError;

      toast.success(`Record ${action === "verified" ? "verified" : "rejected"} successfully`);
      
      // Refetch data
      if (type === "school") {
        refetchSchools();
      } else {
        refetchServices();
      }
      
      // Clear notes
      setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });
      
    } catch (error: any) {
      toast.error(`Failed to ${action} record: ${error.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  if (loadingSchools || loadingServices) {
    return <LoadingSpinner />;
  }

  const totalUnverified = (unverifiedSchools?.length || 0) + (unverifiedServices?.length || 0);

  if (totalUnverified === 0) {
    return (
      <EmptyState
        icon={CheckCircle}
        title="All Caught Up!"
        description="No records pending verification"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Verification Queue</h2>
          <p className="text-muted-foreground">
            {totalUnverified} records pending verification
          </p>
        </div>
      </div>

      {/* Unverified Schools */}
      {unverifiedSchools && unverifiedSchools.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Schools ({unverifiedSchools.length})
          </h3>
          
          <div className="grid gap-4">
            {unverifiedSchools.map((school) => (
              <Card key={school.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{school.school_name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {school.city}, {school.state}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {school.data_source || "manual"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {school.school_type}
                    </div>
                    <div>
                      <span className="font-medium">Enrollment:</span> {school.total_enrollment || "N/A"}
                    </div>
                    {school.website && (
                      <div className="col-span-2">
                        <span className="font-medium">Website:</span>{" "}
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {school.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <Textarea
                    placeholder="Add verification notes (optional)..."
                    value={notes[school.id] || ""}
                    onChange={(e) => setNotes(prev => ({ ...prev, [school.id]: e.target.value }))}
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerify(school.id, "school", "verified")}
                      disabled={verifyingId === school.id}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleVerify(school.id, "school", "rejected")}
                      disabled={verifyingId === school.id}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Unverified Youth Services */}
      {unverifiedServices && unverifiedServices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Youth Services ({unverifiedServices.length})
          </h3>
          
          <div className="grid gap-4">
            {unverifiedServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{service.organization_name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {service.city}, {service.state}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {service.data_source || "manual"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {service.service_type}
                    </div>
                    <div>
                      <span className="font-medium">Age Range:</span> {service.age_ranges}
                    </div>
                    {service.website && (
                      <div className="col-span-2">
                        <span className="font-medium">Website:</span>{" "}
                        <a 
                          href={service.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {service.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <Textarea
                    placeholder="Add verification notes (optional)..."
                    value={notes[service.id] || ""}
                    onChange={(e) => setNotes(prev => ({ ...prev, [service.id]: e.target.value }))}
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleVerify(service.id, "youth_service", "verified")}
                      disabled={verifyingId === service.id}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleVerify(service.id, "youth_service", "rejected")}
                      disabled={verifyingId === service.id}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
