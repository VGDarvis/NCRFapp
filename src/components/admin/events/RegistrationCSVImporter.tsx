import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Loader2, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useCSVParser } from "@/hooks/useCSVParser";
import { validateRegistrationRow, RegistrationCSVRow } from "@/lib/registration-csv-validation";

interface RegistrationCSVImporterProps {
  defaultEventId?: string;
  onImportComplete?: () => void;
}

export function RegistrationCSVImporter({ defaultEventId, onImportComplete }: RegistrationCSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<RegistrationCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { parseCSV, isLoading: isParsing } = useCSVParser<RegistrationCSVRow>();

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

    const result = await parseCSV(file, validateRegistrationRow);
    
    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
      toast.warning(`Found ${result.meta.invalidRows} invalid rows`);
    }
    
    setPreviewData(result.data);
    
    const withCheckIns = result.data.filter(row => row.checked_in_at).length;
    toast.success(`Parsed ${result.meta.validRows} valid registrations (${withCheckIns} with check-in timestamps)`);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('No valid data to import');
      return;
    }

    setIsImporting(true);

    try {
      const registrationInserts = previewData.map((row) => ({
        event_id: row.event_id,
        email: row.email.trim().toLowerCase(),
        first_name: row.first_name.trim(),
        last_name: row.last_name.trim(),
        phone: row.phone?.trim() || null,
        school_name: row.school_name?.trim() || null,
        grade_level: row.grade_level?.trim() || null,
        graduation_year: row.graduation_year ? parseInt(row.graduation_year) : null,
        checked_in_at: row.checked_in_at || null,
        status: row.status?.toLowerCase() || 'confirmed',
        qr_code: crypto.randomUUID(), // Generate unique QR code
      }));

      const { data, error } = await supabase
        .from('registrations')
        .insert(registrationInserts)
        .select();

      if (error) throw error;

      const totalImported = data?.length || 0;
      const checkedInCount = data?.filter(r => r.checked_in_at).length || 0;

      toast.success(
        `Successfully imported ${totalImported} registrations! ${checkedInCount} with historical check-in data.`
      );
      
      // Reset form
      setFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      
      onImportComplete?.();
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import registrations');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'event_id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'school_name',
      'grade_level',
      'graduation_year',
      'checked_in_at',
      'status'
    ];
    
    const exampleRows = [
      [
        defaultEventId || 'your-event-uuid-here',
        'student@example.com',
        'John',
        'Doe',
        '555-123-4567',
        'Example High School',
        '12th',
        '2025',
        '2024-11-15T14:30:00Z',
        'confirmed'
      ],
      [
        defaultEventId || 'your-event-uuid-here',
        'jane.smith@example.com',
        'Jane',
        'Smith',
        '555-987-6543',
        'Another High School',
        '11th',
        '2026',
        '2024-11-15T15:45:00Z',
        'confirmed'
      ]
    ];

    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registration_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Registrations from CSV</CardTitle>
        <CardDescription>
          Bulk import registration data with historical check-in timestamps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Key Fields:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• <strong>event_id</strong>: UUID of the event</li>
              <li>• <strong>email, first_name, last_name</strong>: Required attendee info</li>
              <li>• <strong>checked_in_at</strong>: ISO timestamp (e.g., 2024-11-15T14:30:00Z) for historical scans</li>
              <li>• <strong>phone, school_name, grade_level, graduation_year</strong>: Optional fields</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="csv-upload">Upload CSV File</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isParsing || isImporting}
          />
        </div>

        {file && (
          <Button
            onClick={handlePreview}
            disabled={isParsing || isImporting}
            className="w-full gap-2"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing CSV...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Preview & Validate
              </>
            )}
          </Button>
        )}

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Validation Errors ({validationErrors.length}):</strong>
              <ScrollArea className="h-32 mt-2">
                <ul className="space-y-1 text-xs">
                  {validationErrors.slice(0, 20).map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                  {validationErrors.length > 20 && (
                    <li>... and {validationErrors.length - 20} more errors</li>
                  )}
                </ul>
              </ScrollArea>
            </AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && (
          <>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Ready to Import:</strong>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• {previewData.length} total registrations</li>
                  <li>• {previewData.filter(r => r.checked_in_at).length} with check-in timestamps</li>
                  <li>• {previewData.filter(r => !r.checked_in_at).length} without check-ins (can scan later)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Preview (first 5 rows)</Label>
              <ScrollArea className="h-64 border rounded-md p-4">
                <div className="space-y-3">
                  {previewData.slice(0, 5).map((row, i) => (
                    <div key={i} className="text-xs space-y-1 pb-3 border-b last:border-0">
                      <div><strong>Name:</strong> {row.first_name} {row.last_name}</div>
                      <div><strong>Email:</strong> {row.email}</div>
                      {row.phone && <div><strong>Phone:</strong> {row.phone}</div>}
                      {row.school_name && <div><strong>School:</strong> {row.school_name}</div>}
                      {row.checked_in_at && (
                        <div className="text-green-600 dark:text-green-400">
                          <strong>✓ Checked In:</strong> {new Date(row.checked_in_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="w-full gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing {previewData.length} Registrations...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Import {previewData.length} Registrations
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
