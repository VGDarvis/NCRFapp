import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Store,
  GraduationCap,
  AlertTriangle,
  Download,
  Printer,
  X,
  Heart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSeminarSessions } from "@/hooks/useSeminarSessions";
import { useBooths } from "@/hooks/useBooths";
import { useSeminarFavorites } from "@/hooks/useSeminarFavorites";
import { useBoothFavorites } from "@/hooks/useBoothFavorites";
import { format, parseISO } from "date-fns";
import {
  detectScheduleConflicts,
  calculateTotalDuration,
  type TimeSlot,
} from "@/lib/schedule-utils";
import { createSeminarCalendarEvent, downloadICSFile } from "@/lib/calendar-utils";
import { toast } from "sonner";

interface MyScheduleTabProps {
  eventId: string;
}

export const MyScheduleTab = ({ eventId }: MyScheduleTabProps) => {
  const { data: seminars } = useSeminarSessions(eventId);
  const { data: booths } = useBooths(eventId);
  const seminarFavorites = useSeminarFavorites(eventId);
  const boothFavorites = useBoothFavorites(eventId);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Get favorite seminars
  const favoriteSeminars =
    seminars?.filter((s) => seminarFavorites.isFavorite(s.id)) || [];

  // Get favorite booths
  const favoriteBooths =
    booths?.filter((b) => boothFavorites.isFavorite(b.id)) || [];

  // Convert to TimeSlot format for conflict detection
  const seminarSlots: TimeSlot[] = favoriteSeminars.map((s) => ({
    id: s.id,
    title: s.title,
    start_time: s.start_time,
    end_time: s.end_time,
    type: "seminar" as const,
    location: s.room?.room_number,
  }));

  // Detect conflicts
  const conflicts = detectScheduleConflicts(seminarSlots);

  // Calculate stats
  const totalDuration = calculateTotalDuration(seminarSlots);

  // Sort all items by time
  const allItems = [...favoriteSeminars, ...favoriteBooths].sort((a, b) => {
    const timeA = "start_time" in a ? a.start_time : new Date().toISOString();
    const timeB = "start_time" in b ? b.start_time : new Date().toISOString();
    return parseISO(timeA).getTime() - parseISO(timeB).getTime();
  });

  const handleExportAll = () => {
    favoriteSeminars.forEach((seminar) => {
      const calendarEvent = createSeminarCalendarEvent(seminar);
      downloadICSFile(
        calendarEvent,
        `${seminar.title.replace(/\s+/g, "-")}.ics`
      );
    });
    toast.success(`Exported ${favoriteSeminars.length} events to calendar`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (seminarFavorites.isGuest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <Heart className="h-4 w-4" />
          <AlertTitle>Sign In to Access My Schedule</AlertTitle>
          <AlertDescription>
            Create an account to save your personalized schedule, receive
            reminders, and sync across devices.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (favoriteSeminars.length === 0 && favoriteBooths.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">
            Your Schedule is Empty
          </h3>
          <p className="text-muted-foreground mb-4">
            Start adding seminars and booths to create your personalized
            schedule
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.hash = "#/college-expo?tab=schedule")
              }
            >
              Browse Seminars
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.hash = "#/college-expo?tab=vendors")
              }
            >
              Browse Booths
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          My <span className="text-primary">Schedule</span>
        </h1>
        <p className="text-muted-foreground">
          Your personalized expo schedule with saved seminars and booths
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{favoriteSeminars.length}</p>
              <p className="text-sm text-muted-foreground">Seminars Saved</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{favoriteBooths.length}</p>
              <p className="text-sm text-muted-foreground">Booths Saved</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDuration}h</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Conflict Warnings */}
      {conflicts.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Schedule Conflicts Detected</AlertTitle>
          <AlertDescription>
            {conflicts.map((conflict, idx) => (
              <p key={idx} className="mt-2">
                • {conflict.message}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Button onClick={handleExportAll} disabled={favoriteSeminars.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export All to Calendar
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print Schedule
        </Button>
      </div>

      {/* Timeline View */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Timeline</h2>

        <div className="space-y-4">
          {allItems.map((item) => {
            const isSeminar = "start_time" in item;
            const isConflicted =
              isSeminar &&
              conflicts.some((c) =>
                c.items.some((slot) => slot.id === item.id)
              );

            return (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-lg border ${
                  isConflicted ? "border-destructive bg-destructive/5" : ""
                }`}
              >
                {/* Time */}
                {isSeminar && (
                  <div className="w-24 shrink-0">
                    <div className="flex items-center gap-2 font-semibold">
                      <Clock className="w-4 h-4" />
                      {format(parseISO(item.start_time), "h:mm a")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(item.end_time), "h:mm a")}
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="shrink-0">
                  {isSeminar ? (
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                  ) : (
                    <div className="p-2 bg-secondary/50 rounded-lg">
                      <Store className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {isSeminar ? item.title : item.org_name}
                  </h3>

                  {isSeminar && item.presenter_name && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.presenter_name}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {isSeminar && item.room && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.room.room_number}
                      </div>
                    )}

                    {!isSeminar && item.table_no && (
                      <Badge variant="outline">Table {item.table_no}</Badge>
                    )}
                  </div>

                  {isConflicted && (
                    <Badge variant="destructive" className="mt-2">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Time Conflict
                    </Badge>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isSeminar) {
                      seminarFavorites.removeFavorite(item.id);
                    } else {
                      boothFavorites.removeFavorite.mutate({ boothId: item.id, eventId });
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
