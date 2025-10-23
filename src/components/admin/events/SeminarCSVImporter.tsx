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
import { validateSeminarRow, SeminarCSVRow } from "@/lib/csv-validation";
import { parse } from "date-fns";

interface SeminarCSVImporterProps {
  eventId: string;
  venueId: string;
  eventDate: string;
  onImportComplete?: () => void;
}

export function SeminarCSVImporter({ eventId, venueId, eventDate, onImportComplete }: SeminarCSVImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<SeminarCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { parseCSV, isLoading: isParsing } = useCSVParser<SeminarCSVRow>();

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

    const result = await parseCSV(file, validateSeminarRow);
    
    if (result.errors.length > 0) {
      setValidationErrors(result.errors);
      toast.warning(`Found ${result.meta.invalidRows} invalid rows`);
    }
    
    setPreviewData(result.data);
    toast.success(`Parsed ${result.meta.validRows} valid rows`);
  };

  const parseTime = (timeStr: string, dateStr: string): string => {
    // Try to parse as "10:00 AM" format
    const timeMatch = timeStr.match(/^(0?[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3].toUpperCase();
      
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      
      return `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes}:00`;
    }
    
    // Try to parse as ISO format
    if (!isNaN(Date.parse(timeStr))) {
      return new Date(timeStr).toISOString();
    }
    
    throw new Error(`Invalid time format: ${timeStr}`);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('No valid data to import');
      return;
    }

    setIsImporting(true);

    try {
      const eventDateOnly = eventDate.split('T')[0];
      
      // Create rooms if they don't exist
      const uniqueRooms = [...new Set(previewData.map(row => row.room_name))];
      
      for (const roomName of uniqueRooms) {
        const { data: existing } = await supabase
          .from('seminar_rooms')
          .select('id')
          .eq('venue_id', venueId)
          .eq('room_name', roomName)
          .single();

        if (!existing) {
          await supabase
            .from('seminar_rooms')
            .insert({
              venue_id: venueId,
              room_name: roomName,
              amenities: ['projector', 'seating'],
            });
        }
      }

      // Fetch room IDs
      const { data: rooms } = await supabase
        .from('seminar_rooms')
        .select('id, room_name')
        .eq('venue_id', venueId)
        .in('room_name', uniqueRooms);

      const roomMap = new Map(rooms?.map(r => [r.room_name, r.id]) || []);

      // Create seminar sessions
      const sessionInserts = previewData.map((row) => ({
        event_id: eventId,
        room_id: roomMap.get(row.room_name),
        title: row.title,
        description: row.description,
        presenter_name: row.presenter_name,
        presenter_organization: row.presenter_org,
        start_time: parseTime(row.start_time, eventDateOnly),
        end_time: parseTime(row.end_time, eventDateOnly),
        category: row.category || 'general',
        registration_required: false,
      }));

      const { error: sessionError } = await supabase
        .from('seminar_sessions')
        .insert(sessionInserts);

      if (sessionError) throw sessionError;

      toast.success(`Successfully imported ${previewData.length} seminars!`);
      
      // Reset form
      setFile(null);
      setPreviewData([]);
      setValidationErrors([]);
      
      onImportComplete?.();
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import seminars');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `title,presenter_name,presenter_org,start_time,end_time,room_name,description,category
SAT Prep Strategies,Dr. Michael Chen,Princeton Review,10:00 AM,11:00 AM,Room A,Learn proven strategies to boost SAT scores,test_prep
FAFSA Workshop,Jennifer Rodriguez,Texas Education Agency,11:30 AM,12:30 PM,Room B,Step-by-step FAFSA completion guide,financial_aid`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seminar-import-template.csv';
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Seminars from CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to bulk import seminar schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={downloadTemplate} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download CSV Template
        </Button>

        <div className="space-y-2">
          <Label htmlFor="seminar-csv-file">CSV File</Label>
          <Input
            id="seminar-csv-file"
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
                    <p className="font-semibold">{row.title}</p>
                    <p className="text-muted-foreground">
                      {row.presenter_name} • {row.start_time} - {row.end_time} • {row.room_name}
                    </p>
                  </div>
                ))}
                {previewData.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    ...and {previewData.length - 5} more sessions
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
                  Import {previewData.length} Seminars
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
