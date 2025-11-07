import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { seedDallasSeminars } from "@/lib/seed-dallas-seminars";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function SeedDallasButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const result = await seedDallasSeminars();
      toast({
        title: "Success",
        description: `Created ${result.count} seminars for Dallas/Fort Worth expo`,
      });
      queryClient.invalidateQueries({ queryKey: ["seminar-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["seminar-rooms"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to seed seminars",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSeed}
      disabled={isLoading}
      variant="outline"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Seed Dallas Seminars
    </Button>
  );
}
