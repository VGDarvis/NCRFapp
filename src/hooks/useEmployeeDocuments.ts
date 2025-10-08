import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_name: string;
  document_type: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  notes: string | null;
  created_at: string;
  employees?: {
    first_name: string;
    last_name: string;
  };
  uploader?: {
    display_name: string;
  } | null;
}

export function useEmployeeDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['employee-documents'],
    queryFn: async () => {
      const { data: docs, error } = await supabase
        .from('employee_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get employee details separately
      const employeeIds = [...new Set(docs.map(d => d.employee_id))];
      const { data: employees } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .in('id', employeeIds);

      // Get uploader details separately
      const uploaderIds = docs.filter(d => d.uploaded_by).map(d => d.uploaded_by!);
      const { data: uploaders } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', uploaderIds);

      const employeeMap = new Map(employees?.map(e => [e.id, e]) || []);
      const uploaderMap = new Map(uploaders?.map(u => [u.user_id, u]) || []);

      return docs.map(doc => ({
        ...doc,
        employees: employeeMap.get(doc.employee_id) || undefined,
        uploader: doc.uploaded_by ? uploaderMap.get(doc.uploaded_by) || null : null,
      })) as EmployeeDocument[];
    },
  });

  const uploadDocument = useMutation({
    mutationFn: async ({ file, metadata }: { 
      file: File; 
      metadata: Partial<EmployeeDocument> 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${metadata.employee_id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hr-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hr-documents')
        .getPublicUrl(fileName);

      // Create document record
      const { employees, uploader, ...insertMetadata } = metadata as any;
      const { data, error } = await supabase
        .from('employee_documents')
        .insert({
          ...insertMetadata,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      // Get document to find file URL
      const { data: doc } = await supabase
        .from('employee_documents')
        .select('file_url')
        .eq('id', id)
        .single();

      if (doc) {
        // Extract file path from URL
        const filePath = doc.file_url.split('/hr-documents/')[1];
        if (filePath) {
          await supabase.storage
            .from('hr-documents')
            .remove([filePath]);
        }
      }

      // Delete record
      const { error } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument: uploadDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    isUploading: uploadDocument.isPending,
    isDeleting: deleteDocument.isPending,
  };
}
