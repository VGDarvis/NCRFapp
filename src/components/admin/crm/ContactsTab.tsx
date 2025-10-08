import { useState } from "react";
import { Users, Plus, Eye, Edit, Mail, Phone } from "lucide-react";
import { DataTable } from "@/components/admin/shared/DataTable";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCRMContacts } from "@/hooks/useCRMContacts";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export function ContactsTab() {
  const { contacts, isLoading } = useCRMContacts();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "first_name",
      header: "Name",
      cell: ({ row }) => (
        <span>{`${row.original.first_name} ${row.original.last_name}`}</span>
      ),
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => {
        const org = row.getValue("organization") as any;
        return <span>{org?.name || "N/A"}</span>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        if (!phone) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm">{phone as string}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "active" ? "default" : "secondary";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "last_contact_date",
      header: "Last Contact",
      cell: ({ row }) => {
        const date = row.getValue("last_contact_date");
        if (!date) return <span className="text-muted-foreground">Never</span>;
        return <span>{format(new Date(date as string), "MMM d, yyyy")}</span>;
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
    return <LoadingSpinner text="Loading contacts..." />;
  }

  if (!contacts || contacts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No contacts yet"
        description="Add contacts to manage your relationships"
        actionLabel="Add Contact"
        onAction={() => setShowAddDialog(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Button onClick={() => setShowAddDialog(true)} className="action-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        searchKey="first_name"
        searchPlaceholder="Search contacts..."
      />
    </div>
  );
}
