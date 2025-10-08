import { useState } from "react";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";
import { DataTable } from "../shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Copy, Edit } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TemplatesTab() {
  const [filters, setFilters] = useState({
    templateType: "",
    category: "",
    isActive: undefined as boolean | undefined,
    search: "",
  });

  const { templates, isLoading, deleteTemplate, updateTemplate, isDeleting } = useMessageTemplates(filters);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "template_name",
      header: "Template Name",
    },
    {
      accessorKey: "template_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("template_type") as string;
        return (
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return category ? (
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "usage_count",
      header: "Usage",
      cell: ({ row }) => {
        const count = row.getValue("usage_count") as number;
        return <span className="font-medium">{count || 0}</span>;
      },
    },
    {
      accessorKey: "last_used",
      header: "Last Used",
      cell: ({ row }) => {
        const date = row.getValue("last_used");
        return date ? format(new Date(date as string), "MMM dd, yyyy") : "Never";
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        const template = row.original;
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => updateTemplate({ id: template.id, updates: { is_active: checked } })}
            />
            <span className="text-sm">{isActive ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const template = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Preview">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Duplicate">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTemplate(template.id)}
              disabled={isDeleting}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner size="lg" text="Loading templates..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search templates..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-sm"
          />
          <Select
            value={filters.templateType}
            onValueChange={(value) => setFilters({ ...filters, templateType: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Template Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="recruitment">Recruitment</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.isActive === undefined ? "" : filters.isActive ? "active" : "inactive"}
            onValueChange={(value) =>
              setFilters({ ...filters, isActive: value === "" ? undefined : value === "active" })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <DataTable columns={columns} data={templates} searchKey="template_name" />
    </div>
  );
}
