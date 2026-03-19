import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "../shared/StatsCard";
import { Calendar, Building2, LayoutGrid, GraduationCap, Users, BookOpen } from "lucide-react";

interface PlatformStats {
  totalExpos: number;
  collegePartners: number;
  totalBooths: number;
  seminarSessions: number;
  guestInteractions: number;
  scholarshipBooklets: number;
}

function usePlatformStats() {
  return useQuery({
    queryKey: ["platform-stats"],
    queryFn: async (): Promise<PlatformStats> => {
      const eventsRes = await supabase.from("events").select("id", { count: "exact", head: true });
      const boothsRes = await supabase.from("booths").select("org_name");
      const boothCountRes = await supabase.from("booths").select("id", { count: "exact", head: true });
      const seminarsRes = await supabase.from("seminar_sessions").select("id", { count: "exact", head: true }) as { count: number | null };
      const guestsRes = await supabase.from("guest_sessions").select("id", { count: "exact", head: true });
      const bookletsRes = await supabase.from("scholarship_booklets").select("id").eq("is_published", true);

      const totalExpos = eventsRes.count || 0;
      const totalBooths = boothCountRes.count || 0;
      const seminarSessions = seminarsRes.count || 0;
      const guestInteractions = guestsRes.count || 0;
      const scholarshipBooklets = bookletsRes.data?.length || 0;

      const uniqueColleges = new Set(boothsRes.data?.map((b) => b.org_name) || []);

      return {
        totalExpos: totalExpos || 0,
        collegePartners: uniqueColleges.size,
        totalBooths: totalBooths || 0,
        seminarSessions: seminarSessions || 0,
        guestInteractions: guestInteractions || 0,
        scholarshipBooklets: scholarshipBooklets || 0,
      };
    },
    refetchInterval: 60000,
  });
}

export function MetricsGrid() {
  const { data: stats, isLoading } = usePlatformStats();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 glass-premium animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Expos Hosted"
        value={stats.totalExpos}
        description="Events organized across cities"
        icon={Calendar}
        className="border-primary/20"
      />
      <StatsCard
        title="College Partners"
        value={stats.collegePartners}
        description="Unique institutions represented"
        icon={Building2}
      />
      <StatsCard
        title="Total Booths Managed"
        value={stats.totalBooths}
        description="Exhibitor booths across all expos"
        icon={LayoutGrid}
      />
      <StatsCard
        title="Seminar Sessions"
        value={stats.seminarSessions}
        description="Educational sessions delivered"
        icon={GraduationCap}
        className="border-accent/20"
      />
      <StatsCard
        title="Guest Interactions"
        value={stats.guestInteractions}
        description="Digital check-ins & app sessions"
        icon={Users}
      />
      <StatsCard
        title="Scholarship Booklets"
        value={stats.scholarshipBooklets}
        description="Published resource booklets"
        icon={BookOpen}
      />
    </div>
  );
}
