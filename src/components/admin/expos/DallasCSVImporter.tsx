import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";

interface DallasCSVRow {
  booth_number: string;
  org_name: string;
  waives_fees: string;
  offers_scholarships: string;
  on_spot_admission: string;
}

export const DallasCSVImporter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);

  const eventId = "df8a7c6b-5e4d-3c2b-1a0f-9e8d7c6b5a4f";
  const venueId = "ea9f8b3c-4d2e-4f5a-9c7d-8e2f1a3b4c5d";
  const floorPlanId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  const determineOrgType = (name: string): string => {
    const upperName = name.toUpperCase();
    if (upperName.includes("UNIVERSITY") || upperName.includes("COLLEGE") || upperName.includes("STATE")) {
      return "college";
    }
    if (upperName.includes("COAST GUARD") || upperName.includes("NAVAL") || upperName.includes("AIR FORCE") || upperName.includes("ARMY")) {
      return "military";
    }
    if (upperName.includes("FOUNDATION") || upperName.includes("NCRF")) {
      return "sponsor";
    }
    return "other";
  };

  const determineSponsorTier = (orgType: string): string => {
    if (orgType === "military") return "silver";
    if (orgType === "sponsor") return "platinum";
    if (orgType === "college") return "gold";
    return "bronze";
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setImporting(true);
    let successCount = 0;
    let failedCount = 0;

    try {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          console.log("Parsed CSV rows:", results.data.length);
          
          let boothNumber = 1;

          for (let i = 0; i < results.data.length; i++) {
            const row = results.data[i] as string[];
            
            // Skip header rows and invalid data
            if (i === 0 || !row[1] || row[1].includes("COLOR CODE") || row[1].includes("HBCU") || row[1].includes("SPONSORS")) {
              continue;
            }

            const orgName = row[1]?.trim();
            if (!orgName || orgName === "" || row[0]?.includes("Not coming") || row[0]?.includes("Pending")) {
              continue;
            }

            try {
              // Parse boolean values
              const waivesFees = row[2]?.toUpperCase() === "TRUE";
              const offersScholarships = row[3]?.toUpperCase() === "TRUE";
              const onSpotAdmission = row[4]?.toUpperCase() === "TRUE";

              const orgType = determineOrgType(orgName);
              const sponsorTier = determineSponsorTier(orgType);

              // Check if exhibitor exists
              const { data: existingExhibitor } = await supabase
                .from("exhibitors")
                .select("id")
                .eq("org_name", orgName)
                .maybeSingle();

              let exhibitorId: string;

              if (existingExhibitor) {
                // Update existing exhibitor
                const { error: updateError } = await supabase
                  .from("exhibitors")
                  .update({
                    waives_application_fee: waivesFees,
                    offers_on_spot_admission: onSpotAdmission,
                    scholarship_info: offersScholarships ? "Scholarships available on the spot" : null,
                    org_type: orgType,
                    is_verified: true,
                  })
                  .eq("id", existingExhibitor.id);

                if (updateError) throw updateError;
                exhibitorId = existingExhibitor.id;
              } else {
                // Create new exhibitor
                const { data: newExhibitor, error: insertError } = await supabase
                  .from("exhibitors")
                  .insert({
                    org_name: orgName,
                    org_type: orgType,
                    waives_application_fee: waivesFees,
                    offers_on_spot_admission: onSpotAdmission,
                    scholarship_info: offersScholarships ? "Scholarships available on the spot" : null,
                    is_verified: true,
                  })
                  .select("id")
                  .single();

                if (insertError) throw insertError;
                exhibitorId = newExhibitor.id;
              }

              // Create booth record
              const { error: boothError } = await supabase
                .from("booths")
                .insert({
                  event_id: eventId,
                  venue_id: venueId,
                  floor_plan_id: floorPlanId,
                  exhibitor_id: exhibitorId,
                  org_name: orgName,
                  org_type: orgType,
                  table_no: `B${boothNumber.toString().padStart(3, "0")}`,
                  sponsor_tier: sponsorTier,
                  waives_application_fee: waivesFees,
                  offers_on_spot_admission: onSpotAdmission,
                  scholarship_info: offersScholarships ? "Scholarships available on the spot" : null,
                  is_verified: true,
                  display_order: boothNumber,
                });

              if (boothError) throw boothError;

              boothNumber++;
              successCount++;
              console.log(`✅ Imported: ${orgName}`);
            } catch (error) {
              console.error(`❌ Failed to import ${orgName}:`, error);
              failedCount++;
            }
          }

          // Update floor plan with background image and dimensions
          await supabase
            .from("floor_plans")
            .update({
              background_image_url: "/floor-plans/dallas-fort-worth-gym.jpg",
              canvas_width: 1200,
              canvas_height: 800,
            })
            .eq("id", floorPlanId);

          setResults({ success: successCount, failed: failedCount });
          setImporting(false);
          
          if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} exhibitors and booths!`);
          }
          if (failedCount > 0) {
            toast.warning(`${failedCount} entries failed to import`);
          }
        },
        error: (error) => {
          console.error("CSV parsing error:", error);
          toast.error("Failed to parse CSV file");
          setImporting(false);
        },
      });
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data");
      setImporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Dallas/Fort Worth CSV Importer</h3>
          <p className="text-sm text-muted-foreground">
            Import exhibitor and booth data from the Dallas/Fort Worth spreadsheet
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={importing}
          />
          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="min-w-[120px]"
          >
            {importing ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </>
            )}
          </Button>
        </div>

        {results && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{results.success} records imported successfully</span>
            </div>
            {results.failed > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span>{results.failed} records failed</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-4 bg-muted/50 rounded-md">
          <h4 className="font-medium mb-2">Import Details:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Event: 8th Annual Dallas/Fort Worth Black College Expo</li>
            <li>• Venue: Eastern Hills High School</li>
            <li>• Auto-assigns booth numbers (B001, B002, etc.)</li>
            <li>• Maps organization types and sponsor tiers</li>
            <li>• Creates exhibitor records and booth assignments</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
