import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useEvents } from "@/hooks/useEvents";
import { useBooths } from "@/hooks/useBooths";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid, MapPin, Save, Repeat, Move } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BoothGridSelector } from "./BoothGridSelector";
import { BulkMoveDialog } from "./BulkMoveDialog";
import { LayoutCopier } from "./LayoutCopier";
import { ZoneManager } from "./ZoneManager";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import {
  GridPosition,
  gridToCoordinates,
  getGridLabel,
  findNextAvailableCell,
} from "@/hooks/useGridPositioning";

export const BoothListEditor = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBoothId, setEditingBoothId] = useState<string | null>(null);
  const [selectedGridPosition, setSelectedGridPosition] = useState<GridPosition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [swapMode, setSwapMode] = useState(false);
  const [firstBoothId, setFirstBoothId] = useState<string | null>(null);
  const [selectedBooths, setSelectedBooths] = useState<Set<string>>(new Set());
  const [showBulkMove, setShowBulkMove] = useState(false);
  
  const { isMobile } = useMobileDetection();

  const { events } = useEvents();
  const { data: booths, refetch: refetchBooths } = useBooths(selectedEvent || null);
  
  // Get venue_id from selected event
  const selectedEventData = events?.find((e) => e.id === selectedEvent);
  const venueId = selectedEventData?.venue?.id || null;
  const { data: floorPlans } = useFloorPlans(venueId);
  const floorPlan = floorPlans?.[0] || null;

  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];

  const filteredBooths = useMemo(() => {
    if (!booths) return [];
    return booths.filter(
      (booth) =>
        booth.table_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.org_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [booths, searchQuery]);

  const occupiedGridPositions = useMemo((): GridPosition[] => {
    if (!booths) return [];
    return booths
      .filter((b: any) => b.grid_row !== null && b.grid_col !== null)
      .map((b: any) => ({ row: b.grid_row!, col: b.grid_col! }));
  }, [booths]);

  const handleSavePosition = async (boothId: string) => {
    if (!selectedGridPosition) {
      toast.error("Please select a grid position");
      return;
    }

    setIsSaving(true);
    const coords = gridToCoordinates(selectedGridPosition);

    try {
      const { error } = await supabase
        .from("booths")
        .update({
          grid_row: selectedGridPosition.row,
          grid_col: selectedGridPosition.col,
          x_position: coords.x,
          y_position: coords.y,
        })
        .eq("id", boothId);

      if (error) throw error;

      toast.success(`Booth positioned at ${getGridLabel(selectedGridPosition)}`);
      setEditingBoothId(null);
      setSelectedGridPosition(null);
      refetchBooths();
    } catch (error: any) {
      console.error("Error updating booth position:", error);
      toast.error("Failed to update booth position");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoAssign = async (boothId: string) => {
    const nextCell = findNextAvailableCell(occupiedGridPositions);
    if (!nextCell) {
      toast.error("No available grid cells");
      return;
    }

    setIsSaving(true);
    const coords = gridToCoordinates(nextCell);

    try {
      const { error } = await supabase
        .from("booths")
        .update({
          grid_row: nextCell.row,
          grid_col: nextCell.col,
          x_position: coords.x,
          y_position: coords.y,
        })
        .eq("id", boothId);

      if (error) throw error;

      toast.success(`Booth auto-assigned to ${getGridLabel(nextCell)}`);
      refetchBooths();
    } catch (error: any) {
      console.error("Error auto-assigning booth:", error);
      toast.error("Failed to auto-assign booth");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoArrangeAll = async () => {
    if (!booths || booths.length === 0) {
      toast.error("No booths to arrange");
      return;
    }

    setIsSaving(true);
    const updates = [];

    for (let i = 0; i < booths.length; i++) {
      const row = Math.floor(i / 12); // 12 columns
      const col = i % 12;
      
      if (row >= 8) break; // Only 8 rows available

      const coords = gridToCoordinates({ row, col });
      updates.push({
        id: booths[i].id,
        grid_row: row,
        grid_col: col,
        x_position: coords.x,
        y_position: coords.y,
      });
    }

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from("booths")
          .update({
            grid_row: update.grid_row,
            grid_col: update.grid_col,
            x_position: update.x_position,
            y_position: update.y_position,
          })
          .eq("id", update.id);

        if (error) throw error;
      }

      toast.success(`Auto-arranged ${updates.length} booths in grid layout`);
      refetchBooths();
    } catch (error: any) {
      console.error("Error auto-arranging booths:", error);
      toast.error("Failed to auto-arrange booths");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4">Booth List Editor</h2>
        <p className="text-muted-foreground mb-6">
          Position booths using the visual grid selector. Each cell represents a 100x100 pixel area.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Event</label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an expo event..." />
              </SelectTrigger>
              <SelectContent>
                {collegeExpos.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Search Booths</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Table number or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {selectedEvent && booths && booths.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Button 
              onClick={handleAutoArrangeAll} 
              variant="outline" 
              size="sm"
              disabled={isSaving}
            >
              <Grid className="w-4 h-4 mr-2" />
              Auto-Arrange All Booths
            </Button>
            <Badge variant="secondary">
              {filteredBooths.length} booth{filteredBooths.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </Card>

      {selectedEvent && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredBooths.map((booth: any) => {
            const currentGridPos =
              booth.grid_row !== null && booth.grid_col !== null
                ? { row: booth.grid_row, col: booth.grid_col }
                : null;

            return (
              <Card key={booth.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">
                      Booth #{booth.table_no || "N/A"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {booth.org_name}
                    </p>
                  </div>
                  <div className="text-sm">
                    {currentGridPos ? (
                      <Badge variant="secondary">
                        {getGridLabel(currentGridPos)}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Not positioned</Badge>
                    )}
                  </div>
                </div>

                {editingBoothId === booth.id ? (
                  <div className="space-y-3 mt-3 pt-3 border-t">
                    <BoothGridSelector
                      selectedPosition={selectedGridPosition}
                      occupiedPositions={occupiedGridPositions.filter(
                        (pos) => pos.row !== currentGridPos?.row || pos.col !== currentGridPos?.col
                      )}
                      onSelectPosition={setSelectedGridPosition}
                      backgroundImageUrl={floorPlan?.background_image_url || undefined}
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSavePosition(booth.id)}
                        size="sm"
                        disabled={!selectedGridPosition || isSaving}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? "Saving..." : "Save Position"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBoothId(null);
                          setSelectedGridPosition(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBoothId(booth.id);
                        setSelectedGridPosition(currentGridPos);
                      }}
                      className="flex-1"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Edit Position
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAutoAssign(booth.id)}
                      disabled={isSaving}
                    >
                      Auto-Assign
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {selectedEvent && filteredBooths.length === 0 && (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">
            {searchQuery ? "No booths found matching your search" : "No booths for this event"}
          </p>
        </Card>
      )}
    </div>
  );
};
