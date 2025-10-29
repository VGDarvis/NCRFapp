import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Save, Eye, Grid3x3, LayoutList, Columns } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useBooths } from "@/hooks/useBooths";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BoothQuickPosition } from "./BoothQuickPosition";

export const BoothListEditor = () => {
  const { events } = useEvents();
  const collegeExpos = events?.filter((e) => e.event_type === "college_fair") || [];
  
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBoothId, setEditingBoothId] = useState<string | null>(null);
  const [previewBoothId, setPreviewBoothId] = useState<string | null>(null);
  const [customX, setCustomX] = useState("");
  const [customY, setCustomY] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: booths, refetch } = useBooths(selectedEventId);

  const filteredBooths = useMemo(() => {
    if (!booths) return [];
    return booths.filter((booth) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        booth.table_no?.toLowerCase().includes(searchLower) ||
        booth.org_name?.toLowerCase().includes(searchLower)
      );
    });
  }, [booths, searchQuery]);

  const handleQuickPosition = async (boothId: string, x: number, y: number) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("booths")
        .update({ x_position: x, y_position: y })
        .eq("id", boothId);

      if (error) throw error;

      toast.success("Booth position updated");
      refetch();
      setEditingBoothId(null);
      setPreviewBoothId(null);
    } catch (error) {
      console.error("Error updating booth:", error);
      toast.error("Failed to update booth position");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomPosition = async (boothId: string) => {
    const x = parseFloat(customX);
    const y = parseFloat(customY);

    if (isNaN(x) || isNaN(y)) {
      toast.error("Please enter valid X and Y coordinates");
      return;
    }

    if (x < 0 || x > 1200 || y < 0 || y > 800) {
      toast.error("Position out of bounds (0-1200 for X, 0-800 for Y)");
      return;
    }

    await handleQuickPosition(boothId, x, y);
    setCustomX("");
    setCustomY("");
  };

  const handleAutoArrangeGrid = async () => {
    if (!booths || booths.length === 0) {
      toast.error("No booths to arrange");
      return;
    }

    setIsSaving(true);
    try {
      const cols = Math.ceil(Math.sqrt(booths.length));
      const rows = Math.ceil(booths.length / cols);
      const spacingX = 1100 / cols;
      const spacingY = 700 / rows;
      const startX = 50;
      const startY = 50;

      const updates = booths.map((booth, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        return {
          id: booth.id,
          x_position: startX + col * spacingX,
          y_position: startY + row * spacingY,
        };
      });

      for (const update of updates) {
        await supabase
          .from("booths")
          .update({ x_position: update.x_position, y_position: update.y_position })
          .eq("id", update.id);
      }

      toast.success(`Arranged ${booths.length} booths in ${rows}×${cols} grid`);
      refetch();
    } catch (error) {
      console.error("Error arranging booths:", error);
      toast.error("Failed to arrange booths");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoArrangeRows = async () => {
    if (!booths || booths.length === 0) {
      toast.error("No booths to arrange");
      return;
    }

    setIsSaving(true);
    try {
      const spacingY = 750 / booths.length;
      const startX = 100;
      const startY = 25;

      const updates = booths.map((booth, index) => ({
        id: booth.id,
        x_position: startX,
        y_position: startY + index * spacingY,
      }));

      for (const update of updates) {
        await supabase
          .from("booths")
          .update({ x_position: update.x_position, y_position: update.y_position })
          .eq("id", update.id);
      }

      toast.success(`Arranged ${booths.length} booths in a single column`);
      refetch();
    } catch (error) {
      console.error("Error arranging booths:", error);
      toast.error("Failed to arrange booths");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoArrangeCols = async () => {
    if (!booths || booths.length === 0) {
      toast.error("No booths to arrange");
      return;
    }

    setIsSaving(true);
    try {
      const spacingX = 1100 / booths.length;
      const startX = 50;
      const startY = 400;

      const updates = booths.map((booth, index) => ({
        id: booth.id,
        x_position: startX + index * spacingX,
        y_position: startY,
      }));

      for (const update of updates) {
        await supabase
          .from("booths")
          .update({ x_position: update.x_position, y_position: update.y_position })
          .eq("id", update.id);
      }

      toast.success(`Arranged ${booths.length} booths in a single row`);
      refetch();
    } catch (error) {
      console.error("Error arranging booths:", error);
      toast.error("Failed to arrange booths");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Event Selector & Search */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
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

          <div className="space-y-2">
            <Label>Search Booths</Label>
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

        {/* Batch Operations */}
        {selectedEventId && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoArrangeGrid}
              disabled={isSaving || !booths?.length}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Auto Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoArrangeRows}
              disabled={isSaving || !booths?.length}
            >
              <LayoutList className="w-4 h-4 mr-2" />
              Single Column
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoArrangeCols}
              disabled={isSaving || !booths?.length}
            >
              <Columns className="w-4 h-4 mr-2" />
              Single Row
            </Button>
          </div>
        )}
      </Card>

      {/* Booth List */}
      {selectedEventId && (
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-4">
              {filteredBooths.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchQuery ? "No booths found matching your search" : "No booths for this event"}
                </p>
              ) : (
                filteredBooths.map((booth) => (
                  <Card key={booth.id} className="p-4">
                    <div className="space-y-3">
                      {/* Booth Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">
                              Booth #{booth.table_no}
                            </h4>
                            {booth.sponsor_tier && (
                              <Badge variant="outline" className="capitalize">
                                {booth.sponsor_tier}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {booth.org_name || "No organization"}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booth.x_position !== null && booth.y_position !== null ? (
                            <span>
                              ({Math.round(booth.x_position)}, {Math.round(booth.y_position)})
                            </span>
                          ) : (
                            <Badge variant="secondary">Not positioned</Badge>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Position Controls */}
                      {editingBoothId === booth.id ? (
                        <div className="space-y-4">
                          <BoothQuickPosition
                            onPositionSelect={(x, y) => handleQuickPosition(booth.id, x, y)}
                            disabled={isSaving}
                          />

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Or enter exact coordinates:
                            </p>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label className="text-xs">X (0-1200)</Label>
                                <Input
                                  type="number"
                                  placeholder="X"
                                  value={customX}
                                  onChange={(e) => setCustomX(e.target.value)}
                                  min="0"
                                  max="1200"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-xs">Y (0-800)</Label>
                                <Input
                                  type="number"
                                  placeholder="Y"
                                  value={customY}
                                  onChange={(e) => setCustomY(e.target.value)}
                                  min="0"
                                  max="800"
                                />
                              </div>
                              <Button
                                className="self-end"
                                onClick={() => handleCustomPosition(booth.id)}
                                disabled={isSaving}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingBoothId(null);
                              setCustomX("");
                              setCustomY("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBoothId(booth.id);
                              setCustomX(booth.x_position?.toString() || "");
                              setCustomY(booth.y_position?.toString() || "");
                            }}
                          >
                            Edit Position
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewBoothId(booth.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};
