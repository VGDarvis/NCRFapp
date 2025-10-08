import { useOnboardingTasks } from "@/hooks/useOnboardingTasks";
import { DataTable } from "@/components/admin/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function OnboardingTab() {
  const { tasks, isLoading, updateTask } = useOnboardingTasks();

  const columns = [
    {
      header: "Complete",
      accessorKey: "is_completed",
      cell: (row: any) => (
        <Checkbox
          checked={row.is_completed}
          onCheckedChange={(checked) => {
            updateTask({ id: row.id, is_completed: checked as boolean });
          }}
        />
      ),
    },
    {
      header: "Employee",
      accessorKey: "employee",
      cell: (row: any) => 
        row.employees 
          ? `${row.employees.first_name} ${row.employees.last_name}` 
          : "—",
    },
    {
      header: "Task",
      accessorKey: "checklist_item",
    },
    {
      header: "Due Date",
      accessorKey: "due_date",
      cell: (row: any) => {
        if (!row.due_date) return "—";
        const dueDate = new Date(row.due_date);
        const isOverdue = dueDate < new Date() && !row.is_completed;
        return (
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {format(dueDate, "MMM d, yyyy")}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => {
        if (row.is_completed) {
          return <Badge className="bg-accent/20 text-accent">Completed</Badge>;
        }
        const isOverdue = row.due_date && new Date(row.due_date) < new Date();
        if (isOverdue) {
          return <Badge className="bg-destructive/20 text-destructive">Overdue</Badge>;
        }
        return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">Pending</Badge>;
      },
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: (row: any) => row.notes || "—",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Onboarding Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Track employee onboarding progress
          </p>
        </div>
        <Button className="action-button">
          <CheckSquare className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <DataTable
          data={tasks || []}
          columns={columns}
          searchKey="checklist_item"
          searchPlaceholder="Search tasks..."
        />
      )}
    </div>
  );
}
