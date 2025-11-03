import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface ExhibitorRow {
  org_name: string;
  org_type?: string;
  website_url?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  offers_on_spot_admission?: boolean | string;
  waives_application_fee?: boolean | string;
  scholarship_info?: string;
}

export const ExhibitorCSVImporter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ExhibitorRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{ created: number; updated: number; skipped: number } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setImportResults(null);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        const data = results.data as ExhibitorRow[];

        data.forEach((row, index) => {
          if (!row.org_name || row.org_name.trim() === '') {
            errors.push(`Row ${index + 2}: Missing organization name`);
          }
        });

        setParsedData(data);
        setValidationErrors(errors);

        if (errors.length === 0) {
          toast.success(`Parsed ${data.length} exhibitors successfully`);
        } else {
          toast.error(`Found ${errors.length} validation errors`);
        }
      },
      error: (error) => {
        toast.error('Failed to parse CSV', { description: error.message });
      },
    });
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('No data to import');
      return;
    }

    setImporting(true);
    setProgress(0);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    try {
      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        
        // Check if exhibitor already exists
        const { data: existing } = await supabase
          .from('exhibitors')
          .select('id')
          .eq('org_name', row.org_name)
          .single();

        const exhibitorData = {
          org_name: row.org_name.trim(),
          org_type: row.org_type || 'college',
          website_url: row.website_url?.trim() || null,
          description: row.description?.trim() || null,
          contact_name: row.contact_name?.trim() || null,
          contact_email: row.contact_email?.trim() || null,
          contact_phone: row.contact_phone?.trim() || null,
          offers_on_spot_admission: row.offers_on_spot_admission === true || row.offers_on_spot_admission === 'true' || row.offers_on_spot_admission === 'yes',
          waives_application_fee: row.waives_application_fee === true || row.waives_application_fee === 'true' || row.waives_application_fee === 'yes',
          scholarship_info: row.scholarship_info?.trim() || null,
        };

        if (existing) {
          // Update existing exhibitor
          const { error } = await supabase
            .from('exhibitors')
            .update(exhibitorData)
            .eq('id', existing.id);

          if (error) {
            console.error(`Error updating ${row.org_name}:`, error);
            skipped++;
          } else {
            updated++;
          }
        } else {
          // Create new exhibitor
          const { error } = await supabase
            .from('exhibitors')
            .insert([exhibitorData]);

          if (error) {
            console.error(`Error creating ${row.org_name}:`, error);
            skipped++;
          } else {
            created++;
          }
        }

        setProgress(Math.round(((i + 1) / parsedData.length) * 100));
      }

      setImportResults({ created, updated, skipped });
      toast.success('Import completed', {
        description: `Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`,
      });
    } catch (error: any) {
      toast.error('Import failed', { description: error.message });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `org_name,org_type,website_url,description,contact_name,contact_email,contact_phone,offers_on_spot_admission,waives_application_fee,scholarship_info
"Example University","college","https://example.edu","A great university","John Doe","john@example.edu","555-1234","yes","yes","Full scholarships available"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exhibitor_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Exhibitors from CSV</CardTitle>
        <CardDescription>
          Bulk import exhibitors into the master directory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
            />
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              <div className="font-semibold">Validation Errors:</div>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {validationErrors.slice(0, 10).map((error, i) => (
                  <li key={i} className="text-sm">{error}</li>
                ))}
                {validationErrors.length > 10 && (
                  <li className="text-sm">... and {validationErrors.length - 10} more errors</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {parsedData.length > 0 && validationErrors.length === 0 && (
          <Alert>
            <CheckCircle2 className="w-4 h-4" />
            <AlertDescription>
              Ready to import {parsedData.length} exhibitors
            </AlertDescription>
          </Alert>
        )}

        {importing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Importing... {progress}%
            </p>
          </div>
        )}

        {importResults && (
          <Alert>
            <CheckCircle2 className="w-4 h-4" />
            <AlertDescription>
              <div className="font-semibold">Import Complete:</div>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Created: {importResults.created}</li>
                <li>Updated: {importResults.updated}</li>
                <li>Skipped: {importResults.skipped}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleImport}
          disabled={parsedData.length === 0 || validationErrors.length > 0 || importing}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Exhibitors
        </Button>
      </CardContent>
    </Card>
  );
};
