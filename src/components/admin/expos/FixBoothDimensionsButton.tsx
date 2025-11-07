import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ruler, Loader2 } from "lucide-react";

export function FixBoothDimensionsButton() {
  const [isFixing, setIsFixing] = useState(false);
  const queryClient = useQueryClient();

  const handleFixDimensions = async () => {
    try {
      setIsFixing(true);
      
      // First, get count of booths that need fixing
      const { data: boothsToFix, error: countError } = await supabase
        .from("booths")
        .select("id, table_no, booth_width, booth_depth")
        .or("booth_width.gt.30,booth_depth.gt.30,booth_width.is.null,booth_depth.is.null");

      if (countError) throw countError;

      const count = boothsToFix?.length || 0;
      
      if (count === 0) {
        toast.info("All booths already have correct dimensions (30x30)");
        return;
      }

      // Update all oversized or null dimension booths to 30x30
      const { error: updateError } = await supabase
        .from("booths")
        .update({ 
          booth_width: 30, 
          booth_depth: 30 
        })
        .or("booth_width.gt.30,booth_depth.gt.30,booth_width.is.null,booth_depth.is.null");

      if (updateError) throw updateError;

      // Invalidate all booth-related queries
      await queryClient.invalidateQueries({ queryKey: ["booths"] });
      await queryClient.invalidateQueries({ queryKey: ["floor-plans"] });

      toast.success(`Fixed ${count} booth(s) to 30x30 dimensions`, {
        description: "All booths now display as uniform squares"
      });
    } catch (error: any) {
      console.error("Error fixing booth dimensions:", error);
      toast.error("Failed to fix booth dimensions", {
        description: error.message
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Button
      onClick={handleFixDimensions}
      disabled={isFixing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isFixing ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          <Ruler className="h-4 w-4" />
          Fix Booth Dimensions
        </>
      )}
    </Button>
  );
}
