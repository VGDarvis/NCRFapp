import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Loader2, Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCSVParser } from "@/hooks/useCSVParser";
import { validateBoothRow, BoothCSVRow } from "@/lib/csv-validation";

interface BoothCSVImporterProps {
  eventId: string;
  onImportComplete?: () => void;
}

export function BoothCSVImporter({ eventId, onImportComplete }: BoothCSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<BoothCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { parseCSV, isLoading: isParsing } = useCSVParser<BoothCSVRow>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
      setPreviewData([]);
      setValidationErrors([]);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    const result = await parseCSV(file, validateBoothRow);
    
    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
      toast.warning(`Found ${result.meta.invalidRows} invalid rows`);
    }
    
    setPreviewData(result.data);
    toast.success(`Parsed ${result.meta.validRows} valid rows`);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('No valid data to import');
      return;
    }

    setIsImporting(true);

    try {
      // First, create sponsors for organizations
      const sponsorPromises = previewData.map(async (row) => {
        // Check if sponsor already exists
        const { data: existing } = await supabase
          .from('sponsors')
          .select('id')
          .eq('name', row.org_name)
          .single();

        if (existing) return existing.id;

        // Create new sponsor
        const { data: newSponsor, error } = await supabase
          .from('sponsors')
          .insert({
            name: row.org_name,
            tier: row.tier?.toLowerCase() || 'bronze',
            contact_email: row.contact_email,
            contact_phone: row.phone,
            website: row.website,
          })
          .select('id')
          .single();

        if (error) throw error;
        return newSponsor.id;
      });

      const sponsorIds = await Promise.all(sponsorPromises);

      // Then create booths
      const boothInserts = previewData.map((row, index) => ({
        event_id: eventId,
        sponsor_id: sponsorIds[index],
        booth_number: row.booth_number,
        org_name: row.org_name,
        org_type: row.org_type,
        x_position: row.x_position ? parseFloat(row.x_position) : null,
        y_position: row.y_position ? parseFloat(row.y_position) : null,
        offers_on_spot_admission: row.offers_on_spot_admission?.toLowerCase() === 'true',
        waives_application_fee: row.waives_application_fee?.toLowerCase() === 'true',
        special_offers: row.scholarship_info ? [row.scholarship_info] : [],
      }));

      const { error: boothError } = await supabase
        .from('booths')
        .insert(boothInserts);

      if (boothError) throw boothError;

      toast.success(`Successfully imported ${previewData.length} booths!`);
      
      // Reset form
      setFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      
      onImportComplete?.();
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import booths');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `booth_number,org_name,org_type,tier,contact_email,phone,website,x_position,y_position,offers_on_spot_admission,waives_application_fee,scholarship_info
A-101,Texas Southern University,hbcu,platinum,admissions@tsu.edu,(713) 313-7420,https://tsu.edu,100,50,true,true,Full scholarships available
A-102,University of Houston,university,gold,info@uh.edu,(713) 743-1000,https://uh.edu,150,50,false,true,Merit-based aid`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booth-import-template.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Booths from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to bulk import booth data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={downloadTemplate} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download CSV Template
        </Button>

        <div className="space-y-2">
          <Label htmlFor="booth-csv-file">CSV File</Label>
          <Input
            id="booth-csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isParsing || isImporting}
          />
        </div>

        {file && (
          <Button onClick={handlePreview} disabled={isParsing} className="w-full">
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Parsing...
              </>
            ) : (
              'Preview Data'
            )}
          </Button>
        )}

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ScrollArea className="h-32 w-full">
                <ul className="text-sm space-y-1">
                  {validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </ScrollArea>
            </AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && (
          <div className="space-y-2">
            <Label>Preview ({previewData.length} valid rows)</Label>
            <ScrollArea className="h-48 w-full border rounded-md p-4">
              <div className="space-y-2">
                {previewData.slice(0, 5).map((row, i) => (
                  <div key={i} className="text-sm border-b pb-2">
                    <p className="font-semibold">{row.booth_number} - {row.org_name}</p>
                    <p className="text-muted-foreground">{row.org_type} | {row.tier || 'bronze'}</p>
                  </div>
                ))}
                {previewData.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    ...and {previewData.length - 5} more rows
                  </p>
                )}
              </div>
            </ScrollArea>

            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import {previewData.length} Booths
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
