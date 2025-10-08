import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ImportJob {
  id: string;
  job_type: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  total_records: number;
  processed_records: number;
  failed_records: number;
  error_log: any[];
  metadata: any;
  started_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useImportJobs() {
  const queryClient = useQueryClient();

  const { data: activeJobs, isLoading } = useQuery({
    queryKey: ["import-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("import_jobs")
        .select("*")
        .in("status", ["pending", "in_progress"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ImportJob[];
    },
  });

  const createJob = useMutation({
    mutationFn: async (params: {
      job_type: string;
      total_records: number;
      metadata?: any;
    }) => {
      const { data, error } = await supabase
        .from("import_jobs")
        .insert({
          job_type: params.job_type,
          status: "pending",
          total_records: params.total_records,
          metadata: params.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data as ImportJob;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["import-jobs"] });
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (params: {
      jobId: string;
      processed: number;
      failed: number;
      status?: string;
      errorLog?: any[];
    }) => {
      const updateData: any = {
        processed_records: params.processed,
        failed_records: params.failed,
        updated_at: new Date().toISOString(),
      };

      if (params.status) {
        updateData.status = params.status;
        if (params.status === "in_progress" && !activeJobs?.find(j => j.id === params.jobId)?.started_at) {
          updateData.started_at = new Date().toISOString();
        }
        if (params.status === "completed" || params.status === "failed") {
          updateData.completed_at = new Date().toISOString();
        }
      }

      if (params.errorLog) {
        updateData.error_log = params.errorLog;
      }

      const { error } = await supabase
        .from("import_jobs")
        .update(updateData)
        .eq("id", params.jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["import-jobs"] });
    },
  });

  const cancelJob = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("import_jobs")
        .update({ status: "cancelled", completed_at: new Date().toISOString() })
        .eq("id", jobId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["import-jobs"] });
      toast.success("Import cancelled");
    },
  });

  return {
    activeJobs: activeJobs || [],
    isLoading,
    createJob,
    updateProgress,
    cancelJob,
  };
}
