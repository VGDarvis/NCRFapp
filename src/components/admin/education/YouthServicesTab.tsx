import { useState } from "react";
import { Users, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/components/admin/shared/DataTable";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useYouthServices } from "@/hooks/useYouthServices";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";
import { YouthServiceDialog } from "./YouthServiceDialog";

export function YouthServicesTab() {
  const { youthServices, isLoading, updateYouthService, deleteYouthService } = useYouthServices();
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this youth service?")) {
      deleteYouthService.mutate(id);
    }
  };

  const handleVerify = (id: string, verified: boolean) => {
    updateYouthService.mutate({ id, updates: { is_verified: !verified } });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "organization_name",
      header: "Organization",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.organization_name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.service_type}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.city}, {row.original.state}
        </span>
      ),
    },
    {
      accessorKey: "age_range",
      header: "Age Range",
      cell: ({ row }) => {
        const { min_age, max_age } = row.original;
        if (!min_age && !max_age) return <span className="text-muted-foreground">All ages</span>;
        return <span>{min_age || "0"} - {max_age || "18"} years</span>;
      },
    },
    {
      accessorKey: "programs_offered",
      header: "Programs",
      cell: ({ row }) => {
        const programs = row.original.programs_offered;
        if (!programs || programs.length === 0) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {programs.slice(0, 2).map((program: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                {program}
              </Badge>
            ))}
            {programs.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{programs.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "is_verified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? "default" : "secondary"}>
          {row.original.is_verified ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <XCircle className="w-3 h-3 mr-1" />
          )}
          {row.original.is_verified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVerify(row.original.id, row.original.is_verified)}
          >
            {row.original.is_verified ? "Unverify" : "Verify"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Loading youth services..." />;
  }

  if (!youthServices || youthServices.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No youth services yet"
        description="Add youth services to the database for AI search"
        actionLabel="Add Youth Service"
        onAction={() => {
          setEditingService(null);
          setShowDialog(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Youth Services Database</h3>
          <p className="text-sm text-muted-foreground">
            {youthServices.length} organizations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            setShowDialog(true);
          }}
          className="action-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Youth Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={youthServices}
        searchKey="organization_name"
        searchPlaceholder="Search youth services..."
      />

      <YouthServiceDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        service={editingService}
      />
    </div>
  );
}
