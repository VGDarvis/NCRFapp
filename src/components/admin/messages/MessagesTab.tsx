import { useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import { DataTable } from "../shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MessagesTab() {
  const [filters, setFilters] = useState({
    status: "all",
    messageType: "all",
    search: "",
  });

  const { messages, isLoading, deleteMessage, isDeleting } = useMessages(filters);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sent_at",
      header: "Date Sent",
      cell: ({ row }) => {
        const date = row.getValue("sent_at");
        return date ? format(new Date(date as string), "MMM dd, yyyy HH:mm") : "-";
      },
    },
    {
      accessorKey: "recipient_email",
      header: "Recipient",
      cell: ({ row }) => {
        return row.original.contact_name || row.original.recipient_email || row.original.recipient_phone || "-";
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => row.getValue("subject") || "(No subject)",
    },
    {
      accessorKey: "message_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("message_type") as string;
        return (
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          draft: "outline",
          scheduled: "secondary",
          sent: "default",
          delivered: "default",
          failed: "destructive",
          opened: "default",
          clicked: "default",
        };
        return (
          <Badge variant={variants[status] || "outline"} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "campaign_name",
      header: "Campaign",
      cell: ({ row }) => row.getValue("campaign_name") || "-",
    },
    {
      accessorKey: "opened_at",
      header: "Opened",
      cell: ({ row }) => {
        const opened = row.getValue("opened_at");
        return opened ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>;
      },
    },
    {
      accessorKey: "clicked_at",
      header: "Clicked",
      cell: ({ row }) => {
        const clicked = row.getValue("clicked_at");
        return clicked ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            {message.status === "draft" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMessage(message.id)}
                disabled={isDeleting}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search messages..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-sm"
        />
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.messageType} onValueChange={(value) => setFilters({ ...filters, messageType: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Message Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={messages} searchKey="subject" />
    </div>
  );
}
