import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents } from "@/hooks/useEvents";
import { useBooths } from "@/hooks/useBooths";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, CheckCircle2, XCircle } from "lucide-react";

interface LayoutCopierProps {
  targetEventId: string;
  onSuccess: () => void;
}

export function LayoutCopier({ targetEventId, onSuccess }: LayoutCopierProps) {
  const { events } = useEvents();
  const [sourceEventId, setSourceEventId] = useState<string>("");
  const [copying, setCopying] = useState(false);
  const [result, setResult] = useState<{ matched: number; notFound: number } | null>(null);

  const { data: targetBooths } = useBooths(targetEventId);
  const { data: sourceBooths } = useBooths(sourceEventId);

  const collegeExpoEvents = events?.filter(e => e.event_type === "college_fair") || [];

  const handleCopyLayout = async () => {
    if (!sourceEventId || !sourceBooths || !targetBooths) {
      toast.error("Please select a source event");
      return;
    }

    setCopying(true);
    let matched = 0;
    let notFound = 0;

    try {
      for (const targetBooth of targetBooths) {
        const sourceBooth = sourceBooths.find(
          (b) => b.org_name?.toLowerCase() === targetBooth.org_name?.toLowerCase()
        );

        if (sourceBooth && sourceBooth.grid_row !== null && sourceBooth.grid_col !== null) {
          const { error } = await supabase
            .from("booths")
            .update({
              grid_row: sourceBooth.grid_row,
              grid_col: sourceBooth.grid_col,
              x_position: sourceBooth.x_position,
              y_position: sourceBooth.y_position,
            })
            .eq("id", targetBooth.id);

          if (error) throw error;
          matched++;
        } else {
          notFound++;
        }
      }

      setResult({ matched, notFound });
      toast.success(`Layout copied: ${matched} booths positioned`, {
        description: notFound > 0 ? `${notFound} organizations not found in source event` : undefined,
      });
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to copy layout", {
        description: error.message,
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Copy Layout from Previous Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Event</label>
          <Select value={sourceEventId} onValueChange={setSourceEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Select previous event" />
            </SelectTrigger>
            <SelectContent>
              {collegeExpoEvents
                .filter((e) => e.id !== targetEventId)
                .map((event: any) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCopyLayout} 
          disabled={!sourceEventId || copying}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copying ? "Copying Layout..." : "Copy Booth Positions"}
        </Button>

        {result && (
          <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>{result.matched} organizations matched and positioned</span>
            </div>
            {result.notFound > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="w-4 h-4 text-amber-600" />
                <span>{result.notFound} organizations not found in source event</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
