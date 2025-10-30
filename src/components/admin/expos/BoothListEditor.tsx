import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEvents } from "@/hooks/useEvents";
import { useBooths } from "@/hooks/useBooths";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid, MapPin, Save, Repeat, Move, ChevronDown, Settings, FolderTree } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BoothGridSelector } from "./BoothGridSelector";
import { BulkMoveDialog } from "./BulkMoveDialog";
import { LayoutCopier } from "./LayoutCopier";
import { ZoneManager } from "./ZoneManager";
import { FloorPlanImageUpload } from "./FloorPlanImageUpload";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { cn } from "@/lib/utils";
import {
  GridPosition,
  gridToCoordinates,
  getGridLabel,
  findNextAvailableCell,
} from "@/hooks/useGridPositioning";

// Haptic feedback helper
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

interface BoothListEditorProps {
  floorPlanId?: string | null;
}

export const BoothListEditor = ({ floorPlanId }: BoothListEditorProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("booth-low-high");
  const [editingBoothId, setEditingBoothId] = useState<string | null>(null);
  const [selectedGridPosition, setSelectedGridPosition] = useState<GridPosition | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [swapMode, setSwapMode] = useState(false);
  const [firstBoothId, setFirstBoothId] = useState<string | null>(null);
  const [selectedBooths, setSelectedBooths] = useState<Set<string>>(new Set());
  const [showBulkMove, setShowBulkMove] = useState(false);
  const [floorPlanSettingsOpen, setFloorPlanSettingsOpen] = useState(false);
  const [zoneManagerOpen, setZoneManagerOpen] = useState(false);
  
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
    
    // Filter by search query
    let filtered = booths.filter(
      (booth) =>
        booth.table_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booth.org_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort based on selected option
    switch (sortOption) {
      case "booth-low-high":
        filtered.sort((a, b) => {
          const numA = parseInt(a.table_no || "0");
          const numB = parseInt(b.table_no || "0");
          return numA - numB;
        });
        break;
      case "booth-high-low":
        filtered.sort((a, b) => {
          const numA = parseInt(a.table_no || "0");
          const numB = parseInt(b.table_no || "0");
          return numB - numA;
        });
        break;
      case "org-a-z":
        filtered.sort((a, b) => 
          (a.org_name || "").localeCompare(b.org_name || "")
        );
        break;
      case "org-z-a":
        filtered.sort((a, b) => 
          (b.org_name || "").localeCompare(a.org_name || "")
        );
        break;
      case "unpositioned-first":
        filtered.sort((a, b) => {
          const aPositioned = a.grid_row !== null && a.grid_col !== null ? 1 : 0;
          const bPositioned = b.grid_row !== null && b.grid_col !== null ? 1 : 0;
          return aPositioned - bPositioned;
        });
        break;
    }
    
    return filtered;
  }, [booths, searchQuery, sortOption]);

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

    const coords = gridToCoordinates(selectedGridPosition);
    toast.loading("Saving position...", { id: "save-position" });

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

      toast.success(`Booth positioned at ${getGridLabel(selectedGridPosition)}`, {
        id: "save-position",
        description: "All attendees will see this change immediately",
      });
      
      setEditingBoothId(null);
      setSelectedGridPosition(null);
      refetchBooths();
    } catch (error: any) {
      console.error("Error updating booth position:", error);
      toast.error("Failed to update booth position", { id: "save-position" });
    }
  };

  const handleSwapBooths = async (secondBoothId: string) => {
    if (!firstBoothId) {
      toast.error("No first booth selected");
      return;
    }

    setIsSaving(true);

    try {
      const firstBooth = booths?.find((b) => b.id === firstBoothId);
      const secondBooth = booths?.find((b) => b.id === secondBoothId);

      if (!firstBooth || !secondBooth) {
        throw new Error("Booths not found");
      }

      const { error: error1 } = await supabase
        .from("booths")
        .update({
          grid_row: secondBooth.grid_row,
          grid_col: secondBooth.grid_col,
          x_position: secondBooth.x_position,
          y_position: secondBooth.y_position,
        })
        .eq("id", firstBoothId);

      const { error: error2 } = await supabase
        .from("booths")
        .update({
          grid_row: firstBooth.grid_row,
          grid_col: firstBooth.grid_col,
          x_position: firstBooth.x_position,
          y_position: firstBooth.y_position,
        })
        .eq("id", secondBoothId);

      if (error1 || error2) throw error1 || error2;

      toast.success(`Swapped Booth #${firstBooth.table_no} ↔ Booth #${secondBooth.table_no}`);
      setSwapMode(false);
      setFirstBoothId(null);
      refetchBooths();
    } catch (error: any) {
      console.error("Error swapping booths:", error);
      toast.error("Failed to swap booths");
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
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booth-low-high">Booth Number (Low to High)</SelectItem>
                <SelectItem value="booth-high-low">Booth Number (High to Low)</SelectItem>
                <SelectItem value="org-a-z">Organization (A-Z)</SelectItem>
                <SelectItem value="org-z-a">Organization (Z-A)</SelectItem>
                <SelectItem value="unpositioned-first">Position Status (Unpositioned First)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedEvent && booths && booths.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={swapMode ? "default" : "outline"}
              size={isMobile ? "lg" : "sm"}
              onClick={() => {
                setSwapMode(!swapMode);
                setFirstBoothId(null);
                setSelectedBooths(new Set());
                if (swapMode) {
                  toast.info("Swap mode disabled");
                } else {
                  toast.info("Swap mode enabled. Select two booths to swap positions.");
                }
              }}
              className={cn(isMobile && "min-h-[48px]")}
            >
              <Repeat className="w-4 h-4 mr-2" />
              {swapMode ? "Exit Swap Mode" : "Swap Booths"}
            </Button>

            {selectedBooths.size > 0 && (
              <>
                <Button
                  variant="default"
                  size={isMobile ? "lg" : "sm"}
                  onClick={() => setShowBulkMove(true)}
                  className={cn(isMobile && "min-h-[48px]")}
                >
                  <Move className="w-4 h-4 mr-2" />
                  Move {selectedBooths.size} Selected
                </Button>
                <Button
                  variant="ghost"
                  size={isMobile ? "lg" : "sm"}
                  onClick={() => setSelectedBooths(new Set())}
                  className={cn(isMobile && "min-h-[48px]")}
                >
                  Clear Selection
                </Button>
              </>
            )}

            {filteredBooths.length > 0 && !swapMode && (
              <Button
                variant="outline"
                size={isMobile ? "lg" : "sm"}
                onClick={() => {
                  if (selectedBooths.size === filteredBooths.length) {
                    setSelectedBooths(new Set());
                  } else {
                    setSelectedBooths(new Set(filteredBooths.map((b: any) => b.id)));
                  }
                }}
                className={cn(isMobile && "min-h-[48px]")}
              >
                {selectedBooths.size === filteredBooths.length ? "Deselect All" : "Select All"}
              </Button>
            )}

            <Button 
              onClick={handleAutoArrangeAll} 
              variant="outline" 
              size={isMobile ? "lg" : "sm"}
              disabled={isSaving}
              className={cn(isMobile && "min-h-[48px]")}
            >
              <Grid className="w-4 h-4 mr-2" />
              Auto-Arrange All
            </Button>
            
            <Badge variant="secondary" className="flex items-center">
              {filteredBooths.length} booth{filteredBooths.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </Card>

      {selectedEvent && floorPlanId && (
        <>
          <Collapsible open={floorPlanSettingsOpen} onOpenChange={setFloorPlanSettingsOpen}>
            <Card className="p-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Floor Plan Settings</h3>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-transform", floorPlanSettingsOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <FloorPlanImageUpload floorPlanId={floorPlanId} />
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={zoneManagerOpen} onOpenChange={setZoneManagerOpen}>
            <Card className="p-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Zone Management</h3>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 transition-transform", zoneManagerOpen && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <ZoneManager floorPlanId={floorPlanId} />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </>
      )}

      {selectedEvent && booths && booths.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Quick Tools</h3>
          <div className="space-y-4">
            <LayoutCopier
              targetEventId={selectedEvent}
              onSuccess={() => {
                refetchBooths();
                toast.success("Layout copied successfully!");
              }}
            />

            {floorPlan?.zones && Array.isArray(floorPlan.zones) && floorPlan.zones.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Assign to Zone</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Select booths above, then click a zone to auto-arrange them
                </p>
                <div className="flex flex-wrap gap-2">
                  {floorPlan.zones.map((zone: any) => (
                    <Button
                      key={zone.name}
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (selectedBooths.size === 0) {
                          toast.error("Select booths first");
                          return;
                        }
                        
                        const boothIds = Array.from(selectedBooths);
                        const startRow = zone.startRow;
                        const startCol = zone.startCol;
                        
                        toast.loading(`Assigning ${boothIds.length} booths to ${zone.name}...`, { id: "zone-assign" });
                        
                        try {
                          for (let i = 0; i < boothIds.length; i++) {
                            const row = startRow + Math.floor(i / zone.cols);
                            const col = startCol + (i % zone.cols);
                            
                            if (row >= startRow + zone.rows) break;
                            
                            const coords = gridToCoordinates({ row, col });
                            await supabase
                              .from("booths")
                              .update({
                                grid_row: row,
                                grid_col: col,
                                x_position: coords.x,
                                y_position: coords.y,
                              })
                              .eq("id", boothIds[i]);
                          }
                          
                          toast.success(`Assigned ${boothIds.length} booths to ${zone.name}`, { id: "zone-assign" });
                          setSelectedBooths(new Set());
                          refetchBooths();
                        } catch (error) {
                          toast.error("Failed to assign booths", { id: "zone-assign" });
                        }
                      }}
                      style={{ borderColor: zone.color }}
                    >
                      <div 
                        className="w-3 h-3 rounded mr-2" 
                        style={{ backgroundColor: zone.color }}
                      />
                      {zone.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {selectedEvent && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredBooths.map((booth: any) => {
            const currentGridPos =
              booth.grid_row !== null && booth.grid_col !== null
                ? { row: booth.grid_row, col: booth.grid_col }
                : null;

            return (
              <Card 
                key={booth.id} 
                className={cn(
                  "p-4 transition-all",
                  swapMode && firstBoothId === booth.id && "ring-2 ring-primary",
                  swapMode && "cursor-pointer hover:border-primary"
                )}
                onClick={() => {
                  if (swapMode) {
                    triggerHaptic();
                    if (!firstBoothId) {
                      setFirstBoothId(booth.id);
                      toast.info(`First booth selected: #${booth.table_no}. Now select second booth.`);
                    } else if (firstBoothId === booth.id) {
                      setFirstBoothId(null);
                      toast.info("First booth deselected");
                    } else {
                      handleSwapBooths(booth.id);
                    }
                  }
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    {!swapMode && (
                      <Checkbox
                        checked={selectedBooths.has(booth.id)}
                        onCheckedChange={(checked) => {
                          triggerHaptic();
                          const newSelected = new Set(selectedBooths);
                          if (checked) {
                            newSelected.add(booth.id);
                          } else {
                            newSelected.delete(booth.id);
                          }
                          setSelectedBooths(newSelected);
                        }}
                        className="mt-1"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        Booth #{booth.table_no || "N/A"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booth.org_name}
                      </p>
                    </div>
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

                {editingBoothId === booth.id && (
                  isMobile ? (
                    <Drawer 
                      open={true} 
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingBoothId(null);
                          setSelectedGridPosition(null);
                        }
                      }}
                    >
                      <DrawerContent className="max-h-[85vh]">
                        <DrawerHeader>
                          <DrawerTitle>
                            Position Booth #{booth.table_no}
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 overflow-y-auto">
                          <BoothGridSelector
                            selectedPosition={selectedGridPosition}
                            occupiedPositions={occupiedGridPositions.filter(
                              (pos) => pos.row !== currentGridPos?.row || pos.col !== currentGridPos?.col
                            )}
                            onSelectPosition={setSelectedGridPosition}
                            backgroundImageUrl={floorPlan?.background_image_url || undefined}
                            zones={floorPlan?.zones || []}
                            gridOpacity={floorPlan?.grid_opacity || 0.6}
                            booths={booths}
                          />
                        </div>
                        <div className="sticky bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2">
                          <Button
                            onClick={() => handleSavePosition(booth.id)}
                            size="lg"
                            disabled={!selectedGridPosition}
                            className="flex-1 min-h-[48px]"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Position
                          </Button>
                          <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => {
                              setEditingBoothId(null);
                              setSelectedGridPosition(null);
                            }}
                            className="min-h-[48px]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <div className="space-y-3 mt-3 pt-3 border-t">
                      <BoothGridSelector
                        selectedPosition={selectedGridPosition}
                        occupiedPositions={occupiedGridPositions.filter(
                          (pos) => pos.row !== currentGridPos?.row || pos.col !== currentGridPos?.col
                        )}
                        onSelectPosition={setSelectedGridPosition}
                        backgroundImageUrl={floorPlan?.background_image_url || undefined}
                        zones={floorPlan?.zones || []}
                        gridOpacity={floorPlan?.grid_opacity || 0.6}
                        booths={booths}
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSavePosition(booth.id)}
                          size="sm"
                          disabled={!selectedGridPosition}
                          className="flex-1"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save Position
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
                  )
                )}

                {editingBoothId !== booth.id && !swapMode && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size={isMobile ? "lg" : "sm"}
                      onClick={() => {
                        setEditingBoothId(booth.id);
                        setSelectedGridPosition(currentGridPos);
                      }}
                      className={cn("flex-1", isMobile && "min-h-[48px]")}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Edit Position
                    </Button>
                    <Button
                      variant="secondary"
                      size={isMobile ? "lg" : "sm"}
                      onClick={() => handleAutoAssign(booth.id)}
                      disabled={isSaving}
                      className={cn(isMobile && "min-h-[48px]")}
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

      <BulkMoveDialog
        open={showBulkMove}
        onClose={() => setShowBulkMove(false)}
        boothIds={Array.from(selectedBooths)}
        occupiedPositions={occupiedGridPositions}
        booths={booths || []}
        onSuccess={() => {
          setSelectedBooths(new Set());
          setShowBulkMove(false);
          refetchBooths();
        }}
      />
    </div>
  );
};
