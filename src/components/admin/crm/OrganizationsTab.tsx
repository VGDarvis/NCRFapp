import { useState } from "react";
import { Building2, Plus, Eye, Edit, Archive } from "lucide-react";
import { DataTable } from "@/components/admin/shared/DataTable";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCRMOrganizations } from "@/hooks/useCRMOrganizations";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";

export function OrganizationsTab() {
  const { organizations, isLoading } = useCRMOrganizations();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Organization Name",
    },
    {
      accessorKey: "organization_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("organization_type") || "N/A"}</Badge>
      ),
    },
    {
      accessorKey: "industry",
      header: "Industry",
    },
    {
      accessorKey: "partnership_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("partnership_status") as string;
        const variant = status === "partner" ? "default" : status === "prospect" ? "secondary" : "outline";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "contacts",
      header: "Contacts",
      cell: ({ row }) => {
        const contacts = row.getValue("contacts") as any[];
        return <span>{contacts?.[0]?.count || 0}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Loading organizations..." />;
  }

  if (!organizations || organizations.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No organizations yet"
        description="Start by adding your first organization to track partnerships"
        actionLabel="Add Organization"
        onAction={() => setShowAddDialog(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Organizations</h3>
        <Button onClick={() => setShowAddDialog(true)} className="action-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        searchKey="name"
        searchPlaceholder="Search organizations..."
      />
    </div>
  );
}
