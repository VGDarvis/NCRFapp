import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Loader2, Trash2, Plus } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useBooths, type Booth } from "@/hooks/useBooths";
import { BoothEditDialog } from "./BoothEditDialog";
import { BoothAddDialog } from "./BoothAddDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function BoothEditorTab() {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deletingBoothId, setDeletingBoothId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
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

  const handleDelete = async (booth: any) => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("id", booth.id);

      if (error) throw error;

      toast.success(`Booth #${booth.table_no} deleted successfully`);
      setDeletingBoothId(null);
      refetch();
    } catch (error) {
      console.error("Error deleting booth:", error);
      toast.error("Failed to delete booth");
    } finally {
      setDeleting(false);
    }
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
              <div className="flex items-center gap-2">
                {boothsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <Button onClick={() => setAddDialogOpen(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Booth
                </Button>
              </div>
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
                      <th className="p-3 text-right text-sm font-medium">Actions</th>
                      <th className="p-3 text-center text-sm font-medium w-20">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booths.map((booth) => (
                      <tr key={booth.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-sm font-mono">{booth.table_no || "—"}</td>
                        <td className="p-3 text-sm">{booth.org_name || "No organization"}</td>
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
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingBoothId(booth.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {addDialogOpen && (
        <BoothAddDialog
          eventId={selectedEventId}
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onBoothAdded={handleBoothUpdated}
        />
      )}

      <AlertDialog open={!!deletingBoothId} onOpenChange={(open) => !open && setDeletingBoothId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booth</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Booth #
              {booths?.find(b => b.id === deletingBoothId)?.table_no} (
              {booths?.find(b => b.id === deletingBoothId)?.org_name})? 
              This action cannot be undone and will remove the booth from all views including the floor plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const booth = booths?.find(b => b.id === deletingBoothId);
                if (booth) handleDelete(booth);
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
