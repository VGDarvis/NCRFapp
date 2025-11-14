import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, CheckCircle, AlertCircle, Info, Loader2, ArrowRight } from "lucide-react";
import Papa from "papaparse";
import { Badge } from "@/components/ui/badge";

interface ParsedBooth {
  booth_number: string;
  org_name: string;
  confirmed_status: string;
  waives_application_fee: boolean;
  offers_scholarships: boolean;
  offers_on_spot_admission: boolean;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  willBeSkipped: boolean;
  skipReason?: string;
  existingBoothNumber?: string; // Current booth number in DB
  action?: "UPDATE" | "INSERT";
}

interface ImportResult {
  updated: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

interface SeattleExhibitorImporterProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function SeattleExhibitorImporter({ open, onClose, eventId, eventTitle }: SeattleExhibitorImporterProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [parsedBooths, setParsedBooths] = useState<ParsedBooth[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    Papa.parse(selectedFile, {
      complete: async (results) => {
        const rows = results.data as string[][];
        
        // Skip header rows (first 15 rows based on CSV structure)
        const dataRows = rows.slice(15);
        
        // Fetch existing booths for this event to match against
        const { data: existingBooths } = await supabase
          .from("booths")
          .select("id, org_name, table_no")
          .eq("event_id", eventId);

        const booths: ParsedBooth[] = [];

        dataRows.forEach((row) => {
          // Skip empty rows
          if (!row[2] || row[2].trim() === "") return;

          const confirmed = row[0]?.trim() || "";
          const boothNumber = row[1]?.trim() || "";
          const orgName = row[2]?.trim() || "";
          const feesWaived = row[6]?.trim().toUpperCase() === "TRUE";
          const scholarships = row[7]?.trim().toUpperCase() === "TRUE";
          const onSpotAdmission = row[8]?.trim().toUpperCase() === "TRUE";
          const contactName = row[11]?.trim() || "";
          const contactPhone = row[12]?.trim() || "";
          const contactEmail = row[13]?.trim() || "";

          // Find existing booth by org name (case-insensitive)
          const existingBooth = existingBooths?.find(
            (b) => b.org_name.toLowerCase() === orgName.toLowerCase()
          );

          // Determine if this row should be skipped
          let willBeSkipped = false;
          let skipReason = "";

          if (!boothNumber || boothNumber === "Not Attending") {
            willBeSkipped = true;
            skipReason = "No valid booth number";
          } else if (confirmed === "FALSE") {
            willBeSkipped = true;
            skipReason = "Confirmation status: FALSE";
          } else if (confirmed === "Pending") {
            willBeSkipped = true;
            skipReason = "Pending confirmation";
          } else if (confirmed === "") {
            willBeSkipped = true;
            skipReason = "No confirmation status";
          }

          booths.push({
            booth_number: boothNumber,
            org_name: orgName,
            confirmed_status: confirmed,
            waives_application_fee: feesWaived,
            offers_scholarships: scholarships,
            offers_on_spot_admission: onSpotAdmission,
            contact_name: contactName,
            contact_phone: contactPhone,
            contact_email: contactEmail,
            willBeSkipped,
            skipReason,
            existingBoothNumber: existingBooth?.table_no || undefined,
            action: existingBooth ? "UPDATE" : "INSERT"
          });
        });

        setParsedBooths(booths);
        toast.success(`Parsed ${booths.length} booths from CSV`);
      },
      error: (error) => {
        toast.error("Failed to parse CSV file", {
          description: error.message
        });
      }
    });
  };

  const detectOrgType = (orgName: string): string => {
    const name = orgName.toLowerCase();
    if (name.includes("military") || name.includes("army") || name.includes("navy") || 
        name.includes("air force") || name.includes("marines") || name.includes("coast guard")) {
      return "military";
    }
    if (name.includes("university") || name.includes("college") || name.includes("institute")) {
      return "university";
    }
    if (name.includes("hbcu")) {
      return "hbcu";
    }
    if (name.includes("ncrf")) {
      return "ncrf";
    }
    return "other";
  };

  const handleImport = async () => {
    setIsProcessing(true);
    setProgress(0);

    const boothsToProcess = parsedBooths.filter((b) => !b.willBeSkipped);
    const importResult: ImportResult = {
      updated: 0,
      inserted: 0,
      skipped: parsedBooths.filter((b) => b.willBeSkipped).length,
      errors: []
    };

    try {
      for (let i = 0; i < boothsToProcess.length; i++) {
        const booth = boothsToProcess[i];

        try {
          if (booth.action === "UPDATE") {
            // Update existing booth
            const { error } = await supabase
              .from("booths")
              .update({
                table_no: booth.booth_number,
                waives_application_fee: booth.waives_application_fee,
                scholarship_info: booth.offers_scholarships ? "Offers scholarships on the spot" : null,
                offers_on_spot_admission: booth.offers_on_spot_admission,
                contact_name: booth.contact_name || null,
                contact_email: booth.contact_email || null,
                contact_phone: booth.contact_phone || null,
                updated_at: new Date().toISOString()
              })
              .eq("event_id", eventId)
              .ilike("org_name", booth.org_name);

            if (error) throw error;
            importResult.updated++;
          } else {
            // Insert new booth
            const { error } = await supabase
              .from("booths")
              .insert({
                event_id: eventId,
                table_no: booth.booth_number,
                org_name: booth.org_name,
                org_type: detectOrgType(booth.org_name),
                waives_application_fee: booth.waives_application_fee,
                scholarship_info: booth.offers_scholarships ? "Offers scholarships on the spot" : null,
                offers_on_spot_admission: booth.offers_on_spot_admission,
                contact_name: booth.contact_name || null,
                contact_email: booth.contact_email || null,
                contact_phone: booth.contact_phone || null
              });

            if (error) throw error;
            importResult.inserted++;
          }
        } catch (error: any) {
          importResult.errors.push(`${booth.org_name}: ${error.message}`);
        }

        setProgress(((i + 1) / boothsToProcess.length) * 100);
      }

      setResult(importResult);
      queryClient.invalidateQueries({ queryKey: ["booths"] });
      queryClient.invalidateQueries({ queryKey: ["booths", eventId] });

      toast.success("Import completed", {
        description: `Updated: ${importResult.updated}, Inserted: ${importResult.inserted}, Skipped: ${importResult.skipped}`
      });
    } catch (error: any) {
      toast.error("Import failed", {
        description: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetBooths = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("event_id", eventId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["booths"] });
      queryClient.invalidateQueries({ queryKey: ["booths", eventId] });
      
      toast.success("All booths deleted successfully");
      setShowResetConfirm(false);
      setParsedBooths([]);
      setFile(null);
      setResult(null);
    } catch (error: any) {
      toast.error("Failed to delete booths", {
        description: error.message
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedBooths([]);
    setProgress(0);
    setResult(null);
    onClose();
  };

  const confirmedBooths = parsedBooths.filter((b) => !b.willBeSkipped);
  const skippedBooths = parsedBooths.filter((b) => b.willBeSkipped);
  const updateBooths = confirmedBooths.filter((b) => b.action === "UPDATE");
  const insertBooths = confirmedBooths.filter((b) => b.action === "INSERT");

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Seattle Exhibitors CSV</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Upload CSV to update booth numbers and add new exhibitors for {eventTitle}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Danger Zone */}
            <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-destructive mb-1">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Delete all existing booths for this event before importing new data.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowResetConfirm(true)}
                    disabled={isResetting || isProcessing}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isResetting ? "Deleting..." : "Delete All Booths"}
                  </Button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload CSV File</label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Expected format: Seattle exhibitor CSV with 15 header rows
              </p>
            </div>

            {/* Preview */}
            {parsedBooths.length > 0 && !result && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold text-primary">{confirmedBooths.length}</div>
                    <div className="text-xs text-muted-foreground">To Import</div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <div className="text-2xl font-bold text-blue-600">{updateBooths.length}</div>
                    <div className="text-xs text-muted-foreground">Updates</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-600">{insertBooths.length}</div>
                    <div className="text-xs text-muted-foreground">New Booths</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold text-muted-foreground">{skippedBooths.length}</div>
                    <div className="text-xs text-muted-foreground">Skipped</div>
                  </div>
                </div>

                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left">Action</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Booth #</th>
                        <th className="px-3 py-2 text-left">Organization</th>
                        <th className="px-3 py-2 text-left">Features</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedBooths.map((booth, idx) => (
                        <tr
                          key={idx}
                          className={`border-t ${booth.willBeSkipped ? "opacity-50" : ""}`}
                        >
                          <td className="px-3 py-2">
                            {booth.willBeSkipped ? (
                              <Badge variant="outline" className="bg-muted">
                                SKIP
                              </Badge>
                            ) : booth.action === "UPDATE" ? (
                              <Badge className="bg-blue-500/20 text-blue-700">
                                UPDATE
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500/20 text-green-700">
                                INSERT
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant={booth.confirmed_status === "TRUE" ? "default" : "outline"}
                            >
                              {booth.confirmed_status || "N/A"}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            {booth.action === "UPDATE" && booth.existingBoothNumber !== booth.booth_number ? (
                              <div className="flex items-center gap-1">
                                <span className="line-through text-muted-foreground text-xs">
                                  {booth.existingBoothNumber}
                                </span>
                                <ArrowRight className="h-3 w-3" />
                                <span className="font-semibold">{booth.booth_number}</span>
                              </div>
                            ) : (
                              <span className={booth.action === "INSERT" ? "font-semibold" : ""}>
                                {booth.booth_number}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">{booth.org_name}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              {booth.waives_application_fee && (
                                <Badge variant="outline" className="text-xs">Fee Waived</Badge>
                              )}
                              {booth.offers_scholarships && (
                                <Badge variant="outline" className="text-xs">Scholarships</Badge>
                              )}
                              {booth.offers_on_spot_admission && (
                                <Badge variant="outline" className="text-xs">On-Spot Admission</Badge>
                              )}
                            </div>
                            {booth.willBeSkipped && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {booth.skipReason}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing booths...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Updated</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{result.updated}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Inserted</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{result.inserted}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Skipped</span>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">{result.skipped}</div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
                    <h4 className="font-semibold text-destructive mb-2">Errors</h4>
                    <ul className="text-sm space-y-1">
                      {result.errors.map((error, idx) => (
                        <li key={idx} className="text-muted-foreground">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {!result ? (
              <>
                <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={parsedBooths.length === 0 || confirmedBooths.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {confirmedBooths.length} Booths
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Booths?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all booths for {eventTitle}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetBooths}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All Booths"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
