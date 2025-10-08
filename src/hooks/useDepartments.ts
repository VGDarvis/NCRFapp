import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Department {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  employee_count?: number;
  manager?: {
    first_name: string;
    last_name: string;
  } | null;
}

export function useDepartments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data: depts, error: deptsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (deptsError) throw deptsError;

      // Get manager details separately
      const managerIds = depts.filter(d => d.manager_id).map(d => d.manager_id!);
      const { data: managers } = await supabase
        .from('employees')
        .select('id, first_name, last_name')
        .in('id', managerIds);

      const managerMap = new Map(managers?.map(m => [m.id, m]) || []);

      // Get employee counts for each department
      const { data: counts, error: countsError } = await supabase
        .from('employees')
        .select('department_id')
        .not('department_id', 'is', null);

      if (countsError) throw countsError;

      const countMap = counts.reduce((acc, emp) => {
        acc[emp.department_id!] = (acc[emp.department_id!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return depts.map(dept => ({
        ...dept,
        employee_count: countMap[dept.id] || 0,
        manager: dept.manager_id ? managerMap.get(dept.manager_id) || null : null,
      })) as Department[];
    },
  });

  const createDepartment = useMutation({
    mutationFn: async (department: Partial<Department>) => {
      const { employee_count, manager, ...insertData } = department as any;
      const { data, error } = await supabase
        .from('departments')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
      toast({
        title: "Success",
        description: "Department created successfully",
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

  const updateDepartment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Department> & { id: string }) => {
      const { employee_count, manager, ...updateData } = updates as any;
      const { data, error } = await supabase
        .from('departments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: "Success",
        description: "Department updated successfully",
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

  const deleteDepartment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
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
    departments,
    isLoading,
    error,
    createDepartment: createDepartment.mutate,
    updateDepartment: updateDepartment.mutate,
    deleteDepartment: deleteDepartment.mutate,
    isCreating: createDepartment.isPending,
    isUpdating: updateDepartment.isPending,
    isDeleting: deleteDepartment.isPending,
  };
}
