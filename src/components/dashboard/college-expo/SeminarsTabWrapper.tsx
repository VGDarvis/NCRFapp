import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SeminarsTab } from "./SeminarsTab";

export const SeminarsTabWrapper = () => {
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const now = new Date().toISOString();
        const tryFetch = async (status: string, ascending: boolean, timeFilter?: { col: string; op: 'gte' | 'lte'; val: string }) => {
          let q = supabase.from("events").select("id, status").eq("status", status).order("start_at", { ascending }).limit(1);
          if (timeFilter) q = q[timeFilter.op](timeFilter.col, timeFilter.val);
          const { data, error } = await q.maybeSingle();
          if (error) throw error;
          return data;
        };

        const result =
          (await tryFetch("in_progress", true)) ||
          (await tryFetch("upcoming", true, { col: "start_at", op: "gte", val: now })) ||
          (await tryFetch("completed", false));

        if (result) {
          setEventId(result.id);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading seminars...</p>
        </Card>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No Event Available</h3>
          <p className="text-muted-foreground">
            There are no upcoming events at this time.
          </p>
        </Card>
      </div>
    );
  }

  return <SeminarsTab eventId={eventId} />;
};
