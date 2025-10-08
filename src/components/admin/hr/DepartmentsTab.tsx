import { useDepartments } from "@/hooks/useDepartments";
import { DataTable } from "@/components/admin/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DepartmentsTab() {
  const { departments, isLoading } = useDepartments();

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Manager",
      accessorKey: "manager",
      cell: (row: any) => 
        row.manager 
          ? `${row.manager.first_name} ${row.manager.last_name}` 
          : "—",
    },
    {
      header: "Employee Count",
      accessorKey: "employee_count",
      cell: (row: any) => row.employee_count || 0,
    },
    {
      header: "Status",
      accessorKey: "is_active",
      cell: (row: any) => (
        <Badge className={row.is_active ? "bg-accent/20 text-accent" : "bg-muted"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row: any) => row.description || "—",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Departments</h2>
          <p className="text-sm text-muted-foreground">
            Manage organizational departments
          </p>
        </div>
        <Button className="action-button">
          <Building2 className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading departments...</div>
        </div>
      ) : (
        <DataTable
          data={departments || []}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search departments..."
        />
      )}
    </div>
  );
}
