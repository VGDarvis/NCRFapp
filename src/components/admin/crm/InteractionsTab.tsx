import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { DataTable } from "@/components/admin/shared/DataTable";
import { EmptyState } from "@/components/admin/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCRMInteractions } from "@/hooks/useCRMInteractions";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export function InteractionsTab() {
  const { interactions, isLoading } = useCRMInteractions();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "interaction_date",
      header: "Date",
      cell: ({ row }) => (
        <span>{format(new Date(row.getValue("interaction_date")), "MMM d, yyyy")}</span>
      ),
    },
    {
      accessorKey: "interaction_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("interaction_type")}</Badge>
      ),
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
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const contact = row.getValue("contact") as any;
        if (!contact) return <span className="text-muted-foreground">N/A</span>;
        return <span>{`${contact.first_name} ${contact.last_name}`}</span>;
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "outcome",
      header: "Outcome",
      cell: ({ row }) => {
        const outcome = row.getValue("outcome") as string;
        if (!outcome) return <span className="text-muted-foreground">N/A</span>;
        return <Badge variant="secondary">{outcome}</Badge>;
      },
    },
    {
      accessorKey: "staff",
      header: "Staff",
      cell: ({ row }) => {
        const staff = row.getValue("staff") as any;
        return <span>{staff?.display_name || "N/A"}</span>;
      },
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Loading interactions..." />;
  }

  if (!interactions || interactions.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No interactions logged"
        description="Start tracking your outreach interactions"
        actionLabel="Log Interaction"
        onAction={() => setShowAddDialog(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interactions</h3>
        <Button onClick={() => setShowAddDialog(true)} className="action-button">
          <Plus className="w-4 h-4 mr-2" />
          Log Interaction
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={interactions}
        searchKey="subject"
        searchPlaceholder="Search interactions..."
      />
    </div>
  );
}
