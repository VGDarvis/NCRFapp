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
import { Search, Grid, MapPin, Save, Repeat, Move, ChevronDown, Settings, FolderTree, Sparkles, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BoothGridSelector } from "./BoothGridSelector";
import { BulkMoveDialog } from "./BulkMoveDialog";
import { LayoutCopier } from "./LayoutCopier";
import { ZoneManager } from "./ZoneManager";
import { FloorPlanImageUpload } from "./FloorPlanImageUpload";
import { BoothFeaturesDrawer } from "./BoothFeaturesDrawer";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { cn } from "@/lib/utils";
import {
  GridPosition,
  gridToCoordinates,
  getGridLabel,
  findNextAvailableCell,
} from "@/hooks/useGridPositioning";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
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
  const [featuresDrawerBooth, setFeaturesDrawerBooth] = useState<any>(null);
  const [isFeaturesDrawerOpen, setIsFeaturesDrawerOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [deleteBoothId, setDeleteBoothId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { isMobile } = useMobileDetection();

  const { events } = useEvents();
  const { data: booths } = useBooths(selectedEvent || null);
  
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
          booth_width: 30,
          booth_depth: 30,
        })
        .eq("id", boothId);

      if (error) throw error;

      toast.success(`Booth positioned at ${getGridLabel(selectedGridPosition)}`, {
        id: "save-position",
        description: "All attendees will see this change immediately",
      });
      
      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });
      
      setEditingBoothId(null);
      setSelectedGridPosition(null);
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
      
      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });
      
      setSwapMode(false);
      setFirstBoothId(null);
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
      
      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });
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
      
      // Invalidate all booth queries to sync across all components
      await queryClient.invalidateQueries({ queryKey: ["booths"] });
    } catch (error: any) {
      console.error("Error auto-arranging booths:", error);
      toast.error("Failed to auto-arrange booths");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearPositions = async () => {
    if (selectedBooths.size === 0 || !selectedEvent) return;

    try {
      const boothIds = Array.from(selectedBooths);
      const updates = boothIds.map(boothId => ({
        id: boothId,
        grid_row: null,
        grid_col: null,
        x_position: null,
        y_position: null,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("booths")
          .update(update)
          .eq("id", update.id);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["booths"] });
      toast.success(`Cleared positions for ${boothIds.length} booth(s)`);
      setSelectedBooths(new Set());
      setShowClearDialog(false);
    } catch (error) {
      console.error("Error clearing positions:", error);
      toast.error("Failed to clear positions");
    }
  };

  const handleDeleteBooth = async () => {
    if (!deleteBoothId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("booths")
        .delete()
        .eq("id", deleteBoothId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["booths"] });
      toast.success("Booth deleted successfully");
      
      // Remove from selected booths if it was selected
      setSelectedBooths(prev => {
        const newSet = new Set(prev);
        newSet.delete(deleteBoothId);
        return newSet;
      });
      setDeleteBoothId(null);
    } catch (error) {
      console.error("Error deleting booth:", error);
      toast.error("Failed to delete booth");
    } finally {
      setIsDeleting(false);
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
                  variant="destructive"
                  size={isMobile ? "lg" : "sm"}
                  onClick={() => setShowClearDialog(true)}
                  disabled={isSaving}
                  className={cn(isMobile && "min-h-[48px]")}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Positions
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
            
            <div className="flex flex-wrap gap-2 ml-auto">
              <Badge variant="secondary" className="flex items-center">
                {filteredBooths.length} booth{filteredBooths.length !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                🎓 {booths.filter((b: any) => b.offers_on_spot_admission).length}
              </Badge>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                💰 {booths.filter((b: any) => b.scholarship_info).length}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                💳 {booths.filter((b: any) => b.waives_application_fee).length}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {selectedEvent && booths && booths.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Positioning Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Total Booths</span>
              <span className="text-2xl font-bold">{booths.length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Positioned</span>
              <span className="text-2xl font-bold text-green-600">
                {booths.filter((b: any) => b.grid_row !== null && b.grid_col !== null).length}
              </span>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${(booths.filter((b: any) => b.grid_row !== null && b.grid_col !== null).length / booths.length) * 100}%` 
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Unpositioned</span>
              <span className="text-2xl font-bold text-orange-600">
                {booths.filter((b: any) => b.grid_row === null || b.grid_col === null).length}
              </span>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all" 
                  style={{ 
                    width: `${(booths.filter((b: any) => b.grid_row === null || b.grid_col === null).length / booths.length) * 100}%` 
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Grid Coverage</span>
              <span className="text-2xl font-bold">
                {Math.round((booths.filter((b: any) => b.grid_row !== null && b.grid_col !== null).length / 96) * 100)}%
              </span>
              <span className="text-[10px] text-muted-foreground">of 96 cells used</span>
            </div>
          </div>
        </Card>
      )}

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
                      {/* Special Features Badges */}
                      {(booth.offers_on_spot_admission || booth.scholarship_info || booth.waives_application_fee) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {booth.offers_on_spot_admission && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                              🎓 On-Spot Admission
                            </Badge>
                          )}
                          {booth.scholarship_info && (
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
                              💰 Scholarships
                            </Badge>
                          )}
                          {booth.waives_application_fee && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                              💳 Fee Waiver
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {currentGridPos ? (
                      <>
                        <Badge variant="secondary" className="font-mono">
                          {getGridLabel(currentGridPos)}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          X:{booth.x_position || 0} Y:{booth.y_position || 0}
                        </span>
                      </>
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
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size={isMobile ? "lg" : "sm"}
                        onClick={() => {
                          setFeaturesDrawerBooth(booth);
                          setIsFeaturesDrawerOpen(true);
                        }}
                        className={cn("flex-1", isMobile && "min-h-[48px]")}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Edit Features
                      </Button>
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
                        Move Booth
                      </Button>
                    </div>
                    <Button
                      variant="secondary"
                      size={isMobile ? "lg" : "sm"}
                      onClick={() => handleAutoAssign(booth.id)}
                      disabled={isSaving}
                      className={cn("w-full", isMobile && "min-h-[48px]")}
                    >
                      Auto-Assign Position
                    </Button>
                    <Button
                      variant="outline"
                      size={isMobile ? "lg" : "sm"}
                      onClick={() => setDeleteBoothId(booth.id)}
                      className={cn("w-full text-destructive hover:text-destructive", isMobile && "min-h-[48px]")}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Booth
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
        onSuccess={async () => {
          setSelectedBooths(new Set());
          setShowBulkMove(false);
          // Invalidate all booth queries to sync across all components
          await queryClient.invalidateQueries({ queryKey: ["booths"] });
        }}
      />

      {featuresDrawerBooth && (
        <BoothFeaturesDrawer
          open={isFeaturesDrawerOpen}
          onOpenChange={setIsFeaturesDrawerOpen}
          boothId={featuresDrawerBooth.id}
          boothNumber={featuresDrawerBooth.table_no}
          organizationName={featuresDrawerBooth.org_name || "Unknown"}
          initialFeatures={{
            offers_on_spot_admission: featuresDrawerBooth.offers_on_spot_admission || false,
            scholarship_info: featuresDrawerBooth.scholarship_info,
            waives_application_fee: featuresDrawerBooth.waives_application_fee || false,
          }}
          onUpdate={async () => {
            // Invalidate all booth queries to sync across all components
            await queryClient.invalidateQueries({ queryKey: ["booths"] });
          }}
        />
      )}

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Booth Positions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the grid positions for {selectedBooths.size} selected booth(s). 
              They will appear as "Not positioned" and can be placed anywhere afterwards.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowClearDialog(false);
                handleClearPositions();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Clear Positions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteBoothId} onOpenChange={(open) => !open && setDeleteBoothId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booth?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete booth #{filteredBooths.find(b => b.id === deleteBoothId)?.table_no} - {filteredBooths.find(b => b.id === deleteBoothId)?.org_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteBooth}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Booth"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
