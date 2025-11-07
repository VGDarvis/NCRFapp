import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { Badge } from "@/components/ui/badge";

interface ParsedBooth {
  booth_number: string;
  org_name: string;
  confirmed_status: string;
  waives_application_fee: boolean;
  offers_scholarships: boolean;
  offers_on_spot_admission: boolean;
  willBeSkipped: boolean;
  skipReason?: string;
}

interface ImportResult {
  inserted: number;
  skipped: number;
  errors: string[];
}

interface DallasExhibitorImporterProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function DallasExhibitorImporter({ open, onClose, eventId, eventTitle }: DallasExhibitorImporterProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [parsedBooths, setParsedBooths] = useState<ParsedBooth[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    Papa.parse(selectedFile, {
      complete: (results) => {
        const rows = results.data as string[][];
        
        // Skip header rows (first 10 rows based on CSV structure)
        const dataRows = rows.slice(10);
        
        const booths: ParsedBooth[] = [];

        dataRows.forEach((row, index) => {
          // Skip empty rows
          if (!row[2] || row[2].trim() === "" || row[2] === "COLOR CODE & KEY") return;

          const confirmed = row[0]?.trim() || "";
          const boothNumber = row[1]?.trim() || "";
          const orgName = row[2]?.trim() || "";
          const feesWaived = row[3]?.trim().toUpperCase() === "TRUE";
          const scholarships = row[4]?.trim().toUpperCase() === "TRUE";
          const onSpotAdmission = row[5]?.trim().toUpperCase() === "TRUE";

          // Determine if this row should be skipped
          let willBeSkipped = false;
          let skipReason = "";

          if (!boothNumber) {
            willBeSkipped = true;
            skipReason = "No booth number";
          } else if (confirmed === "Not coming") {
            willBeSkipped = true;
            skipReason = "Marked as 'Not coming'";
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
            willBeSkipped,
            skipReason
          });
        });

        setParsedBooths(booths);
        toast.success(`Parsed ${booths.length} rows from CSV`);
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
      }
    });
  };

  const handleResetBooths = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("event_id", eventId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["booths"] });
      toast.success(`All booths deleted for ${eventTitle}`);
      setShowResetConfirm(false);
    } catch (error) {
      console.error("Error deleting booths:", error);
      toast.error("Failed to delete booths");
    } finally {
      setIsResetting(false);
    }
  };

  const handleImport = async () => {
    if (parsedBooths.length === 0) {
      toast.error("No booths to import");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const boothsToImport = parsedBooths.filter(b => !b.willBeSkipped);
    const errors: string[] = [];
    let inserted = 0;
    let skipped = parsedBooths.filter(b => b.willBeSkipped).length;

    try {
      // Prepare booth records for batch insert
      const boothRecords = boothsToImport.map(booth => ({
        event_id: eventId,
        table_no: booth.booth_number,
        org_name: booth.org_name,
        waives_application_fee: booth.waives_application_fee,
        offers_on_spot_admission: booth.offers_on_spot_admission,
        scholarship_info: booth.offers_scholarships 
          ? "Scholarships available on the spot"
          : null,
        org_type: detectOrgType(booth.org_name),
        is_verified: true,
        last_verified_at: new Date().toISOString()
      }));

      // Batch insert all booths
      const { data, error } = await supabase
        .from("booths")
        .insert(boothRecords)
        .select();

      if (error) {
        errors.push(`Database error: ${error.message}`);
      } else {
        inserted = data?.length || 0;
      }

      setProgress(100);

      // Invalidate queries to refresh all booth data
      await queryClient.invalidateQueries({ queryKey: ["booths"] });

      setResult({
        inserted,
        skipped,
        errors
      });

      if (errors.length === 0) {
        toast.success(`✅ Successfully imported ${inserted} booths!`);
      } else {
        toast.error("Import completed with errors");
      }

    } catch (error: any) {
      console.error("Import error:", error);
      toast.error(`Import failed: ${error.message}`);
      setResult({
        inserted,
        skipped,
        errors: [...errors, error.message]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const detectOrgType = (orgName: string): string => {
    const name = orgName.toLowerCase();
    
    if (name.includes("hbcu") || name.includes("black college")) return "hbcu";
    if (name.includes("military") || name.includes("naval") || 
        name.includes("coast guard") || name.includes("army") || 
        name.includes("air force")) return "military";
    if (name.includes("university") || name.includes("college") || 
        name.includes("state") || name.includes("institute")) return "university";
    if (name.includes("ncrf")) return "ncrf";
    if (name.includes("career") || name.includes("internship")) return "career";
    
    return "other";
  };

  const handleClose = () => {
    setFile(null);
    setParsedBooths([]);
    setResult(null);
    setProgress(0);
    onClose();
  };

  const boothsToImport = parsedBooths.filter(b => !b.willBeSkipped);
  const boothsToSkip = parsedBooths.filter(b => b.willBeSkipped);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Dallas Exhibitors
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Event: <span className="font-medium">{eventTitle}</span>
            </p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Danger Zone: Reset Booths */}
            <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-destructive mb-1">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Delete all existing booths for this event before importing. This cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowResetConfirm(true)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset All Booths
                  </Button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            {!result && (
              <div>
                <label className="text-sm font-medium mb-2 block">Upload CSV File</label>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
                {file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            )}

            {/* Preview */}
            {parsedBooths.length > 0 && !result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Will Import</span>
                    </div>
                    <p className="text-2xl font-bold">{boothsToImport.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Will Skip</span>
                    </div>
                    <p className="text-2xl font-bold">{boothsToSkip.length}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Total Rows</span>
                    </div>
                    <p className="text-2xl font-bold">{parsedBooths.length}</p>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted">
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">Booth #</th>
                        <th className="p-2 text-left font-medium">Organization</th>
                        <th className="p-2 text-center font-medium">Fees</th>
                        <th className="p-2 text-center font-medium">Scholarships</th>
                        <th className="p-2 text-center font-medium">On-Spot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedBooths.map((booth, idx) => (
                        <tr key={idx} className={booth.willBeSkipped ? "bg-muted/50 opacity-60" : ""}>
                          <td className="p-2">
                            {booth.willBeSkipped ? (
                              <Badge variant="secondary" className="text-xs">
                                Skip: {booth.skipReason}
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Import
                              </Badge>
                            )}
                          </td>
                          <td className="p-2 font-mono">{booth.booth_number}</td>
                          <td className="p-2">{booth.org_name}</td>
                          <td className="p-2 text-center">
                            {booth.waives_application_fee ? "✓" : "—"}
                          </td>
                          <td className="p-2 text-center">
                            {booth.offers_scholarships ? "✓" : "—"}
                          </td>
                          <td className="p-2 text-center">
                            {booth.offers_on_spot_admission ? "✓" : "—"}
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
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold">Import Complete</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>✅ Imported: <span className="font-bold">{result.inserted}</span></div>
                    <div>⏭️ Skipped: <span className="font-bold">{result.skipped}</span></div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="border border-destructive rounded-lg p-4 bg-destructive/5">
                    <h4 className="font-semibold text-destructive mb-2">Errors</h4>
                    <ul className="text-sm space-y-1">
                      {result.errors.map((error, idx) => (
                        <li key={idx} className="text-destructive">• {error}</li>
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
                  disabled={isProcessing || parsedBooths.length === 0 || boothsToImport.length === 0}
                >
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Import {boothsToImport.length} Booths
                </Button>
              </>
            ) : (
              <Button onClick={handleClose}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Booths?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all existing booths for <strong>{eventTitle}</strong>.
              This action cannot be undone. You should only do this if you're about to import fresh data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetBooths}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete All Booths
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
