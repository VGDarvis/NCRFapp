import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/admin/shared/LoadingSpinner";
import { EventCountdownBadge } from "@/components/EventCountdownBadge";
import { useStagePerformances } from "@/hooks/useStagePerformances";
import { useSeminarFavorites } from "@/hooks/useSeminarFavorites";
import { format, isPast, differenceInMinutes } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Heart, 
  Share2, 
  DollarSign,
  GraduationCap,
  Music,
  Star,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { downloadICSFile } from "@/lib/calendar-export-utils";
import { supabase } from "@/integrations/supabase/client";

interface StageTabProps {
  eventId: string;
}

const CATEGORY_CONFIG = {
  entertainment: {
    label: "Entertainment",
    icon: Music,
    gradient: "from-purple-500/20 to-pink-500/20",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
  },
  money_giveaway: {
    label: "💰 Money Giveaway",
    icon: DollarSign,
    gradient: "from-green-500/20 to-emerald-500/20",
    badgeClass: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
  },
  scholarship_giveaway: {
    label: "🎓 Scholarship Giveaway",
    icon: GraduationCap,
    gradient: "from-blue-500/20 to-cyan-500/20",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
  },
  stage_performance: {
    label: "⭐ Stage Performance",
    icon: Star,
    gradient: "from-amber-500/20 to-orange-500/20",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
  }
};

export const StageTab = ({ eventId }: StageTabProps) => {
  const { performances, isLoading } = useStagePerformances(eventId);
  const { isFavorite, toggleFavorite } = useSeminarFavorites(eventId);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleExportToCalendar = (performance: any) => {
    downloadICSFile({
      title: performance.title,
      description: performance.description || undefined,
      location: performance.room?.room_name || undefined,
      startDate: new Date(performance.start_time),
      endDate: new Date(performance.end_time),
    }, `${performance.title.replace(/\s+/g, '-').toLowerCase()}.ics`);
    toast.success("Event added to calendar!");
  };

  const upcomingPerformances = performances.filter(p => !isPast(new Date(p.start_time)));
  const pastPerformances = performances.filter(p => isPast(new Date(p.start_time)));
  const nextPerformance = upcomingPerformances[0];

  const handleShare = (performance: any) => {
    const text = `Check out this stage event: ${performance.title} at ${format(new Date(performance.start_time), "h:mm a")}`;
    
    if (navigator.share) {
      navigator.share({ title: performance.title, text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Event details copied to clipboard!");
    }
  };

  const getTimeUntil = (startTime: string) => {
    const minutes = differenceInMinutes(new Date(startTime), new Date());
    if (minutes < 60) return `Starts in ${minutes} minutes!`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Starts in ${hours} ${hours === 1 ? 'hour' : 'hours'}!`;
    const days = Math.floor(hours / 24);
    return `Starts in ${days} ${days === 1 ? 'day' : 'days'}!`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading stage events..." />
      </div>
    );
  }

  if (performances.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Stage Events Yet</h3>
        <p className="text-muted-foreground">
          Stage performances and giveaways will be announced soon!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Stage Events
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don't miss our exciting stage performances, scholarship giveaways, and cash prize opportunities!
        </p>
      </div>

      {!user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Sign in to save your favorite stage events and add them to your calendar.
          </AlertDescription>
        </Alert>
      )}

      {/* Hero - Next Performance */}
      {nextPerformance && (
        <Card className={`p-6 bg-gradient-to-br ${CATEGORY_CONFIG[nextPerformance.category?.toLowerCase() as keyof typeof CATEGORY_CONFIG]?.gradient || 'from-primary/20 to-secondary/20'} border-2 border-primary/20`}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Badge variant="secondary" className="mb-2">
                  🔥 Up Next
                </Badge>
                <h3 className="text-2xl font-bold">{nextPerformance.title}</h3>
                {nextPerformance.description && (
                  <p className="text-muted-foreground">{nextPerformance.description}</p>
                )}
              </div>
              <EventCountdownBadge 
                eventDate={new Date(nextPerformance.start_time)} 
                className="text-lg"
              />
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{getTimeUntil(nextPerformance.start_time)}</span>
              </div>
              {nextPerformance.room && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{nextPerformance.room.room_name}</span>
                </div>
              )}
              {nextPerformance.category && (
                <Badge variant="outline" className={CATEGORY_CONFIG[nextPerformance.category.toLowerCase() as keyof typeof CATEGORY_CONFIG]?.badgeClass}>
                  {CATEGORY_CONFIG[nextPerformance.category.toLowerCase() as keyof typeof CATEGORY_CONFIG]?.label}
                </Badge>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                onClick={() => handleExportToCalendar(nextPerformance)}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              {user && (
                <Button
                  variant={isFavorite(nextPerformance.id) ? "secondary" : "outline"}
                  onClick={() => toggleFavorite(nextPerformance.id)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(nextPerformance.id) ? 'fill-current' : ''}`} />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleShare(nextPerformance)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Performances */}
      {upcomingPerformances.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Events</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingPerformances.slice(1).map((performance) => {
              const config = CATEGORY_CONFIG[performance.category?.toLowerCase() as keyof typeof CATEGORY_CONFIG];
              const Icon = config?.icon || Star;
              
              return (
                <Card key={performance.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-semibold line-clamp-2">{performance.title}</h4>
                          {performance.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {performance.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(performance.id)}
                        >
                          <Heart className={`h-4 w-4 ${isFavorite(performance.id) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(performance.start_time), "MMM d, h:mm a")}
                      </div>
                      {performance.room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {performance.room.room_name}
                        </div>
                      )}
                    </div>

                    {performance.category && (
                      <Badge variant="outline" className={config?.badgeClass}>
                        {config?.label}
                      </Badge>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportToCalendar(performance)}
                        className="flex-1"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Calendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(performance)}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Performances */}
      {pastPerformances.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-muted-foreground">Past Events</h3>
          <div className="grid gap-3 opacity-60">
            {pastPerformances.map((performance) => (
              <Card key={performance.id} className="p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{performance.title}</h4>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{format(new Date(performance.start_time), "MMM d, h:mm a")}</span>
                      {performance.room && <span>• {performance.room.room_name}</span>}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
