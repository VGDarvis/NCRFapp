import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useCSVParser } from '@/hooks/useCSVParser';
import { parseExhibitorCSV, detectOrgType, getSponsorTier, validateExhibitorRow, type ExhibitorCSVRow } from '@/lib/exhibitor-validation';
import { generateWebsiteURL } from '@/lib/website-finder-utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEvents } from '@/hooks/useEvents';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export const ExhibitorCSVImporter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ExhibitorCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const { parseCSV, isLoading: isParsing } = useCSVParser<any>();
  const { events } = useEvents();

  const houstonEvent = events?.find(e => 
    e.event_type === 'college_fair' && 
    e.start_at && new Date(e.start_at) > new Date()
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const result = await parseCSV(uploadedFile);

    const exhibitors: ExhibitorCSVRow[] = [];
    const errors: string[] = [];

    result.data.forEach((row: any, index: number) => {
      const exhibitor = parseExhibitorCSV(row);
      if (exhibitor) {
        const validation = validateExhibitorRow(exhibitor);
        if (validation.isValid) {
          exhibitors.push(exhibitor);
        } else {
          errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
        }
      }
    });

    setParsedData(exhibitors);
    setValidationErrors(errors);
  };

  const handleImport = async () => {
    if (!houstonEvent) {
      toast.error('No active event found for import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const venueId = houstonEvent.venue?.id;
      const floorPlanId = venueId ? await getFloorPlanId(venueId) : null;

      for (let i = 0; i < parsedData.length; i++) {
        const exhibitor = parsedData[i];
        const orgType = detectOrgType(exhibitor.organizationName);
        const sponsorTier = getSponsorTier(exhibitor.paymentStatus, exhibitor.paid);
        const websiteUrl = generateWebsiteURL(exhibitor.organizationName);

        await supabase.from('booths').insert({
          event_id: houstonEvent.id,
          venue_id: venueId,
          floor_plan_id: floorPlanId,
          org_name: exhibitor.organizationName,
          org_type: orgType,
          sponsor_tier: sponsorTier,
          table_no: exhibitor.boothNumber || null,
          contact_name: exhibitor.contactName,
          contact_email: exhibitor.email,
          contact_phone: exhibitor.phone,
          website_url: websiteUrl,
          offers_on_spot_admission: exhibitor.acceptingOnSpot,
          waives_application_fee: exhibitor.applicationFeesWaived,
          scholarship_info: exhibitor.scholarshipsOnSpot ? 'Available on-spot' : null,
          booth_width: 40,
          booth_depth: 40,
          latitude: 29.6847,
          longitude: -95.4107,
          x_position: null,
          y_position: null,
        });

        setImportProgress(((i + 1) / parsedData.length) * 100);
      }

      toast.success(`Successfully imported ${parsedData.length} exhibitors`);
      setParsedData([]);
      setFile(null);
    } catch (error: any) {
      toast.error('Import failed', { description: error.message });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const getFloorPlanId = async (venueId: string) => {
    const { data } = await supabase
      .from('floor_plans')
      .select('id')
      .eq('venue_id', venueId)
      .limit(1)
      .single();
    return data?.id || null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Import Exhibitors from CSV</h3>
              <p className="text-sm text-muted-foreground">
                Upload your exhibitor list to automatically create booth entries
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isParsing || isImporting}
              />
              <Button
                variant="outline"
                className="w-full"
                disabled={isParsing || isImporting}
                asChild
              >
                <span>
                  <FileText className="w-4 h-4 mr-2" />
                  {file ? file.name : 'Choose CSV File'}
                </span>
              </Button>
            </label>

            <Button
              variant="outline"
              onClick={() => window.open('/datasets/houston_booths.csv', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>

          {isParsing && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>Parsing CSV file...</AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <Alert>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <AlertDescription>
                <strong>{parsedData.length}</strong> valid exhibitors found
                {validationErrors.length > 0 && (
                  <span className="text-destructive ml-2">
                    ({validationErrors.length} errors)
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {validationErrors.map((error, i) => (
                <p key={i} className="text-sm text-destructive">{error}</p>
              ))}
            </div>
          )}

          {isImporting && (
            <div className="space-y-2">
              <Progress value={importProgress} />
              <p className="text-sm text-muted-foreground text-center">
                Importing... {Math.round(importProgress)}%
              </p>
            </div>
          )}

          {parsedData.length > 0 && !isImporting && (
            <Button 
              onClick={handleImport} 
              className="w-full"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import {parsedData.length} Exhibitors
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
