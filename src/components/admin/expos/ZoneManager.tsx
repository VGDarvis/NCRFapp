import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye } from "lucide-react";
import { useZones, Zone } from "@/hooks/useZones";
import { toast } from "sonner";

interface ZoneManagerProps {
  floorPlanId: string | null;
  onViewZone?: (zone: Zone) => void;
}

export function ZoneManager({ floorPlanId, onViewZone }: ZoneManagerProps) {
  const { zones, saveZones, isSaving } = useZones(floorPlanId);
  const [editingZone, setEditingZone] = useState<Partial<Zone> | null>(null);

  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"
  ];

  const handleAddZone = () => {
    if (!editingZone?.name || editingZone.startRow === undefined || 
        editingZone.startCol === undefined || !editingZone.rows || !editingZone.cols) {
      toast.error("Please fill all zone details");
      return;
    }

    const newZone: Zone = {
      id: crypto.randomUUID(),
      name: editingZone.name,
      startRow: editingZone.startRow,
      startCol: editingZone.startCol,
      rows: editingZone.rows,
      cols: editingZone.cols,
      color: editingZone.color || colors[zones.length % colors.length],
    };

    saveZones({ floorPlanId: floorPlanId!, zones: [...zones, newZone] });
    setEditingZone(null);
  };

  const handleDeleteZone = (zoneId: string) => {
    const updatedZones = zones.filter(z => z.id !== zoneId);
    saveZones({ floorPlanId: floorPlanId!, zones: updatedZones });
  };

  if (!floorPlanId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Select an event to manage zones</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zone Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Zones */}
        {zones.map((zone) => (
          <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: zone.color }}
              />
              <div>
                <div className="font-medium">{zone.name}</div>
                <div className="text-sm text-muted-foreground">
                  Rows {String.fromCharCode(65 + zone.startRow)}-
                  {String.fromCharCode(65 + zone.startRow + zone.rows - 1)}, 
                  Cols {zone.startCol + 1}-{zone.startCol + zone.cols}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {onViewZone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewZone(zone)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteZone(zone.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Zone */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium">Add New Zone</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Zone Name</Label>
              <Input
                placeholder="North Hall"
                value={editingZone?.name || ""}
                onChange={(e) => setEditingZone({ ...editingZone, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2"
                    style={{ 
                      backgroundColor: color,
                      borderColor: editingZone?.color === color ? '#000' : 'transparent'
                    }}
                    onClick={() => setEditingZone({ ...editingZone, color })}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Start Row (0-7)</Label>
              <Input
                type="number"
                min={0}
                max={7}
                value={editingZone?.startRow ?? ""}
                onChange={(e) => setEditingZone({ ...editingZone, startRow: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Start Col (0-11)</Label>
              <Input
                type="number"
                min={0}
                max={11}
                value={editingZone?.startCol ?? ""}
                onChange={(e) => setEditingZone({ ...editingZone, startCol: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Rows</Label>
              <Input
                type="number"
                min={1}
                max={8}
                value={editingZone?.rows ?? ""}
                onChange={(e) => setEditingZone({ ...editingZone, rows: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Columns</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={editingZone?.cols ?? ""}
                onChange={(e) => setEditingZone({ ...editingZone, cols: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <Button onClick={handleAddZone} disabled={isSaving}>
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
