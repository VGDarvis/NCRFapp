import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCSVParser } from "@/hooks/useCSVParser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const DALLAS_EVENT_ID = "df8a7c6b-5e4d-3c2b-1a0f-9e8d7c6b5a4f";

interface CSVRow {
  confirmed: string;
  boothNumber: string;
  organization: string;
  waivedFees: boolean;
  scholarships: boolean;
  acceptingOnSpot: boolean;
}

interface UpdateResult {
  success: number;
  failed: number;
  notFound: string[];
  errors: string[];
}

export function DallasBoothUpdater({ open, onClose, onComplete }: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UpdateResult | null>(null);
  const { parseCSV, isLoading } = useCSVParser<any>();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview([]);
    setResult(null);

    try {
      const parsed = await parseCSV(selectedFile);
      
      // Parse CSV and filter valid rows
      const validRows: CSVRow[] = [];
      
      parsed.data.forEach((row: any, index: number) => {
        // Skip header rows (first 10 rows)
        if (index < 10) return;
        
        const confirmed = row.CONFIRMED || row[Object.keys(row)[0]];
        const boothNumber = row["BOOTH\nNUMBER"] || row[Object.keys(row)[1]];
        const organization = row["DALLAS\nNOVEMBER 8, 2025\n50 MAX # OF BOOTHS"] || row[Object.keys(row)[2]];
        const waivedFees = row["APPLICATION \nFEES \nWAIVED"] || row[Object.keys(row)[3]];
        const scholarships = row["SCHOLARSHIPS\nON THE\n SPOT"] || row[Object.keys(row)[4]];
        const acceptingOnSpot = row["ACCEPTING\nON THE\n SPOT"] || row[Object.keys(row)[5]];
        
        // Skip if color code section or empty
        if (!organization || organization.includes("COLOR CODE") || !boothNumber) return;
        
        // Skip if not confirmed
        if (confirmed?.toLowerCase().includes("not coming") || 
            confirmed?.toLowerCase().includes("pending") ||
            confirmed === "FALSE") return;
        
        validRows.push({
          confirmed,
          boothNumber: boothNumber.trim(),
          organization: organization.trim(),
          waivedFees: waivedFees === "TRUE",
          scholarships: scholarships === "TRUE",
          acceptingOnSpot: acceptingOnSpot === "TRUE"
        });
      });

      setPreview(validRows);
      toast.success(`Loaded ${validRows.length} valid booths from CSV`);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file");
    }
  };

  const handleUpdate = async () => {
    if (preview.length === 0) return;

    setUpdating(true);
    setProgress(0);

    const results: UpdateResult = {
      success: 0,
      failed: 0,
      notFound: [],
      errors: []
    };

    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      setProgress(Math.round(((i + 1) / preview.length) * 100));

      try {
        // Find booth by organization name
        const { data: booths, error: findError } = await supabase
          .from("booths")
          .select("id, org_name")
          .eq("event_id", DALLAS_EVENT_ID)
          .ilike("org_name", `%${row.organization}%`)
          .limit(1);

        if (findError) throw findError;

        if (!booths || booths.length === 0) {
          results.notFound.push(row.organization);
          results.failed++;
          continue;
        }

        // Update booth
        const { error: updateError } = await supabase
          .from("booths")
          .update({
            table_no: row.boothNumber,
            waives_application_fee: row.waivedFees,
            offers_on_spot_admission: row.acceptingOnSpot,
            scholarship_info: row.scholarships 
              ? "Scholarships available on the spot" 
              : null,
            updated_at: new Date().toISOString()
          })
          .eq("id", booths[0].id);

        if (updateError) {
          results.errors.push(`${row.organization}: ${updateError.message}`);
          results.failed++;
        } else {
          results.success++;
        }
      } catch (error: any) {
        results.errors.push(`${row.organization}: ${error.message}`);
        results.failed++;
      }
    }

    setResult(results);
    setUpdating(false);
    setProgress(100);
    
    if (results.success > 0) {
      toast.success(`Updated ${results.success} booths successfully`);
      onComplete();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setResult(null);
    setProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dallas Booth Number Updater</DialogTitle>
          <DialogDescription>
            Upload the Dallas exhibitor CSV file to update booth numbers and feature flags
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <label 
              htmlFor="csv-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to upload CSV file"}
                </p>
              </div>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading || updating}
              />
            </label>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing CSV file...
              </div>
            )}
          </div>

          {/* Preview */}
          {preview.length > 0 && !result && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Ready to update {preview.length} booths</p>
                  <div className="text-sm space-y-1">
                    <p>• Booth numbers will be updated</p>
                    <p>• Application fee waivers: {preview.filter(r => r.waivedFees).length}</p>
                    <p>• Scholarships on spot: {preview.filter(r => r.scholarships).length}</p>
                    <p>• Accepting on spot: {preview.filter(r => r.acceptingOnSpot).length}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Update Progress */}
          {updating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Updating booths...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <Alert className={result.success > 0 ? "border-green-500" : "border-destructive"}>
                {result.success > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Update Complete</p>
                    <div className="text-sm space-y-1">
                      <p className="text-green-600">✓ {result.success} booths updated successfully</p>
                      {result.failed > 0 && (
                        <p className="text-destructive">✗ {result.failed} failed</p>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {result.notFound.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">Organizations not found in database:</p>
                    <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {result.notFound.map((org, i) => (
                        <li key={i}>• {org}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium mb-2">Errors encountered:</p>
                    <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                      {result.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={updating}>
              {result ? "Close" : "Cancel"}
            </Button>
            {preview.length > 0 && !result && (
              <Button onClick={handleUpdate} disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  `Update ${preview.length} Booths`
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
