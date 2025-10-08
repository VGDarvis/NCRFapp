import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Download, X, List } from "lucide-react";
import { useCRMIntegration } from "@/hooks/useCRMIntegration";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedIds: string[];
  allResults: any[];
  onClearSelection: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  selectedIds,
  allResults,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const { addBulkSchoolsToCRM, isAddingToCRM } = useCRMIntegration();
  const { toast } = useToast();

  const selectedSchools = allResults.filter(r => selectedIds.includes(r.id));

  const handleBulkAddToCRM = async () => {
    const result = await addBulkSchoolsToCRM(selectedSchools);
    if (result.success) {
      onClearSelection();
    }
  };

  const handleExportCSV = () => {
    const headers = ["School Name", "Type", "City", "State", "Website", "Enrollment", "Contact Email"];
    const rows = selectedSchools.map(school => [
      school.school_name || school.organization_name,
      school.school_type || "N/A",
      school.city || "",
      school.state || "",
      school.website || "",
      school.total_enrollment || school.student_count || "",
      school.contact_email || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `school-finder-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${selectedCount} results to CSV`,
    });
  };

  return (
    <Card className="p-4 glass-light border-primary/40">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">
            {selectedCount} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleBulkAddToCRM}
            disabled={isAddingToCRM}
          >
            <Building2 className="w-4 h-4 mr-2" />
            {isAddingToCRM ? "Adding..." : "Add to CRM"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
