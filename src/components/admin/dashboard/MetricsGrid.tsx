import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "../shared/StatsCard";
import { QrCode, Users, Activity, Star } from "lucide-react";
import { useExpoStats } from "@/hooks/useExpoStats";

export function MetricsGrid() {
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data) setEventId(data.id);
    };
    fetchEvent();
  }, []);

  const { data: stats, isLoading } = useExpoStats(eventId);

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 glass-premium animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="QR Code Scans Today"
        value={stats.qrScansToday}
        description="Attendees who joined today"
        icon={QrCode}
        className="border-primary/20"
      />
      <StatsCard
        title="Total App Users"
        value={stats.totalAppUsers}
        description="All-time expo visitors"
        icon={Users}
      />
      <StatsCard
        title="Active Now"
        value={stats.activeNow}
        description="Live in the last 5 minutes"
        icon={Activity}
        className="border-accent/20"
      />
      <StatsCard
        title="Popular Booths"
        value={stats.popularBoothsCount}
        description="Favorited by visitors"
        icon={Star}
      />
    </div>
  );
}
