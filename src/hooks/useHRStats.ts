import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  activeDepartments: number;
  pendingTasks: number;
  overdueTasks: number;
  newHiresThisMonth: number;
  documentsUploadedThisMonth: number;
}

export function useHRStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['hr-stats'],
    queryFn: async () => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total and active employees
      const { data: employees } = await supabase
        .from('employees')
        .select('status, start_date');

      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
      const onLeaveEmployees = employees?.filter(e => e.status === 'on-leave').length || 0;
      const newHiresThisMonth = employees?.filter(e => 
        new Date(e.start_date) >= firstDayOfMonth
      ).length || 0;

      // Active departments
      const { data: departments } = await supabase
        .from('departments')
        .select('id')
        .eq('is_active', true);
      const activeDepartments = departments?.length || 0;

      // Onboarding tasks
      const { data: tasks } = await supabase
        .from('hr_onboarding')
        .select('is_completed, due_date');

      const pendingTasks = tasks?.filter(t => !t.is_completed).length || 0;
      const overdueTasks = tasks?.filter(t => 
        !t.is_completed && t.due_date && new Date(t.due_date) < now
      ).length || 0;

      // Documents uploaded this month
      const { data: documents } = await supabase
        .from('employee_documents')
        .select('created_at')
        .gte('created_at', firstDayOfMonth.toISOString());
      const documentsUploadedThisMonth = documents?.length || 0;

      return {
        totalEmployees,
        activeEmployees,
        onLeaveEmployees,
        activeDepartments,
        pendingTasks,
        overdueTasks,
        newHiresThisMonth,
        documentsUploadedThisMonth,
      } as HRStats;
    },
  });

  return { stats, isLoading, error };
}
