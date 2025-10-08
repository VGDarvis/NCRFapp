import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle2 } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";
import { formatDistanceToNow } from "date-fns";

interface Task {
  id: string;
  checklist_item: string;
  due_date: string | null;
  is_completed: boolean;
  employee_id: string;
}

export function UpcomingTasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('hr_onboarding')
        .select('*')
        .eq('is_completed', false)
        .order('due_date', { ascending: true, nullsFirst: false })
        .limit(8);

      if (!error && data) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, checked: boolean) => {
    try {
      const { error } = await supabase
        .from('hr_onboarding')
        .update({ 
          is_completed: checked,
          completed_at: checked ? new Date().toISOString() : null 
        })
        .eq('id', taskId);

      if (!error) {
        setTasks((prev) => prev.map((task) =>
          task.id === taskId ? { ...task, is_completed: checked } : task
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (dueDate: string | null) => {
    if (!dueDate) return "secondary";
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "destructive";
    if (days <= 3) return "destructive";
    if (days <= 7) return "default";
    return "secondary";
  };

  return (
    <Card className="glass-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription>HR onboarding & pending items</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up!"
            description="No pending tasks at the moment"
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg glass-medium border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{task.checklist_item}</p>
                  {task.due_date && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
                <Badge variant={getPriorityColor(task.due_date)} className="text-xs">
                  {task.due_date ? (
                    Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) > 0
                      ? `${Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d`
                      : "Overdue"
                  ) : "No date"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
