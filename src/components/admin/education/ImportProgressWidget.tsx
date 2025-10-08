import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { ImportJob, useImportJobs } from "@/hooks/useImportJobs";

interface ImportProgressWidgetProps {
  job: ImportJob;
}

export function ImportProgressWidget({ job }: ImportProgressWidgetProps) {
  const { cancelJob } = useImportJobs();
  
  const progress = job.total_records > 0 
    ? Math.round((job.processed_records / job.total_records) * 100)
    : 0;

  const successCount = job.processed_records - job.failed_records;
  
  // Calculate ETA (rough estimate based on current progress)
  const getETA = () => {
    if (!job.started_at || job.processed_records === 0) return "Calculating...";
    
    const elapsed = Date.now() - new Date(job.started_at).getTime();
    const rate = job.processed_records / elapsed;
    const remaining = job.total_records - job.processed_records;
    const etaMs = remaining / rate;
    
    const seconds = Math.round(etaMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)}m`;
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {job.status === "in_progress" && (
            <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
          )}
          {job.status === "completed" && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {job.status === "failed" && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium">
            Importing {job.job_type === "schools" ? "Schools" : "Youth Services"}
          </span>
        </div>
        
        {job.status === "in_progress" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => cancelJob.mutate(job.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Progress value={progress} className="h-2" />
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {job.processed_records} / {job.total_records} records
        </span>
        {job.status === "in_progress" && (
          <span>ETA: {getETA()}</span>
        )}
      </div>

      {(job.status === "completed" || job.status === "failed") && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-600">
            ✓ {successCount} succeeded
          </span>
          {job.failed_records > 0 && (
            <span className="text-red-600">
              ✗ {job.failed_records} failed
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
