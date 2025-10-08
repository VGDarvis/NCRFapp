import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { DataTable } from "@/components/admin/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function EmployeesTab() {
  const { employees, isLoading } = useEmployees();

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (row: any) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: (row: any) => row.departments?.name || "—",
    },
    {
      header: "Employment Type",
      accessorKey: "employment_type",
      cell: (row: any) => row.employment_type || "—",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => {
        const statusColors = {
          active: "bg-accent/20 text-accent",
          "on-leave": "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
          terminated: "bg-destructive/20 text-destructive",
        };
        return (
          <Badge className={statusColors[row.status as keyof typeof statusColors]}>
            {row.status}
          </Badge>
        );
      },
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      cell: (row: any) => format(new Date(row.start_date), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Employees</h2>
          <p className="text-sm text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <Button className="action-button">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading employees...</div>
        </div>
      ) : (
        <DataTable
          data={employees || []}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search employees..."
        />
      )}
    </div>
  );
}
