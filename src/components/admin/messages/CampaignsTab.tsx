import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { DataTable } from "../shared/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, Copy, Pause, Play } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export function CampaignsTab() {
  const [filters, setFilters] = useState({
    status: "",
    campaignType: "",
    search: "",
  });

  const { campaigns, isLoading, deleteCampaign, updateCampaign, isDeleting } = useCampaigns(filters);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "campaign_name",
      header: "Campaign Name",
    },
    {
      accessorKey: "campaign_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("campaign_type") as string;
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
          "in-progress": "default",
          completed: "default",
          paused: "secondary",
        };
        return (
          <Badge variant={variants[status] || "outline"} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "recipient_count",
      header: "Recipients",
    },
    {
      accessorKey: "sent_count",
      header: "Sent",
      cell: ({ row }) => {
        const sent = row.getValue("sent_count") as number;
        const total = row.original.recipient_count as number;
        const percentage = total > 0 ? (sent / total) * 100 : 0;
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>
                {sent} / {total}
              </span>
              <span className="text-muted-foreground">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "delivered_count",
      header: "Delivered",
    },
    {
      accessorKey: "opened_count",
      header: "Opened",
      cell: ({ row }) => {
        const opened = row.getValue("opened_count") as number;
        const delivered = row.original.delivered_count as number;
        const rate = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0";
        return (
          <div>
            {opened} <span className="text-muted-foreground">({rate}%)</span>
          </div>
        );
      },
    },
    {
      accessorKey: "clicked_count",
      header: "Clicked",
      cell: ({ row }) => {
        const clicked = row.getValue("clicked_count") as number;
        const delivered = row.original.delivered_count as number;
        const rate = delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0";
        return (
          <div>
            {clicked} <span className="text-muted-foreground">({rate}%)</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return format(new Date(date as string), "MMM dd, yyyy");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" title="View Details">
              <Eye className="h-4 w-4" />
            </Button>
            {campaign.status === "in-progress" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateCampaign({ id: campaign.id, updates: { status: "paused" } })}
                title="Pause"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            {campaign.status === "paused" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateCampaign({ id: campaign.id, updates: { status: "in-progress" } })}
                title="Resume"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" title="Duplicate">
              <Copy className="h-4 w-4" />
            </Button>
            {campaign.status === "draft" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteCampaign(campaign.id)}
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
        <LoadingSpinner size="lg" text="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search campaigns..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-sm"
          />
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.campaignType} onValueChange={(value) => setFilters({ ...filters, campaignType: value })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <DataTable columns={columns} data={campaigns} searchKey="campaign_name" />
    </div>
  );
}
