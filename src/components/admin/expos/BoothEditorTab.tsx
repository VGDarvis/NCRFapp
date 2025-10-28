import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useBooths, type Booth } from "@/hooks/useBooths";
import { BoothEditDialog } from "./BoothEditDialog";

export function BoothEditorTab() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const { events, isLoading: eventsLoading } = useEvents();
  const { data: booths, isLoading: boothsLoading, refetch } = useBooths(selectedEventId);

  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];

  // Auto-select first event
  useEffect(() => {
    if (collegeExpos.length > 0 && !selectedEventId) {
      setSelectedEventId(collegeExpos[0].id);
    }
  }, [collegeExpos, selectedEventId]);

  const handleBoothUpdated = () => {
    refetch();
    setEditingBooth(null);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Event</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {eventsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                collegeExpos.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedEventId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Booths</h3>
              {boothsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>

            {boothsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : booths && booths.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left text-sm font-medium">Booth #</th>
                      <th className="p-3 text-left text-sm font-medium">Organization</th>
                      <th className="p-3 text-left text-sm font-medium">Sponsorship</th>
                      <th className="p-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booths.map((booth) => (
                      <tr key={booth.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-sm font-mono">{booth.table_no || "—"}</td>
                        <td className="p-3 text-sm">{booth.org_name || "No organization"}</td>
                        <td className="p-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            booth.sponsor_tier === "gold" ? "bg-yellow-100 text-yellow-800" :
                            booth.sponsor_tier === "silver" ? "bg-gray-100 text-gray-800" :
                            booth.sponsor_tier === "bronze" ? "bg-orange-100 text-orange-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {booth.sponsor_tier || "Standard"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBooth(booth)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No booths found for this event
              </div>
            )}
          </div>
        )}
      </div>

      {editingBooth && (
        <BoothEditDialog
          booth={editingBooth}
          open={!!editingBooth}
          onClose={() => setEditingBooth(null)}
          onBoothUpdated={handleBoothUpdated}
        />
      )}
    </Card>
  );
}
