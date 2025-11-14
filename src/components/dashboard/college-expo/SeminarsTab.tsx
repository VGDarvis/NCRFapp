import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Clock, MapPin, Users, ChevronDown, ChevronUp, 
  Heart, Info, Calendar as CalendarIcon, Share2
} from "lucide-react";
import { useSeminarSessions } from "@/hooks/useSeminarSessions";
import { useSeminarFavorites } from "@/hooks/useSeminarFavorites";
import { useRealtimeSeminars } from "@/hooks/useRealtimeSeminars";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createSeminarCalendarEvent, downloadICSFile } from "@/lib/calendar-utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SeminarsTabProps {
  eventId: string;
}

export const SeminarsTab = ({ eventId }: SeminarsTabProps) => {
  const { data: sessions, isLoading } = useSeminarSessions(eventId);
  const { isFavorite, toggleFavorite, isGuest } = useSeminarFavorites(eventId);
  const [expandedSeminar, setExpandedSeminar] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [user, setUser] = useState<any>(null);
  
  // Enable real-time updates for seminars
  useRealtimeSeminars(eventId);

  // Check user authentication
  useState(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading seminars...</p>
        </Card>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Seminars Scheduled</h3>
          <p className="text-muted-foreground">
            Check back soon for workshop and seminar schedules.
          </p>
        </Card>
      </div>
    );
  }

  // Get unique rooms
  const rooms = Array.from(new Set(sessions.map(s => s.room?.room_number).filter(Boolean)));
  
  // Filter sessions by room
  const filteredSessions = selectedRoom === "all" 
    ? sessions 
    : sessions.filter(s => s.room?.room_number === selectedRoom);

  const handleShare = async (session: any) => {
    const shareData = {
      title: session.title,
      text: `Join me at "${session.title}" - ${format(parseISO(session.start_time), 'h:mm a')}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleExportToCalendar = (session: any) => {
    const calendarEvent = createSeminarCalendarEvent(session);
    downloadICSFile(calendarEvent, `${session.title.replace(/\s+/g, '-')}.ics`);
    toast.success("Calendar event downloaded");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Seminars & <span className="text-primary">Workshops</span>
        </h1>
        <p className="text-muted-foreground mb-4">
          Click any seminar to view details. {isGuest ? "Sign in to save favorites to My Schedule." : "Click the heart to save to My Schedule."}
        </p>

        {isGuest && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Viewing as Guest</AlertTitle>
            <AlertDescription>
              Favorites will be saved locally. Create an account to sync across devices and receive reminders.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Room Filter */}
      {rooms.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={selectedRoom === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRoom("all")}
          >
            All Rooms
            <Badge variant="secondary" className="ml-2">{sessions.length}</Badge>
          </Button>
          {rooms.map((room) => {
            const count = sessions.filter(s => s.room?.room_number === room).length;
            return (
              <Button
                key={room}
                variant={selectedRoom === room ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRoom(room)}
              >
                {room}
                <Badge variant="secondary" className="ml-2">{count}</Badge>
              </Button>
            );
          })}
        </div>
      )}

      {/* Seminars List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => {
          const isExpanded = expandedSeminar === session.id;
          const favorited = isFavorite(session.id);

          return (
            <Card
              key={session.id}
              className={cn(
                "group cursor-pointer transition-all duration-200",
                isExpanded && "ring-2 ring-primary",
                "hover:border-primary hover:shadow-lg"
              )}
              onClick={() => setExpandedSeminar(isExpanded ? null : session.id)}
            >
              <div className="p-6">
                {/* Top Row: Time + Room Number */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-lg">
                        {format(parseISO(session.start_time), "h:mm a")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        to {format(parseISO(session.end_time), "h:mm a")}
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT ROOM NUMBER */}
                  {session.room && (
                    <Badge 
                      variant="secondary" 
                      className="text-base px-3 py-1.5 font-bold bg-primary/10 text-primary shrink-0"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      {session.room.room_number}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {session.title}
                  </h3>
                  {session.room?.room_number && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Room {session.room.room_number}
                    </Badge>
                  )}
                </div>

                {/* Presenter (when collapsed) */}
                {!isExpanded && session.presenter_name && (
                  <p className="text-sm text-muted-foreground mb-3">
                    Presented by {session.presenter_name}
                    {session.presenter_organization && ` - ${session.presenter_organization}`}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {session.category && (
                    <Badge variant="secondary">
                      {session.category.replace(/_/g, " ")}
                    </Badge>
                  )}
                  {session.target_audience?.slice(0, 2).map((audience) => (
                    <Badge key={audience} variant="outline">
                      {audience.replace(/_/g, " ")}
                    </Badge>
                  ))}
                  {session.max_capacity && (
                    <Badge variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      {session.max_capacity} seats
                    </Badge>
                  )}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 mt-4 border-t pt-4"
                    >
                      {/* Full Description */}
                      {session.description && (
                        <p className="text-muted-foreground">{session.description}</p>
                      )}

                      {/* Presenter Details */}
                      {session.presenter_name && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-primary mt-1 shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold">{session.presenter_name}</p>
                              {session.presenter_title && (
                                <p className="text-sm text-muted-foreground">
                                  {session.presenter_title}
                                </p>
                              )}
                              {session.presenter_organization && (
                                <p className="text-sm text-muted-foreground">
                                  {session.presenter_organization}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Location Details */}
                      {session.room && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium">{session.room.room_name || session.room.room_number}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant={favorited ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(session.id);
                          }}
                        >
                          <Heart 
                            className={cn(
                              "w-4 h-4 mr-2",
                              favorited && "fill-current"
                            )} 
                          />
                          {favorited ? "Saved to My Schedule" : "Save to My Schedule"}
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportToCalendar(session);
                          }}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Add to Calendar
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(session);
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand/Collapse Indicator */}
                <div className="flex items-center justify-center mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="text-xs">
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        View Details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
