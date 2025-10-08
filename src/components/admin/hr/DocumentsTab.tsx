import { useEmployeeDocuments } from "@/hooks/useEmployeeDocuments";
import { DataTable } from "@/components/admin/shared/DataTable";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function DocumentsTab() {
  const { documents, isLoading } = useEmployeeDocuments();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const columns = [
    {
      header: "Document Name",
      accessorKey: "document_name",
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
      header: "Type",
      accessorKey: "document_type",
      cell: (row: any) => {
        const typeColors: Record<string, string> = {
          contract: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
          id: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
          tax_form: "bg-green-500/20 text-green-700 dark:text-green-400",
          certification: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
          review: "bg-pink-500/20 text-pink-700 dark:text-pink-400",
          other: "bg-muted",
        };
        return (
          <Badge className={typeColors[row.document_type] || typeColors.other}>
            {row.document_type}
          </Badge>
        );
      },
    },
    {
      header: "File Size",
      accessorKey: "file_size",
      cell: (row: any) => formatFileSize(row.file_size),
    },
    {
      header: "Uploaded By",
      accessorKey: "uploader",
      cell: (row: any) => row.uploader?.display_name || "—",
    },
    {
      header: "Upload Date",
      accessorKey: "created_at",
      cell: (row: any) => format(new Date(row.created_at), "MMM d, yyyy"),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.open(row.file_url, '_blank')}
        >
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Employee Documents</h2>
          <p className="text-sm text-muted-foreground">
            Manage employee documentation
          </p>
        </div>
        <Button className="action-button">
          <FileText className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading documents...</div>
        </div>
      ) : (
        <DataTable
          data={documents || []}
          columns={columns}
          searchKey="document_name"
          searchPlaceholder="Search documents..."
        />
      )}
    </div>
  );
}
