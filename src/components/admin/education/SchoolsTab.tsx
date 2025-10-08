import { useState } from "react";
import { School, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/components/admin/shared/DataTable";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSchools } from "@/hooks/useSchools";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";
import { SchoolDialog } from "./SchoolDialog";

export function SchoolsTab() {
  const { schools, isLoading, updateSchool, deleteSchool } = useSchools();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);

  const handleEdit = (school: any) => {
    setEditingSchool(school);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this school?")) {
      deleteSchool.mutate(id);
    }
  };

  const handleVerify = (id: string, verified: boolean) => {
    updateSchool.mutate({ id, updates: { is_verified: !verified } });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "School Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.school_type === "college" ? "College/University" : "High School"}
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
      accessorKey: "enrollment",
      header: "Enrollment",
      cell: ({ row }) => {
        const enrollment = row.original.enrollment;
        if (!enrollment) return <span className="text-muted-foreground">N/A</span>;
        return <span>{enrollment.toLocaleString()}</span>;
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
      accessorKey: "data_source",
      header: "Source",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.data_source}</Badge>
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
    return <LoadingSpinner text="Loading schools..." />;
  }

  if (!schools || schools.length === 0) {
    return (
      <EmptyState
        icon={School}
        title="No schools yet"
        description="Add schools to the database for AI search"
        actionLabel="Add School"
        onAction={() => {
          setEditingSchool(null);
          setShowDialog(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Schools Database</h3>
          <p className="text-sm text-muted-foreground">
            {schools.length} schools ({schools.filter(s => s.school_type === 'college').length} colleges, {schools.filter(s => s.school_type === 'high_school').length} high schools)
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingSchool(null);
            setShowDialog(true);
          }}
          className="action-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add School
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={schools}
        searchKey="name"
        searchPlaceholder="Search schools..."
      />

      <SchoolDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        school={editingSchool}
      />
    </div>
  );
}
