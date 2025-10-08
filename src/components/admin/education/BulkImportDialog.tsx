import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet, AlertCircle, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useImportJobs } from "@/hooks/useImportJobs";
import { ImportProgressWidget } from "./ImportProgressWidget";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportDialog({ open, onOpenChange }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const [activeTab, setActiveTab] = useState("schools");
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  
  const { activeJobs, createJob, updateProgress } = useImportJobs();
  const BATCH_SIZE = 50;

  const downloadTemplate = (type: "schools" | "youth_services") => {
    if (type === "schools") {
      const csvContent = "school_name,school_type,city,state,address,zip_code,website,total_enrollment,tuition_in_state,tuition_out_state,acceptance_rate,student_faculty_ratio,academic_programs,athletic_programs\n";
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schools_import_template.csv";
      a.click();
    } else {
      const csvContent = "organization_name,service_type,city,state,address,contact_email,contact_phone,website,programs_offered,age_ranges,cost_info\n";
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "youth_services_import_template.csv";
      a.click();
    }
    toast.success("Template downloaded");
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || null;
      });
      data.push(row);
    }
    
    return data;
  };

  const validateSchoolRow = (row: any, rowNumber: number): string | null => {
    if (!row.school_name) return `Row ${rowNumber}: Missing school_name`;
    if (!row.school_type) return `Row ${rowNumber}: Missing school_type`;
    if (!row.city) return `Row ${rowNumber}: Missing city`;
    if (!row.state) return `Row ${rowNumber}: Missing state`;
    return null;
  };

  const validateYouthServiceRow = (row: any, rowNumber: number): string | null => {
    if (!row.organization_name) return `Row ${rowNumber}: Missing organization_name`;
    if (!row.service_type) return `Row ${rowNumber}: Missing service_type`;
    if (!row.city) return `Row ${rowNumber}: Missing city`;
    if (!row.state) return `Row ${rowNumber}: Missing state`;
    return null;
  };

  const checkDuplicates = async (rows: any[], table: string): Promise<Set<string>> => {
    const duplicates = new Set<string>();
    
    for (const row of rows) {
      const nameField = table === "school_database" ? "school_name" : "organization_name";
      const nameValue = table === "school_database" ? row.school_name : row.organization_name;
      
      const { data } = await supabase
        .from(table as any)
        .select("id")
        .eq(nameField, nameValue)
        .eq("city", row.city)
        .eq("state", row.state)
        .maybeSingle();
      
      if (data) {
        const key = `${nameValue}-${row.city}-${row.state}`;
        duplicates.add(key);
      }
    }
    
    return duplicates;
  };

  const quickStartTexas = async () => {
    setFile(null);
    setImporting(true);
    setErrors([]);
    setSuccessCount(0);
    setProgress(0);

    try {
      const response = await fetch("/datasets/texas_high_schools.csv");
      const text = await response.text();
      await processImport(text);
    } catch (error: any) {
      toast.error(`Quick Start failed: ${error.message}`);
      setImporting(false);
    }
  };

  const processImport = async (text: string) => {
    const rows = parseCSV(text);
    
    if (rows.length === 0) {
      toast.error("No data found in file");
      setImporting(false);
      return;
    }

    const validationErrors: string[] = [];
    const validRows: any[] = [];

    // Validate all rows
    rows.forEach((row, index) => {
      const error = activeTab === "schools" 
        ? validateSchoolRow(row, index + 2)
        : validateYouthServiceRow(row, index + 2);
      
      if (error) {
        validationErrors.push(error);
      } else {
        validRows.push(row);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setImporting(false);
      return;
    }

    // Create import job
    const job = await createJob.mutateAsync({
      job_type: activeTab,
      total_records: validRows.length,
      metadata: { filename: file?.name || "texas_quick_start" },
    });
    
    setCurrentJobId(job.id);
    
    await updateProgress.mutateAsync({
      jobId: job.id,
      processed: 0,
      failed: 0,
      status: "in_progress",
    });

    const table = activeTab === "schools" ? "school_database" : "youth_services_database";
    
    // Check for duplicates
    const duplicates = await checkDuplicates(validRows, table);
    
    // Filter out duplicates
    const nonDuplicateRows = validRows.filter(row => {
      const key = `${row.school_name || row.organization_name}-${row.city}-${row.state}`;
      return !duplicates.has(key);
    });

    if (duplicates.size > 0) {
      toast.info(`Skipping ${duplicates.size} duplicate records`);
    }

    // Batch import
    let imported = 0;
    let failed = 0;
    const errorLog: any[] = [];
    
    for (let i = 0; i < nonDuplicateRows.length; i += BATCH_SIZE) {
      const batch = nonDuplicateRows.slice(i, i + BATCH_SIZE);
      
      // Add metadata to each row
      const batchWithMetadata = batch.map(row => ({
        ...row,
        data_source: "bulk_import",
        verification_status: "pending",
      }));
      
      try {
        const { error } = await supabase.from(table).insert(batchWithMetadata);
        
        if (!error) {
          imported += batch.length;
        } else {
          failed += batch.length;
          errorLog.push({ batch: i / BATCH_SIZE, error: error.message });
          validationErrors.push(`Batch ${i / BATCH_SIZE + 1}: ${error.message}`);
        }
      } catch (err: any) {
        failed += batch.length;
        errorLog.push({ batch: i / BATCH_SIZE, error: err.message });
        validationErrors.push(`Batch ${i / BATCH_SIZE + 1}: ${err.message}`);
      }
      
      // Update progress
      const processed = imported + failed;
      setProgress(Math.round((processed / nonDuplicateRows.length) * 100));
      
      await updateProgress.mutateAsync({
        jobId: job.id,
        processed,
        failed,
        errorLog,
      });
    }

    // Complete job
    await updateProgress.mutateAsync({
      jobId: job.id,
      processed: imported + failed,
      failed,
      status: failed === nonDuplicateRows.length ? "failed" : "completed",
      errorLog,
    });

    setSuccessCount(imported);
    setErrors(validationErrors);
    
    if (imported > 0) {
      toast.success(`Successfully imported ${imported} records (${duplicates.size} duplicates skipped)`);
      setTimeout(() => {
        onOpenChange(false);
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Import failed - no records were imported");
    }
    
    setImporting(false);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    setErrors([]);
    setSuccessCount(0);
    setProgress(0);

    try {
      const text = await file.text();
      await processImport(text);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Data</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="youth_services">Youth Services</TabsTrigger>
          </TabsList>

          <TabsContent value="schools" className="space-y-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with school data. Download the template below to see the required format.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => downloadTemplate("schools")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              
              <Button
                variant="default"
                onClick={quickStartTexas}
                disabled={importing}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Quick Start (200 TX Schools)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="youth_services" className="space-y-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                Upload a CSV file with youth service data. Download the template below to see the required format.
              </AlertDescription>
            </Alert>

            <Button
              variant="outline"
              onClick={() => downloadTemplate("youth_services")}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          {activeJobs.length > 0 && (
            <div className="space-y-2">
              {activeJobs.map((job) => (
                <ImportProgressWidget key={job.id} job={job} />
              ))}
            </div>
          )}
          
          <div>
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={importing}
            />
          </div>

          {importing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Importing... {progress}%
              </p>
            </div>
          )}

          {successCount > 0 && (
            <Alert>
              <AlertDescription className="text-green-600">
                Successfully imported {successCount} records
              </AlertDescription>
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Import Errors:</p>
                <ul className="list-disc pl-4 space-y-1 max-h-40 overflow-y-auto">
                  {errors.slice(0, 10).map((error, i) => (
                    <li key={i} className="text-sm">{error}</li>
                  ))}
                  {errors.length > 10 && (
                    <li className="text-sm italic">...and {errors.length - 10} more errors</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {importing ? "Importing..." : "Import Data"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
